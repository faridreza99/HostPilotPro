// server/replitAuth.ts
import type { Express, RequestHandler } from "express";
import type { Request, Response } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

/**
 * Simple session-based auth (no Replit, no passport).
 * - POST /api/login   { email }  -> creates/updates user and sets session
 * - POST /api/logout                 -> destroy session
 * - GET  /api/me                     -> current user info
 *
 * Replace later with real OAuth/JWT when ready.
 */

const SESSION_SECRET = process.env.SESSION_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  let store: any = undefined;
  if (DATABASE_URL) {
    try {
      const pgStore = connectPg(session);
      store = new pgStore({
        conString: DATABASE_URL,
        createTableIfMissing: false,
        ttl: sessionTtl,
        tableName: "sessions",
      });
    } catch (err) {
      console.warn("[replitAuth/simple] connect-pg-simple not available or failed, falling back to memory store.", err);
    }
  }

  if (!SESSION_SECRET) {
    console.warn("[replitAuth/simple] WARNING: SESSION_SECRET not set. Using fallback secret (NOT SECURE) — set SESSION_SECRET in Render env for production.");
  }

  return session({
    secret: SESSION_SECRET ?? "dev-secret",
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

/** Minimal helper to set user in session and upsert to storage. */
async function createUserInSession(req: Request, email: string) {
  // Use email as ID for simple flows, or generate a proper id
  const userId = `local:${email}`;
  const userRecord = {
    id: userId,
    email,
    firstName: "",
    lastName: "",
    profileImageUrl: "",
    organizationId: "default-org",
  };

  // Upsert user into your storage (keeps your existing user DB)
  try {
    // storage.upsertUser should be implemented in your storage module
    await storage.upsertUser(userRecord);
  } catch (err) {
    console.warn("[replitAuth/simple] storage.upsertUser failed:", err);
    // continue — session can still be set locally
  }

  // Save minimal session user
  (req.session as any).user = {
    id: userId,
    email,
  };
}

/** Call this to mount session + small login routes */
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Basic routes for login/logout/me
  // NOTE: POST /api/login accepts JSON { email }
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const body = req.body as any;
      const email = (body?.email || "").toString().trim().toLowerCase();
      if (!email) {
        return res.status(400).json({ message: "Missing email in request body" });
      }

      await createUserInSession(req, email);
      // save session then respond
      req.session.save((err) => {
        if (err) {
          console.error("[replitAuth/simple] session save error:", err);
          return res.status(500).json({ message: "Session save failed" });
        }
        return res.json({ message: "Logged in (dev)", user: (req.session as any).user });
      });
    } catch (err) {
      console.error("[replitAuth/simple] /api/login error:", err);
      return res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("[replitAuth/simple] session destroy error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/me", (req: Request, res: Response) => {
    const u = (req.session as any).user;
    if (!u) return res.status(401).json({ message: "Not authenticated" });
    return res.json({ user: u });
  });

  console.log("[replitAuth/simple] Session-based auth mounted (no Replit/OIDC).");
}

/** Middleware to protect endpoints */
export const isAuthenticated: RequestHandler = (req, res, next) => {
  const u = (req.session as any).user;
  if (!u) return res.status(401).json({ message: "Unauthorized" });
  // attach user to req.user for compatibility
  (req as any).user = u;
  return next();
};

export default { getSession, setupAuth, isAuthenticated };
