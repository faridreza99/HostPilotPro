import { storage } from "./storage";

export async function seedInventoryData() {
  console.log("🏨 Seeding Inventory & Welcome Pack Tracker data...");

  try {
    // Create inventory categories
    const bathroomCategory = await storage.createInventoryCategory({
      organizationId: "demo-org",
      categoryName: "Bathroom Essentials",
      description: "Toiletries and bathroom supplies for guest stays",
      sortOrder: 1,
    });

    const kitchenCategory = await storage.createInventoryCategory({
      organizationId: "demo-org",
      categoryName: "Kitchen & Dining",
      description: "Kitchen supplies and welcome beverages",
      sortOrder: 2,
    });

    const cleaningCategory = await storage.createInventoryCategory({
      organizationId: "demo-org",
      categoryName: "Cleaning Supplies",
      description: "Cleaning materials and maintenance items",
      sortOrder: 3,
    });

    const amenitiesCategory = await storage.createInventoryCategory({
      organizationId: "demo-org",
      categoryName: "Guest Amenities",
      description: "Welcome gifts and comfort items",
      sortOrder: 4,
    });

    // Create inventory items for Bathroom Essentials
    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: bathroomCategory.id,
      itemName: "Shampoo Bottles",
      description: "High-quality shampoo for guest use",
      unitType: "bottles",
      defaultQuantityPerBedroom: 1,
      costPerUnit: "25.00",
      sortOrder: 1,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: bathroomCategory.id,
      itemName: "Body Soap",
      description: "Luxury body soap bars",
      unitType: "bars",
      defaultQuantityPerBedroom: 2,
      costPerUnit: "15.00",
      sortOrder: 2,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: bathroomCategory.id,
      itemName: "Toilet Paper Rolls",
      description: "Premium toilet paper",
      unitType: "rolls",
      defaultQuantityPerBedroom: 4,
      costPerUnit: "8.00",
      sortOrder: 3,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: bathroomCategory.id,
      itemName: "Towel Set",
      description: "Bath and hand towels",
      unitType: "sets",
      defaultQuantityPerBedroom: 1,
      costPerUnit: "45.00",
      sortOrder: 4,
    });

    // Create inventory items for Kitchen & Dining
    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: kitchenCategory.id,
      itemName: "Welcome Water Bottles",
      description: "Complimentary water bottles",
      unitType: "bottles",
      defaultQuantityPerBedroom: 2,
      costPerUnit: "5.00",
      sortOrder: 1,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: kitchenCategory.id,
      itemName: "Coffee Pods",
      description: "Premium coffee pods",
      unitType: "pods",
      defaultQuantityPerBedroom: 6,
      costPerUnit: "3.00",
      sortOrder: 2,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: kitchenCategory.id,
      itemName: "Tea Bags",
      description: "Assorted tea selection",
      unitType: "bags",
      defaultQuantityPerBedroom: 8,
      costPerUnit: "2.00",
      sortOrder: 3,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: kitchenCategory.id,
      itemName: "Sugar Packets",
      description: "Individual sugar packets",
      unitType: "packets",
      defaultQuantityPerBedroom: 6,
      costPerUnit: "1.00",
      sortOrder: 4,
    });

    // Create inventory items for Cleaning Supplies
    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: cleaningCategory.id,
      itemName: "Disinfectant Spray",
      description: "Surface disinfectant for checkout cleaning",
      unitType: "bottles",
      defaultQuantityPerBedroom: 1,
      costPerUnit: "12.00",
      sortOrder: 1,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: cleaningCategory.id,
      itemName: "Laundry Detergent",
      description: "Detergent for washing linens",
      unitType: "scoops",
      defaultQuantityPerBedroom: 2,
      costPerUnit: "4.00",
      sortOrder: 2,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: cleaningCategory.id,
      itemName: "Trash Bags",
      description: "Garbage bags for room bins",
      unitType: "bags",
      defaultQuantityPerBedroom: 3,
      costPerUnit: "2.50",
      sortOrder: 3,
    });

    // Create inventory items for Guest Amenities
    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: amenitiesCategory.id,
      itemName: "Welcome Snacks",
      description: "Local snacks and treats",
      unitType: "packages",
      defaultQuantityPerBedroom: 1,
      costPerUnit: "20.00",
      sortOrder: 1,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: amenitiesCategory.id,
      itemName: "Slippers",
      description: "Disposable slippers",
      unitType: "pairs",
      defaultQuantityPerBedroom: 2,
      costPerUnit: "8.00",
      sortOrder: 2,
    });

    await storage.createInventoryItem({
      organizationId: "demo-org",
      categoryId: amenitiesCategory.id,
      itemName: "Welcome Note",
      description: "Personalized welcome card",
      unitType: "cards",
      defaultQuantityPerBedroom: 1,
      costPerUnit: "3.00",
      sortOrder: 3,
    });

    // Get all properties to create configs
    const properties = await storage.getProperties("demo-org");

    // Create welcome pack configs for each property
    for (const property of properties) {
      await storage.createPropertyWelcomePackConfig({
        organizationId: "demo-org",
        propertyId: property.id,
        oneBrCost: "300.00",
        twoBrCost: "350.00",
        threePlusBrCost: "400.00",
        defaultBillingRule: "owner",
      });
    }

    // Create some demo usage logs
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Usage log 1 - Sunset Villa checkout
    const usageLog1 = await storage.createInventoryUsageLog({
      organizationId: "demo-org",
      propertyId: properties[0]?.id || 1,
      guestCount: 4,
      stayNights: 3,
      checkoutDate: yesterday.toISOString(),
      totalPackCost: "350.00",
      billingRule: "owner",
      staffMemberId: "staff@test.com",
      notes: "Standard checkout cleaning and restocking",
    });

    // Usage log 2 - Ocean Breeze Villa checkout
    const usageLog2 = await storage.createInventoryUsageLog({
      organizationId: "demo-org",
      propertyId: properties[1]?.id || 2,
      guestCount: 6,
      stayNights: 5,
      checkoutDate: lastWeek.toISOString(),
      totalPackCost: "400.00",
      billingRule: "guest",
      billingReason: "Guest requested extra amenities",
      staffMemberId: "staff@test.com",
      isProcessed: true,
      processedBy: "admin@test.com",
      processedAt: lastWeek.toISOString(),
      notes: "Extra cleaning required, guest party",
    });

    // Usage log 3 - Mountain View Cabin checkout
    const usageLog3 = await storage.createInventoryUsageLog({
      organizationId: "demo-org",
      propertyId: properties[2]?.id || 3,
      guestCount: 2,
      stayNights: 2,
      checkoutDate: today.toISOString(),
      totalPackCost: "300.00",
      billingRule: "complimentary",
      billingReason: "VIP guest - complimentary stay",
      staffMemberId: "staff@test.com",
      notes: "VIP treatment with premium amenities",
    });

    // Create some stock levels
    const items = await storage.getInventoryItems("demo-org");
    for (const item of items.slice(0, 5)) {
      const isLowStock = Math.random() > 0.7; // 30% chance of low stock
      await storage.updateInventoryStockLevel(item.id, {
        organizationId: "demo-org",
        currentStock: isLowStock ? 5 : Math.floor(Math.random() * 50) + 20,
        minimumStock: 10,
        maxStock: 100,
        isLowStock: isLowStock,
        lastRestockDate: lastWeek.toISOString(),
        lastRestockQuantity: 50,
      });
    }

    // Create billing summary for last month
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthYear = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    for (const property of properties.slice(0, 3)) {
      await storage.createWelcomePackBillingSummary({
        organizationId: "demo-org",
        propertyId: property.id,
        monthYear: monthYear,
        totalUsages: Math.floor(Math.random() * 10) + 5,
        totalCostOwner: (Math.random() * 2000 + 1000).toFixed(2),
        totalCostGuest: (Math.random() * 500 + 200).toFixed(2),
        totalCostCompany: (Math.random() * 300 + 100).toFixed(2),
        totalCostComplimentary: (Math.random() * 200 + 50).toFixed(2),
        isProcessed: true,
        processedAt: today.toISOString(),
      });
    }

    console.log("✅ Inventory & Welcome Pack Tracker data seeded successfully!");
    console.log(`📦 Created ${items.length} inventory items in 4 categories`);
    console.log(`🏠 Configured ${properties.length} properties with welcome pack settings`);
    console.log("📊 Added demo usage logs and billing summaries");

  } catch (error) {
    console.error("❌ Error seeding inventory data:", error);
    throw error;
  }
}