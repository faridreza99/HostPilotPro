// server/vite.ts
import type { Express } from "express";
import type http from "http";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { createServer as createViteServer, type ViteDevServer } from "vite";

/**
 * Normalize import.meta dirname when it may contain a file: URL (esbuild define workaround).
 * If import.meta.dirname is already a plain filesystem path (string without file:), use it.
 */
function resolveImportMetaDir(): string {
  // Some of your build steps may define import.meta.dirname as import.meta.url (a file: URL).
  // Accept either import.meta.dirname (if present) or fallback to import.meta.url.
  // Type coercion because TS doesn't know about custom define.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (import.meta as any).dirname ?? import.meta.url;

  const rawStr = String(raw);

  if (rawStr.startsWith("file:")) {
    // Convert file://... into /... path
    return fileURLToPath(rawStr);
  }

  return rawStr;
}

const projectRoot = resolveImportMetaDir();

/** Utility logger used by index.ts */
export function log(...args: any[]) {
  // keep short — index.ts expects log()
  console.log(...args);
}

/**
 * Attempts to find the built client directory and index.html file.
 * Tries reasonable locations in order: dist/client, dist/public, dist.
 * Returns { indexHtmlPath, clientRoot } or throws a helpful error.
 */
async function findBuiltClient(): Promise<{ indexHtmlPath: string; clientRoot: string }> {
  const candidates = [
    path.resolve(projectRoot, "dist", "client"),
    path.resolve(projectRoot, "dist", "public"),
    path.resolve(projectRoot, "dist"),
    path.resolve(projectRoot, "client", "dist"),
    path.resolve(projectRoot, "client", "build"),
  ];

  for (const candidate of candidates) {
    try {
      // check if index.html exists directly inside candidate
      const indexPath = path.join(candidate, "index.html");
      await fs.access(indexPath);
      return { indexHtmlPath: indexPath, clientRoot: candidate };
    } catch {
      // ignore and continue
    }
  }

  // Nothing found — provide a helpful message
  throw new Error(
    `Could not find built client files. Checked: ${candidates.join(
      ", ",
    )}. Make sure your Vite build output exists and contains index.html.`,
  );
}

/**
 * Production static server setup.
 * Serves static assets and falls back to index.html for SPA routing.
 */
export async function serveStatic(app: Express) {
  let indexHtmlPath: string;
  let clientRoot: string;
  try {
    ({ indexHtmlPath, clientRoot } = await findBuiltClient());
  } catch (err) {
    // Re-throw with more context for logs
    log("[vite] serveStatic error:", (err as Error).message);
    throw err;
  }

  const express = await import("express");
  // serve static folder (cache control can be added if required)
  app.use(express.static(clientRoot));

  // catch-all to serve index.html for client-side routing
  app.get("*", async (_req, res) => {
    try {
      const html = await fs.readFile(indexHtmlPath, "utf-8");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(200).send(html);
    } catch (err) {
      log("[vite] Failed to read index.html:", (err as Error).message);
      res.status(500).send("Internal Server Error");
    }
  });

  log("[vite] Production static files served from", clientRoot);
}

/**
 * Development Vite server setup (middleware mode).
 * - Creates Vite dev server and mounts the middlewares into Express.
 * - Adds a catch-all that proxies to Vite's index.html (via transformIndexHtml).
 */
export async function setupVite(app: Express, httpServer: http.Server) {
  // create vite dev server
  const vite: ViteDevServer = await createViteServer({
    root: path.resolve(projectRoot, "client"),
    server: {
      middlewareMode: "ssr",
      // Bind the http server if provided (so HMR can use same server)
      // Vite will auto-detect httpServer if passed here, but keeping simple:
      // @ts-expect-error - vite types accept http server in some configs
      httpServer,
      watch: {
        // increase watch stability in containerized environments
        usePolling: true,
        interval: 100,
      },
    },
    appType: "custom",
    // avoid loading heavy production-only plugins in dev build
    optimizeDeps: {
      disabled: false,
    },
  });

  // Use Vite's middlewares
  app.use(vite.middlewares);

  // Provide a catch-all that uses Vite to transform index.html and serve it
  app.use("*", async (req, res, _next) => {
    try {
      const url = req.originalUrl || req.url;
      // resolve index.html in projectRoot/client (dev)
      const indexHtmlFile = path.resolve(projectRoot, "client", "index.html");
      let html = await fs.readFile(indexHtmlFile, "utf-8");
      html = await vite.transformIndexHtml(url, html);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      vite && vite.ssrFixStacktrace && vite.ssrFixStacktrace(err as Error);
      log("[vite] dev serve error:", (err as Error).message);
      res.status(500).end((err as Error).stack || (err as Error).message);
    }
  });

  log("[vite] Vite dev server mounted (middleware mode)");
  return vite;
}
