// server/index.ts
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { seedAddonServicesData } from "./seedAddonServicesData";
import { seedInvoiceData } from "./seedInvoiceData";
import { seedServiceMarketplaceData } from "./seedServiceMarketplaceData";
import { seedOwnerOnboardingData } from "./seedOwnerOnboardingData";
import { setupDemoAuth } from "./demoAuth";
import mountIntegrationRoutes from "./routers/integrations-routes";
import mountPmsRoutes from "./routers/pms-routes";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Request logging middleware (keeps concise JSON in logs)
import { log as viteLog } from "./vite";
app.use((req, res, next) => {
  const start = Date.now();
  const pathReq = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  // @ts-ignore
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathReq.startsWith("/api")) {
      let logLine = `${req.method} ${pathReq} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch {
          logLine += ` :: [unserializable payload]`;
        }
      }

      if (logLine.length > 800) {
        logLine = logLine.slice(0, 799) + "…";
      }

      viteLog ? viteLog(logLine) : console.log(logLine);
    }
  });

  next();
});

(async () => {
  // Graceful startup handling
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  });

  try {
    console.log("Skipping seeding during debugging...");
    // const serverRoutes = await registerRoutes(app);
    const server = await registerRoutes(app);

    // Register bulk delete routes
    const { registerBulkDeleteRoutes } = await import("./bulk-delete-api");
    registerBulkDeleteRoutes(app);

    // Register Utility Bills routes FIRST (before other routes to avoid conflicts)
    const utilityBillsRouter = (await import("./utility-bills-routes")).default;
    app.use("/api/utility-bills", utilityBillsRouter);
    console.log("[INIT] Utility bills routes mounted ✅");

    // Register other routes / routers
    const { registerFastDashboardRoutes } = await import("./fast-dashboard-api");
    registerFastDashboardRoutes(app);

    mountIntegrationRoutes(app);
    mountPmsRoutes(app);

    const { setupAchievementRoutes } = await import("./achievement-routes");
    setupAchievementRoutes(app);
    console.log("[INIT] Achievement routes mounted ✅");

    const { propertyDocRouter } = await import("./property-document-routes");
    app.use("/api/property-documents", propertyDocRouter);
    console.log("[INIT] Alternate property-document-routes mounted ✅");

    const { serviceBookingRouter } = await import("./service-booking-routes");
    app.use("/api/service-bookings", serviceBookingRouter);
    console.log("[INIT] Service booking routes mounted ✅");

    const lodgifyRouter = (await import("./lodgify-routes")).default;
    app.use("/api", lodgifyRouter);
    console.log("[INIT] Lodgify API routes mounted ✅");

    const makcorpsRouter = (await import("./makcorps-routes")).default;
    app.use("/api", makcorpsRouter);
    console.log("[INIT] Makcorps API routes mounted ✅");

    const rentcastRouter = (await import("./rentcast-routes")).default;
    app.use("/api/rentcast", rentcastRouter);
    console.log("[INIT] RentCast API routes mounted ✅");

    // Serve uploaded files
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    console.log("[INIT] Static uploads directory mounted ✅");

    // Central error handler (keeps returning JSON to API callers)
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      // respond JSON for API calls
      if (_req.path.startsWith("/api")) {
        res.status(status).json({ message });
      } else {
        res.status(status).send(message);
      }

      // still throw in non-production so logs / crash become visible while dev
      if (process.env.NODE_ENV !== "production") {
        throw err;
      } else {
        // in production, log and continue
        console.error(err);
      }
    });

    // Start HTTP server first (so dev Vite can attach if needed)
    const port = Number(process.env.PORT) || 5000;
    const httpServer = app.listen(port, "0.0.0.0", () => {
      console.log(`Server started on port ${port}`);
    });

    // Decide production vs dev. On Render, RENDER=1 etc.
    const isProduction =
      process.env.NODE_ENV === "production" ||
      !!process.env.RENDER ||
      !!process.env.RENDER_EXTERNAL_HOSTNAME;

    if (!isProduction) {
      // DEV: dynamic import of vite setup (so bundle doesn't include Vite)
      try {
        console.log("[INIT] DEV mode — attaching Vite dev middleware");
        const { setupVite } = await import("./vite");
        await setupVite(app, httpServer);
      } catch (err) {
        console.error("[VITE] Dev setup failed:", (err as Error).message);
      }
    } else {
      // PROD: serve static client build
      try {
        const { serveStatic } = await import("./vite");
        await serveStatic(app);
      } catch (err) {
        console.error("[VITE] Production static serve failed:", (err as Error).message);
        // If built assets not present, print helpful guidance and keep server running for API only
        console.error(
          "Frontend build not found. Ensure you ran `npm run build` (client) before deploying, or adjust outDir.",
        );
      }
    }

    // Graceful shutdown hooks
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      httpServer.close(() => {
        console.log("Process terminated");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      httpServer.close(() => {
        console.log("Process terminated");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("Startup error:", (err as Error).message);
    process.exit(1);
  }
})();
