import { db } from "./db";
import { aiRoiPredictions } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedAiRoiPredictionsData() {
  try {
    console.log("Seeding AI ROI Predictions demo data...");
    
    // Check if AI ROI predictions already exist
    const existingPredictions = await db
      .select()
      .from(aiRoiPredictions)
      .where(eq(aiRoiPredictions.organizationId, "default-org"));

    if (existingPredictions.length > 0) {
      console.log("AI ROI Predictions data already exists, skipping seed.");
      return;
    }

    // AI ROI Predictions demo data - using correct property IDs from database
    const predictionData = [
      // Villa Samui Breeze - Property ID 1
      {
        organizationId: "default-org",
        propertyId: 1,
        forecastStart: "2025-01-01",
        forecastEnd: "2025-01-31",
        predictedRoi: 18.2,
        predictedOccupancy: 94.6,
        aiNotes: "Villa Samui Breeze forecast for high season: excellent ROI potential with high occupancy expected. Peak tourism period with strong demand. Recommendations: target luxury family market."
      },
      {
        organizationId: "default-org",
        propertyId: 1,
        forecastStart: "2025-04-01",
        forecastEnd: "2025-04-30",
        predictedRoi: 12.7,
        predictedOccupancy: 74.3,
        aiNotes: "Villa Samui Breeze forecast for shoulder season: strong performance expected with good occupancy rates. Moderate demand expected. Recommendations: target luxury family market."
      },

      // Villa Ocean View - Property ID 2  
      {
        organizationId: "default-org",
        propertyId: 2,
        forecastStart: "2025-02-01",
        forecastEnd: "2025-02-28",
        predictedRoi: 14.5,
        predictedOccupancy: 88.2,
        aiNotes: "Villa Ocean View forecast for high season: strong performance expected with high occupancy expected. Peak tourism period with strong demand. Recommendations: target luxury family market."
      },
      {
        organizationId: "default-org",
        propertyId: 2,
        forecastStart: "2025-07-01",
        forecastEnd: "2025-07-31",
        predictedRoi: 8.3,
        predictedOccupancy: 58.7,
        aiNotes: "Villa Ocean View forecast for low season: average performance with standard occupancy levels. Rainy season with reduced tourist activity. Recommendations: focus on maintenance and renovations, enhance marketing efforts."
      },

      // Villa Aruna (Demo) - Property ID 3
      {
        organizationId: "default-org",
        propertyId: 3,
        forecastStart: "2025-12-01",
        forecastEnd: "2025-12-31",
        predictedRoi: 22.4,
        predictedOccupancy: 96.8,
        aiNotes: "Villa Aruna Demo forecast for high season: excellent ROI potential with high occupancy expected. Peak tourism period with strong demand. Recommendations: target luxury family market."
      },
      {
        organizationId: "default-org",
        propertyId: 3,
        forecastStart: "2025-05-01",
        forecastEnd: "2025-05-31",
        predictedRoi: 15.1,
        predictedOccupancy: 79.5,
        aiNotes: "Villa Aruna Demo forecast for shoulder season: excellent ROI potential with good occupancy rates. Moderate demand expected. Recommendations: target luxury family market."
      },

      // Sunset Villa Bondi - Property ID 4
      {
        organizationId: "default-org",
        propertyId: 4,
        forecastStart: "2025-03-01",
        forecastEnd: "2025-03-31",
        predictedRoi: 16.8,
        predictedOccupancy: 92.4,
        aiNotes: "Sunset Villa Bondi forecast for high season: excellent ROI potential with high occupancy expected. Peak tourism period with strong demand. Recommendations: target luxury family market."
      },

      // Villa Tropical Paradise - Property ID 10
      {
        organizationId: "default-org",
        propertyId: 10,
        forecastStart: "2025-02-01",
        forecastEnd: "2025-02-28",
        predictedRoi: 13.8,
        predictedOccupancy: 85.4,
        aiNotes: "Villa Tropical Paradise forecast for high season: strong performance expected with high occupancy expected. Peak tourism period with strong demand. Recommendations: enhance marketing efforts."
      },
      {
        organizationId: "default-org",
        propertyId: 10,
        forecastStart: "2025-06-01",
        forecastEnd: "2025-06-30",
        predictedRoi: 7.2,
        predictedOccupancy: 48.9,
        aiNotes: "Villa Tropical Paradise forecast for low season: below-average returns predicted with lower occupancy anticipated. Rainy season with reduced tourist activity. Recommendations: consider pricing optimization, enhance marketing efforts, focus on maintenance and renovations."
      },

      // Villa Tropical Paradise - Property ID 17 (another instance)
      {
        organizationId: "default-org",
        propertyId: 17,
        forecastStart: "2025-10-01",
        forecastEnd: "2025-10-31",
        predictedRoi: 11.4,
        predictedOccupancy: 68.7,
        aiNotes: "Villa Tropical Paradise forecast for shoulder season: strong performance expected with good occupancy rates. Moderate demand expected. Recommendations: enhance marketing efforts."
      },

      // Additional forecasts for comprehensive demo
      {
        organizationId: "default-org",
        propertyId: 2,
        forecastStart: "2025-11-01",
        forecastEnd: "2025-11-30",
        predictedRoi: 13.2,
        predictedOccupancy: 76.3,
        aiNotes: "Villa Ocean View forecast for shoulder season: strong performance expected with good occupancy rates. Moderate demand expected. Recommendations: target luxury family market."
      },
      {
        organizationId: "default-org",
        propertyId: 1,
        forecastStart: "2025-08-01",
        forecastEnd: "2025-08-31",
        predictedRoi: 6.9,
        predictedOccupancy: 52.1,
        aiNotes: "Villa Samui Breeze forecast for low season: below-average returns predicted with lower occupancy anticipated. Rainy season with reduced tourist activity. Recommendations: consider pricing optimization, enhance marketing efforts, focus on maintenance and renovations."
      }
    ];

    // Insert AI ROI predictions
    for (const prediction of predictionData) {
      await db.insert(aiRoiPredictions).values(prediction);
    }

    console.log(`✅ Successfully seeded ${predictionData.length} AI ROI Predictions`);
  } catch (error) {
    console.error("❌ Error seeding AI ROI Predictions data:", error);
  }
}