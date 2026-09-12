import { db } from "./index";
import * as schema from "@shared/schema";
import { hash } from "bcrypt";
import { eq } from "drizzle-orm";

async function fixFarmerDistricts() {
  try {
    console.log("Fixing farmer districts...");
    
    // Get all farmers with their user info
    const allFarmers = await db.query.farmers.findMany({
      with: {
        user: true
      }
    });
    
    let updatedCount = 0;
    
    for (const farmer of allFarmers) {
      // If user doesn't have district but farmer has location, update user district
      if (!farmer.user?.district && farmer.location) {
        try {
          await db.update(schema.users)
            .set({ district: farmer.location.trim() })
            .where(eq(schema.users.id, farmer.userId));
          updatedCount++;
          console.log(`Updated farmer ${farmer.farmName} user district to: ${farmer.location}`);
        } catch (error) {
          console.error(`Failed to update farmer ${farmer.farmName}:`, error);
        }
      }
    }
    
    console.log(`Fixed ${updatedCount} farmer districts out of ${allFarmers.length} total farmers`);
    return { totalFarmers: allFarmers.length, updatedCount };
  } catch (error) {
    console.error('Error fixing farmer districts:', error);
    throw error;
  }
}

async function seed() {
  try {
    console.log("Starting seed process...");

    // First, fix farmer districts if needed
    await fixFarmerDistricts();

    // Check if admin user exists
    const existingAdminUser = await db.query.users.findFirst({
      where: (users) => eq(users.role, "admin")
    });
    
    // If admin doesn't exist, create one
    if (!existingAdminUser) {
      console.log("No admin user found. Creating admin user...");
      
      // Hash password
      const hashedPassword = await hash("password123", 10);
      
      // Create admin user
      const adminUser = {
        username: "admin",
        password: hashedPassword,
        email: "admin@harvestdirect.com",
        name: "Admin User",
        phone: "+1 (555) 123-4567",
        role: "admin"
      };
      
      await db.insert(schema.users)
        .values(adminUser)
        .returning();
        
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists.");
    }
    
    // Check if other data already exists
    const existingCategories = await db.query.categories.findMany({ limit: 1 });
    if (existingCategories.length > 0) {
      console.log("Categories already exist. Skipping full seed.");
      return;
    }

    // ---------------------------
    // Create categories
    // ---------------------------
    console.log("Creating categories...");
    const categories = [
      {
        name: "Fruits",
        description: "Fresh fruits from local farms"
      },
      {
        name: "Vegetables",
        description: "Seasonal vegetables harvested at peak freshness"
      },
      {
        name: "Herbs",
        description: "Aromatic herbs for cooking and medicinal purposes"
      },
      {
        name: "Dairy",
        description: "Fresh dairy products from local farms"
      },
      {
        name: "Eggs",
        description: "Farm fresh eggs from free-range chickens"
      },
      {
        name: "Nuts & Seeds",
        description: "Nutritious nuts and seeds for healthy snacking"
      },
      {
        name: "Honey",
        description: "Local honey and bee products"
      }
    ];

    const createdCategories = await db.insert(schema.categories)
      .values(categories)
      .returning();
    
    console.log(`Created ${createdCategories.length} categories`);

    // ---------------------------
    // Create users
    // ---------------------------
    console.log("Creating users...");

    // Hash passwords
    const hashedPassword = await hash("password123", 10);

    // Create farmer users
    const farmerUsers = [
      {
        username: "greenacres",
        password: hashedPassword,
        email: "info@greenacres.com",
        name: "John Smith",
        phone: "+1 (555) 234-5678",
        role: "farmer"
      },
      {
        username: "sunnyvalefarm",
        password: hashedPassword,
        email: "michael@sunnyvalefarm.com",
        name: "Michael Johnson",
        phone: "+1 (555) 345-6789",
        role: "farmer"
      },
      {
        username: "riverbankgardens",
        password: hashedPassword,
        email: "amy@riverbankgardens.com",
        name: "Amy Rodriguez",
        phone: "+1 (555) 456-7890",
        role: "farmer"
      }
    ];

    const createdFarmerUsers = await db.insert(schema.users)
      .values(farmerUsers)
      .returning();
    
    // Create customer users
    const customerUsers = [
      {
        username: "customer1",
        password: hashedPassword,
        email: "customer1@example.com",
        name: "Jane Doe",
        phone: "+1 (555) 567-8901",
        role: "customer"
      },
      {
        username: "customer2",
        password: hashedPassword,
        email: "customer2@example.com",
        name: "Alex Johnson",
        phone: "+1 (555) 678-9012",
        role: "customer"
      }
    ];

    const createdCustomerUsers = await db.insert(schema.users)
      .values(customerUsers)
      .returning();

    
    console.log(`Created ${createdFarmerUsers.length} farmer users and ${createdCustomerUsers.length} customer users`);

    // ---------------------------
    // Create farmers
    // ---------------------------
    console.log("Creating farmers...");

    const farmers = [
      {
        userId: createdFarmerUsers[0].id,
        farmName: "Green Acres Farm",
        description: "Family-owned farm specializing in organic berries and heirloom vegetables. Practicing sustainable farming since 1978.",
        location: "Riverdale, CA",
        distance: "12",
        imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=500",
        logoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        tags: ["Organic", "Berries", "Heirloom"],
        rating: 4.9,
        reviewCount: 124
      },
      {
        userId: createdFarmerUsers[1].id,
        farmName: "Sunnyvale Farm",
        description: "Specializing in heirloom tomatoes and seasonal greens. Using regenerative practices to build healthy soil and nutritious food.",
        location: "Maplewood, CA",
        distance: "8",
        imageUrl: "https://pixabay.com/get/g84e22d2ae975dd23d9db0b89372693c254cb4f8879370b5139badaaf5575e2d200b131e254fc59fdfbbf93d841b1386433833d55cc3360e78765add4f7cfe076_1280.jpg",
        logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        tags: ["Tomatoes", "Greens", "Regenerative"],
        rating: 4.7,
        reviewCount: 86
      },
      {
        userId: createdFarmerUsers[2].id,
        farmName: "Riverbank Gardens",
        description: "Woman-owned farm growing a diverse selection of vegetables and herbs. Known for unique varieties and exceptional quality.",
        location: "Oakridge, CA",
        distance: "15",
        imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=500",
        logoUrl: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        tags: ["Diverse", "Herbs", "Woman-owned"],
        rating: 4.8,
        reviewCount: 103
      }
    ];

    const createdFarmers = await db.insert(schema.farmers)
      .values(farmers)
      .returning();
    
    console.log(`Created ${createdFarmers.length} farmers`);

    // ---------------------------
    // Create customers
    // ---------------------------
    console.log("Creating customers...");

    const customers = createdCustomerUsers.map(user => ({
      userId: user.id,
      phone: "(555) 123-4567",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120"
    }));

    const createdCustomers = await db.insert(schema.customers)
      .values(customers)
      .returning();
    
    console.log(`Created ${createdCustomers.length} customers`);

    // ---------------------------
    // Create products
    // ---------------------------
    console.log("Creating products...");

    // Helper function to create a date in the future
    const futureDate = (days: number): Date => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date;
    };

    // Helper function to set month for harvest date
    const harvestMonth = (month: number): Date => {
      const date = new Date();
      date.setMonth(month, 15); // 15th day of the month
      return date;
    };

    const products = [
      {
        name: "Organic Strawberries",
        description: "Sweet, juicy berries picked at peak ripeness",
        price: 4.99,
        unit: "basket",
        status: "Available Now",
        categoryId: createdCategories[0].id, // Fruits
        farmerId: createdFarmers[0].id, // Green Acres Farm
        imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        availableUntil: futureDate(45), // 45 days from now
        harvestMonth: harvestMonth(5), // June
        inventory: 50,
        growingDetails: "Our strawberries are grown using organic practices. We plant them in early spring and harvest through summer. They're picked at peak ripeness for maximum flavor."
      },
      {
        name: "Spring Asparagus",
        description: "Tender spring asparagus, hand-harvested",
        price: 3.49,
        unit: "bundle",
        status: "Available Now",
        categoryId: createdCategories[1].id, // Vegetables
        farmerId: createdFarmers[1].id, // Sunnyvale Farm
        imageUrl: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        availableUntil: futureDate(30), // 30 days from now
        harvestMonth: harvestMonth(4), // May
        inventory: 35,
        growingDetails: "Our asparagus is planted in dedicated beds and harvested fresh each morning during the spring season. We harvest selectively to ensure each spear is tender and flavorful."
      },
      {
        name: "Heirloom Tomatoes",
        description: "Colorful variety of flavorful tomatoes",
        price: 5.99,
        unit: "lb",
        status: "Pre-Order",
        categoryId: createdCategories[1].id, // Vegetables
        farmerId: createdFarmers[2].id, // Riverbank Gardens
        imageUrl: "https://pixabay.com/get/ge0b6d2497eb3a0be738f4ae3c1be39fc2fb6ec77a13c59f850badcc54230e7884410e56c7bfdbe7d2276df0781927332_1280.jpg",
        availableUntil: futureDate(90), // 90 days from now
        harvestMonth: harvestMonth(7), // August
        inventory: 100,
        growingDetails: "Our heirloom tomatoes are grown from seeds passed down through generations. We start them in our greenhouse and transplant when the soil warms. Each variety is chosen for exceptional flavor."
      },
      {
        name: "Summer Squash Mix",
        description: "Fresh zucchini and yellow squash",
        price: 2.99,
        unit: "lb",
        status: "Available Now",
        categoryId: createdCategories[1].id, // Vegetables
        farmerId: createdFarmers[0].id, // Green Acres Farm
        imageUrl: "https://images.unsplash.com/photo-1583687355032-89b902b7335f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        availableUntil: futureDate(60), // 60 days from now
        harvestMonth: harvestMonth(6), // July
        inventory: 75,
        growingDetails: "Our summer squash is planted in succession for a continuous harvest throughout the season. We pick them small and tender for the best flavor and texture."
      },
      {
        name: "Fresh Basil",
        description: "Aromatic basil perfect for cooking",
        price: 2.49,
        unit: "bunch",
        status: "Available Now",
        categoryId: createdCategories[2].id, // Herbs
        farmerId: createdFarmers[2].id, // Riverbank Gardens
        imageUrl: "https://images.unsplash.com/photo-1600623632650-e595bac818d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        availableUntil: futureDate(40), // 40 days from now
        harvestMonth: harvestMonth(5), // June
        inventory: 60,
        growingDetails: "Our basil is grown in rich, well-drained soil with plenty of sunshine. We harvest it regularly to encourage bushier growth and maximum flavor."
      },
      {
        name: "Local Honey",
        description: "Pure, raw honey from our farm apiaries",
        price: 8.99,
        unit: "jar",
        status: "Available Now",
        categoryId: createdCategories[6].id, // Honey
        farmerId: createdFarmers[1].id, // Sunnyvale Farm
        imageUrl: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        availableUntil: futureDate(180), // 180 days from now
        harvestMonth: harvestMonth(7), // August
        inventory: 40,
        growingDetails: "Our honey is harvested from hives placed throughout our farm and surrounding natural areas. The bees forage on a diverse range of wildflowers, creating a unique flavor profile."
      },
      {
        name: "Fresh Farm Eggs",
        description: "Farm-fresh eggs from pasture-raised hens",
        price: 6.49,
        unit: "dozen",
        status: "Available Now",
        categoryId: createdCategories[4].id, // Eggs
        farmerId: createdFarmers[0].id, // Green Acres Farm
        imageUrl: "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        availableUntil: futureDate(30), // 30 days from now
        harvestMonth: harvestMonth(5), // June
        inventory: 25,
        growingDetails: "Our hens are raised on pasture where they can forage for insects and plants. They're supplemented with organic feed for balanced nutrition, resulting in eggs with rich, orange yolks."
      },
      {
        name: "Organic Kale",
        description: "Nutritious, crisp kale leaves",
        price: 3.99,
        unit: "bunch",
        status: "Available Now",
        categoryId: createdCategories[1].id, // Vegetables
        farmerId: createdFarmers[2].id, // Riverbank Gardens
        imageUrl: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        availableUntil: futureDate(25), // 25 days from now
        harvestMonth: harvestMonth(5), // June
        inventory: 45,
        growingDetails: "Our kale is grown in nutrient-rich soil and harvested young for tender leaves. We grow several varieties including Lacinato (Dinosaur) kale and Red Russian kale."
      }
    ];

    const createdProducts = await db.insert(schema.products)
      .values(products)
      .returning();
    
    console.log(`Created ${createdProducts.length} products`);

    // ---------------------------
    // Create calendar entries
    // ---------------------------
    console.log("Creating calendar entries...");

    function generateMonthlyStatus(harvestMonth: Date, availableUntil: Date): Record<string, string> {
      const monthlyStatus: Record<string, string> = {};
      
      // Set all months to 'none'
      for (let i = 0; i < 12; i++) {
        monthlyStatus[i.toString()] = 'none';
      }
      
      // Calculate growing period (3 months before harvest)
      const growingStartMonth = new Date(harvestMonth);
      growingStartMonth.setMonth(growingStartMonth.getMonth() - 3);
      
      // Get month numbers
      const harvestMonthNum = harvestMonth.getMonth();
      const growingStartMonthNum = growingStartMonth.getMonth();
      const availableUntilMonthNum = availableUntil.getMonth();
      
      // Set statuses
      for (let i = 0; i < 12; i++) {
        // Growing period
        if (growingStartMonthNum <= i && i < harvestMonthNum) {
          monthlyStatus[i.toString()] = 'growing';
        }
        
        // Harvest month
        if (i === harvestMonthNum) {
          monthlyStatus[i.toString()] = 'harvesting';
        }
        
        // Available period
        if (harvestMonthNum < i && i <= availableUntilMonthNum) {
          monthlyStatus[i.toString()] = 'available';
        }
        
        // Pre-order period (month before harvest)
        if ((harvestMonthNum - 1 + 12) % 12 === i) {
          monthlyStatus[i.toString()] = 'pre-order';
        }
      }
      
      return monthlyStatus;
    }

    const calendarEntries = createdProducts.map(product => ({
      productId: product.id,
      monthlyStatus: generateMonthlyStatus(new Date(product.harvestMonth), new Date(product.availableUntil))
    }));

    const createdCalendarEntries = await db.insert(schema.calendarEntries)
      .values(calendarEntries)
      .returning();
    
    console.log(`Created ${createdCalendarEntries.length} calendar entries`);

    // ---------------------------
    // Create reviews
    // ---------------------------
    console.log("Creating reviews...");

    const reviews = [
      {
        farmerId: createdFarmers[0].id,
        userId: createdCustomerUsers[0].id,
        rating: 5,
        comment: "Green Acres Farm has the best strawberries I've ever tasted! Their commitment to organic farming really shows in the quality and flavor."
      },
      {
        farmerId: createdFarmers[0].id,
        userId: createdCustomerUsers[1].id,
        rating: 4,
        comment: "Great produce and friendly service. I appreciate their sustainable farming practices."
      },
      {
        farmerId: createdFarmers[1].id,
        userId: createdCustomerUsers[0].id,
        rating: 5,
        comment: "Sunnyvale Farm's tomatoes are amazing! So many interesting heirloom varieties that you can't find in stores."
      },
      {
        farmerId: createdFarmers[2].id,
        userId: createdCustomerUsers[1].id,
        rating: 5,
        comment: "I love supporting Riverbank Gardens. Their herbs are incredibly fresh and flavorful."
      }
    ];

    const createdReviews = await db.insert(schema.reviews)
      .values(reviews)
      .returning();
    
    console.log(`Created ${createdReviews.length} reviews`);

    // Update review counts
    for (const farmer of createdFarmers) {
      const farmerReviews = createdReviews.filter(review => review.farmerId === farmer.id);
      
      if (farmerReviews.length > 0) {
        await db.update(schema.farmers)
          .set({ reviewCount: farmerReviews.length })
          .where(eq(schema.farmers.id, farmer.id));
      }
    }
    
    // Seed default order fees if they don't exist
    console.log("Checking for existing order fees...");
    const existingFees = await db.query.orderFees.findMany();
    
    if (existingFees.length === 0) {
      console.log("No existing order fees found. Creating default fees...");
      
      const defaultFees = [
        {
          name: "Delivery Fee",
          description: "Fee for delivery service",
          type: "fixed",
          value: "50.00", // ₹50 fixed fee
          isActive: true,
          applyToSubtotal: false,
          displayOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Goods Handling",
          description: "Fee for packaging and handling",
          type: "percentage",
          value: "2.00", // 2% of order value
          isActive: true,
          applyToSubtotal: true,
          displayOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Platform Fee",
          description: "Fee for using the platform services",
          type: "percentage",
          value: "5.00", // 5% of order value
          isActive: true,
          applyToSubtotal: true,
          displayOrder: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await db.insert(schema.orderFees).values(defaultFees);
      console.log("Created", defaultFees.length, "default order fees");
    } else {
      console.log("Found", existingFees.length, "existing order fees. Skipping fee creation.");
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
  }
}

seed();
