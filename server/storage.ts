import { db } from "@db";
import * as schema from "@shared/schema";
import { and, eq, SQL, desc, asc, inArray, sql, like, or } from "drizzle-orm";
import { 
  InsertUser, User, InsertFarmer, Farmer, InsertCustomer, Customer, 
  InsertProduct, Product, InsertOrderItem, OrderItem, InsertOrder, Order, 
  InsertCalendarEntry, CalendarEntry, InsertCategory, Category, 
  InsertReview, Review, InsertNewsletterSubscriber, NewsletterSubscriber,
  InsertProductImage, ProductImage, InsertOrderFee, OrderFee,
  InsertDistrict, District
} from "@shared/schema";

// Centralized user columns to prevent schema drift issues
const USER_SAFE_COLUMNS = {
  id: true,
  isActive: true,
  district: true,
  districtId: true,
  role: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  orgSlug: true,
  orgName: true,
  orgLogoUrl: true
} as const;

class Storage {
  schema = schema;
  
  // Helper Methods for District Normalization
  
  normalizeDistrictName(district: string): string {
    // Normalize district names to handle common variations
    const normalized = district.toLowerCase().trim();
    
    // Handle common district name variations
    const districtMapping: Record<string, string> = {
      'tumkur': 'tumkur',
      'tumakuru': 'tumkur',
      'tumkuru': 'tumkur',
      'bangalore rural': 'bengaluru rural',
      'bangalore urban': 'bengaluru urban',
      'bengaluru rural': 'bengaluru rural',
      'bengaluru urban': 'bengaluru urban',
      'chikkaballapur': 'chikkaballapur',
      'chikballapur': 'chikkaballapur',
      'chitradurga': 'chitradurga',
      'davanagere': 'davanagere',
      'davangere': 'davanagere',
      'mysore': 'mysore',
      'mysuru': 'mysore',
      'gulbarga': 'gulbarga',
      'kalaburagi': 'gulbarga',
      'mandya': 'mandya',
      'tirupati': 'tirupati',
      'tirupathi': 'tirupati'
    };
    
    return districtMapping[normalized] || normalized;
  }
  
  getDistrictVariations(district: string): string[] {
    // Get all possible variations of a district name
    const normalized = this.normalizeDistrictName(district);
    
    const variationsMap: Record<string, string[]> = {
      'tumkur': ['Tumkur', 'Tumakuru', 'Tumkuru'],
      'bengaluru rural': ['Bengaluru Rural', 'Bangalore Rural'],
      'bengaluru urban': ['Bengaluru Urban', 'Bangalore Urban'],
      'chikkaballapur': ['Chikkaballapur', 'Chikballapur'],
      'chitradurga': ['Chitradurga'],
      'davanagere': ['Davanagere', 'Davangere'],
      'mysore': ['Mysore', 'Mysuru'],
      'gulbarga': ['Gulbarga', 'Kalaburagi'],
      'mandya': ['Mandya'],
      'tirupati': ['Tirupati', 'Tirupathi']
    };
    
    return variationsMap[normalized] || [district];
  }
  
  // User Methods
  
  async getAllUsers(): Promise<User[]> {
    return await db.query.users.findMany({
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgLogoUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  async getUserById(id: number): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(schema.users.id, id),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgSlug: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgLogoUrl: true,
        orgQrCodeUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(schema.users.username, username),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgSlug: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgLogoUrl: true,
        orgQrCodeUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(schema.users.email, email),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgSlug: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgLogoUrl: true,
        orgQrCodeUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  async getUserByResetToken(resetToken: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(schema.users.resetToken, resetToken),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgLogoUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(schema.users).values(user).returning();
    return createdUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db.update(schema.users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(schema.users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Farmer Methods
  
  async getAllFarmers(): Promise<Farmer[]> {
    return await db.query.farmers.findMany({
      with: {
        user: { columns: USER_SAFE_COLUMNS }
      }
    });
  }
  
  async getFarmersWithFilters(filters?: SQL, limit?: number, orderBy?: SQL): Promise<Farmer[]> {
    let query = db.query.farmers.findMany({
      with: {
        user: { columns: USER_SAFE_COLUMNS }
      }
    });
    
    if (filters) {
      query = db.query.farmers.findMany({
        where: filters,
        with: {
          user: { columns: USER_SAFE_COLUMNS }
        }
      });
    }
    
    if (orderBy) {
      query = db.query.farmers.findMany({
        where: filters,
        with: {
          user: { columns: USER_SAFE_COLUMNS }
        },
        orderBy: orderBy
      });
    }
    
    const farmers = await query;
    
    if (limit) {
      return farmers.slice(0, limit);
    }
    
    return farmers;
  }
  
  async getFarmerById(id: number): Promise<Farmer | undefined> {
    return await db.query.farmers.findFirst({
      where: eq(schema.farmers.id, id),
      with: {
        user: { columns: USER_SAFE_COLUMNS }
      },
      columns: {
        id: true,
        userId: true,
        farmName: true,
        description: true,
        location: true,
        distance: true,
        address: true,
        imageUrl: true,
        logoUrl: true,
        website: true,
        phone: true,
        email: true,
        story: true,
        practices: true,
        tags: true,
        farmImages: true,
        instagramReels: true,
        youtube: true,
        rating: true,
        reviewCount: true,
        isZbnfCertified: true,
        isOrganicCertified: true,
        isNaturalCertified: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  async getFarmerByUserId(userId: number): Promise<Farmer | undefined> {
    return await db.query.farmers.findFirst({
      where: eq(schema.farmers.userId, userId),
      columns: {
        id: true,
        userId: true,
        farmName: true,
        description: true,
        location: true,
        distance: true,
        address: true,
        imageUrl: true,
        logoUrl: true,
        website: true,
        phone: true,
        email: true,
        story: true,
        practices: true,
        tags: true,
        farmImages: true,
        instagramReels: true,
        youtube: true,
        rating: true,
        reviewCount: true,
        isZbnfCertified: true,
        isOrganicCertified: true,
        isNaturalCertified: true,
        createdAt: true,
        updatedAt: true,
        aiSubscriptionActive: true,
        aiSubscriptionExpiry: true
      }
    });
  }
  
  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const [createdFarmer] = await db.insert(schema.farmers).values(farmer).returning();
    return createdFarmer;
  }
  
  async updateFarmer(id: number, farmerData: Partial<InsertFarmer>): Promise<Farmer> {
    const [updatedFarmer] = await db.update(schema.farmers)
      .set({
        ...farmerData,
        updatedAt: new Date()
      })
      .where(eq(schema.farmers.id, id))
      .returning();
    return updatedFarmer;
  }

  async deleteFarmer(id: number): Promise<void> {
    await db.delete(schema.farmers).where(eq(schema.farmers.id, id));
  }

  async deleteFarmerReviews(farmerId: number): Promise<void> {
    await db.delete(schema.reviews).where(eq(schema.reviews.farmerId, farmerId));
  }
  
  // Customer Methods
  
  async getCustomerByUserId(userId: number): Promise<Customer | undefined> {
    return await db.query.customers.findFirst({
      where: eq(schema.customers.userId, userId)
    });
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [createdCustomer] = await db.insert(schema.customers).values(customer).returning();
    return createdCustomer;
  }
  
  async updateCustomer(id: number, customerData: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db.update(schema.customers)
      .set({
        ...customerData,
        updatedAt: new Date()
      })
      .where(eq(schema.customers.id, id))
      .returning();
    return updatedCustomer;
  }
  
  // Category Methods
  
  async getAllCategories(): Promise<Category[]> {
    return await db.query.categories.findMany();
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return await db.query.categories.findFirst({
      where: eq(schema.categories.id, id)
    });
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [createdCategory] = await db.insert(schema.categories).values(category).returning();
    return createdCategory;
  }
  
  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db.update(schema.categories)
      .set({
        ...categoryData,
        updatedAt: new Date()
      })
      .where(eq(schema.categories.id, id))
      .returning();
    
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<void> {
    await db.delete(schema.categories).where(eq(schema.categories.id, id));
  }
  
  // District Methods
  
  async getAllDistricts(): Promise<District[]> {
    return await db.query.districts.findMany({
      orderBy: asc(schema.districts.name)
    });
  }
  
  async getActiveDistricts(): Promise<District[]> {
    return await db.query.districts.findMany({
      where: eq(schema.districts.isActive, true),
      orderBy: asc(schema.districts.name)
    });
  }
  
  async getDistrictById(id: number): Promise<District | undefined> {
    return await db.query.districts.findFirst({
      where: eq(schema.districts.id, id)
    });
  }
  
  async getDistrictByName(name: string): Promise<District | undefined> {
    return await db.query.districts.findFirst({
      where: eq(schema.districts.name, name)
    });
  }
  
  async createDistrict(district: InsertDistrict): Promise<District> {
    const [createdDistrict] = await db.insert(schema.districts).values(district).returning();
    return createdDistrict;
  }
  
  async updateDistrict(id: number, districtData: Partial<InsertDistrict>): Promise<District> {
    const [updatedDistrict] = await db.update(schema.districts)
      .set({
        ...districtData,
        updatedAt: new Date()
      })
      .where(eq(schema.districts.id, id))
      .returning();
    
    return updatedDistrict;
  }
  
  async deleteDistrict(id: number): Promise<void> {
    await db.delete(schema.districts).where(eq(schema.districts.id, id));
  }

  async getFarmerIdsByDistrictName(name: string): Promise<number[]> {
    // Normalize district name to handle variations (Tumkur, Tumakuru, etc.)
    const normalizedDistrict = this.normalizeDistrictName(name);
    
    // Get all possible district name variations for this normalized name
    const districtVariations = this.getDistrictVariations(normalizedDistrict);
    
    // Build OR conditions for all district variations with case-insensitive matching
    const whereConditions = districtVariations.map(variant => 
      sql`lower(${schema.users.district}) = lower(${variant})`
    );
    
    const result = await db
      .selectDistinct({ id: schema.farmers.id })
      .from(schema.farmers)
      .leftJoin(schema.users, eq(schema.farmers.userId, schema.users.id))
      .where(
        and(
          or(...whereConditions),
          eq(schema.users.isActive, true) // Only get farmers with active users
        )
      );
    
    return result.map(row => row.id);
  }
  
  // Product Methods
  
  async getProductsWithFilters(filters?: SQL, limit?: number): Promise<Product[]> {
    const queryOptions: any = {
      with: {
        category: true,
        farmer: true,
        createdByDm: true,
        approvedBy: true,
      },
      orderBy: desc(schema.products.createdAt)
    };
    
    if (filters) {
      queryOptions.where = filters;
    }
    
    if (limit) {
      queryOptions.limit = limit;
    }
    
    const products = await db.query.products.findMany(queryOptions);
    
    // Format products for frontend
    const formattedProducts = products.map(product => {
      const ap = (product as any);
      // FPO info: from approvedBy user (farmer products approved by FPO) or createdByDm (FPO-direct)
      const fpoUser = ap.approvedBy?.orgName ? ap.approvedBy
                    : ap.createdByDm?.orgName ? ap.createdByDm
                    : null;
      const fpo = fpoUser ? {
        orgName: fpoUser.orgName || null,
        orgLogoUrl: fpoUser.orgLogoUrl || null,
        orgSlug: fpoUser.orgSlug || null,
        district: fpoUser.district || null,
      } : null;

      return {
        ...product,
        fpo,
        farm: ap.farmer ? {
          id: ap.farmer.id,
          name: ap.farmer.farmName,
          location: ap.farmer.location,
          logoUrl: ap.farmer.logoUrl,
          isZbnfCertified: ap.farmer.isZbnfCertified,
          isOrganicCertified: ap.farmer.isOrganicCertified,
          isNaturalCertified: ap.farmer.isNaturalCertified,
        } : ap.createdByDm ? {
          id: ap.createdByDm.id,
          name: ap.createdByDm.orgName || ap.createdByDm.username,
          location: ap.createdByDm.district || 'Direct from FPO',
          logoUrl: ap.createdByDm.orgLogoUrl || null,
          orgSlug: ap.createdByDm.orgSlug || null,
          isZbnfCertified: false,
          isOrganicCertified: false,
          isNaturalCertified: false,
          isFpoDirect: true,
        } : null
      };
    });
    
    return formattedProducts;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const product = await db.query.products.findFirst({
      where: eq(schema.products.id, id),
      with: {
        category: true,
        farmer: true,
        createdByDm: true,
        approvedBy: true,
      }
    });
    
    if (!product) {
      return undefined;
    }
    
    const ap = product as any;
    const fpoUser = ap.approvedBy?.orgName ? ap.approvedBy
                  : ap.createdByDm?.orgName ? ap.createdByDm
                  : null;
    const fpo = fpoUser ? {
      orgName: fpoUser.orgName || null,
      orgLogoUrl: fpoUser.orgLogoUrl || null,
      orgSlug: fpoUser.orgSlug || null,
      district: fpoUser.district || null,
    } : null;

    // Format product for frontend with ALL fields preserved
    return {
      ...product,
      fpo,
      farm: ap.farmer ? {
        id: ap.farmer.id,
        name: ap.farmer.farmName,
        location: ap.farmer.location,
        logoUrl: ap.farmer.logoUrl,
        isZbnfCertified: ap.farmer.isZbnfCertified,
        isOrganicCertified: ap.farmer.isOrganicCertified,
        isNaturalCertified: ap.farmer.isNaturalCertified,
      } : ap.createdByDm ? {
        id: ap.createdByDm.id,
        name: ap.createdByDm.orgName || ap.createdByDm.username,
        location: ap.createdByDm.district || 'Direct from FPO',
        logoUrl: ap.createdByDm.orgLogoUrl || null,
        orgSlug: ap.createdByDm.orgSlug || null,
        isZbnfCertified: false,
        isOrganicCertified: false,
        isNaturalCertified: false,
        isFpoDirect: true,
      } : null
    };
  }
  
  async getProductsByFarmerId(farmerId: number): Promise<Product[]> {
    const products = await db.query.products.findMany({
      where: eq(schema.products.farmerId, farmerId),
      with: {
        category: true,
        farmer: true
      }
    });
    
    // Format products for frontend
    return products.map(product => {
      return {
        ...product,
        farm: product.farmer ? {
          id: product.farmer.id,
          name: product.farmer.farmName,
          location: product.farmer.location,
          logoUrl: product.farmer.logoUrl,
          isZbnfCertified: product.farmer.isZbnfCertified,
          isOrganicCertified: product.farmer.isOrganicCertified,
          isNaturalCertified: product.farmer.isNaturalCertified,
        } : null
      };
    });
  }

  async getActiveProductsByFarmerId(farmerId: number): Promise<Product[]> {
    const products = await db.query.products.findMany({
      where: and(
        eq(schema.products.farmerId, farmerId),
        eq(schema.products.isActive, true),
        eq(schema.products.approvalStatus, 'approved'),
        sql`${schema.products.availableUntil} > NOW()` // Exclude expired products
      ),
      with: {
        category: true,
        farmer: true
      }
    });
    
    // Format products for frontend
    return products.map(product => {
      return {
        ...product,
        farm: product.farmer ? {
          id: product.farmer.id,
          name: product.farmer.farmName,
          location: product.farmer.location,
          logoUrl: product.farmer.logoUrl,
          isZbnfCertified: product.farmer.isZbnfCertified,
          isOrganicCertified: product.farmer.isOrganicCertified,
          isNaturalCertified: product.farmer.isNaturalCertified,
        } : null
      };
    });
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [createdProduct] = await db.insert(schema.products).values(product).returning();
    
    // Get complete product with relations
    return this.getProductById(createdProduct.id);
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db.update(schema.products)
      .set({
        ...productData,
        updatedAt: new Date()
      })
      .where(eq(schema.products.id, id))
      .returning();
    
    // Get complete product with relations
    return this.getProductById(updatedProduct.id);
  }
  
  async deleteProduct(id: number): Promise<void> {
    // Check if product has any order items
    const orderItems = await db.query.orderItems.findMany({
      where: eq(schema.orderItems.productId, id)
    });

    if (orderItems.length > 0) {
      // Product has orders, so we'll soft delete by marking as inactive
      // Update the product to set approvalStatus to 'deleted' instead of hard delete
      await db.update(schema.products)
        .set({ 
          approvalStatus: 'deleted',
          updatedAt: new Date()
        })
        .where(eq(schema.products.id, id));
    } else {
      // No orders exist, safe to hard delete
      // First delete all related product images
      await db.delete(schema.productImages).where(eq(schema.productImages.productId, id));
      // Delete calendar entries
      await db.delete(schema.calendarEntries).where(eq(schema.calendarEntries.productId, id));
      // Then delete the product
      await db.delete(schema.products).where(eq(schema.products.id, id));
    }
  }
  
  // Product Images Methods
  
  async createProductImage(productImage: InsertProductImage): Promise<ProductImage> {
    const [createdImage] = await db.insert(schema.productImages).values(productImage).returning();
    
    // If this is a primary image or the first image, update the product's imageUrl
    if (productImage.isPrimary) {
      await db
        .update(schema.products)
        .set({ imageUrl: productImage.imageUrl, updatedAt: new Date() })
        .where(eq(schema.products.id, productImage.productId));
    } else {
      // Check if product has no imageUrl - if so, set this as the default
      const product = await db.query.products.findFirst({
        where: eq(schema.products.id, productImage.productId)
      });
      
      if (product && !product.imageUrl) {
        await db
          .update(schema.products)
          .set({ imageUrl: productImage.imageUrl, updatedAt: new Date() })
          .where(eq(schema.products.id, productImage.productId));
      }
    }
    
    return createdImage;
  }
  
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return await db.query.productImages.findMany({
      where: eq(schema.productImages.productId, productId),
      orderBy: [desc(schema.productImages.isPrimary)]
    });
  }
  
  async setPrimaryProductImage(imageId: number, productId: number): Promise<void> {
    // First, set all images for this product to non-primary
    await db
      .update(schema.productImages)
      .set({ isPrimary: false })
      .where(eq(schema.productImages.productId, productId));
    
    // Then set the selected image as primary
    await db
      .update(schema.productImages)
      .set({ isPrimary: true })
      .where(eq(schema.productImages.id, imageId));
    
    // Also update the main product's imageUrl field to match the primary image
    const primaryImage = await db.query.productImages.findFirst({
      where: eq(schema.productImages.id, imageId)
    });
    
    if (primaryImage) {
      await db
        .update(schema.products)
        .set({ imageUrl: primaryImage.imageUrl, updatedAt: new Date() })
        .where(eq(schema.products.id, productId));
    }
  }
  
  async deleteProductImage(imageId: number): Promise<void> {
    // Get the image details before deleting
    const imageToDelete = await db.query.productImages.findFirst({
      where: eq(schema.productImages.id, imageId)
    });
    
    if (!imageToDelete) return;
    
    const productId = imageToDelete.productId;
    const wasImageUrl = imageToDelete.imageUrl;
    
    // Delete the image
    await db
      .delete(schema.productImages)
      .where(eq(schema.productImages.id, imageId));
    
    // Check if the product's imageUrl matches the deleted image
    const product = await db.query.products.findFirst({
      where: eq(schema.products.id, productId)
    });
    
    if (product && product.imageUrl === wasImageUrl) {
      // Find the next available image (preferably primary)
      const remainingImages = await db.query.productImages.findMany({
        where: eq(schema.productImages.productId, productId),
        orderBy: [desc(schema.productImages.isPrimary)]
      });
      
      // Update product imageUrl to the next available image or null
      const newImageUrl = remainingImages.length > 0 ? remainingImages[0].imageUrl : null;
      await db
        .update(schema.products)
        .set({ imageUrl: newImageUrl, updatedAt: new Date() })
        .where(eq(schema.products.id, productId));
    }
  }
  
  // Order Methods
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const [createdOrder] = await db.insert(schema.orders).values(order).returning();
    return createdOrder;
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return await db.query.orders.findFirst({
      where: eq(schema.orders.id, id),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await db.query.orders.findMany({
      where: eq(schema.orders.userId, userId),
      with: {
        items: {
          with: {
            product: true
          }
        }
      },
      orderBy: desc(schema.orders.createdAt)
    });
  }
  
  async getOrdersByFarmerId(farmerId: number): Promise<Order[]> {
    // First get all order items for this farmer
    const orderItems = await db.query.orderItems.findMany({
      where: eq(schema.orderItems.farmerId, farmerId),
      with: {
        product: true
      }
    });
    
    if (orderItems.length === 0) {
      return [];
    }
    
    // Get unique order IDs
    const orderIds = [...new Set(orderItems.map(item => item.orderId))];
    
    // Get orders with all items
    const orders = await db.query.orders.findMany({
      where: inArray(schema.orders.id, orderIds),
      with: {
        items: {
          with: {
            product: true
          }
        }
      },
      orderBy: desc(schema.orders.createdAt)
    });
    
    // Ensure each order only includes items for this farmer
    const ordersWithFilteredItems = orders.map(order => {
      const farmerItems = order.items?.filter(item => item.farmerId === farmerId) || [];
      return {
        ...order,
        items: farmerItems
      };
    });
    
    return ordersWithFilteredItems;
  }
  
  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order> {
    const [updatedOrder] = await db.update(schema.orders)
      .set({
        ...orderData,
        updatedAt: new Date()
      })
      .where(eq(schema.orders.id, id))
      .returning();
    
    return updatedOrder;
  }
  
  // Order Item Methods
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [createdOrderItem] = await db.insert(schema.orderItems).values(orderItem).returning();
    return createdOrderItem;
  }
  
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return await db.query.orderItems.findMany({
      where: eq(schema.orderItems.orderId, orderId),
      with: {
        product: true
      }
    });
  }

  async getOrderItemsByFarmerId(farmerId: number): Promise<OrderItem[]> {
    return await db.query.orderItems.findMany({
      where: eq(schema.orderItems.farmerId, farmerId)
    });
  }
  
  async getOrdersWithFilters(filters?: SQL, limit?: number): Promise<Order[]> {
    const itemsEagerLoad = {
      items: {
        with: {
          product: {
            with: {
              farmer: true,
              createdByDm: { columns: { id: true, orgName: true, name: true } }
            }
          }
        }
      }
    };
    if (filters) {
      if (limit) {
        return await db.query.orders.findMany({
          where: filters,
          limit,
          with: itemsEagerLoad,
          orderBy: [desc(schema.orders.createdAt)]
        });
      }
      return await db.query.orders.findMany({
        where: filters,
        with: itemsEagerLoad,
        orderBy: [desc(schema.orders.createdAt)]
      });
    }
    
    if (limit) {
      return await db.query.orders.findMany({
        limit,
        with: itemsEagerLoad,
        orderBy: [desc(schema.orders.createdAt)]
      });
    }
    
    return await db.query.orders.findMany({
      with: itemsEagerLoad,
      orderBy: [desc(schema.orders.createdAt)]
    });
  }
  
  async getAllCustomers(): Promise<User[]> {
    return await db.query.users.findMany({
      where: eq(schema.users.role, "customer"),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgLogoUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  // Calendar Entry Methods
  
  async createCalendarEntry(calendarEntry: InsertCalendarEntry): Promise<CalendarEntry> {
    const [createdCalendarEntry] = await db.insert(schema.calendarEntries).values(calendarEntry).returning();
    return createdCalendarEntry;
  }
  
  async getCalendarEntryByProductId(productId: number): Promise<CalendarEntry | undefined> {
    return await db.query.calendarEntries.findFirst({
      where: eq(schema.calendarEntries.productId, productId)
    });
  }
  
  async updateCalendarEntry(id: number, calendarEntryData: Partial<InsertCalendarEntry>): Promise<CalendarEntry> {
    const [updatedCalendarEntry] = await db.update(schema.calendarEntries)
      .set({
        ...calendarEntryData,
        updatedAt: new Date()
      })
      .where(eq(schema.calendarEntries.id, id))
      .returning();
    
    return updatedCalendarEntry;
  }
  
  async deleteCalendarEntry(id: number): Promise<void> {
    await db.delete(schema.calendarEntries).where(eq(schema.calendarEntries.id, id));
  }
  
  async getCalendarEntriesWithFilters(filters?: SQL, limit?: number): Promise<any[]> {
    const entries = await db.select({
      id: schema.calendarEntries.id,
      productId: schema.calendarEntries.productId,
      monthlyStatus: schema.calendarEntries.monthlyStatus,
      createdAt: schema.calendarEntries.createdAt,
      product: {
        id: schema.products.id,
        name: schema.products.name,
        imageUrl: schema.products.imageUrl,
        categoryId: schema.products.categoryId,
        farmerId: schema.products.farmerId,
        farm: {
          id: schema.farmers.id,
          farmName: schema.farmers.farmName,
          logoUrl: schema.farmers.logoUrl
        }
      }
    })
    .from(schema.calendarEntries)
    .leftJoin(schema.products, eq(schema.calendarEntries.productId, schema.products.id))
    .leftJoin(schema.farmers, eq(schema.products.farmerId, schema.farmers.id))
    .where(filters || sql`1=1`);
    
    if (limit) {
      return entries.slice(0, limit);
    }
    
    return entries;
  }
  
  // Review Methods
  
  async createReview(review: InsertReview): Promise<Review> {
    const [createdReview] = await db.insert(schema.reviews).values(review).returning();
    
    // Update rating and review count based on the entity type
    if (review.farmerId) {
      await this.updateFarmerRating(review.farmerId);
    } else if (review.productId) {
      await this.updateProductRating(review.productId);
    }
    
    return createdReview;
  }
  
  async getReviewsByFarmerId(farmerId: number): Promise<Review[]> {
    return await db.query.reviews.findMany({
      where: eq(schema.reviews.farmerId, farmerId),
      with: {
        user: { columns: USER_SAFE_COLUMNS }
      },
      orderBy: desc(schema.reviews.createdAt)
    });
  }
  
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return await db.query.reviews.findMany({
      where: eq(schema.reviews.productId, productId),
      with: {
        user: { columns: USER_SAFE_COLUMNS }
      },
      orderBy: desc(schema.reviews.createdAt)
    });
  }
  
  async updateFarmerRating(farmerId: number): Promise<void> {
    // Get all reviews for the farmer
    const reviews = await this.getReviewsByFarmerId(farmerId);
    
    if (reviews.length === 0) return;
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    
    // Update farmer's rating and reviewCount
    await db.update(schema.farmers)
      .set({
        rating: averageRating,
        reviewCount: reviews.length,
        updatedAt: new Date()
      })
      .where(eq(schema.farmers.id, farmerId));
  }
  
  async updateProductRating(productId: number): Promise<void> {
    // Get all reviews for the product
    const reviews = await this.getReviewsByProductId(productId);
    
    if (reviews.length === 0) return;
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    
    // Update product's rating and reviewCount
    await db.update(schema.products)
      .set({
        rating: averageRating,
        reviewCount: reviews.length,
        updatedAt: new Date()
      })
      .where(eq(schema.products.id, productId));
  }
  
  // Newsletter Methods
  
  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [createdSubscriber] = await db.insert(schema.newsletterSubscribers).values(subscriber).returning();
    return createdSubscriber;
  }
  
  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    return await db.query.newsletterSubscribers.findFirst({
      where: eq(schema.newsletterSubscribers.email, email)
    });
  }
  
  async updateNewsletterSubscriber(id: number, subscriberData: Partial<InsertNewsletterSubscriber>): Promise<NewsletterSubscriber> {
    const [updatedSubscriber] = await db.update(schema.newsletterSubscribers)
      .set({
        ...subscriberData,
        updatedAt: new Date()
      })
      .where(eq(schema.newsletterSubscribers.id, id))
      .returning();
    
    return updatedSubscriber;
  }

  // Order Fee Methods
  
  async getAllOrderFees(): Promise<OrderFee[]> {
    return await db.query.orderFees.findMany({
      orderBy: asc(schema.orderFees.displayOrder)
    });
  }
  
  async getActiveOrderFees(): Promise<OrderFee[]> {
    return await db.query.orderFees.findMany({
      where: eq(schema.orderFees.isActive, true),
      orderBy: asc(schema.orderFees.displayOrder)
    });
  }
  
  async getOrderFeeById(id: number): Promise<OrderFee | undefined> {
    return await db.query.orderFees.findFirst({
      where: eq(schema.orderFees.id, id)
    });
  }
  
  async createOrderFee(orderFee: InsertOrderFee): Promise<OrderFee> {
    const [createdOrderFee] = await db.insert(schema.orderFees).values(orderFee).returning();
    return createdOrderFee;
  }
  
  async updateOrderFee(id: number, orderFeeData: Partial<InsertOrderFee>): Promise<OrderFee> {
    const [updatedOrderFee] = await db.update(schema.orderFees)
      .set({
        ...orderFeeData,
        updatedAt: new Date()
      })
      .where(eq(schema.orderFees.id, id))
      .returning();
    
    return updatedOrderFee;
  }
  
  async deleteOrderFee(id: number): Promise<void> {
    await db.delete(schema.orderFees).where(eq(schema.orderFees.id, id));
  }

  // Farmer Follow Methods
  async followFarmer(followerId: number, farmerId: number): Promise<schema.FarmerFollow> {
    const [follow] = await db.insert(schema.farmerFollows).values({
      followerId,
      farmerId: farmerId
    }).returning();
    return follow;
  }

  async unfollowFarmer(followerId: number, farmerId: number): Promise<void> {
    await db.delete(schema.farmerFollows)
      .where(and(
        eq(schema.farmerFollows.followerId, followerId),
        eq(schema.farmerFollows.farmerId, farmerId)
      ));
  }

  async isFollowing(followerId: number, farmerId: number): Promise<boolean> {
    const follow = await db.query.farmerFollows.findFirst({
      where: and(
        eq(schema.farmerFollows.followerId, followerId),
        eq(schema.farmerFollows.farmerId, farmerId)
      )
    });
    return !!follow;
  }

  async getFarmerFollowers(farmerId: number): Promise<schema.User[]> {
    const follows = await db.query.farmerFollows.findMany({
      where: eq(schema.farmerFollows.farmerId, farmerId),
      with: {
        follower: { columns: USER_SAFE_COLUMNS }
      }
    });
    return follows.map(f => f.follower);
  }

  async getUserFollowedFarmers(userId: number): Promise<schema.Farmer[]> {
    const follows = await db.query.farmerFollows.findMany({
      where: eq(schema.farmerFollows.followerId, userId),
      with: {
        farmer: true
      }
    });
    return follows.map(f => f.farmer);
  }

  async getFarmerFollowCounts(farmerId: number): Promise<{ followerCount: number }> {
    const followers = await this.getFarmerFollowers(farmerId);
    return { followerCount: followers.length };
  }

  // Notification Methods
  async createNotification(notification: schema.InsertNotification): Promise<schema.Notification> {
    const [created] = await db.insert(schema.notifications).values(notification).returning();
    return created;
  }

  async getUserNotifications(userId: number, limit: number = 50): Promise<schema.Notification[]> {
    return await db.query.notifications.findMany({
      where: eq(schema.notifications.userId, userId),
      orderBy: desc(schema.notifications.createdAt),
      limit: limit
    });
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await db.update(schema.notifications)
      .set({ isRead: true, updatedAt: new Date() })
      .where(eq(schema.notifications.id, notificationId));
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await db.update(schema.notifications)
      .set({ isRead: true, updatedAt: new Date() })
      .where(eq(schema.notifications.userId, userId));
  }

  async getUnreadNotificationCount(userId: number): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.notifications)
      .where(and(
        eq(schema.notifications.userId, userId),
        eq(schema.notifications.isRead, false)
      ));
    return result[0]?.count || 0;
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await db.delete(schema.notifications).where(eq(schema.notifications.id, notificationId));
  }

  // Notification helpers
  async notifyFollowersOfNewProduct(farmerId: number, productId: number, productName: string): Promise<void> {
    const followers = await this.getFarmerFollowers(farmerId);
    const farmer = await this.getFarmerById(farmerId);
    
    if (!farmer) return;

    const notifications = followers.map(follower => ({
      userId: follower.id,
      type: 'new_product',
      title: 'New Product Available',
      message: `${farmer.farmName} has added a new product: ${productName}`,
      data: JSON.stringify({ farmerId, productId, farmerName: farmer.farmName, productName })
    }));

    for (const notification of notifications) {
      await this.createNotification(notification);
    }
  }

  // Order notification methods
  async notifyFarmerOfNewOrder(orderId: number): Promise<void> {
    const order = await this.getOrderById(orderId);
    if (!order) return;

    const orderItems = await this.getOrderItemsByOrderId(orderId);
    const customer = await this.getUserById(order.userId);
    
    if (!customer) return;

    // Group items by farmer
    const farmerOrders = new Map<number, any[]>();
    
    for (const item of orderItems) {
      const product = await this.getProductById(item.productId);
      if (product) {
        if (!farmerOrders.has(product.farmerId)) {
          farmerOrders.set(product.farmerId, []);
        }
        farmerOrders.get(product.farmerId)!.push({
          productName: product.name,
          quantity: item.quantity,
          price: item.price
        });
      }
    }

    // Notify each farmer
    for (const [farmerId, items] of farmerOrders) {
      const farmer = await this.getFarmerById(farmerId);
      if (!farmer) continue;

      const farmerUser = await this.getUserById(farmer.userId);
      if (!farmerUser) continue;

      const itemsList = items.map(item => `${item.productName} (${item.quantity} units)`).join(', ');
      const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

      await this.createNotification({
        userId: farmerUser.id,
        type: 'new_order',
        title: 'New Order Received',
        message: `You have received a new order from ${customer.name}. Items: ${itemsList}. Total value: ₹${totalValue.toFixed(2)}`,
        data: JSON.stringify({
          orderId,
          customerId: customer.id,
          customerName: customer.name,
          items,
          totalValue,
          orderStatus: order.status
        })
      });
    }
  }

  async notifyOrderStatusUpdate(orderId: number, newStatus: string): Promise<void> {
    const order = await this.getOrderById(orderId);
    if (!order) return;

    const customer = await this.getUserById(order.userId);
    const orderItems = await this.getOrderItemsByOrderId(orderId);
    
    if (!customer) return;

    // Notify customer of status change
    const statusMessages = {
      'pending': 'Your order has been placed and is pending confirmation',
      'accepted': 'Your order has been accepted by the farmer',
      'growing': 'Your products are currently being grown',
      'harvested': 'Your products have been harvested',
      'packaging': 'Your order is being packaged for shipment',
      'shipping': 'Your order has been shipped and is on its way',
      'delivered': 'Your order has been delivered',
      'cancelled': 'Your order has been cancelled'
    };

    await this.createNotification({
      userId: customer.id,
      type: 'order_status',
      title: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      message: statusMessages[newStatus as keyof typeof statusMessages] || `Your order status has been updated to ${newStatus}`,
      data: JSON.stringify({
        orderId,
        newStatus,
        orderDate: order.createdAt,
        totalAmount: order.total
      })
    });

    // Also notify farmers involved in this order
    const farmerIds = new Set<number>();
    for (const item of orderItems) {
      const product = await this.getProductById(item.productId);
      if (product) {
        farmerIds.add(product.farmerId);
      }
    }

    for (const farmerId of farmerIds) {
      const farmer = await this.getFarmerById(farmerId);
      if (!farmer) continue;

      const farmerUser = await this.getUserById(farmer.userId);
      if (!farmerUser) continue;

      await this.createNotification({
        userId: farmerUser.id,
        type: 'order_status',
        title: `Order Status Updated`,
        message: `Order #${orderId} from ${customer.name} has been ${newStatus}`,
        data: JSON.stringify({
          orderId,
          customerId: customer.id,
          customerName: customer.name,
          newStatus,
          totalAmount: order.total
        })
      });
    }
  }

  async notifyPaymentStatus(orderId: number, paymentStatus: string): Promise<void> {
    const order = await this.getOrderById(orderId);
    if (!order) return;

    const customer = await this.getUserById(order.userId);
    const orderItems = await this.getOrderItemsByOrderId(orderId);
    
    if (!customer) return;

    // Notify customer of payment status
    const paymentMessages = {
      'pending': 'Your payment is being processed',
      'completed': 'Your payment has been successfully processed',
      'failed': 'Your payment has failed. Please try again',
      'refunded': 'Your payment has been refunded'
    };

    await this.createNotification({
      userId: customer.id,
      type: 'payment_status',
      title: `Payment ${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}`,
      message: paymentMessages[paymentStatus as keyof typeof paymentMessages] || `Payment status: ${paymentStatus}`,
      data: JSON.stringify({
        orderId,
        paymentStatus,
        amount: order.total
      })
    });

    // Notify farmers of successful payment
    if (paymentStatus === 'completed') {
      const farmerIds = new Set<number>();
      for (const item of orderItems) {
        const product = await this.getProductById(item.productId);
        if (product) {
          farmerIds.add(product.farmerId);
        }
      }

      for (const farmerId of farmerIds) {
        const farmer = await this.getFarmerById(farmerId);
        if (!farmer) continue;

        const farmerUser = await this.getUserById(farmer.userId);
        if (!farmerUser) continue;

        await this.createNotification({
          userId: farmerUser.id,
          type: 'payment_received',
          title: 'Payment Received',
          message: `Payment for order #${orderId} from ${customer.name} has been completed`,
          data: JSON.stringify({
            orderId,
            customerId: customer.id,
            customerName: customer.name,
            amount: order.total
          })
        });
      }
    }
  }

  // Low Stock Alert Notification
  async notifyLowStock(productId: number, currentStock: number, threshold: number = 10): Promise<void> {
    const product = await this.getProductById(productId);
    if (!product) return;

    const farmer = await this.getFarmerById(product.farmerId);
    if (!farmer) return;

    const farmerUser = await this.getUserById(farmer.userId);
    if (!farmerUser) return;

    await this.createNotification({
      userId: farmerUser.id,
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: `Your product "${product.name}" is running low with only ${currentStock} units remaining. Consider restocking soon!`,
      data: JSON.stringify({
        productId,
        productName: product.name,
        currentStock,
        threshold
      })
    });
  }

  // Product Approval Notification
  async notifyProductApproval(productId: number, approved: boolean, reason?: string): Promise<void> {
    const product = await this.getProductById(productId);
    if (!product) return;

    const farmer = await this.getFarmerById(product.farmerId);
    if (!farmer) return;

    const farmerUser = await this.getUserById(farmer.userId);
    if (!farmerUser) return;

    const status = approved ? 'approved' : 'rejected';
    const title = approved ? 'Product Approved!' : 'Product Needs Attention';
    const message = approved 
      ? `Great news! Your product "${product.name}" has been approved and is now live on the marketplace.`
      : `Your product "${product.name}" requires some changes. ${reason || 'Please review and resubmit.'}`;

    await this.createNotification({
      userId: farmerUser.id,
      type: 'product_approval',
      title,
      message,
      data: JSON.stringify({
        productId,
        productName: product.name,
        status,
        reason
      })
    });
  }

  // New Review Notification
  async notifyNewReview(reviewId: number, productId: number, rating: number, reviewerName: string): Promise<void> {
    const product = await this.getProductById(productId);
    if (!product) return;

    const farmer = await this.getFarmerById(product.farmerId);
    if (!farmer) return;

    const farmerUser = await this.getUserById(farmer.userId);
    if (!farmerUser) return;

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    await this.createNotification({
      userId: farmerUser.id,
      type: 'new_review',
      title: 'New Review Received',
      message: `${reviewerName} left a ${rating}-star review ${stars} for your product "${product.name}".`,
      data: JSON.stringify({
        reviewId,
        productId,
        productName: product.name,
        rating,
        reviewerName
      })
    });
  }

  // New Follower Notification
  async notifyNewFollower(farmerId: number, followerUserId: number): Promise<void> {
    const farmer = await this.getFarmerById(farmerId);
    if (!farmer) return;

    const farmerUser = await this.getUserById(farmer.userId);
    if (!farmerUser) return;

    const follower = await this.getUserById(followerUserId);
    if (!follower) return;

    const followerName = follower.name || follower.username || 'A new user';

    await this.createNotification({
      userId: farmerUser.id,
      type: 'new_follower',
      title: 'New Follower!',
      message: `${followerName} is now following your farm "${farmer.farmName}". You now have a growing community!`,
      data: JSON.stringify({
        farmerId,
        farmName: farmer.farmName,
        followerId: followerUserId,
        followerName
      })
    });
  }

  // Quote Status Notification to Customer
  async notifyQuoteStatus(quoteId: number, customerId: number, status: string, productName: string, farmerResponse?: string): Promise<void> {
    const customer = await this.getUserById(customerId);
    if (!customer) return;

    const statusMessages: Record<string, { title: string; message: string }> = {
      accepted: {
        title: 'Quote Accepted!',
        message: `Great news! Your quote for "${productName}" has been accepted by the farmer. ${farmerResponse ? `Farmer's note: ${farmerResponse}` : 'You can now proceed with the payment.'}`
      },
      rejected: {
        title: 'Quote Update',
        message: `Your quote for "${productName}" could not be accepted. ${farmerResponse || 'The farmer may have suggested alternatives.'}`
      },
      countered: {
        title: 'Counter Offer Received',
        message: `The farmer has made a counter offer for your "${productName}" quote. ${farmerResponse || 'Please review the new terms.'}`
      }
    };

    const notification = statusMessages[status] || {
      title: 'Quote Update',
      message: `Your quote for "${productName}" has been updated to: ${status}`
    };

    await this.createNotification({
      userId: customer.id,
      type: 'quote_status',
      title: notification.title,
      message: notification.message,
      data: JSON.stringify({
        quoteId,
        productName,
        status,
        farmerResponse
      })
    });
  }

  // Role Hierarchy Management Methods

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.query.users.findMany({
      where: eq(schema.users.role, role),
      orderBy: asc(schema.users.name),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgSlug: true,
        orgLogoUrl: true,
        orgQrCodeUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getUsersUnderManager(managerId: number): Promise<User[]> {
    return await db.query.users.findMany({
      where: eq(schema.users.reportsTo, managerId),
      orderBy: asc(schema.users.name),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgSlug: true,
        orgLogoUrl: true,
        orgQrCodeUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getDistrictManagers(): Promise<User[]> {
    return await this.getUsersByRole('district_manager');
  }

  async getTalukAgents(): Promise<User[]> {
    return await this.getUsersByRole('taluk_agent');
  }

  async getDeliveryAgents(): Promise<User[]> {
    return await this.getUsersByRole('delivery_agent');
  }

  async getUsersInDistrict(district: string): Promise<User[]> {
    return await db.query.users.findMany({
      where: eq(schema.users.district, district),
      orderBy: asc(schema.users.name),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgLogoUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  async getUsersByRoleAndDistrict(role: string, district: string): Promise<User[]> {
    return await db.query.users.findMany({
      where: and(
        eq(schema.users.role, role),
        eq(schema.users.district, district)
      ),
      orderBy: asc(schema.users.name),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgLogoUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getUsersInTaluk(taluk: string): Promise<User[]> {
    return await db.query.users.findMany({
      where: eq(schema.users.taluk, taluk),
      orderBy: asc(schema.users.name),
      columns: {
        id: true,
        username: true,
        password: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        district: true,
        // Skip districtId to avoid column not exists error
        taluk: true,
        reportsTo: true,
        resetToken: true,
        resetTokenExpiry: true,
        isActive: true,
        orgName: true,
        orgAddress: true,
        orgPhone: true,
        orgEmail: true,
        orgLogoUrl: true,
        bankAccountNumber: true,
        bankIfsc: true,
        gstNumber: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getFarmersInDistrict(district: string): Promise<Farmer[]> {
    // Normalize district name for consistent matching
    const normalizedDistrict = this.normalizeDistrictName(district);
    
    // Get farmer IDs that belong to this district using server-side filtering
    const farmerIds = await this.getFarmerIdsByDistrictName(normalizedDistrict);
    
    // Early return if no farmers in this district
    if (farmerIds.length === 0) {
      return [];
    }
    
    // Query only farmers in the specified district with proper database filtering
    // Active user filtering is already handled at the database level in getFarmerIdsByDistrictName()
    return await db.query.farmers.findMany({
      where: inArray(schema.farmers.id, farmerIds),
      with: {
        user: { columns: USER_SAFE_COLUMNS }
      }
    });
  }

  async getProductsInDistrict(district: string): Promise<Product[]> {
    // Normalize district name for consistent matching
    const normalizedDistrict = this.normalizeDistrictName(district);
    
    // Get farmer IDs that belong to this district using server-side filtering
    const farmerIds = await this.getFarmerIdsByDistrictName(normalizedDistrict);
    
    // Early return if no farmers in this district
    if (farmerIds.length === 0) {
      return [];
    }
    
    // Query only products from farmers in the specified district with proper database filtering
    // Active user filtering is already handled at the database level in getFarmerIdsByDistrictName()
    return await db.query.products.findMany({
      where: inArray(schema.products.farmerId, farmerIds),
      with: {
        farmer: {
          with: {
            user: { columns: USER_SAFE_COLUMNS }
          }
        }
      }
    });
  }

  async getOrdersInDistrict(district: string): Promise<Order[]> {
    // Step 1: Normalize district name and get farmer IDs using server-side filtering
    const normalizedDistrict = this.normalizeDistrictName(district);
    const farmerIds = await this.getFarmerIdsByDistrictName(normalizedDistrict);
    
    // Early return if no farmers in this district
    if (farmerIds.length === 0) {
      return [];
    }
    
    // Step 2: Get product IDs from farmers in the district
    const productIdsResult = await db
      .select({ id: schema.products.id })
      .from(schema.products)
      .where(inArray(schema.products.farmerId, farmerIds))
      .groupBy(schema.products.id);
    
    const productIds = productIdsResult.map(row => row.id);
    
    // Early return if no products from district farmers
    if (productIds.length === 0) {
      return [];
    }
    
    // Step 3: Get order IDs from order items containing district products
    const orderIdsResult = await db
      .select({ orderId: schema.orderItems.orderId })
      .from(schema.orderItems)
      .where(inArray(schema.orderItems.productId, productIds))
      .groupBy(schema.orderItems.orderId);
    
    const orderIds = orderIdsResult.map(row => row.orderId);
    
    // Early return if no orders contain district products
    if (orderIds.length === 0) {
      return [];
    }
    
    // Step 4: Get final orders with proper database filtering (items pre-loaded to avoid N+1)
    return await db.query.orders.findMany({
      where: inArray(schema.orders.id, orderIds),
      with: {
        user: { columns: USER_SAFE_COLUMNS },
        items: { with: { product: { with: { farmer: true, createdByDm: { columns: { id: true, orgName: true, name: true } } } } } }
      }
    });
  }

  async createStaffUser(userData: InsertUser): Promise<User> {
    return await this.createUser(userData);
  }

  async updateUserRole(userId: number, role: string, reportsTo?: number, district?: string, taluk?: string): Promise<User> {
    const updateData: Partial<InsertUser> = {
      role,
      reportsTo,
      district,
      taluk,
      updatedAt: new Date()
    };

    const [updatedUser] = await db.update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, userId))
      .returning();

    return updatedUser;
  }

  async getHierarchyStructure(): Promise<any> {
    // Get all staff users with their reporting relationships
    const admins = await this.getUsersByRole('admin');
    const districtManagers = await this.getUsersByRole('district_manager');
    const talukAgents = await this.getUsersByRole('taluk_agent');
    const deliveryAgents = await this.getUsersByRole('delivery_agent');

    // Build hierarchy structure
    const hierarchy = {
      admins,
      districts: [] as any[]
    };

    for (const manager of districtManagers) {
      const district = {
        manager,
        talukAgents: talukAgents.filter(agent => agent.reportsTo === manager.id),
        deliveryAgents: deliveryAgents.filter(agent => agent.reportsTo === manager.id)
      };
      hierarchy.districts.push(district);
    }

    return hierarchy;
  }

  async canUserAccessResource(userId: number, resourceType: string, resourceId?: number): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    // Admin has access to everything
    if (user.role === 'admin') return true;

    // Role-based access control logic
    switch (user.role) {
      case 'district_manager':
        // District managers can access their district's data
        return true;
      case 'taluk_agent':
        // Taluk agents can access their taluk's data
        return true;
      case 'delivery_agent':
        // Delivery agents can access delivery-related data
        return resourceType === 'orders' || resourceType === 'deliveries';
      default:
        return false;
    }
  }

  // ZBNF Plans Management Methods
  async saveZbnfPlan(planData: any): Promise<any> {
    try {
      const [savedPlan] = await db.insert(schema.zbnfPlans).values(planData).returning();
      return savedPlan;
    } catch (error) {
      console.error('Error saving ZBNF plan:', error);
      
      // If table doesn't exist, create a temporary plan with ID
      if (error.code === '42P01') {
        console.log('Table zbnf_plans does not exist, creating temporary plan');
        const tempPlan = {
          id: Date.now(), // Temporary ID
          ...planData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return tempPlan;
      }
      throw error;
    }
  }

  async getZbnfPlansByFarmer(farmerId: number): Promise<any[]> {
    try {
      return await db.query.zbnfPlans.findMany({
        where: eq(schema.zbnfPlans.farmerId, farmerId),
        orderBy: desc(schema.zbnfPlans.createdAt)
      });
    } catch (error) {
      console.error('Error fetching ZBNF plans:', error);
      return [];
    }
  }

  async getZbnfPlansByUser(userId: number): Promise<any[]> {
    try {
      return await db.query.zbnfPlans.findMany({
        where: eq(schema.zbnfPlans.userId, userId),
        orderBy: desc(schema.zbnfPlans.createdAt)
      });
    } catch (error) {
      console.error('Error fetching ZBNF plans:', error);
      return [];
    }
  }

  // AI Subscription Plans Management Methods
  async createAiSubscriptionPlan(planData: any): Promise<any> {
    try {
      const [createdPlan] = await db.insert(schema.aiSubscriptionPlans).values(planData).returning();
      return createdPlan;
    } catch (error) {
      console.error('Error creating AI subscription plan:', error);
      throw error;
    }
  }

  async getAllAiSubscriptionPlans(): Promise<any[]> {
    try {
      return await db.query.aiSubscriptionPlans.findMany({
        where: eq(schema.aiSubscriptionPlans.isActive, true),
        orderBy: asc(schema.aiSubscriptionPlans.price)
      });
    } catch (error) {
      console.error('Error fetching AI subscription plans:', error);
      return [];
    }
  }

  async updateAiSubscriptionPlan(planId: number, planData: any): Promise<any> {
    try {
      const [updatedPlan] = await db.update(schema.aiSubscriptionPlans)
        .set({ ...planData, updatedAt: new Date() })
        .where(eq(schema.aiSubscriptionPlans.id, planId))
        .returning();
      return updatedPlan;
    } catch (error) {
      console.error('Error updating AI subscription plan:', error);
      throw error;
    }
  }

  async deleteAiSubscriptionPlan(planId: number): Promise<void> {
    try {
      await db.update(schema.aiSubscriptionPlans)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(schema.aiSubscriptionPlans.id, planId));
    } catch (error) {
      console.error('Error deleting AI subscription plan:', error);
      throw error;
    }
  }

  // ZBNF Certification Management Methods
  async updateFarmerZbnfCertification(farmerId: number, isZbnfCertified: boolean): Promise<Farmer> {
    try {
      const [updatedFarmer] = await db.update(schema.farmers)
        .set({ 
          isZbnfCertified,
          updatedAt: new Date()
        })
        .where(eq(schema.farmers.id, farmerId))
        .returning();
      return updatedFarmer;
    } catch (error) {
      console.error('Error updating farmer ZBNF certification:', error);
      throw error;
    }
  }

  async updateFarmerOrganicCertification(farmerId: number, isOrganicCertified: boolean): Promise<Farmer> {
    try {
      const [updatedFarmer] = await db.update(schema.farmers)
        .set({ isOrganicCertified, updatedAt: new Date() })
        .where(eq(schema.farmers.id, farmerId))
        .returning();
      return updatedFarmer;
    } catch (error) {
      console.error('Error updating farmer organic certification:', error);
      throw error;
    }
  }

  async updateFarmerNaturalCertification(farmerId: number, isNaturalCertified: boolean): Promise<Farmer> {
    try {
      const [updatedFarmer] = await db.update(schema.farmers)
        .set({ isNaturalCertified, updatedAt: new Date() })
        .where(eq(schema.farmers.id, farmerId))
        .returning();
      return updatedFarmer;
    } catch (error) {
      console.error('Error updating farmer natural certification:', error);
      throw error;
    }
  }

  // AI Subscription Management Methods
  async updateFarmerAISubscription(userId: number, active: boolean, expiryDate?: Date): Promise<void> {
    try {
      const farmer = await db.query.farmers.findFirst({
        where: eq(schema.farmers.userId, userId)
      });

      if (!farmer) {
        throw new Error('Farmer not found');
      }

      await db.update(schema.farmers)
        .set({ 
          aiSubscriptionActive: active,
          aiSubscriptionExpiry: expiryDate || null,
          updatedAt: new Date()
        })
        .where(eq(schema.farmers.userId, userId));
    } catch (error) {
      console.error('Error updating farmer AI subscription:', error);
      throw error;
    }
  }

  async checkFarmerAISubscription(userId: number): Promise<boolean> {
    try {
      const farmer = await db.query.farmers.findFirst({
        where: eq(schema.farmers.userId, userId)
      });

      if (!farmer) {
        return false;
      }

      if (!farmer.aiSubscriptionActive) {
        return false;
      }

      if (farmer.aiSubscriptionExpiry && farmer.aiSubscriptionExpiry < new Date()) {
        await this.updateFarmerAISubscription(userId, false);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking farmer AI subscription:', error);
      return false;
    }
  }

  async getZbnfPlanById(planId: string): Promise<any> {
    try {
      return await db.query.zbnfPlans.findFirst({
        where: eq(schema.zbnfPlans.id, parseInt(planId))
      });
    } catch (error) {
      console.error('Error fetching ZBNF plan by ID:', error);
      return null;
    }
  }

  async updateZbnfPlan(planId: string, updateData: any): Promise<any> {
    try {
      const [updatedPlan] = await db.update(schema.zbnfPlans)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(schema.zbnfPlans.id, parseInt(planId)))
        .returning();
      return updatedPlan;
    } catch (error) {
      console.error('Error updating ZBNF plan:', error);
      throw error;
    }
  }

  async deleteZbnfPlan(planId: string): Promise<boolean> {
    try {
      await db.delete(schema.zbnfPlans).where(eq(schema.zbnfPlans.id, parseInt(planId)));
      return true;
    } catch (error) {
      console.error('Error deleting ZBNF plan:', error);
      return false;
    }
  }

  // Quote functions for B2B Quote Mode
  async createQuote(quoteData: any) {
    try {
      const [quote] = await db.insert(schema.consumerQuotes)
        .values({
          ...quoteData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return quote;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  }

  async getAllQuotes() {
    try {
      const quotes = await db.query.consumerQuotes.findMany({
        with: {
          product: {
            with: {
              farmer: true
            }
          },
          consumer: true,
          farmer: true
        },
        orderBy: (quotes, { desc }) => [desc(quotes.createdAt)]
      });
      return quotes;
    } catch (error) {
      console.error('Error fetching all quotes:', error);
      throw error;
    }
  }

  async getQuotesByFarmerId(farmerId: number) {
    try {
      const quotes = await db.query.consumerQuotes.findMany({
        where: eq(schema.consumerQuotes.farmerId, farmerId),
        with: {
          product: {
            with: {
              farmer: true
            }
          },
          consumer: true,
          farmer: true
        },
        orderBy: (quotes, { desc }) => [desc(quotes.createdAt)]
      });
      return quotes;
    } catch (error) {
      console.error('Error fetching quotes by farmer ID:', error);
      throw error;
    }
  }

  async getQuotesByDistrictId(districtId: number) {
    try {
      // Get all farmers in the district first
      const district = await this.getDistrictById(districtId);
      if (!district) return [];
      
      const farmerIds = await this.getFarmerIdsByDistrictName(district.name);
      if (farmerIds.length === 0) return [];
      
      // Get quotes for those farmers directly
      const quotes = await db.query.consumerQuotes.findMany({
        where: inArray(schema.consumerQuotes.farmerId, farmerIds),
        with: {
          product: {
            with: {
              farmer: true
            }
          },
          consumer: true,
          farmer: true
        },
        orderBy: (quotes, { desc }) => [desc(quotes.createdAt)]
      });
      
      return quotes;
    } catch (error) {
      console.error('Error fetching quotes by district ID:', error);
      throw error;
    }
  }

  async getQuotesByUserId(userId: number) {
    try {
      const quotes = await db.query.consumerQuotes.findMany({
        where: eq(schema.consumerQuotes.consumerId, userId),
        with: {
          product: {
            with: {
              farmer: true
            }
          },
          consumer: true,
          farmer: true
        },
        orderBy: (quotes, { desc }) => [desc(quotes.createdAt)]
      });
      return quotes;
    } catch (error) {
      console.error('Error fetching quotes by user ID:', error);
      throw error;
    }
  }

  async getQuoteById(quoteId: number) {
    try {
      const quote = await db.query.consumerQuotes.findFirst({
        where: eq(schema.consumerQuotes.id, quoteId),
        with: {
          product: {
            with: {
              farmer: true
            }
          },
          consumer: true,
          farmer: true
        }
      });
      return quote;
    } catch (error) {
      console.error('Error fetching quote by ID:', error);
      throw error;
    }
  }

  async updateQuoteStatus(quoteId: number, status: string) {
    try {
      const [updatedQuote] = await db.update(schema.consumerQuotes)
        .set({
          status,
          updatedAt: new Date()
        })
        .where(eq(schema.consumerQuotes.id, quoteId))
        .returning();
      return updatedQuote;
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  }

  // ==================== FARMER VOICE METHODS ====================

  async createFarmerVoicePost(data: {
    districtManagerId: number;
    districtId: number;
    title: string;
    content: string;
    category: string;
    socialMediaUrl?: string;
  }) {
    try {
      const [post] = await db.insert(schema.farmerVoicePosts).values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      return post;
    } catch (error) {
      console.error('Error creating farmer voice post:', error);
      throw error;
    }
  }

  async getFarmerVoicePosts(filters?: {
    districtId?: number;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const conditions: SQL[] = [eq(schema.farmerVoicePosts.isActive, true)];
      
      if (filters?.districtId) {
        conditions.push(eq(schema.farmerVoicePosts.districtId, filters.districtId));
      }
      if (filters?.category) {
        conditions.push(eq(schema.farmerVoicePosts.category, filters.category));
      }

      const posts = await db.query.farmerVoicePosts.findMany({
        where: and(...conditions),
        orderBy: [desc(schema.farmerVoicePosts.createdAt)],
        limit: filters?.limit || 20,
        offset: filters?.offset || 0,
        with: {
          districtManager: true,
          district: true
        }
      });
      return posts;
    } catch (error) {
      console.error('Error fetching farmer voice posts:', error);
      throw error;
    }
  }

  async getFarmerVoicePostById(postId: number) {
    try {
      const post = await db.query.farmerVoicePosts.findFirst({
        where: eq(schema.farmerVoicePosts.id, postId),
        with: {
          districtManager: true,
          district: true,
          comments: {
            where: eq(schema.farmerVoiceComments.isActive, true),
            orderBy: [desc(schema.farmerVoiceComments.createdAt)],
            with: {
              farmer: true
            }
          }
        }
      });
      return post;
    } catch (error) {
      console.error('Error fetching farmer voice post:', error);
      throw error;
    }
  }

  async upvoteFarmerVoicePost(postId: number, userId: number) {
    try {
      // Check if already upvoted
      const existingUpvote = await db.query.farmerVoiceUpvotes.findFirst({
        where: and(
          eq(schema.farmerVoiceUpvotes.postId, postId),
          eq(schema.farmerVoiceUpvotes.userId, userId)
        )
      });

      if (existingUpvote) {
        // Remove upvote
        await db.delete(schema.farmerVoiceUpvotes)
          .where(eq(schema.farmerVoiceUpvotes.id, existingUpvote.id));
        
        // Decrement count
        await db.update(schema.farmerVoicePosts)
          .set({ 
            upvoteCount: sql`${schema.farmerVoicePosts.upvoteCount} - 1`,
            updatedAt: new Date()
          })
          .where(eq(schema.farmerVoicePosts.id, postId));
        
        return { upvoted: false };
      } else {
        // Add upvote
        await db.insert(schema.farmerVoiceUpvotes).values({
          postId,
          userId,
          createdAt: new Date()
        });
        
        // Increment count
        await db.update(schema.farmerVoicePosts)
          .set({ 
            upvoteCount: sql`${schema.farmerVoicePosts.upvoteCount} + 1`,
            updatedAt: new Date()
          })
          .where(eq(schema.farmerVoicePosts.id, postId));
        
        return { upvoted: true };
      }
    } catch (error) {
      console.error('Error toggling farmer voice upvote:', error);
      throw error;
    }
  }

  async checkUserUpvote(postId: number, userId: number) {
    try {
      const upvote = await db.query.farmerVoiceUpvotes.findFirst({
        where: and(
          eq(schema.farmerVoiceUpvotes.postId, postId),
          eq(schema.farmerVoiceUpvotes.userId, userId)
        )
      });
      return !!upvote;
    } catch (error) {
      console.error('Error checking user upvote:', error);
      throw error;
    }
  }

  async addFarmerVoiceComment(data: {
    postId: number;
    farmerId: number;
    content: string;
  }) {
    try {
      const [comment] = await db.insert(schema.farmerVoiceComments).values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Increment comment count
      await db.update(schema.farmerVoicePosts)
        .set({ 
          commentCount: sql`${schema.farmerVoicePosts.commentCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(schema.farmerVoicePosts.id, data.postId));

      return comment;
    } catch (error) {
      console.error('Error adding farmer voice comment:', error);
      throw error;
    }
  }

  async getFarmerVoiceComments(postId: number) {
    try {
      const comments = await db.query.farmerVoiceComments.findMany({
        where: and(
          eq(schema.farmerVoiceComments.postId, postId),
          eq(schema.farmerVoiceComments.isActive, true)
        ),
        orderBy: [desc(schema.farmerVoiceComments.createdAt)],
        with: {
          farmer: true
        }
      });
      return comments;
    } catch (error) {
      console.error('Error fetching farmer voice comments:', error);
      throw error;
    }
  }

  async updateFarmerVoicePost(postId: number, data: {
    title?: string;
    content?: string;
    category?: string;
    socialMediaUrl?: string | null;
  }) {
    try {
      const [post] = await db.update(schema.farmerVoicePosts)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(schema.farmerVoicePosts.id, postId))
        .returning();
      return post;
    } catch (error) {
      console.error('Error updating farmer voice post:', error);
      throw error;
    }
  }

  async deleteFarmerVoicePost(postId: number) {
    try {
      // Soft delete
      const [post] = await db.update(schema.farmerVoicePosts)
        .set({ 
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(schema.farmerVoicePosts.id, postId))
        .returning();
      return post;
    } catch (error) {
      console.error('Error deleting farmer voice post:', error);
      throw error;
    }
  }

  async getFarmerByUserId(userId: number) {
    try {
      const farmer = await db.query.farmers.findFirst({
        where: eq(schema.farmers.userId, userId)
      });
      return farmer;
    } catch (error) {
      console.error('Error fetching farmer by user ID:', error);
      throw error;
    }
  }

  async notifyFarmersOfNewPost(postId: number, districtName: string, postTitle: string, postCategory: string, dmName: string): Promise<void> {
    try {
      // Get all farmers in the district
      const farmersInDistrict = await this.getFarmersInDistrict(districtName);
      
      if (!farmersInDistrict || farmersInDistrict.length === 0) {
        console.log(`No farmers found in district ${districtName} to notify`);
        return;
      }

      // Create notifications for each farmer
      for (const farmer of farmersInDistrict) {
        if (!farmer.userId) continue;
        
        await this.createNotification({
          userId: farmer.userId,
          type: 'farmer_voice_post',
          title: `New ${postCategory.replace('_', ' ')} from ${dmName}`,
          message: postTitle,
          data: JSON.stringify({
            postId,
            postTitle,
            postCategory,
            districtName,
            dmName
          })
        });
      }

      console.log(`✅ Notified ${farmersInDistrict.length} farmers in ${districtName} about new post`);
    } catch (error) {
      console.error('Error notifying farmers of new post:', error);
    }
  }

}

export const storage = new Storage();
