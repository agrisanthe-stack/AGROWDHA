import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, json, foreignKey, unique, index, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull().default("customer"),
  avatar: text("avatar"),
  district: text("district"), // For district managers and taluk agents (legacy)
  districtId: integer("district_id").references(() => districts.id), // Foreign key to districts table
  taluk: text("taluk"), // For taluk-level agents
  reportsTo: integer("reports_to"), // Hierarchical reporting
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  isActive: boolean("is_active").default(true).notNull(),
  // District Manager / FPO Organization Details
  orgName: text("org_name"), // FPO/Organization name
  orgSlug: text("org_slug").unique(), // URL slug for tenant routing (auto-generated from orgName)
  orgAddress: text("org_address"), // Organization address
  orgPhone: text("org_phone"), // Organization contact phone
  orgEmail: text("org_email"), // Organization contact email
  orgLogoUrl: text("org_logo_url"), // Organization logo
  bankAccountNumber: text("bank_account_number"), // Encrypted sensitive data
  bankIfsc: text("bank_ifsc"), // Bank IFSC code
  gstNumber: text("gst_number"), // Optional GST registration
  upiId: text("upi_id"), // Optional UPI ID
  // Cashfree Easy Split Vendor Details
  cashfreeVendorId: text("cashfree_vendor_id"), // Cashfree vendor ID for split payments
  vendorStatus: text("vendor_status"), // ACTIVE, INACTIVE, PENDING, or null
  vendorCreatedAt: timestamp("vendor_created_at"), // When vendor was registered with Cashfree
  orgQrCodeUrl: text("org_qr_code_url"), // Branded QR code for FPO storefront
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);

// Enhanced validation for User schema with district manager requirements
export const userValidationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Must provide a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"),
  role: z.string().refine((val) => ["customer", "farmer", "admin", "district_manager", "taluk_agent", "delivery_agent"].includes(val), {
    message: "Role must be one of: customer, farmer, admin, district_manager, taluk_agent, delivery_agent",
  }),
  district: z.string().optional(),
  // District Manager / FPO Organization Details
  orgName: z.string().optional(),
  orgAddress: z.string().optional(),
  orgPhone: z.string().optional(),
  orgEmail: z.string().email().optional(),
  orgLogoUrl: z.string().url().optional().or(z.literal("")),
  bankAccountNumber: z.string().optional(),
  bankIfsc: z.string().optional(),
  gstNumber: z.string().optional(),
  upiId: z.string().optional(),
}).refine((data) => {
  // If role is district_manager, require organization details
  if (data.role === "district_manager") {
    return (
      data.orgName &&
      data.orgAddress &&
      data.orgPhone &&
      data.orgEmail &&
      data.bankAccountNumber &&
      data.bankIfsc &&
      data.district
    );
  }
  return true;
}, {
  message: "District managers must provide organization details: name, address, phone, email, banking info, and district assignment",
  path: ["orgName"], // This will show the error on orgName field
});

// Validation for IFSC code format
export const ifscValidation = z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format");

// Enhanced district manager creation schema
export const districtManagerValidationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Must provide a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"),
  role: z.literal("district_manager"),
  district: z.string().min(2, "District assignment is required"),
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
  orgAddress: z.string().min(10, "Organization address must be at least 10 characters"),
  orgPhone: z.string().min(10, "Organization phone must be at least 10 digits").regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"),
  orgEmail: z.string().email("Must provide a valid organization email"),
  bankAccountNumber: z.string().min(9, "Account number must be at least 9 digits"),
  bankIfsc: ifscValidation,
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format").optional(),
  upiId: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Farmers Table
export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  farmName: text("farm_name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  distance: decimal("distance", { precision: 5, scale: 2 }).default("10"),
  address: text("address"),
  imageUrl: text("image_url").default("https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=500"),
  logoUrl: text("logo_url").default("https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50"),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  story: text("story"),
  practices: text("practices"),
  tags: json("tags").default([]),
  farmImages: json("farm_images").default([]),
  instagramReels: text("instagram_reels"),
  youtube: text("youtube"),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("4.8"),
  reviewCount: integer("review_count").default(0),
  isZbnfCertified: boolean("is_zbnf_certified").default(false),
  isOrganicCertified: boolean("is_organic_certified").default(false),
  isNaturalCertified: boolean("is_natural_certified").default(false),
  aiSubscriptionActive: boolean("ai_subscription_active").default(false),
  aiSubscriptionExpiry: timestamp("ai_subscription_expiry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFarmerSchema = createInsertSchema(farmers);

export const farmerFpoLinks = pgTable("farmer_fpo_links", {
  id: serial("id").primaryKey(),
  farmerUserId: integer("farmer_user_id").references(() => users.id).notNull(),
  dmUserId: integer("dm_user_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("approved"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const farmerFpoLinksRelations = relations(farmerFpoLinks, ({ one }) => ({
  farmer: one(users, { fields: [farmerFpoLinks.farmerUserId], references: [users.id], relationName: "farmerFpoFarmer" }),
  dm: one(users, { fields: [farmerFpoLinks.dmUserId], references: [users.id], relationName: "farmerFpoDm" }),
}));

export type FarmerFpoLink = typeof farmerFpoLinks.$inferSelect;

// Location Change Requests Table
export const locationChangeRequests = pgTable("location_change_requests", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 8 }),
  currentLongitude: decimal("current_longitude", { precision: 11, scale: 8 }),
  requestedLatitude: decimal("requested_latitude", { precision: 10, scale: 8 }).notNull(),
  requestedLongitude: decimal("requested_longitude", { precision: 11, scale: 8 }).notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"),
  processedBy: integer("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLocationChangeRequestSchema = createInsertSchema(locationChangeRequests, {
  reason: (schema) => schema.min(10, "Reason must be at least 10 characters"),
  requestedLatitude: (schema) => schema.refine(val => val !== null && val !== undefined, "Latitude is required"),
  requestedLongitude: (schema) => schema.refine(val => val !== null && val !== undefined, "Longitude is required"),
});

export type InsertLocationChangeRequest = z.infer<typeof insertLocationChangeRequestSchema>;
export type LocationChangeRequest = typeof locationChangeRequests.$inferSelect;

// Location Change Requests Relations
export const locationChangeRequestsRelations = relations(locationChangeRequests, ({ one }) => ({
  farmer: one(farmers, {
    fields: [locationChangeRequests.farmerId],
    references: [farmers.id],
  }),
  processedByUser: one(users, {
    fields: [locationChangeRequests.processedBy],
    references: [users.id],
  }),
}));

// AI Subscription Plans Table (legacy - kept for backward compatibility)
export const aiSubscriptionPlans = pgTable("ai_subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(),
  durationType: text("duration_type").notNull().default("monthly"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiSubscriptionPlanSchema = createInsertSchema(aiSubscriptionPlans);
export type InsertAiSubscriptionPlan = z.infer<typeof insertAiSubscriptionPlanSchema>;
export type AiSubscriptionPlan = typeof aiSubscriptionPlans.$inferSelect;

// Customer Subscription Plans Table
export const customerSubscriptionPlans = pgTable("customer_subscription_plans", {
  id: serial("id").primaryKey(),
  tier: text("tier").notNull(), // family_basic, family_farm_direct, business_basic, business_farm_direct_pro
  name: text("name").notNull(), // Display name e.g. "FAMILY – BASIC"
  description: text("description").notNull(),
  billingPeriod: text("billing_period").notNull(), // monthly, 6months, yearly
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  durationDays: integer("duration_days").notNull(), // 30, 180, 365
  preorderRetail: boolean("preorder_retail").default(false).notNull(),
  preorderWholesale: boolean("preorder_wholesale").default(false).notNull(),
  zeroPlatformFee: boolean("zero_platform_fee").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomerSubscriptionPlanSchema = createInsertSchema(customerSubscriptionPlans);
export type InsertCustomerSubscriptionPlan = z.infer<typeof insertCustomerSubscriptionPlanSchema>;
export type CustomerSubscriptionPlan = typeof customerSubscriptionPlans.$inferSelect;

// Customer Subscriptions Table (tracks active subscriptions per customer)
export const customerSubscriptions = pgTable("customer_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => customerSubscriptionPlans.id).notNull(),
  status: text("status").notNull().default("active"), // active, expired, cancelled
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  paymentId: text("payment_id"), // Cashfree or manual payment reference
  autoRenew: boolean("auto_renew").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomerSubscriptionSchema = createInsertSchema(customerSubscriptions);
export type InsertCustomerSubscription = z.infer<typeof insertCustomerSubscriptionSchema>;
export type CustomerSubscription = typeof customerSubscriptions.$inferSelect;

export const customerSubscriptionPlansRelations = relations(customerSubscriptionPlans, ({ many }) => ({
  subscriptions: many(customerSubscriptions),
}));

export const customerSubscriptionsRelations = relations(customerSubscriptions, ({ one }) => ({
  plan: one(customerSubscriptionPlans, { fields: [customerSubscriptions.planId], references: [customerSubscriptionPlans.id] }),
  user: one(users, { fields: [customerSubscriptions.userId], references: [users.id] }),
}));

// Custom validation for Farmer schema
export const farmerValidationSchema = z.object({
  farmName: z.string().min(2, "Farm name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
});

export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type Farmer = typeof farmers.$inferSelect;

// Customers Table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers);
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Categories Table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories);

// Custom validation for Category schema
export const categoryValidationSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional()
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Districts Table
export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  state: text("state"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDistrictSchema = createInsertSchema(districts);

// Custom validation for District schema
export const districtValidationSchema = z.object({
  name: z.string().min(2, "District name must be at least 2 characters"),
  state: z.string().optional(),
  isActive: z.boolean().optional()
});

export type InsertDistrict = z.infer<typeof insertDistrictSchema>;
export type District = typeof districts.$inferSelect;

// Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull().default("lb"),
  status: text("status").notNull().default("Available Now"),
  isActive: boolean("is_active").default(true).notNull(),
  approvalStatus: text("approval_status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id),
  imageUrl: text("image_url"),
  availableUntil: timestamp("available_until").notNull(),
  harvestDate: timestamp("harvest_date").notNull(),
  inventory: integer("inventory").notNull().default(0),
  unitsPerBox: decimal("units_per_box", { precision: 10, scale: 3 }).notNull().default("1"),
  wholesaleUnit: text("wholesale_unit"),
  growingDetails: text("growing_details"),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  // Approval tracking fields
  approvedByUserId: integer("approved_by_user_id").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  approvalType: text("approval_type"), // 'fpo' for District Manager, 'admin' for Admin
  // B2B Quote Mode fields (NEW - optional, backward compatible)
  isQuoteMode: boolean("is_quote_mode").default(false),
  priceRangeMin: decimal("price_range_min", { precision: 10, scale: 2 }),
  priceRangeMax: decimal("price_range_max", { precision: 10, scale: 2 }),
  totalAvailableQuantity: integer("total_available_quantity"),
  quoteDeadline: timestamp("quote_deadline"),
  isSold: boolean("is_sold").default(false), // Track if BIB product is sold via accepted quote
  // DM/FPO created product fields
  createdByDmId: integer("created_by_dm_id").references(() => users.id),
  b2cQuantity: integer("b2c_quantity"), // B2C allocation quantity
  b2bQuantity: integer("b2b_quantity"), // B2B allocation quantity  
  b2cMoq: integer("b2c_moq").default(1), // B2C minimum order quantity
  b2bMoq: integer("b2b_moq").default(1), // B2B minimum order quantity
  hasSlabPricing: boolean("has_slab_pricing").default(false), // Uses slab-based pricing
  gradeVariety: text("grade_variety"), // Grade/variety info
  approxWeightPerPieceGrams: decimal("approx_weight_per_piece_grams", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products);

// Custom validation for Product schema
export const productValidationSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().or(z.number()).refine((val) => parseFloat(String(val)) > 0, {
    message: "Price must be greater than 0",
  }),
  unit: z.string(),
  status: z.string(),
  approvalStatus: z.string().refine((val) => ["pending", "approved", "rejected"].includes(val), {
    message: "Approval status must be either 'pending', 'approved', or 'rejected'",
  }).optional(),
  rejectionReason: z.string().optional(),
  approvalType: z.string().refine((val) => !val || ["fpo", "admin"].includes(val), {
    message: "Approval type must be either 'fpo' or 'admin'",
  }).optional(),
  categoryId: z.number(),
  farmerId: z.number().optional().nullable(),
  imageUrl: z.string().optional(),
  availableUntil: z.string().or(z.date()),
  harvestDate: z.string().or(z.date()),
  inventory: z.number(),
  unitsPerBox: z.number().positive("Box size must be greater than 0").default(1),
  wholesaleUnit: z.string().optional().nullable(),
  growingDetails: z.string().optional()
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Product Images Table
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductImageSchema = createInsertSchema(productImages);
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = typeof productImages.$inferSelect;

// Product Price Slabs Table (for slab-based pricing)
export const productPriceSlabs = pgTable("product_price_slabs", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  minQuantity: integer("min_quantity").notNull(), // e.g., 1, 21, 201
  maxQuantity: integer("max_quantity"), // null means unlimited (e.g., 201+)
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  slabType: text("slab_type").notNull().default("b2c"), // 'b2c' or 'b2b'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductPriceSlabSchema = createInsertSchema(productPriceSlabs);
export type InsertProductPriceSlab = z.infer<typeof insertProductPriceSlabSchema>;
export type ProductPriceSlab = typeof productPriceSlabs.$inferSelect;

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  productsTotal: decimal("products_total", { precision: 10, scale: 2 }).default('0'),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default('0'),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).default('0'),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method").default("cashfree"), // "cashfree" or "cod"
  notes: text("notes"),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders);
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Items Table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems);
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Extended types for enriched order items with product details
export type EnrichedOrderItem = OrderItem & {
  productName?: string;
  farmerName?: string;
  product?: {
    id: number;
    name: string;
    status?: string;
    harvestDate?: Date | null;
    availableUntil?: Date | null;
    unitsPerBox?: number | null;
    unit?: string | null;
    imageUrl?: string | null;
  } | null;
};

// Pending Payments Table - Persists payment session data to survive server restarts
export const pendingPayments = pgTable("pending_payments", {
  id: serial("id").primaryKey(),
  cashfreeOrderId: text("cashfree_order_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderData: json("order_data").notNull(), // Serialized order payload
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, verified, failed
  paymentMode: text("payment_mode").default("production"), // production or testing
  processed: boolean("processed").default(false).notNull(),
  errorMessage: text("error_message"), // Store any error during processing
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  processedIdx: index("pending_payments_processed_idx").on(table.processed),
  userIdIdx: index("pending_payments_user_id_idx").on(table.userId),
  statusProcessedIdx: index("pending_payments_status_processed_idx").on(table.status, table.processed),
}));

// Validation schema for pending payments with strict orderData type checking
export const insertPendingPaymentSchema = createInsertSchema(pendingPayments, {
  status: (schema) => schema.refine(
    (val) => ['pending', 'paid', 'verified', 'failed'].includes(val),
    { message: "Status must be one of: pending, paid, verified, failed" }
  ),
  amount: (schema) => schema.refine(
    (val) => parseFloat(val as string) > 0,
    { message: "Amount must be greater than 0" }
  ),
});

export type InsertPendingPayment = z.infer<typeof insertPendingPaymentSchema>;
export type PendingPayment = typeof pendingPayments.$inferSelect;

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmers.id),
  productId: integer("product_id").references(() => products.id),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews);

// Custom validation for Review schema
export const reviewValidationSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Comment must be at least 3 characters"),
  farmerId: z.number().optional(),
  productId: z.number().optional(),
  userId: z.number()
}).refine(data => data.farmerId !== undefined || data.productId !== undefined, {
  message: "Either farmerId or productId must be provided",
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Calendar Entries Table
export const calendarEntries = pgTable("calendar_entries", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  monthlyStatus: json("monthly_status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCalendarEntrySchema = createInsertSchema(calendarEntries);
export type InsertCalendarEntry = z.infer<typeof insertCalendarEntrySchema>;
export type CalendarEntry = typeof calendarEntries.$inferSelect;

// Newsletter Subscribers Table
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers);

// Custom validation for Newsletter Subscriber schema
export const newsletterSubscriberValidationSchema = z.object({
  email: z.string().email("Must provide a valid email"),
  isActive: z.boolean().optional()
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Order Fees Table
export const orderFees = pgTable("order_fees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // fixed or percentage
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  applyToSubtotal: boolean("apply_to_subtotal").default(false), // If true, calculate % based on subtotal
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderFeeSchema = createInsertSchema(orderFees);

export const orderFeeValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  type: z.string().refine((val) => ["fixed", "percentage"].includes(val), {
    message: "Type must be either 'fixed' or 'percentage'",
  }),
  value: z.number().positive("Value must be positive"),
  isActive: z.boolean().optional(),
  applyToSubtotal: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export type InsertOrderFee = z.infer<typeof insertOrderFeeSchema>;
export type OrderFee = typeof orderFees.$inferSelect;

// ZBNF Saved Plans Table
export const zbnfPlans = pgTable("zbnf_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  planName: text("plan_name").notNull(),
  farmLocation: text("farm_location").notNull(),
  district: text("district").notNull(),
  season: text("season").notNull(),
  soilType: text("soil_type").notNull(),
  waterAvailability: text("water_availability").notNull(),
  analysisMethod: text("analysis_method").notNull(), // manual or camera
  farmData: json("farm_data").notNull(), // Contains existing crops, detected gaps, etc.
  recommendations: json("recommendations").notNull(), // Generated recommendations
  layoutData: json("layout_data"), // Optional: SVG layout data
  implementationStatus: text("implementation_status").default("saved"), // saved, in_progress, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertZbnfPlanSchema = createInsertSchema(zbnfPlans);
export const zbnfPlanValidationSchema = z.object({
  planName: z.string().min(3, "Plan name must be at least 3 characters"),
  farmLocation: z.string().min(2, "Farm location is required"),
  district: z.string().min(2, "District is required"),
  season: z.string().min(2, "Season is required"),
  soilType: z.string().min(2, "Soil type is required"),
  waterAvailability: z.string().min(2, "Water availability is required"),
  analysisMethod: z.string().refine((val) => ["manual", "camera"].includes(val), {
    message: "Analysis method must be either 'manual' or 'camera'",
  }),
  implementationStatus: z.string().optional(),
  notes: z.string().optional(),
});

export type InsertZbnfPlan = z.infer<typeof insertZbnfPlanSchema>;
export type ZbnfPlan = typeof zbnfPlans.$inferSelect;

// Admin Managed Crops Table (for rule-based analysis)
export const adminCrops = pgTable("admin_crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  scientificName: text("scientific_name"),
  layerNumber: integer("layer_number").notNull(), // 1-5 for ZBNF layers
  category: text("category").notNull(),
  spacingRequirement: text("spacing_requirement").notNull(),
  soilTypes: json("soil_types").notNull(), // Array of soil types
  climateZones: json("climate_zones").notNull(), // Array of climate zones
  districts: json("districts").notNull(), // Array of suitable districts
  seasons: json("seasons").notNull(), // Array of suitable seasons
  companionCrops: json("companion_crops").default([]), // Array of companion crop names
  conflictCrops: json("conflict_crops").default([]), // Array of conflicting crop names
  benefits: json("benefits").notNull(), // Array of benefits
  waterRequirement: text("water_requirement").notNull(), // low, medium, high
  sunRequirement: text("sun_requirement").notNull(), // full, partial, shade
  maturityPeriod: text("maturity_period").notNull(),
  yieldPerPlant: text("yield_per_plant"),
  marketDemand: text("market_demand").notNull(), // low, medium, high
  isNative: boolean("is_native").default(false),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdminCropSchema = createInsertSchema(adminCrops);
export const adminCropValidationSchema = z.object({
  name: z.string().min(2, "Crop name must be at least 2 characters"),
  scientificName: z.string().optional(),
  layerNumber: z.number().min(1).max(5, "Layer must be between 1 and 5"),
  category: z.string().min(2, "Category is required"),
  spacingRequirement: z.string().min(2, "Spacing requirement is required"),
  soilTypes: z.array(z.string()).min(1, "At least one soil type is required"),
  climateZones: z.array(z.string()).min(1, "At least one climate zone is required"),
  districts: z.array(z.string()).min(1, "At least one district is required"),
  seasons: z.array(z.string()).min(1, "At least one season is required"),
  companionCrops: z.array(z.string()).optional(),
  conflictCrops: z.array(z.string()).optional(),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  waterRequirement: z.string().refine((val) => ["low", "medium", "high"].includes(val), {
    message: "Water requirement must be low, medium, or high",
  }),
  sunRequirement: z.string().refine((val) => ["full", "partial", "shade"].includes(val), {
    message: "Sun requirement must be full, partial, or shade",
  }),
  maturityPeriod: z.string().min(2, "Maturity period is required"),
  yieldPerPlant: z.string().optional(),
  marketDemand: z.string().refine((val) => ["low", "medium", "high"].includes(val), {
    message: "Market demand must be low, medium, or high",
  }),
  isNative: z.boolean().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type InsertAdminCrop = z.infer<typeof insertAdminCropSchema>;
export type AdminCrop = typeof adminCrops.$inferSelect;

// FPO Store follows table
export const fpoFollows = pgTable("fpo_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id).notNull(),
  dmUserId: integer("dm_user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueFpoFollow: unique().on(table.followerId, table.dmUserId),
}));

export const insertFpoFollowSchema = createInsertSchema(fpoFollows);
export type InsertFpoFollow = z.infer<typeof insertFpoFollowSchema>;
export type FpoFollow = typeof fpoFollows.$inferSelect;

// FPO Delivery Districts - which districts an FPO delivers to
export const fpoDeliveryDistricts = pgTable("fpo_delivery_districts", {
  id: serial("id").primaryKey(),
  dmUserId: integer("dm_user_id").references(() => users.id).notNull(),
  districtId: integer("district_id").references(() => districts.id).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueFpoDeliveryDistrict: unique().on(table.dmUserId, table.districtId),
}));

export const insertFpoDeliveryDistrictSchema = createInsertSchema(fpoDeliveryDistricts);
export type InsertFpoDeliveryDistrict = z.infer<typeof insertFpoDeliveryDistrictSchema>;
export type FpoDeliveryDistrict = typeof fpoDeliveryDistricts.$inferSelect;

// FPO Delivery Pricing - tiered delivery pricing per FPO per district
export const fpoDeliveryPricing = pgTable("fpo_delivery_pricing", {
  id: serial("id").primaryKey(),
  dmUserId: integer("dm_user_id").references(() => users.id).notNull(),
  districtId: integer("district_id").references(() => districts.id).notNull(),
  minWeightKg: decimal("min_weight_kg", { precision: 10, scale: 2 }).notNull(),
  maxWeightKg: decimal("max_weight_kg", { precision: 10, scale: 2 }),
  priceRs: decimal("price_rs", { precision: 10, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFpoDeliveryPricingSchema = createInsertSchema(fpoDeliveryPricing);
export type InsertFpoDeliveryPricing = z.infer<typeof insertFpoDeliveryPricingSchema>;
export type FpoDeliveryPricing = typeof fpoDeliveryPricing.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  farmer: one(farmers, {
    fields: [users.id],
    references: [farmers.userId],
  }),
  customer: one(customers, {
    fields: [users.id],
    references: [customers.userId],
  }),
  district: one(districts, {
    fields: [users.districtId],
    references: [districts.id],
  }),
  supervisor: one(users, {
    fields: [users.reportsTo],
    references: [users.id],
  }),
  subordinates: many(users, {
    relationName: "userHierarchy",
  }),
  orders: many(orders),
  reviews: many(reviews),
  farmerFollows: many(farmerFollows),
  fpoFollows: many(fpoFollows),
  notifications: many(notifications),
  zbnfPlans: many(zbnfPlans),
  createdCrops: many(adminCrops),
  approvedProducts: many(products, {
    relationName: "fpoApprovedProducts",
  }),
}));

export const farmersRelations = relations(farmers, ({ one, many }) => ({
  user: one(users, {
    fields: [farmers.userId],
    references: [users.id],
  }),
  products: many(products),
  reviews: many(reviews),
  zbnfPlans: many(zbnfPlans),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  farmer: one(farmers, {
    fields: [products.farmerId],
    references: [farmers.id],
  }),
  createdByDm: one(users, {
    fields: [products.createdByDmId],
    references: [users.id],
    relationName: "dmCreatedProducts",
  }),
  approvedBy: one(users, {
    fields: [products.approvedByUserId],
    references: [users.id],
    relationName: "fpoApprovedProducts",
  }),
  orderItems: many(orderItems),
  calendarEntry: many(calendarEntries),
  images: many(productImages),
  reviews: many(reviews),
  consumerQuotes: many(consumerQuotes),
  priceSlabs: many(productPriceSlabs),
}));

export const productPriceSlabsRelations = relations(productPriceSlabs, ({ one }) => ({
  product: one(products, {
    fields: [productPriceSlabs.productId],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));


export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  farmer: one(farmers, {
    fields: [orderItems.farmerId],
    references: [farmers.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  farmer: one(farmers, {
    fields: [reviews.farmerId],
    references: [farmers.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const calendarEntriesRelations = relations(calendarEntries, ({ one }) => ({
  product: one(products, {
    fields: [calendarEntries.productId],
    references: [products.id],
  }),
}));

// Farmer follows table
export const farmerFollows = pgTable("farmer_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Ensure a user can only follow a farmer once
  uniqueFollow: unique().on(table.followerId, table.farmerId),
}));

export const insertFarmerFollowSchema = createInsertSchema(farmerFollows);
export type InsertFarmerFollow = z.infer<typeof insertFarmerFollowSchema>;
export type FarmerFollow = typeof farmerFollows.$inferSelect;

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'new_product', 'farmer_update', etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: text("data"), // JSON string for additional data
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications);
export const notificationValidationSchema = z.object({
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  data: z.string().optional(),
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Relations for follows and notifications
export const farmerFollowsRelations = relations(farmerFollows, ({ one }) => ({
  follower: one(users, {
    fields: [farmerFollows.followerId],
    references: [users.id],
  }),
  farmer: one(farmers, {
    fields: [farmerFollows.farmerId],
    references: [farmers.id],
  }),
}));

export const fpoFollowsRelations = relations(fpoFollows, ({ one }) => ({
  follower: one(users, {
    fields: [fpoFollows.followerId],
    references: [users.id],
  }),
}));

export const fpoDeliveryDistrictsRelations = relations(fpoDeliveryDistricts, ({ one }) => ({
  dm: one(users, { fields: [fpoDeliveryDistricts.dmUserId], references: [users.id] }),
  district: one(districts, { fields: [fpoDeliveryDistricts.districtId], references: [districts.id] }),
}));

export const fpoDeliveryPricingRelations = relations(fpoDeliveryPricing, ({ one }) => ({
  dm: one(users, { fields: [fpoDeliveryPricing.dmUserId], references: [users.id] }),
  district: one(districts, { fields: [fpoDeliveryPricing.districtId], references: [districts.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const districtsRelations = relations(districts, ({ many }) => ({
  users: many(users),
}));

// ZBNF Plans Relations
export const zbnfPlansRelations = relations(zbnfPlans, ({ one }) => ({
  user: one(users, {
    fields: [zbnfPlans.userId],
    references: [users.id],
  }),
  farmer: one(farmers, {
    fields: [zbnfPlans.farmerId],
    references: [farmers.id],
  }),
}));

// Admin Crops Relations
export const adminCropsRelations = relations(adminCrops, ({ one }) => ({
  createdBy: one(users, {
    fields: [adminCrops.createdBy],
    references: [users.id],
  }),
}));

// ZBNF Crop Layers Table - 5-layer agroforestry model
export const cropLayers = pgTable("crop_layers", {
  id: serial("id").primaryKey(),
  layerNumber: integer("layer_number").notNull(), // 1-5 for different layers
  layerName: text("layer_name").notNull(), // Canopy, Sub-canopy, Shrub, Herbaceous, Ground
  description: text("description").notNull(),
  heightRange: text("height_range"), // e.g., "20-40m", "5-20m"
  characteristics: json("characteristics").default([]), // Growing conditions, space requirements
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ZBNF Crop Database with layer mapping
export const zbnfCrops = pgTable("zbnf_crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  scientificName: text("scientific_name"),
  layerId: integer("layer_id").references(() => cropLayers.id).notNull(),
  category: text("category").notNull(), // fruits, vegetables, spices, grains, etc.
  spacingRequirement: text("spacing_requirement"), // e.g., "6m x 6m", "1m x 1m"
  soilTypes: json("soil_types").default([]), // Compatible soil types
  climateZones: json("climate_zones").default([]), // Suitable climate zones
  seasons: json("seasons").default([]), // Planting/harvesting seasons
  companionCrops: json("companion_crops").default([]), // Compatible crops for intercropping
  conflictCrops: json("conflict_crops").default([]), // Crops to avoid nearby
  benefits: json("benefits").default([]), // Nitrogen fixing, pest control, etc.
  waterRequirement: text("water_requirement"), // low, medium, high
  sunRequirement: text("sun_requirement"), // full, partial, shade
  maturityPeriod: text("maturity_period"), // e.g., "3-4 months", "2-3 years"
  yieldPerPlant: text("yield_per_plant"),
  marketDemand: text("market_demand").default("medium"), // low, medium, high
  isNative: boolean("is_native").default(false),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Farm Analysis - stores detected gaps and existing crops
export const farmAnalysis = pgTable("farm_analysis", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  analysisDate: timestamp("analysis_date").defaultNow().notNull(),
  detectionMethod: text("detection_method").notNull(), // camera, drone, manual
  farmArea: decimal("farm_area", { precision: 10, scale: 2 }), // in acres or hectares
  soilType: text("soil_type"), // clay, loam, sandy, etc.
  climateZone: text("climate_zone"),
  currentSeason: text("current_season"),
  existingCrops: json("existing_crops").default([]), // Current crops with layer info
  detectedGaps: json("detected_gaps").default([]), // Gap sizes and locations
  waterAvailability: text("water_availability"), // abundant, moderate, scarce
  slopeGrade: text("slope_grade"), // flat, gentle, steep
  analysisNotes: text("analysis_notes"),
  status: text("status").default("active"), // active, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ZBNF Recommendations - generated recommendations based on analysis
export const zbnfRecommendations = pgTable("zbnf_recommendations", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").references(() => farmAnalysis.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  recommendedCropId: integer("recommended_crop_id").references(() => zbnfCrops.id).notNull(),
  targetLayer: integer("target_layer").notNull(), // Which layer this recommendation targets
  gapSize: text("gap_size"), // Size of gap this addresses
  placementLocation: text("placement_location"), // Where to plant
  estimatedYield: text("estimated_yield"),
  investmentRequired: decimal("investment_required", { precision: 10, scale: 2 }),
  expectedROI: text("expected_roi"), // Return on investment timeframe
  priority: text("priority").default("medium"), // low, medium, high
  reasoning: text("reasoning").notNull(), // Why this crop is recommended
  seasonalTiming: text("seasonal_timing"), // When to plant
  status: text("status").default("pending"), // pending, accepted, rejected, implemented
  farmerFeedback: text("farmer_feedback"),
  implementationDate: timestamp("implementation_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Crop compatibility matrix for intercropping recommendations
export const cropCompatibility = pgTable("crop_compatibility", {
  id: serial("id").primaryKey(),
  crop1Id: integer("crop1_id").references(() => zbnfCrops.id).notNull(),
  crop2Id: integer("crop2_id").references(() => zbnfCrops.id).notNull(),
  compatibilityType: text("compatibility_type").notNull(), // beneficial, neutral, harmful
  benefitDescription: text("benefit_description"), // nitrogen fixing, pest control, etc.
  minimumDistance: text("minimum_distance"), // Required spacing
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema validations for ZBNF tables
export const insertCropLayerSchema = createInsertSchema(cropLayers);
export const insertZbnfCropSchema = createInsertSchema(zbnfCrops);
export const insertFarmAnalysisSchema = createInsertSchema(farmAnalysis);
export const insertZbnfRecommendationSchema = createInsertSchema(zbnfRecommendations);
export const insertCropCompatibilitySchema = createInsertSchema(cropCompatibility);

export type CropLayer = typeof cropLayers.$inferSelect;
export type ZbnfCrop = typeof zbnfCrops.$inferSelect;
export type FarmAnalysis = typeof farmAnalysis.$inferSelect;
export type ZbnfRecommendation = typeof zbnfRecommendations.$inferSelect;
export type CropCompatibility = typeof cropCompatibility.$inferSelect;

export type InsertCropLayer = z.infer<typeof insertCropLayerSchema>;
export type InsertZbnfCrop = z.infer<typeof insertZbnfCropSchema>;
export type InsertFarmAnalysis = z.infer<typeof insertFarmAnalysisSchema>;
export type InsertZbnfRecommendation = z.infer<typeof insertZbnfRecommendationSchema>;
export type InsertCropCompatibility = z.infer<typeof insertCropCompatibilitySchema>;

// Relations for ZBNF tables
export const cropLayersRelations = relations(cropLayers, ({ many }) => ({
  crops: many(zbnfCrops),
}));

export const zbnfCropsRelations = relations(zbnfCrops, ({ one, many }) => ({
  layer: one(cropLayers, {
    fields: [zbnfCrops.layerId],
    references: [cropLayers.id],
  }),
  recommendations: many(zbnfRecommendations),
  compatibility1: many(cropCompatibility, { relationName: "crop1" }),
  compatibility2: many(cropCompatibility, { relationName: "crop2" }),
}));

export const farmAnalysisRelations = relations(farmAnalysis, ({ one, many }) => ({
  farmer: one(farmers, {
    fields: [farmAnalysis.farmerId],
    references: [farmers.id],
  }),
  recommendations: many(zbnfRecommendations),
}));

export const zbnfRecommendationsRelations = relations(zbnfRecommendations, ({ one }) => ({
  analysis: one(farmAnalysis, {
    fields: [zbnfRecommendations.analysisId],
    references: [farmAnalysis.id],
  }),
  farmer: one(farmers, {
    fields: [zbnfRecommendations.farmerId],
    references: [farmers.id],
  }),
  crop: one(zbnfCrops, {
    fields: [zbnfRecommendations.recommendedCropId],
    references: [zbnfCrops.id],
  }),
}));

export const cropCompatibilityRelations = relations(cropCompatibility, ({ one }) => ({
  crop1: one(zbnfCrops, {
    fields: [cropCompatibility.crop1Id],
    references: [zbnfCrops.id],
    relationName: "crop1",
  }),
  crop2: one(zbnfCrops, {
    fields: [cropCompatibility.crop2Id],
    references: [zbnfCrops.id],
    relationName: "crop2",
  }),
}));

// ============================================================================
// B2B QUOTE SYSTEM TABLES (NEW FEATURE - Does not affect existing order flow)
// ============================================================================

// Consumer Quotes Table - For B2B dynamic pricing/reverse auction
export const consumerQuotes = pgTable("consumer_quotes", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  consumerId: integer("consumer_id").references(() => users.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  quotedPrice: decimal("quoted_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, expired
  // When quote is accepted, track the resulting order
  orderId: integer("order_id").references(() => orders.id),
  acceptedAt: timestamp("accepted_at"),
  rejectedAt: timestamp("rejected_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertConsumerQuoteSchema = createInsertSchema(consumerQuotes, {
  quotedPrice: (schema) => schema.refine(val => parseFloat(val as string) > 0, "Price must be greater than 0"),
  quantity: (schema) => schema.refine(val => val > 0, "Quantity must be greater than 0"),
  message: (schema) => schema.optional(),
});

export type InsertConsumerQuote = z.infer<typeof insertConsumerQuoteSchema>;
export type ConsumerQuote = typeof consumerQuotes.$inferSelect;

// Consumer Quotes Relations
export const consumerQuotesRelations = relations(consumerQuotes, ({ one }) => ({
  product: one(products, {
    fields: [consumerQuotes.productId],
    references: [products.id],
  }),
  consumer: one(users, {
    fields: [consumerQuotes.consumerId],
    references: [users.id],
  }),
  farmer: one(farmers, {
    fields: [consumerQuotes.farmerId],
    references: [farmers.id],
  }),
  order: one(orders, {
    fields: [consumerQuotes.orderId],
    references: [orders.id],
  }),
}));

// ============================================================================
// FARM EVENTS MODULE - Experiential farm visits and activities
// ============================================================================

// Admin-controlled Event Types
export const eventTypes = pgTable("event_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayName: varchar("display_name", { length: 150 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEventTypeSchema = createInsertSchema(eventTypes, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  displayName: (schema) => schema.min(2, "Display name must be at least 2 characters"),
});
export type InsertEventType = z.infer<typeof insertEventTypeSchema>;
export type EventType = typeof eventTypes.$inferSelect;

// Farm Events Table - Main event information
export const farmEvents = pgTable("farm_events", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => users.id).notNull(),
  dmId: integer("dm_id").references(() => users.id),
  
  // Event Details
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }),
  description: text("description").notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  cropType: varchar("crop_type", { length: 100 }),
  
  // Location
  location: varchar("location", { length: 255 }).notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Date & Time
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  
  // Capacity & Pricing
  totalSeats: integer("total_seats").notNull().default(30),
  pricePerSeat: decimal("price_per_seat", { precision: 10, scale: 2 }).notNull(),
  
  // Media
  coverImage: text("cover_image"),
  
  // Status & Approval
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  approvedAt: timestamp("approved_at"),
  
  // Metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Event Dates - Individual dates when the event is available
export const eventDates = pgTable("event_dates", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => farmEvents.id).notNull(),
  eventDate: date("event_date").notNull(),
  availableSeats: integer("available_seats").notNull(),
  isAvailable: boolean("is_available").default(true),
});

// Event Facilities - Available facilities at the farm event
export const eventFacilities = pgTable("event_facilities", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => farmEvents.id).notNull(),
  facilityName: text("facility_name").notNull(), // parking, restrooms, drinking_water, farm_tour, meals, snacks, pick_carry_bags, safety_gear
  description: text("description"),
});

// Event Activities - Activities included in the event
export const eventActivities = pgTable("event_activities", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => farmEvents.id).notNull(),
  activityName: text("activity_name").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes"),
});

// Event Gallery - Photos and media for the event
export const eventGallery = pgTable("event_gallery", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => farmEvents.id).notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
});

// Event Bookings - Customer bookings for events
export const eventBookings = pgTable("event_bookings", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => farmEvents.id).notNull(),
  eventDateId: integer("event_date_id").references(() => eventDates.id),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  bookingDate: date("booking_date").notNull(),
  numSeats: integer("num_seats").notNull().default(1),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").default("pending"),
  paymentId: text("payment_id"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert and Select schemas for Farm Events
export const insertFarmEventSchema = createInsertSchema(farmEvents, {
  title: (schema) => schema.min(5, "Title must be at least 5 characters"),
  description: (schema) => schema.min(20, "Description must be at least 20 characters"),
  totalSeats: (schema) => schema.refine(val => val > 0, "Total seats must be greater than 0"),
  pricePerSeat: (schema) => schema.refine(val => parseFloat(val as string) > 0, "Price must be greater than 0"),
});

export const insertEventDateSchema = createInsertSchema(eventDates);
export const insertEventFacilitySchema = createInsertSchema(eventFacilities);
export const insertEventActivitySchema = createInsertSchema(eventActivities);
export const insertEventGallerySchema = createInsertSchema(eventGallery);
export const insertEventBookingSchema = createInsertSchema(eventBookings, {
  numSeats: (schema) => schema.refine(val => val > 0, "At least 1 seat is required"),
});

export type FarmEvent = typeof farmEvents.$inferSelect;
export type EventDate = typeof eventDates.$inferSelect;
export type EventFacility = typeof eventFacilities.$inferSelect;
export type EventActivity = typeof eventActivities.$inferSelect;
export type EventGallery = typeof eventGallery.$inferSelect;
export type EventBooking = typeof eventBookings.$inferSelect;

export type InsertFarmEvent = z.infer<typeof insertFarmEventSchema>;
export type InsertEventDate = z.infer<typeof insertEventDateSchema>;
export type InsertEventFacility = z.infer<typeof insertEventFacilitySchema>;
export type InsertEventActivity = z.infer<typeof insertEventActivitySchema>;
export type InsertEventGallery = z.infer<typeof insertEventGallerySchema>;
export type InsertEventBooking = z.infer<typeof insertEventBookingSchema>;

// Farm Events Relations
export const farmEventsRelations = relations(farmEvents, ({ one, many }) => ({
  farmer: one(users, {
    fields: [farmEvents.farmerId],
    references: [users.id],
    relationName: "eventFarmer",
  }),
  districtManager: one(users, {
    fields: [farmEvents.dmId],
    references: [users.id],
    relationName: "eventDistrictManager",
  }),
  dates: many(eventDates),
  facilities: many(eventFacilities),
  activities: many(eventActivities),
  gallery: many(eventGallery),
  bookings: many(eventBookings),
}));

export const eventDatesRelations = relations(eventDates, ({ one, many }) => ({
  event: one(farmEvents, {
    fields: [eventDates.eventId],
    references: [farmEvents.id],
  }),
  bookings: many(eventBookings),
}));

export const eventFacilitiesRelations = relations(eventFacilities, ({ one }) => ({
  event: one(farmEvents, {
    fields: [eventFacilities.eventId],
    references: [farmEvents.id],
  }),
}));

export const eventActivitiesRelations = relations(eventActivities, ({ one }) => ({
  event: one(farmEvents, {
    fields: [eventActivities.eventId],
    references: [farmEvents.id],
  }),
}));

export const eventGalleryRelations = relations(eventGallery, ({ one }) => ({
  event: one(farmEvents, {
    fields: [eventGallery.eventId],
    references: [farmEvents.id],
  }),
}));

export const eventBookingsRelations = relations(eventBookings, ({ one }) => ({
  event: one(farmEvents, {
    fields: [eventBookings.eventId],
    references: [farmEvents.id],
  }),
  eventDate: one(eventDates, {
    fields: [eventBookings.eventDateId],
    references: [eventDates.id],
  }),
  customer: one(users, {
    fields: [eventBookings.customerId],
    references: [users.id],
    relationName: "bookingCustomer",
  }),
}));

// Facility types constant for reference
export const FACILITY_TYPES = [
  "parking",
  "restrooms", 
  "drinking_water",
  "farm_tour",
  "meals",
  "snacks",
  "pick_carry_bags",
  "safety_gear",
  "first_aid",
  "shade_area",
  "photography_allowed",
] as const;

// Activity types constant for reference
export const ACTIVITY_TYPES = [
  "fruit_picking",
  "vegetable_harvesting",
  "tractor_ride",
  "zbnf_training",
  "farm_walk",
  "nursery_visit",
  "farmer_interaction",
  "compost_demo",
  "seed_treatment_demo",
  "cattle_visit",
  "dairy_experience",
  "cooking_class",
] as const;

// Event types constant
export const EVENT_TYPES = [
  "fruit_picking",
  "vegetable_experience",
  "farm_tour",
  "zbnf_training",
  "nursery_visit",
  "festival",
  "workshop",
  "kids_activity",
] as const;

// ==================== FARMER VOICE TABLES ====================

// Post categories for Farmer Voice
export const FARMER_VOICE_CATEGORIES = [
  "innovation",
  "issue",
  "solution",
  "protest",
  "announcement",
  "success_story",
] as const;

// Farmer Voice Posts - created by district managers
export const farmerVoicePosts = pgTable("farmer_voice_posts", {
  id: serial("id").primaryKey(),
  districtManagerId: integer("district_manager_id").references(() => users.id).notNull(),
  districtId: integer("district_id").references(() => districts.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // innovation, issue, solution, protest, announcement
  socialMediaUrl: text("social_media_url"),
  isActive: boolean("is_active").default(true).notNull(),
  upvoteCount: integer("upvote_count").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFarmerVoicePostSchema = createInsertSchema(farmerVoicePosts);
export const selectFarmerVoicePostSchema = createSelectSchema(farmerVoicePosts);
export type FarmerVoicePost = z.infer<typeof selectFarmerVoicePostSchema>;
export type FarmerVoicePostInsert = z.infer<typeof insertFarmerVoicePostSchema>;

// Farmer Voice Post validation schema
export const farmerVoicePostValidationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.enum(["innovation", "issue", "solution", "protest", "announcement", "success_story"]),
  socialMediaUrl: z.string().url().optional().or(z.literal("")),
});

// Farmer Voice Upvotes
export const farmerVoiceUpvotes = pgTable("farmer_voice_upvotes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => farmerVoicePosts.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueUpvote: unique().on(table.postId, table.userId),
}));

export const insertFarmerVoiceUpvoteSchema = createInsertSchema(farmerVoiceUpvotes);
export type FarmerVoiceUpvote = z.infer<typeof insertFarmerVoiceUpvoteSchema>;

// Farmer Voice Comments - only farmers from the same district can comment
export const farmerVoiceComments = pgTable("farmer_voice_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => farmerVoicePosts.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFarmerVoiceCommentSchema = createInsertSchema(farmerVoiceComments);
export const selectFarmerVoiceCommentSchema = createSelectSchema(farmerVoiceComments);
export type FarmerVoiceComment = z.infer<typeof selectFarmerVoiceCommentSchema>;
export type FarmerVoiceCommentInsert = z.infer<typeof insertFarmerVoiceCommentSchema>;

// Farmer Voice Comment validation schema
export const farmerVoiceCommentValidationSchema = z.object({
  content: z.string().min(3, "Comment must be at least 3 characters"),
});

// Relations for Farmer Voice
export const farmerVoicePostsRelations = relations(farmerVoicePosts, ({ one, many }) => ({
  districtManager: one(users, { fields: [farmerVoicePosts.districtManagerId], references: [users.id] }),
  district: one(districts, { fields: [farmerVoicePosts.districtId], references: [districts.id] }),
  upvotes: many(farmerVoiceUpvotes),
  comments: many(farmerVoiceComments),
}));

export const farmerVoiceUpvotesRelations = relations(farmerVoiceUpvotes, ({ one }) => ({
  post: one(farmerVoicePosts, { fields: [farmerVoiceUpvotes.postId], references: [farmerVoicePosts.id] }),
  user: one(users, { fields: [farmerVoiceUpvotes.userId], references: [users.id] }),
}));

export const farmerVoiceCommentsRelations = relations(farmerVoiceComments, ({ one }) => ({
  post: one(farmerVoicePosts, { fields: [farmerVoiceComments.postId], references: [farmerVoicePosts.id] }),
  farmer: one(farmers, { fields: [farmerVoiceComments.farmerId], references: [farmers.id] }),
}));







// FPO Storefront Inquiries - leads from FPOs interested in creating a brand store
export const fpoInquiries = pgTable("fpo_inquiries", {
  id: serial("id").primaryKey(),
  orgName: text("org_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  district: text("district").notNull(),
  message: text("message"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFpoInquirySchema = createInsertSchema(fpoInquiries, {
  orgName: (s) => s.min(2, "Organisation name is required"),
  contactName: (s) => s.min(2, "Contact name is required"),
  email: (s) => s.email("Valid email is required"),
  phone: (s) => s.min(10, "Valid phone number is required"),
  district: (s) => s.min(2, "District is required"),
});

export type FpoInquiry = typeof fpoInquiries.$inferSelect;
export type InsertFpoInquiry = typeof fpoInquiries.$inferInsert;

// Return / Refund Requests
export const returnRequests = pgTable("return_requests", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  fpoUserId: integer("fpo_user_id").references(() => users.id).notNull(),
  reason: text("reason").notNull(), // damaged, wrong_product, quality_issue, missing_items, quantity_mismatch, other
  description: text("description").notNull(),
  photos: json("photos").$type<string[]>().default([]),
  status: text("status").notNull().default("pending"), // pending | fpo_accepted | fpo_rejected
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  fpoNote: text("fpo_note"),
  adminStatus: text("admin_status").notNull().default("pending"), // pending | approved | rejected | processed
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertReturnRequestSchema = createInsertSchema(returnRequests, {
  reason: (s) => s.min(1, "Please select a reason"),
  description: (s) => s.min(5, "Please describe the issue"),
});

export type ReturnRequest = typeof returnRequests.$inferSelect;
export type InsertReturnRequest = z.infer<typeof insertReturnRequestSchema>;

export const returnRequestsRelations = relations(returnRequests, ({ one }) => ({
  order: one(orders, { fields: [returnRequests.orderId], references: [orders.id] }),
  customer: one(users, { fields: [returnRequests.customerId], references: [users.id] }),
  fpoUser: one(users, { fields: [returnRequests.fpoUserId], references: [users.id] }),
}));

// Official Buyers Table
export const officialBuyers = pgTable("official_buyers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // hotel | trader | retailer | corporate | other
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const OFFICIAL_BUYER_TYPES = ["hotel", "trader", "retailer", "corporate", "caterer", "other"] as const;

export const insertOfficialBuyerSchema = createInsertSchema(officialBuyers, {
  name: (s) => s.min(2, "Name must be at least 2 characters"),
  type: () => z.enum(OFFICIAL_BUYER_TYPES),
});

export type OfficialBuyer = typeof officialBuyers.$inferSelect;
export type InsertOfficialBuyer = z.infer<typeof insertOfficialBuyerSchema>;
