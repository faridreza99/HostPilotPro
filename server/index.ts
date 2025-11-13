// server/index.ts
import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { serveStatic, setupVite, log as viteLog } from "./vite";
import { storage } from "./storage";
import { registerRoutes } from "./routes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  const app = express();
  const server = http.createServer(app);

  // common middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    try {
      const viteModule = await import("./vite");
      await viteModule.setupVite(app as any, server as any);
      viteModule.log("[startup] Running in DEV mode — Vite middleware mounted.");
    } catch (err) {
      console.error("[startup] Failed to mount Vite dev server:", (err as Error).message);
    }
  } else {
    // PROD: before calling serveStatic, log what the runtime sees
    try {
      const root = path.resolve(process.cwd());
      console.log("[startup] cwd:", root);

      const candidates = [
        path.join(root, "dist", "public"),
        path.join(root, "client", "dist"),
        path.join(root, "client", "build"),
        path.join(root, "dist"),
        path.join(root, "dist", "build"),
        path.join(root, "client"),
        // compiled/packaged locations:
        path.join(__dirname, "..", "dist", "public"),
        path.join(__dirname, "..", "dist"),
      ];

      console.log("[startup] Checking candidate client build locations:");
      for (const c of candidates) {
        const idx = path.join(c, "index.html");
        try {
          const exists = fs.existsSync(idx);
          console.log(`[startup]  ${idx} -> ${exists ? "FOUND" : "missing"}`);
          if (exists) {
            console.log(`[startup]  listing ${c}:`, fs.readdirSync(c).slice(0, 50));
          }
        } catch (e) {
          console.log("[startup]  error checking", idx, e);
        }
      }

      await serveStatic(app);
      console.log("[startup] Running in PROD mode — serving static build.");
    } catch (err) {
      console.error("[startup] Failed to serve static client:", (err as Error).message);
      // Choose behavior: throw to fail the deploy, or continue API-only.
      // For now rethrow so deploy fails loudly and you fix the build step:
      throw err;
      // If you prefer server to run API-only uncomment the following and remove throw:
      // console.warn("[startup] Continuing in API-only mode (static client missing).");
    }
  }

  await registerRoutes(app);

  server.listen(PORT, () => {
    console.log(`[startup] Server listening on port ${PORT} (dev=${isDev})`);
  });

  process.on("SIGINT", () => process.exit(0));
  process.on("SIGTERM", () => process.exit(0));
}

start().catch((err) => {
  console.error("[startup] Fatal error:", err);
  process.exit(1);
});
