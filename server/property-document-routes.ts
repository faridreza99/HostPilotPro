import express from "express";
import { storage } from "./storage";
import { isDemoAuthenticated } from "./demoAuth";
import { db } from "./db";
import { propertyDocuments } from "@shared/schema";
import { eq, and, desc, lte, sql } from "drizzle-orm";

export const propertyDocRouter = express.Router();

propertyDocRouter.post("/", isDemoAuthenticated, async (req, res) => {
  console.log("[ALT-ROUTE] POST /api/property-documents hit");
  try {
    const orgId = req.user?.organizationId || "default-org";
    const data = req.body;
    
    console.log("[ALT-ROUTE] POST data:", JSON.stringify(data));
    
    if (!data.docType || !data.fileUrl || !data.uploadedBy) {
      console.log("[ALT-ROUTE] POST validation failed");
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const created = await storage.createPropertyDocument(orgId, data);
    console.log("[ALT-ROUTE] POST created document:", JSON.stringify(created));
    res.json(created);
  } catch (err) {
    console.error("[ALT-ROUTE] ERROR creating document:", err);
    res.status(500).json({ message: "Server error creating document" });
  }
});

propertyDocRouter.get("/expiring", isDemoAuthenticated, async (req, res) => {
  console.log("[ALT-ROUTE] GET /api/property-documents/expiring hit");
  try {
    const orgId = req.user?.organizationId || "default-org";
    const days = parseInt(req.query.days as string) || 30;
    
    // Calculate future date threshold
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    console.log(`[ALT-ROUTE] Checking for documents expiring before ${futureDateStr} for org ${orgId}`);
    
    // Direct database query - fetch documents with expiryDate <= futureDate (includes expired and soon-to-expire)
    const expiringDocs = await db.select()
      .from(propertyDocuments)
      .where(and(
        eq(propertyDocuments.organizationId, orgId),
        lte(propertyDocuments.expiryDate, futureDateStr)
      ))
      .orderBy(propertyDocuments.expiryDate);
    
    console.log(`[ALT-ROUTE] Found ${expiringDocs.length} expiring/expired documents:`, JSON.stringify(expiringDocs));
    res.json(expiringDocs);
  } catch (err) {
    console.error("[ALT-ROUTE] ERROR fetching expiring documents:", err);
    res.status(500).json({ message: "Server error fetching expiring documents" });
  }
});

propertyDocRouter.get("/property/:propertyId", isDemoAuthenticated, async (req, res) => {
  console.log("[ALT-ROUTE] GET /api/property-documents/property/:propertyId hit");
  try {
    const orgId = req.user?.organizationId || "default-org";
    const { propertyId } = req.params;
    
    console.log(`[ALT-ROUTE] GET - Fetching docs for property ${propertyId}, org ${orgId}`);
    
    // Direct database query using actual schema columns (bypass broken storage method)
    const docs = await db.select()
      .from(propertyDocuments)
      .where(and(
        eq(propertyDocuments.organizationId, orgId),
        eq(propertyDocuments.propertyId, Number(propertyId))
      ))
      .orderBy(desc(propertyDocuments.createdAt));
    
    console.log(`[ALT-ROUTE] GET - Found ${docs?.length || 0} documents:`, JSON.stringify(docs));
    res.json(docs);
  } catch (err) {
    console.error("[ALT-ROUTE] ERROR fetching documents:", err);
    res.status(500).json({ message: "Server error fetching documents" });
  }
});
