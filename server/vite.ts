// server/vite.ts
import type { Express } from "express";
import type http from "http";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

/** Normalize import.meta dirname when it may contain a file: URL. */
function resolveImportMetaDir(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (import.meta as any).dirname ?? import.meta.url;
  const rawStr = String(raw);
  if (rawStr.startsWith("file:")) return fileURLToPath(rawStr);
  return rawStr;
}
const projectRoot = resolveImportMetaDir();

export function log(...args: any[]) {
  console.log(...args);
}

/** Try to find built client index.html in common locations. */
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
      const indexPath = path.join(candidate, "index.html");
      await fs.access(indexPath);
      return { indexHtmlPath: indexPath, clientRoot: candidate };
    } catch {
      // continue
    }
  }

  throw new Error(
    `Could not find built client files. Checked: ${candidates.join(
      ", ",
    )}. Make sure your Vite build output exists and contains index.html.`,
  );
}

/**
 * Production: serve static files and SPA fallback. Safe: no Vite import here.
 */
export async function serveStatic(app: Express) {
  let indexHtmlPath: string;
  let clientRoot: string;
  try {
    ({ indexHtmlPath, clientRoot } = await findBuiltClient());
  } catch (err) {
    log("[vite] serveStatic error:", (err as Error).message);
    throw err;
  }

  // lazy require to keep top-level pure ESM compatible for bundlers
  const express = await import("express");
  app.use(express.static(clientRoot));
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
 * Development: create and mount Vite dev server.
 * NOTE: this dynamically imports 'vite' at runtime so bundlers won't include it for production.
 */
export async function setupVite(app: Express, httpServer?: http.Server) {
  // dynamic import so `vite` is only loaded when this function is called.
  const { createServer: createViteServer } = await import("vite");
  const projectClientRoot = path.resolve(projectRoot, "client");

  const vite = await createViteServer({
    root: projectClientRoot,
    server: {
      middlewareMode: "ssr",
      // @ts-expect-error - optional
      httpServer,
      watch: { usePolling: true, interval: 100 },
      host: true,
    },
    appType: "custom",
    optimizeDeps: { disabled: false },
  });

  app.use(vite.middlewares);

  // catch-all: use Vite to transform index.html
  app.use("*", async (req, res, _next) => {
    try {
      const url = req.originalUrl || req.url;
      const indexHtmlFile = path.resolve(projectClientRoot, "index.html");
      let html = await fs.readFile(indexHtmlFile, "utf-8");
      html = await vite.transformIndexHtml(url, html);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      vite && (vite as any).ssrFixStacktrace && (vite as any).ssrFixStacktrace(err as Error);
      log("[vite] dev serve error:", (err as Error).message);
      res.status(500).end((err as Error).stack || (err as Error).message);
    }
  });

  log("[vite] Vite dev server mounted (middleware mode)");
  return vite;
}
