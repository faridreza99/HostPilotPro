// server/index.ts
import express from "express";
import http from "http";
import path from "path";
import { serveStatic, setupVite, log as viteLog } from "./vite"; // note: vite.ts exports serveStatic & setupVite
import { storage } from "./storage"; // your existing imports
// import other server route modules below (they should not import vite or replit dev plugins)
import { registerRoutes } from "./routes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  const app = express();
  const server = http.createServer(app);

  // common middleware (CORS, bodyParser etc)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // important: do NOT import Vite or dev-only plugins here at top-level for production.
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    // DEV: dynamically import vite server and mount it as middleware
    try {
      // dynamic import so bundlers won't include Vite in prod bundle
      const viteModule = await import("./vite");
      // viteModule.setupVite is the middleware-mode setup
      await viteModule.setupVite(app as any, server as any);
      viteModule.log("[startup] Running in DEV mode — Vite middleware mounted.");
    } catch (err) {
      // If dev import fails, log and continue — dev only
      console.error("[startup] Failed to mount Vite dev server:", (err as Error).message);
    }
  } else {
    // PROD: serve built static files
    try {
      await serveStatic(app);
      console.log("[startup] Running in PROD mode — serving static build.");
    } catch (err) {
      console.error("[startup] Failed to serve static client:", (err as Error).message);
      // failing to find client should not crash the server if you want API-only deploys.
      // Throwing here will crash the process and make deploy fail — choose behavior you want.
      throw err;
    }
  }

  // register your app routes (these should be free of dev-only imports)
  await registerRoutes(app);

  // start http server
  server.listen(PORT, () => {
    console.log(`[startup] Server listening on port ${PORT} (dev=${isDev})`);
  });

  // optional: graceful shutdown handlers
  process.on("SIGINT", () => process.exit(0));
  process.on("SIGTERM", () => process.exit(0));
}

start().catch((err) => {
  console.error("[startup] Fatal error:", err);
  process.exit(1);
});
