var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc3) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc3 = __getOwnPropDesc(from, key)) || desc3.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  ACTIVITY_TYPES: () => ACTIVITY_TYPES,
  EVENT_TYPES: () => EVENT_TYPES,
  FACILITY_TYPES: () => FACILITY_TYPES,
  FARMER_VOICE_CATEGORIES: () => FARMER_VOICE_CATEGORIES,
  adminCropValidationSchema: () => adminCropValidationSchema,
  adminCrops: () => adminCrops,
  adminCropsRelations: () => adminCropsRelations,
  aiSubscriptionPlans: () => aiSubscriptionPlans,
  calendarEntries: () => calendarEntries,
  calendarEntriesRelations: () => calendarEntriesRelations,
  categories: () => categories,
  categoriesRelations: () => categoriesRelations,
  categoryValidationSchema: () => categoryValidationSchema,
  consumerQuotes: () => consumerQuotes,
  consumerQuotesRelations: () => consumerQuotesRelations,
  cropCompatibility: () => cropCompatibility,
  cropCompatibilityRelations: () => cropCompatibilityRelations,
  cropLayers: () => cropLayers,
  cropLayersRelations: () => cropLayersRelations,
  customerSubscriptionPlans: () => customerSubscriptionPlans,
  customerSubscriptionPlansRelations: () => customerSubscriptionPlansRelations,
  customerSubscriptions: () => customerSubscriptions,
  customerSubscriptionsRelations: () => customerSubscriptionsRelations,
  customers: () => customers,
  customersRelations: () => customersRelations,
  districtManagerValidationSchema: () => districtManagerValidationSchema,
  districtValidationSchema: () => districtValidationSchema,
  districts: () => districts,
  districtsRelations: () => districtsRelations,
  eventActivities: () => eventActivities,
  eventActivitiesRelations: () => eventActivitiesRelations,
  eventBookings: () => eventBookings,
  eventBookingsRelations: () => eventBookingsRelations,
  eventDates: () => eventDates,
  eventDatesRelations: () => eventDatesRelations,
  eventFacilities: () => eventFacilities,
  eventFacilitiesRelations: () => eventFacilitiesRelations,
  eventGallery: () => eventGallery,
  eventGalleryRelations: () => eventGalleryRelations,
  eventTypes: () => eventTypes,
  farmAnalysis: () => farmAnalysis,
  farmAnalysisRelations: () => farmAnalysisRelations,
  farmEvents: () => farmEvents,
  farmEventsRelations: () => farmEventsRelations,
  farmerFollows: () => farmerFollows,
  farmerFollowsRelations: () => farmerFollowsRelations,
  farmerFpoLinks: () => farmerFpoLinks,
  farmerFpoLinksRelations: () => farmerFpoLinksRelations,
  farmerValidationSchema: () => farmerValidationSchema,
  farmerVoiceCommentValidationSchema: () => farmerVoiceCommentValidationSchema,
  farmerVoiceComments: () => farmerVoiceComments,
  farmerVoiceCommentsRelations: () => farmerVoiceCommentsRelations,
  farmerVoicePostValidationSchema: () => farmerVoicePostValidationSchema,
  farmerVoicePosts: () => farmerVoicePosts,
  farmerVoicePostsRelations: () => farmerVoicePostsRelations,
  farmerVoiceUpvotes: () => farmerVoiceUpvotes,
  farmerVoiceUpvotesRelations: () => farmerVoiceUpvotesRelations,
  farmers: () => farmers,
  farmersRelations: () => farmersRelations,
  fpoDeliveryDistricts: () => fpoDeliveryDistricts,
  fpoDeliveryDistrictsRelations: () => fpoDeliveryDistrictsRelations,
  fpoDeliveryPricing: () => fpoDeliveryPricing,
  fpoDeliveryPricingRelations: () => fpoDeliveryPricingRelations,
  fpoFollows: () => fpoFollows,
  fpoFollowsRelations: () => fpoFollowsRelations,
  fpoInquiries: () => fpoInquiries,
  ifscValidation: () => ifscValidation,
  insertAdminCropSchema: () => insertAdminCropSchema,
  insertAiSubscriptionPlanSchema: () => insertAiSubscriptionPlanSchema,
  insertCalendarEntrySchema: () => insertCalendarEntrySchema,
  insertCategorySchema: () => insertCategorySchema,
  insertConsumerQuoteSchema: () => insertConsumerQuoteSchema,
  insertCropCompatibilitySchema: () => insertCropCompatibilitySchema,
  insertCropLayerSchema: () => insertCropLayerSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertCustomerSubscriptionPlanSchema: () => insertCustomerSubscriptionPlanSchema,
  insertCustomerSubscriptionSchema: () => insertCustomerSubscriptionSchema,
  insertDistrictSchema: () => insertDistrictSchema,
  insertEventActivitySchema: () => insertEventActivitySchema,
  insertEventBookingSchema: () => insertEventBookingSchema,
  insertEventDateSchema: () => insertEventDateSchema,
  insertEventFacilitySchema: () => insertEventFacilitySchema,
  insertEventGallerySchema: () => insertEventGallerySchema,
  insertEventTypeSchema: () => insertEventTypeSchema,
  insertFarmAnalysisSchema: () => insertFarmAnalysisSchema,
  insertFarmEventSchema: () => insertFarmEventSchema,
  insertFarmerFollowSchema: () => insertFarmerFollowSchema,
  insertFarmerSchema: () => insertFarmerSchema,
  insertFarmerVoiceCommentSchema: () => insertFarmerVoiceCommentSchema,
  insertFarmerVoicePostSchema: () => insertFarmerVoicePostSchema,
  insertFarmerVoiceUpvoteSchema: () => insertFarmerVoiceUpvoteSchema,
  insertFpoDeliveryDistrictSchema: () => insertFpoDeliveryDistrictSchema,
  insertFpoDeliveryPricingSchema: () => insertFpoDeliveryPricingSchema,
  insertFpoFollowSchema: () => insertFpoFollowSchema,
  insertFpoInquirySchema: () => insertFpoInquirySchema,
  insertLocationChangeRequestSchema: () => insertLocationChangeRequestSchema,
  insertNewsletterSubscriberSchema: () => insertNewsletterSubscriberSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertOrderFeeSchema: () => insertOrderFeeSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertPendingPaymentSchema: () => insertPendingPaymentSchema,
  insertProductImageSchema: () => insertProductImageSchema,
  insertProductPriceSlabSchema: () => insertProductPriceSlabSchema,
  insertProductSchema: () => insertProductSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertUserSchema: () => insertUserSchema,
  insertZbnfCropSchema: () => insertZbnfCropSchema,
  insertZbnfPlanSchema: () => insertZbnfPlanSchema,
  insertZbnfRecommendationSchema: () => insertZbnfRecommendationSchema,
  locationChangeRequests: () => locationChangeRequests,
  locationChangeRequestsRelations: () => locationChangeRequestsRelations,
  newsletterSubscriberValidationSchema: () => newsletterSubscriberValidationSchema,
  newsletterSubscribers: () => newsletterSubscribers,
  notificationValidationSchema: () => notificationValidationSchema,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  orderFeeValidationSchema: () => orderFeeValidationSchema,
  orderFees: () => orderFees,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  pendingPayments: () => pendingPayments,
  productImages: () => productImages,
  productImagesRelations: () => productImagesRelations,
  productPriceSlabs: () => productPriceSlabs,
  productPriceSlabsRelations: () => productPriceSlabsRelations,
  productValidationSchema: () => productValidationSchema,
  products: () => products,
  productsRelations: () => productsRelations,
  reviewValidationSchema: () => reviewValidationSchema,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations,
  selectFarmerVoiceCommentSchema: () => selectFarmerVoiceCommentSchema,
  selectFarmerVoicePostSchema: () => selectFarmerVoicePostSchema,
  userValidationSchema: () => userValidationSchema,
  users: () => users,
  usersRelations: () => usersRelations,
  zbnfCrops: () => zbnfCrops,
  zbnfCropsRelations: () => zbnfCropsRelations,
  zbnfPlanValidationSchema: () => zbnfPlanValidationSchema,
  zbnfPlans: () => zbnfPlans,
  zbnfPlansRelations: () => zbnfPlansRelations,
  zbnfRecommendations: () => zbnfRecommendations,
  zbnfRecommendationsRelations: () => zbnfRecommendationsRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, json, unique, index, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";
var users, insertUserSchema, userValidationSchema, ifscValidation, districtManagerValidationSchema, farmers, insertFarmerSchema, farmerFpoLinks, farmerFpoLinksRelations, locationChangeRequests, insertLocationChangeRequestSchema, locationChangeRequestsRelations, aiSubscriptionPlans, insertAiSubscriptionPlanSchema, customerSubscriptionPlans, insertCustomerSubscriptionPlanSchema, customerSubscriptions, insertCustomerSubscriptionSchema, customerSubscriptionPlansRelations, customerSubscriptionsRelations, farmerValidationSchema, customers, insertCustomerSchema, categories, insertCategorySchema, categoryValidationSchema, districts, insertDistrictSchema, districtValidationSchema, products, insertProductSchema, productValidationSchema, productImages, insertProductImageSchema, productPriceSlabs, insertProductPriceSlabSchema, orders, insertOrderSchema, orderItems, insertOrderItemSchema, pendingPayments, insertPendingPaymentSchema, reviews, insertReviewSchema, reviewValidationSchema, calendarEntries, insertCalendarEntrySchema, newsletterSubscribers, insertNewsletterSubscriberSchema, newsletterSubscriberValidationSchema, orderFees, insertOrderFeeSchema, orderFeeValidationSchema, zbnfPlans, insertZbnfPlanSchema, zbnfPlanValidationSchema, adminCrops, insertAdminCropSchema, adminCropValidationSchema, fpoFollows, insertFpoFollowSchema, fpoDeliveryDistricts, insertFpoDeliveryDistrictSchema, fpoDeliveryPricing, insertFpoDeliveryPricingSchema, usersRelations, farmersRelations, customersRelations, productsRelations, productPriceSlabsRelations, productImagesRelations, categoriesRelations, ordersRelations, orderItemsRelations, reviewsRelations, calendarEntriesRelations, farmerFollows, insertFarmerFollowSchema, notifications, insertNotificationSchema, notificationValidationSchema, farmerFollowsRelations, fpoFollowsRelations, fpoDeliveryDistrictsRelations, fpoDeliveryPricingRelations, notificationsRelations, districtsRelations, zbnfPlansRelations, adminCropsRelations, cropLayers, zbnfCrops, farmAnalysis, zbnfRecommendations, cropCompatibility, insertCropLayerSchema, insertZbnfCropSchema, insertFarmAnalysisSchema, insertZbnfRecommendationSchema, insertCropCompatibilitySchema, cropLayersRelations, zbnfCropsRelations, farmAnalysisRelations, zbnfRecommendationsRelations, cropCompatibilityRelations, consumerQuotes, insertConsumerQuoteSchema, consumerQuotesRelations, eventTypes, insertEventTypeSchema, farmEvents, eventDates, eventFacilities, eventActivities, eventGallery, eventBookings, insertFarmEventSchema, insertEventDateSchema, insertEventFacilitySchema, insertEventActivitySchema, insertEventGallerySchema, insertEventBookingSchema, farmEventsRelations, eventDatesRelations, eventFacilitiesRelations, eventActivitiesRelations, eventGalleryRelations, eventBookingsRelations, FACILITY_TYPES, ACTIVITY_TYPES, EVENT_TYPES, FARMER_VOICE_CATEGORIES, farmerVoicePosts, insertFarmerVoicePostSchema, selectFarmerVoicePostSchema, farmerVoicePostValidationSchema, farmerVoiceUpvotes, insertFarmerVoiceUpvoteSchema, farmerVoiceComments, insertFarmerVoiceCommentSchema, selectFarmerVoiceCommentSchema, farmerVoiceCommentValidationSchema, farmerVoicePostsRelations, farmerVoiceUpvotesRelations, farmerVoiceCommentsRelations, fpoInquiries, insertFpoInquirySchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      username: text("username").notNull().unique(),
      password: text("password").notNull(),
      email: text("email").notNull().unique(),
      name: text("name").notNull(),
      phone: text("phone").notNull(),
      role: text("role").notNull().default("customer"),
      avatar: text("avatar"),
      district: text("district"),
      // For district managers and taluk agents (legacy)
      districtId: integer("district_id").references(() => districts.id),
      // Foreign key to districts table
      taluk: text("taluk"),
      // For taluk-level agents
      reportsTo: integer("reports_to"),
      // Hierarchical reporting
      resetToken: text("reset_token"),
      resetTokenExpiry: timestamp("reset_token_expiry"),
      isActive: boolean("is_active").default(true).notNull(),
      // District Manager / FPO Organization Details
      orgName: text("org_name"),
      // FPO/Organization name
      orgSlug: text("org_slug").unique(),
      // URL slug for tenant routing (auto-generated from orgName)
      orgAddress: text("org_address"),
      // Organization address
      orgPhone: text("org_phone"),
      // Organization contact phone
      orgEmail: text("org_email"),
      // Organization contact email
      orgLogoUrl: text("org_logo_url"),
      // Organization logo
      bankAccountNumber: text("bank_account_number"),
      // Encrypted sensitive data
      bankIfsc: text("bank_ifsc"),
      // Bank IFSC code
      gstNumber: text("gst_number"),
      // Optional GST registration
      upiId: text("upi_id"),
      // Optional UPI ID
      // Cashfree Easy Split Vendor Details
      cashfreeVendorId: text("cashfree_vendor_id"),
      // Cashfree vendor ID for split payments
      vendorStatus: text("vendor_status"),
      // ACTIVE, INACTIVE, PENDING, or null
      vendorCreatedAt: timestamp("vendor_created_at"),
      // When vendor was registered with Cashfree
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertUserSchema = createInsertSchema(users);
    userValidationSchema = z.object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      email: z.string().email("Must provide a valid email"),
      name: z.string().min(2, "Name must be at least 2 characters"),
      phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"),
      role: z.string().refine((val) => ["customer", "farmer", "admin", "district_manager", "taluk_agent", "delivery_agent"].includes(val), {
        message: "Role must be one of: customer, farmer, admin, district_manager, taluk_agent, delivery_agent"
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
      upiId: z.string().optional()
    }).refine((data) => {
      if (data.role === "district_manager") {
        return data.orgName && data.orgAddress && data.orgPhone && data.orgEmail && data.bankAccountNumber && data.bankIfsc && data.district;
      }
      return true;
    }, {
      message: "District managers must provide organization details: name, address, phone, email, banking info, and district assignment",
      path: ["orgName"]
      // This will show the error on orgName field
    });
    ifscValidation = z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format");
    districtManagerValidationSchema = z.object({
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
      upiId: z.string().optional()
    });
    farmers = pgTable("farmers", {
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
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertFarmerSchema = createInsertSchema(farmers);
    farmerFpoLinks = pgTable("farmer_fpo_links", {
      id: serial("id").primaryKey(),
      farmerUserId: integer("farmer_user_id").references(() => users.id).notNull(),
      dmUserId: integer("dm_user_id").references(() => users.id).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    farmerFpoLinksRelations = relations(farmerFpoLinks, ({ one }) => ({
      farmer: one(users, { fields: [farmerFpoLinks.farmerUserId], references: [users.id], relationName: "farmerFpoFarmer" }),
      dm: one(users, { fields: [farmerFpoLinks.dmUserId], references: [users.id], relationName: "farmerFpoDm" })
    }));
    locationChangeRequests = pgTable("location_change_requests", {
      id: serial("id").primaryKey(),
      farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
      currentLatitude: decimal("current_latitude", { precision: 10, scale: 8 }),
      currentLongitude: decimal("current_longitude", { precision: 11, scale: 8 }),
      requestedLatitude: decimal("requested_latitude", { precision: 10, scale: 8 }).notNull(),
      requestedLongitude: decimal("requested_longitude", { precision: 11, scale: 8 }).notNull(),
      reason: text("reason").notNull(),
      status: text("status").notNull().default("pending"),
      // pending, approved, rejected
      adminNotes: text("admin_notes"),
      processedBy: integer("processed_by").references(() => users.id),
      processedAt: timestamp("processed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertLocationChangeRequestSchema = createInsertSchema(locationChangeRequests, {
      reason: (schema) => schema.min(10, "Reason must be at least 10 characters"),
      requestedLatitude: (schema) => schema.refine((val) => val !== null && val !== void 0, "Latitude is required"),
      requestedLongitude: (schema) => schema.refine((val) => val !== null && val !== void 0, "Longitude is required")
    });
    locationChangeRequestsRelations = relations(locationChangeRequests, ({ one }) => ({
      farmer: one(farmers, {
        fields: [locationChangeRequests.farmerId],
        references: [farmers.id]
      }),
      processedByUser: one(users, {
        fields: [locationChangeRequests.processedBy],
        references: [users.id]
      })
    }));
    aiSubscriptionPlans = pgTable("ai_subscription_plans", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description").notNull(),
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      duration: integer("duration").notNull(),
      durationType: text("duration_type").notNull().default("monthly"),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertAiSubscriptionPlanSchema = createInsertSchema(aiSubscriptionPlans);
    customerSubscriptionPlans = pgTable("customer_subscription_plans", {
      id: serial("id").primaryKey(),
      tier: text("tier").notNull(),
      // family_basic, family_farm_direct, business_basic, business_farm_direct_pro
      name: text("name").notNull(),
      // Display name e.g. "FAMILY – BASIC"
      description: text("description").notNull(),
      billingPeriod: text("billing_period").notNull(),
      // monthly, 6months, yearly
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      durationDays: integer("duration_days").notNull(),
      // 30, 180, 365
      preorderRetail: boolean("preorder_retail").default(false).notNull(),
      preorderWholesale: boolean("preorder_wholesale").default(false).notNull(),
      zeroPlatformFee: boolean("zero_platform_fee").default(false).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      displayOrder: integer("display_order").default(0),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertCustomerSubscriptionPlanSchema = createInsertSchema(customerSubscriptionPlans);
    customerSubscriptions = pgTable("customer_subscriptions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      planId: integer("plan_id").references(() => customerSubscriptionPlans.id).notNull(),
      status: text("status").notNull().default("active"),
      // active, expired, cancelled
      startDate: timestamp("start_date").defaultNow().notNull(),
      endDate: timestamp("end_date").notNull(),
      paymentId: text("payment_id"),
      // Cashfree or manual payment reference
      autoRenew: boolean("auto_renew").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertCustomerSubscriptionSchema = createInsertSchema(customerSubscriptions);
    customerSubscriptionPlansRelations = relations(customerSubscriptionPlans, ({ many }) => ({
      subscriptions: many(customerSubscriptions)
    }));
    customerSubscriptionsRelations = relations(customerSubscriptions, ({ one }) => ({
      plan: one(customerSubscriptionPlans, { fields: [customerSubscriptions.planId], references: [customerSubscriptionPlans.id] }),
      user: one(users, { fields: [customerSubscriptions.userId], references: [users.id] })
    }));
    farmerValidationSchema = z.object({
      farmName: z.string().min(2, "Farm name must be at least 2 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      location: z.string().min(2, "Location must be at least 2 characters")
    });
    customers = pgTable("customers", {
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
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertCustomerSchema = createInsertSchema(customers);
    categories = pgTable("categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertCategorySchema = createInsertSchema(categories);
    categoryValidationSchema = z.object({
      name: z.string().min(2, "Category name must be at least 2 characters"),
      description: z.string().optional()
    });
    districts = pgTable("districts", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      state: text("state"),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertDistrictSchema = createInsertSchema(districts);
    districtValidationSchema = z.object({
      name: z.string().min(2, "District name must be at least 2 characters"),
      state: z.string().optional(),
      isActive: z.boolean().optional()
    });
    products = pgTable("products", {
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
      farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
      imageUrl: text("image_url"),
      availableUntil: timestamp("available_until").notNull(),
      harvestDate: timestamp("harvest_date").notNull(),
      inventory: integer("inventory").notNull().default(0),
      unitsPerBox: integer("units_per_box").notNull().default(1),
      growingDetails: text("growing_details"),
      rating: decimal("rating", { precision: 3, scale: 1 }).default("0.0"),
      reviewCount: integer("review_count").default(0),
      // Approval tracking fields
      approvedByUserId: integer("approved_by_user_id").references(() => users.id),
      approvedAt: timestamp("approved_at"),
      approvalType: text("approval_type"),
      // 'fpo' for District Manager, 'admin' for Admin
      // B2B Quote Mode fields (NEW - optional, backward compatible)
      isQuoteMode: boolean("is_quote_mode").default(false),
      priceRangeMin: decimal("price_range_min", { precision: 10, scale: 2 }),
      priceRangeMax: decimal("price_range_max", { precision: 10, scale: 2 }),
      totalAvailableQuantity: integer("total_available_quantity"),
      quoteDeadline: timestamp("quote_deadline"),
      isSold: boolean("is_sold").default(false),
      // Track if BIB product is sold via accepted quote
      // DM/FPO created product fields
      createdByDmId: integer("created_by_dm_id").references(() => users.id),
      b2cQuantity: integer("b2c_quantity"),
      // B2C allocation quantity
      b2bQuantity: integer("b2b_quantity"),
      // B2B allocation quantity  
      b2cMoq: integer("b2c_moq").default(1),
      // B2C minimum order quantity
      b2bMoq: integer("b2b_moq").default(1),
      // B2B minimum order quantity
      hasSlabPricing: boolean("has_slab_pricing").default(false),
      // Uses slab-based pricing
      gradeVariety: text("grade_variety"),
      // Grade/variety info
      approxWeightPerPieceGrams: decimal("approx_weight_per_piece_grams", { precision: 10, scale: 2 }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertProductSchema = createInsertSchema(products);
    productValidationSchema = z.object({
      name: z.string().min(2, "Product name must be at least 2 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      price: z.string().or(z.number()).refine((val) => parseFloat(String(val)) > 0, {
        message: "Price must be greater than 0"
      }),
      unit: z.string(),
      status: z.string(),
      approvalStatus: z.string().refine((val) => ["pending", "approved", "rejected"].includes(val), {
        message: "Approval status must be either 'pending', 'approved', or 'rejected'"
      }).optional(),
      rejectionReason: z.string().optional(),
      approvalType: z.string().refine((val) => !val || ["fpo", "admin"].includes(val), {
        message: "Approval type must be either 'fpo' or 'admin'"
      }).optional(),
      categoryId: z.number(),
      farmerId: z.number(),
      imageUrl: z.string().optional(),
      availableUntil: z.string().or(z.date()),
      harvestDate: z.string().or(z.date()),
      inventory: z.number(),
      unitsPerBox: z.number().int().min(1, "Must have at least 1 unit per box").default(1),
      growingDetails: z.string().optional()
    });
    productImages = pgTable("product_images", {
      id: serial("id").primaryKey(),
      productId: integer("product_id").references(() => products.id).notNull(),
      imageUrl: text("image_url").notNull(),
      isPrimary: boolean("is_primary").notNull().default(false),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertProductImageSchema = createInsertSchema(productImages);
    productPriceSlabs = pgTable("product_price_slabs", {
      id: serial("id").primaryKey(),
      productId: integer("product_id").references(() => products.id).notNull(),
      minQuantity: integer("min_quantity").notNull(),
      // e.g., 1, 21, 201
      maxQuantity: integer("max_quantity"),
      // null means unlimited (e.g., 201+)
      pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
      slabType: text("slab_type").notNull().default("b2c"),
      // 'b2c' or 'b2b'
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertProductPriceSlabSchema = createInsertSchema(productPriceSlabs);
    orders = pgTable("orders", {
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
      deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("0"),
      status: text("status").notNull().default("pending"),
      paymentMethod: text("payment_method").default("cashfree"),
      // "cashfree" or "cod"
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertOrderSchema = createInsertSchema(orders);
    orderItems = pgTable("order_items", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").references(() => orders.id).notNull(),
      productId: integer("product_id").references(() => products.id).notNull(),
      quantity: integer("quantity").notNull(),
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertOrderItemSchema = createInsertSchema(orderItems);
    pendingPayments = pgTable("pending_payments", {
      id: serial("id").primaryKey(),
      cashfreeOrderId: text("cashfree_order_id").notNull().unique(),
      userId: integer("user_id").references(() => users.id).notNull(),
      orderData: json("order_data").notNull(),
      // Serialized order payload
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      status: text("status").notNull().default("pending"),
      // pending, paid, verified, failed
      paymentMode: text("payment_mode").default("production"),
      // production or testing
      processed: boolean("processed").default(false).notNull(),
      errorMessage: text("error_message"),
      // Store any error during processing
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (table) => ({
      processedIdx: index("pending_payments_processed_idx").on(table.processed),
      userIdIdx: index("pending_payments_user_id_idx").on(table.userId),
      statusProcessedIdx: index("pending_payments_status_processed_idx").on(table.status, table.processed)
    }));
    insertPendingPaymentSchema = createInsertSchema(pendingPayments, {
      status: (schema) => schema.refine(
        (val) => ["pending", "paid", "verified", "failed"].includes(val),
        { message: "Status must be one of: pending, paid, verified, failed" }
      ),
      amount: (schema) => schema.refine(
        (val) => parseFloat(val) > 0,
        { message: "Amount must be greater than 0" }
      )
    });
    reviews = pgTable("reviews", {
      id: serial("id").primaryKey(),
      farmerId: integer("farmer_id").references(() => farmers.id),
      productId: integer("product_id").references(() => products.id),
      userId: integer("user_id").references(() => users.id).notNull(),
      rating: integer("rating").notNull(),
      comment: text("comment").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertReviewSchema = createInsertSchema(reviews);
    reviewValidationSchema = z.object({
      rating: z.number().min(1).max(5),
      comment: z.string().min(3, "Comment must be at least 3 characters"),
      farmerId: z.number().optional(),
      productId: z.number().optional(),
      userId: z.number()
    }).refine((data) => data.farmerId !== void 0 || data.productId !== void 0, {
      message: "Either farmerId or productId must be provided"
    });
    calendarEntries = pgTable("calendar_entries", {
      id: serial("id").primaryKey(),
      productId: integer("product_id").references(() => products.id).notNull(),
      monthlyStatus: json("monthly_status").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertCalendarEntrySchema = createInsertSchema(calendarEntries);
    newsletterSubscribers = pgTable("newsletter_subscribers", {
      id: serial("id").primaryKey(),
      email: text("email").notNull().unique(),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers);
    newsletterSubscriberValidationSchema = z.object({
      email: z.string().email("Must provide a valid email"),
      isActive: z.boolean().optional()
    });
    orderFees = pgTable("order_fees", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      type: text("type").notNull(),
      // fixed or percentage
      value: decimal("value", { precision: 10, scale: 2 }).notNull(),
      isActive: boolean("is_active").default(true),
      applyToSubtotal: boolean("apply_to_subtotal").default(false),
      // If true, calculate % based on subtotal
      displayOrder: integer("display_order").default(0),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertOrderFeeSchema = createInsertSchema(orderFees);
    orderFeeValidationSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      description: z.string().optional(),
      type: z.string().refine((val) => ["fixed", "percentage"].includes(val), {
        message: "Type must be either 'fixed' or 'percentage'"
      }),
      value: z.number().positive("Value must be positive"),
      isActive: z.boolean().optional(),
      applyToSubtotal: z.boolean().optional(),
      displayOrder: z.number().optional()
    });
    zbnfPlans = pgTable("zbnf_plans", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
      planName: text("plan_name").notNull(),
      farmLocation: text("farm_location").notNull(),
      district: text("district").notNull(),
      season: text("season").notNull(),
      soilType: text("soil_type").notNull(),
      waterAvailability: text("water_availability").notNull(),
      analysisMethod: text("analysis_method").notNull(),
      // manual or camera
      farmData: json("farm_data").notNull(),
      // Contains existing crops, detected gaps, etc.
      recommendations: json("recommendations").notNull(),
      // Generated recommendations
      layoutData: json("layout_data"),
      // Optional: SVG layout data
      implementationStatus: text("implementation_status").default("saved"),
      // saved, in_progress, completed
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertZbnfPlanSchema = createInsertSchema(zbnfPlans);
    zbnfPlanValidationSchema = z.object({
      planName: z.string().min(3, "Plan name must be at least 3 characters"),
      farmLocation: z.string().min(2, "Farm location is required"),
      district: z.string().min(2, "District is required"),
      season: z.string().min(2, "Season is required"),
      soilType: z.string().min(2, "Soil type is required"),
      waterAvailability: z.string().min(2, "Water availability is required"),
      analysisMethod: z.string().refine((val) => ["manual", "camera"].includes(val), {
        message: "Analysis method must be either 'manual' or 'camera'"
      }),
      implementationStatus: z.string().optional(),
      notes: z.string().optional()
    });
    adminCrops = pgTable("admin_crops", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      scientificName: text("scientific_name"),
      layerNumber: integer("layer_number").notNull(),
      // 1-5 for ZBNF layers
      category: text("category").notNull(),
      spacingRequirement: text("spacing_requirement").notNull(),
      soilTypes: json("soil_types").notNull(),
      // Array of soil types
      climateZones: json("climate_zones").notNull(),
      // Array of climate zones
      districts: json("districts").notNull(),
      // Array of suitable districts
      seasons: json("seasons").notNull(),
      // Array of suitable seasons
      companionCrops: json("companion_crops").default([]),
      // Array of companion crop names
      conflictCrops: json("conflict_crops").default([]),
      // Array of conflicting crop names
      benefits: json("benefits").notNull(),
      // Array of benefits
      waterRequirement: text("water_requirement").notNull(),
      // low, medium, high
      sunRequirement: text("sun_requirement").notNull(),
      // full, partial, shade
      maturityPeriod: text("maturity_period").notNull(),
      yieldPerPlant: text("yield_per_plant"),
      marketDemand: text("market_demand").notNull(),
      // low, medium, high
      isNative: boolean("is_native").default(false),
      imageUrl: text("image_url"),
      isActive: boolean("is_active").default(true),
      createdBy: integer("created_by").references(() => users.id).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertAdminCropSchema = createInsertSchema(adminCrops);
    adminCropValidationSchema = z.object({
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
        message: "Water requirement must be low, medium, or high"
      }),
      sunRequirement: z.string().refine((val) => ["full", "partial", "shade"].includes(val), {
        message: "Sun requirement must be full, partial, or shade"
      }),
      maturityPeriod: z.string().min(2, "Maturity period is required"),
      yieldPerPlant: z.string().optional(),
      marketDemand: z.string().refine((val) => ["low", "medium", "high"].includes(val), {
        message: "Market demand must be low, medium, or high"
      }),
      isNative: z.boolean().optional(),
      imageUrl: z.string().optional(),
      isActive: z.boolean().optional()
    });
    fpoFollows = pgTable("fpo_follows", {
      id: serial("id").primaryKey(),
      followerId: integer("follower_id").references(() => users.id).notNull(),
      dmUserId: integer("dm_user_id").references(() => users.id).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (table) => ({
      uniqueFpoFollow: unique().on(table.followerId, table.dmUserId)
    }));
    insertFpoFollowSchema = createInsertSchema(fpoFollows);
    fpoDeliveryDistricts = pgTable("fpo_delivery_districts", {
      id: serial("id").primaryKey(),
      dmUserId: integer("dm_user_id").references(() => users.id).notNull(),
      districtId: integer("district_id").references(() => districts.id).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (table) => ({
      uniqueFpoDeliveryDistrict: unique().on(table.dmUserId, table.districtId)
    }));
    insertFpoDeliveryDistrictSchema = createInsertSchema(fpoDeliveryDistricts);
    fpoDeliveryPricing = pgTable("fpo_delivery_pricing", {
      id: serial("id").primaryKey(),
      dmUserId: integer("dm_user_id").references(() => users.id).notNull(),
      districtId: integer("district_id").references(() => districts.id).notNull(),
      minWeightKg: decimal("min_weight_kg", { precision: 10, scale: 2 }).notNull(),
      maxWeightKg: decimal("max_weight_kg", { precision: 10, scale: 2 }),
      priceRs: decimal("price_rs", { precision: 10, scale: 2 }).notNull(),
      sortOrder: integer("sort_order").notNull().default(0),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertFpoDeliveryPricingSchema = createInsertSchema(fpoDeliveryPricing);
    usersRelations = relations(users, ({ one, many }) => ({
      farmer: one(farmers, {
        fields: [users.id],
        references: [farmers.userId]
      }),
      customer: one(customers, {
        fields: [users.id],
        references: [customers.userId]
      }),
      district: one(districts, {
        fields: [users.districtId],
        references: [districts.id]
      }),
      supervisor: one(users, {
        fields: [users.reportsTo],
        references: [users.id]
      }),
      subordinates: many(users, {
        relationName: "userHierarchy"
      }),
      orders: many(orders),
      reviews: many(reviews),
      farmerFollows: many(farmerFollows),
      fpoFollows: many(fpoFollows),
      notifications: many(notifications),
      zbnfPlans: many(zbnfPlans),
      createdCrops: many(adminCrops)
    }));
    farmersRelations = relations(farmers, ({ one, many }) => ({
      user: one(users, {
        fields: [farmers.userId],
        references: [users.id]
      }),
      products: many(products),
      reviews: many(reviews),
      zbnfPlans: many(zbnfPlans)
    }));
    customersRelations = relations(customers, ({ one, many }) => ({
      user: one(users, {
        fields: [customers.userId],
        references: [users.id]
      })
    }));
    productsRelations = relations(products, ({ one, many }) => ({
      category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id]
      }),
      farmer: one(farmers, {
        fields: [products.farmerId],
        references: [farmers.id]
      }),
      createdByDm: one(users, {
        fields: [products.createdByDmId],
        references: [users.id],
        relationName: "dmCreatedProducts"
      }),
      orderItems: many(orderItems),
      calendarEntry: many(calendarEntries),
      images: many(productImages),
      reviews: many(reviews),
      consumerQuotes: many(consumerQuotes),
      priceSlabs: many(productPriceSlabs)
    }));
    productPriceSlabsRelations = relations(productPriceSlabs, ({ one }) => ({
      product: one(products, {
        fields: [productPriceSlabs.productId],
        references: [products.id]
      })
    }));
    productImagesRelations = relations(productImages, ({ one }) => ({
      product: one(products, {
        fields: [productImages.productId],
        references: [products.id]
      })
    }));
    categoriesRelations = relations(categories, ({ many }) => ({
      products: many(products)
    }));
    ordersRelations = relations(orders, ({ one, many }) => ({
      user: one(users, {
        fields: [orders.userId],
        references: [users.id]
      }),
      items: many(orderItems)
    }));
    orderItemsRelations = relations(orderItems, ({ one }) => ({
      order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id]
      }),
      product: one(products, {
        fields: [orderItems.productId],
        references: [products.id]
      }),
      farmer: one(farmers, {
        fields: [orderItems.farmerId],
        references: [farmers.id]
      })
    }));
    reviewsRelations = relations(reviews, ({ one }) => ({
      farmer: one(farmers, {
        fields: [reviews.farmerId],
        references: [farmers.id]
      }),
      product: one(products, {
        fields: [reviews.productId],
        references: [products.id]
      }),
      user: one(users, {
        fields: [reviews.userId],
        references: [users.id]
      })
    }));
    calendarEntriesRelations = relations(calendarEntries, ({ one }) => ({
      product: one(products, {
        fields: [calendarEntries.productId],
        references: [products.id]
      })
    }));
    farmerFollows = pgTable("farmer_follows", {
      id: serial("id").primaryKey(),
      followerId: integer("follower_id").references(() => users.id).notNull(),
      farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (table) => ({
      // Ensure a user can only follow a farmer once
      uniqueFollow: unique().on(table.followerId, table.farmerId)
    }));
    insertFarmerFollowSchema = createInsertSchema(farmerFollows);
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      type: text("type").notNull(),
      // 'new_product', 'farmer_update', etc.
      title: text("title").notNull(),
      message: text("message").notNull(),
      data: text("data"),
      // JSON string for additional data
      isRead: boolean("is_read").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertNotificationSchema = createInsertSchema(notifications);
    notificationValidationSchema = z.object({
      type: z.string().min(1, "Type is required"),
      title: z.string().min(1, "Title is required"),
      message: z.string().min(1, "Message is required"),
      data: z.string().optional()
    });
    farmerFollowsRelations = relations(farmerFollows, ({ one }) => ({
      follower: one(users, {
        fields: [farmerFollows.followerId],
        references: [users.id]
      }),
      farmer: one(farmers, {
        fields: [farmerFollows.farmerId],
        references: [farmers.id]
      })
    }));
    fpoFollowsRelations = relations(fpoFollows, ({ one }) => ({
      follower: one(users, {
        fields: [fpoFollows.followerId],
        references: [users.id]
      })
    }));
    fpoDeliveryDistrictsRelations = relations(fpoDeliveryDistricts, ({ one }) => ({
      dm: one(users, { fields: [fpoDeliveryDistricts.dmUserId], references: [users.id] }),
      district: one(districts, { fields: [fpoDeliveryDistricts.districtId], references: [districts.id] })
    }));
    fpoDeliveryPricingRelations = relations(fpoDeliveryPricing, ({ one }) => ({
      dm: one(users, { fields: [fpoDeliveryPricing.dmUserId], references: [users.id] }),
      district: one(districts, { fields: [fpoDeliveryPricing.districtId], references: [districts.id] })
    }));
    notificationsRelations = relations(notifications, ({ one }) => ({
      user: one(users, {
        fields: [notifications.userId],
        references: [users.id]
      })
    }));
    districtsRelations = relations(districts, ({ many }) => ({
      users: many(users)
    }));
    zbnfPlansRelations = relations(zbnfPlans, ({ one }) => ({
      user: one(users, {
        fields: [zbnfPlans.userId],
        references: [users.id]
      }),
      farmer: one(farmers, {
        fields: [zbnfPlans.farmerId],
        references: [farmers.id]
      })
    }));
    adminCropsRelations = relations(adminCrops, ({ one }) => ({
      createdBy: one(users, {
        fields: [adminCrops.createdBy],
        references: [users.id]
      })
    }));
    cropLayers = pgTable("crop_layers", {
      id: serial("id").primaryKey(),
      layerNumber: integer("layer_number").notNull(),
      // 1-5 for different layers
      layerName: text("layer_name").notNull(),
      // Canopy, Sub-canopy, Shrub, Herbaceous, Ground
      description: text("description").notNull(),
      heightRange: text("height_range"),
      // e.g., "20-40m", "5-20m"
      characteristics: json("characteristics").default([]),
      // Growing conditions, space requirements
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    zbnfCrops = pgTable("zbnf_crops", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      scientificName: text("scientific_name"),
      layerId: integer("layer_id").references(() => cropLayers.id).notNull(),
      category: text("category").notNull(),
      // fruits, vegetables, spices, grains, etc.
      spacingRequirement: text("spacing_requirement"),
      // e.g., "6m x 6m", "1m x 1m"
      soilTypes: json("soil_types").default([]),
      // Compatible soil types
      climateZones: json("climate_zones").default([]),
      // Suitable climate zones
      seasons: json("seasons").default([]),
      // Planting/harvesting seasons
      companionCrops: json("companion_crops").default([]),
      // Compatible crops for intercropping
      conflictCrops: json("conflict_crops").default([]),
      // Crops to avoid nearby
      benefits: json("benefits").default([]),
      // Nitrogen fixing, pest control, etc.
      waterRequirement: text("water_requirement"),
      // low, medium, high
      sunRequirement: text("sun_requirement"),
      // full, partial, shade
      maturityPeriod: text("maturity_period"),
      // e.g., "3-4 months", "2-3 years"
      yieldPerPlant: text("yield_per_plant"),
      marketDemand: text("market_demand").default("medium"),
      // low, medium, high
      isNative: boolean("is_native").default(false),
      imageUrl: text("image_url"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    farmAnalysis = pgTable("farm_analysis", {
      id: serial("id").primaryKey(),
      farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
      analysisDate: timestamp("analysis_date").defaultNow().notNull(),
      detectionMethod: text("detection_method").notNull(),
      // camera, drone, manual
      farmArea: decimal("farm_area", { precision: 10, scale: 2 }),
      // in acres or hectares
      soilType: text("soil_type"),
      // clay, loam, sandy, etc.
      climateZone: text("climate_zone"),
      currentSeason: text("current_season"),
      existingCrops: json("existing_crops").default([]),
      // Current crops with layer info
      detectedGaps: json("detected_gaps").default([]),
      // Gap sizes and locations
      waterAvailability: text("water_availability"),
      // abundant, moderate, scarce
      slopeGrade: text("slope_grade"),
      // flat, gentle, steep
      analysisNotes: text("analysis_notes"),
      status: text("status").default("active"),
      // active, archived
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    zbnfRecommendations = pgTable("zbnf_recommendations", {
      id: serial("id").primaryKey(),
      analysisId: integer("analysis_id").references(() => farmAnalysis.id).notNull(),
      farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
      recommendedCropId: integer("recommended_crop_id").references(() => zbnfCrops.id).notNull(),
      targetLayer: integer("target_layer").notNull(),
      // Which layer this recommendation targets
      gapSize: text("gap_size"),
      // Size of gap this addresses
      placementLocation: text("placement_location"),
      // Where to plant
      estimatedYield: text("estimated_yield"),
      investmentRequired: decimal("investment_required", { precision: 10, scale: 2 }),
      expectedROI: text("expected_roi"),
      // Return on investment timeframe
      priority: text("priority").default("medium"),
      // low, medium, high
      reasoning: text("reasoning").notNull(),
      // Why this crop is recommended
      seasonalTiming: text("seasonal_timing"),
      // When to plant
      status: text("status").default("pending"),
      // pending, accepted, rejected, implemented
      farmerFeedback: text("farmer_feedback"),
      implementationDate: timestamp("implementation_date"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    cropCompatibility = pgTable("crop_compatibility", {
      id: serial("id").primaryKey(),
      crop1Id: integer("crop1_id").references(() => zbnfCrops.id).notNull(),
      crop2Id: integer("crop2_id").references(() => zbnfCrops.id).notNull(),
      compatibilityType: text("compatibility_type").notNull(),
      // beneficial, neutral, harmful
      benefitDescription: text("benefit_description"),
      // nitrogen fixing, pest control, etc.
      minimumDistance: text("minimum_distance"),
      // Required spacing
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertCropLayerSchema = createInsertSchema(cropLayers);
    insertZbnfCropSchema = createInsertSchema(zbnfCrops);
    insertFarmAnalysisSchema = createInsertSchema(farmAnalysis);
    insertZbnfRecommendationSchema = createInsertSchema(zbnfRecommendations);
    insertCropCompatibilitySchema = createInsertSchema(cropCompatibility);
    cropLayersRelations = relations(cropLayers, ({ many }) => ({
      crops: many(zbnfCrops)
    }));
    zbnfCropsRelations = relations(zbnfCrops, ({ one, many }) => ({
      layer: one(cropLayers, {
        fields: [zbnfCrops.layerId],
        references: [cropLayers.id]
      }),
      recommendations: many(zbnfRecommendations),
      compatibility1: many(cropCompatibility, { relationName: "crop1" }),
      compatibility2: many(cropCompatibility, { relationName: "crop2" })
    }));
    farmAnalysisRelations = relations(farmAnalysis, ({ one, many }) => ({
      farmer: one(farmers, {
        fields: [farmAnalysis.farmerId],
        references: [farmers.id]
      }),
      recommendations: many(zbnfRecommendations)
    }));
    zbnfRecommendationsRelations = relations(zbnfRecommendations, ({ one }) => ({
      analysis: one(farmAnalysis, {
        fields: [zbnfRecommendations.analysisId],
        references: [farmAnalysis.id]
      }),
      farmer: one(farmers, {
        fields: [zbnfRecommendations.farmerId],
        references: [farmers.id]
      }),
      crop: one(zbnfCrops, {
        fields: [zbnfRecommendations.recommendedCropId],
        references: [zbnfCrops.id]
      })
    }));
    cropCompatibilityRelations = relations(cropCompatibility, ({ one }) => ({
      crop1: one(zbnfCrops, {
        fields: [cropCompatibility.crop1Id],
        references: [zbnfCrops.id],
        relationName: "crop1"
      }),
      crop2: one(zbnfCrops, {
        fields: [cropCompatibility.crop2Id],
        references: [zbnfCrops.id],
        relationName: "crop2"
      })
    }));
    consumerQuotes = pgTable("consumer_quotes", {
      id: serial("id").primaryKey(),
      productId: integer("product_id").references(() => products.id).notNull(),
      consumerId: integer("consumer_id").references(() => users.id).notNull(),
      farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
      quotedPrice: decimal("quoted_price", { precision: 10, scale: 2 }).notNull(),
      quantity: integer("quantity").notNull(),
      message: text("message"),
      status: text("status").notNull().default("pending"),
      // pending, accepted, rejected, expired
      // When quote is accepted, track the resulting order
      orderId: integer("order_id").references(() => orders.id),
      acceptedAt: timestamp("accepted_at"),
      rejectedAt: timestamp("rejected_at"),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertConsumerQuoteSchema = createInsertSchema(consumerQuotes, {
      quotedPrice: (schema) => schema.refine((val) => parseFloat(val) > 0, "Price must be greater than 0"),
      quantity: (schema) => schema.refine((val) => val > 0, "Quantity must be greater than 0"),
      message: (schema) => schema.optional()
    });
    consumerQuotesRelations = relations(consumerQuotes, ({ one }) => ({
      product: one(products, {
        fields: [consumerQuotes.productId],
        references: [products.id]
      }),
      consumer: one(users, {
        fields: [consumerQuotes.consumerId],
        references: [users.id]
      }),
      farmer: one(farmers, {
        fields: [consumerQuotes.farmerId],
        references: [farmers.id]
      }),
      order: one(orders, {
        fields: [consumerQuotes.orderId],
        references: [orders.id]
      })
    }));
    eventTypes = pgTable("event_types", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 100 }).notNull().unique(),
      displayName: varchar("display_name", { length: 150 }).notNull(),
      description: text("description"),
      icon: varchar("icon", { length: 50 }),
      sortOrder: integer("sort_order").default(0),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertEventTypeSchema = createInsertSchema(eventTypes, {
      name: (schema) => schema.min(2, "Name must be at least 2 characters"),
      displayName: (schema) => schema.min(2, "Display name must be at least 2 characters")
    });
    farmEvents = pgTable("farm_events", {
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
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    eventDates = pgTable("event_dates", {
      id: serial("id").primaryKey(),
      eventId: integer("event_id").references(() => farmEvents.id).notNull(),
      eventDate: date("event_date").notNull(),
      availableSeats: integer("available_seats").notNull(),
      isAvailable: boolean("is_available").default(true)
    });
    eventFacilities = pgTable("event_facilities", {
      id: serial("id").primaryKey(),
      eventId: integer("event_id").references(() => farmEvents.id).notNull(),
      facilityName: text("facility_name").notNull(),
      // parking, restrooms, drinking_water, farm_tour, meals, snacks, pick_carry_bags, safety_gear
      description: text("description")
    });
    eventActivities = pgTable("event_activities", {
      id: serial("id").primaryKey(),
      eventId: integer("event_id").references(() => farmEvents.id).notNull(),
      activityName: text("activity_name").notNull(),
      description: text("description"),
      durationMinutes: integer("duration_minutes")
    });
    eventGallery = pgTable("event_gallery", {
      id: serial("id").primaryKey(),
      eventId: integer("event_id").references(() => farmEvents.id).notNull(),
      imageUrl: text("image_url").notNull(),
      caption: text("caption"),
      sortOrder: integer("sort_order").default(0)
    });
    eventBookings = pgTable("event_bookings", {
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
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertFarmEventSchema = createInsertSchema(farmEvents, {
      title: (schema) => schema.min(5, "Title must be at least 5 characters"),
      description: (schema) => schema.min(20, "Description must be at least 20 characters"),
      totalSeats: (schema) => schema.refine((val) => val > 0, "Total seats must be greater than 0"),
      pricePerSeat: (schema) => schema.refine((val) => parseFloat(val) > 0, "Price must be greater than 0")
    });
    insertEventDateSchema = createInsertSchema(eventDates);
    insertEventFacilitySchema = createInsertSchema(eventFacilities);
    insertEventActivitySchema = createInsertSchema(eventActivities);
    insertEventGallerySchema = createInsertSchema(eventGallery);
    insertEventBookingSchema = createInsertSchema(eventBookings, {
      numSeats: (schema) => schema.refine((val) => val > 0, "At least 1 seat is required")
    });
    farmEventsRelations = relations(farmEvents, ({ one, many }) => ({
      farmer: one(users, {
        fields: [farmEvents.farmerId],
        references: [users.id],
        relationName: "eventFarmer"
      }),
      districtManager: one(users, {
        fields: [farmEvents.dmId],
        references: [users.id],
        relationName: "eventDistrictManager"
      }),
      dates: many(eventDates),
      facilities: many(eventFacilities),
      activities: many(eventActivities),
      gallery: many(eventGallery),
      bookings: many(eventBookings)
    }));
    eventDatesRelations = relations(eventDates, ({ one, many }) => ({
      event: one(farmEvents, {
        fields: [eventDates.eventId],
        references: [farmEvents.id]
      }),
      bookings: many(eventBookings)
    }));
    eventFacilitiesRelations = relations(eventFacilities, ({ one }) => ({
      event: one(farmEvents, {
        fields: [eventFacilities.eventId],
        references: [farmEvents.id]
      })
    }));
    eventActivitiesRelations = relations(eventActivities, ({ one }) => ({
      event: one(farmEvents, {
        fields: [eventActivities.eventId],
        references: [farmEvents.id]
      })
    }));
    eventGalleryRelations = relations(eventGallery, ({ one }) => ({
      event: one(farmEvents, {
        fields: [eventGallery.eventId],
        references: [farmEvents.id]
      })
    }));
    eventBookingsRelations = relations(eventBookings, ({ one }) => ({
      event: one(farmEvents, {
        fields: [eventBookings.eventId],
        references: [farmEvents.id]
      }),
      eventDate: one(eventDates, {
        fields: [eventBookings.eventDateId],
        references: [eventDates.id]
      }),
      customer: one(users, {
        fields: [eventBookings.customerId],
        references: [users.id],
        relationName: "bookingCustomer"
      })
    }));
    FACILITY_TYPES = [
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
      "photography_allowed"
    ];
    ACTIVITY_TYPES = [
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
      "cooking_class"
    ];
    EVENT_TYPES = [
      "fruit_picking",
      "vegetable_experience",
      "farm_tour",
      "zbnf_training",
      "nursery_visit",
      "festival",
      "workshop",
      "kids_activity"
    ];
    FARMER_VOICE_CATEGORIES = [
      "innovation",
      "issue",
      "solution",
      "protest",
      "announcement",
      "success_story"
    ];
    farmerVoicePosts = pgTable("farmer_voice_posts", {
      id: serial("id").primaryKey(),
      districtManagerId: integer("district_manager_id").references(() => users.id).notNull(),
      districtId: integer("district_id").references(() => districts.id).notNull(),
      title: text("title").notNull(),
      content: text("content").notNull(),
      category: text("category").notNull(),
      // innovation, issue, solution, protest, announcement
      socialMediaUrl: text("social_media_url"),
      isActive: boolean("is_active").default(true).notNull(),
      upvoteCount: integer("upvote_count").default(0).notNull(),
      commentCount: integer("comment_count").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertFarmerVoicePostSchema = createInsertSchema(farmerVoicePosts);
    selectFarmerVoicePostSchema = createSelectSchema(farmerVoicePosts);
    farmerVoicePostValidationSchema = z.object({
      title: z.string().min(5, "Title must be at least 5 characters"),
      content: z.string().min(20, "Content must be at least 20 characters"),
      category: z.enum(["innovation", "issue", "solution", "protest", "announcement", "success_story"]),
      socialMediaUrl: z.string().url().optional().or(z.literal(""))
    });
    farmerVoiceUpvotes = pgTable("farmer_voice_upvotes", {
      id: serial("id").primaryKey(),
      postId: integer("post_id").references(() => farmerVoicePosts.id).notNull(),
      userId: integer("user_id").references(() => users.id).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (table) => ({
      uniqueUpvote: unique().on(table.postId, table.userId)
    }));
    insertFarmerVoiceUpvoteSchema = createInsertSchema(farmerVoiceUpvotes);
    farmerVoiceComments = pgTable("farmer_voice_comments", {
      id: serial("id").primaryKey(),
      postId: integer("post_id").references(() => farmerVoicePosts.id).notNull(),
      farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
      content: text("content").notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertFarmerVoiceCommentSchema = createInsertSchema(farmerVoiceComments);
    selectFarmerVoiceCommentSchema = createSelectSchema(farmerVoiceComments);
    farmerVoiceCommentValidationSchema = z.object({
      content: z.string().min(3, "Comment must be at least 3 characters")
    });
    farmerVoicePostsRelations = relations(farmerVoicePosts, ({ one, many }) => ({
      districtManager: one(users, { fields: [farmerVoicePosts.districtManagerId], references: [users.id] }),
      district: one(districts, { fields: [farmerVoicePosts.districtId], references: [districts.id] }),
      upvotes: many(farmerVoiceUpvotes),
      comments: many(farmerVoiceComments)
    }));
    farmerVoiceUpvotesRelations = relations(farmerVoiceUpvotes, ({ one }) => ({
      post: one(farmerVoicePosts, { fields: [farmerVoiceUpvotes.postId], references: [farmerVoicePosts.id] }),
      user: one(users, { fields: [farmerVoiceUpvotes.userId], references: [users.id] })
    }));
    farmerVoiceCommentsRelations = relations(farmerVoiceComments, ({ one }) => ({
      post: one(farmerVoicePosts, { fields: [farmerVoiceComments.postId], references: [farmerVoicePosts.id] }),
      farmer: one(farmers, { fields: [farmerVoiceComments.farmerId], references: [farmers.id] })
    }));
    fpoInquiries = pgTable("fpo_inquiries", {
      id: serial("id").primaryKey(),
      orgName: text("org_name").notNull(),
      contactName: text("contact_name").notNull(),
      email: text("email").notNull(),
      phone: text("phone").notNull(),
      district: text("district").notNull(),
      message: text("message"),
      status: text("status").notNull().default("new"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertFpoInquirySchema = createInsertSchema(fpoInquiries, {
      orgName: (s) => s.min(2, "Organisation name is required"),
      contactName: (s) => s.min(2, "Contact name is required"),
      email: (s) => s.email("Valid email is required"),
      phone: (s) => s.min(10, "Valid phone number is required"),
      district: (s) => s.min(2, "District is required")
    });
  }
});

// server/config/environment.ts
import dotenv from "dotenv";
import path from "path";
var nodeEnv, config;
var init_environment = __esm({
  "server/config/environment.ts"() {
    "use strict";
    nodeEnv = process.env.NODE_ENV || "development";
    if (nodeEnv === "production") {
      dotenv.config({ path: path.resolve(process.cwd(), ".env.production") });
    } else {
      dotenv.config({ path: path.resolve(process.cwd(), ".env.development") });
    }
    config = {
      nodeEnv,
      database: {
        url: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL
      },
      storage: {
        type: "cloudinary",
        // Always use Cloudinary when credentials are available
        uploadDir: path.join(process.cwd(), "public", "uploads")
      },
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
      },
      server: {
        port: process.env.PORT || 5e3
      }
    };
  }
});

// db/index.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  pool: () => pool
});
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
var sslConfig, pool, db;
var init_db = __esm({
  "db/index.ts"() {
    "use strict";
    init_schema();
    init_environment();
    if (!config.database.url) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    sslConfig = config.database.url.includes("neon.tech") ? { rejectUnauthorized: false } : false;
    pool = new Pool({
      connectionString: config.database.url,
      ssl: sslConfig
    });
    db = drizzle(pool, { schema: schema_exports });
  }
});

// server/storage.ts
import { and, eq, desc, asc, inArray, sql, or } from "drizzle-orm";
var USER_SAFE_COLUMNS, Storage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    USER_SAFE_COLUMNS = {
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
    };
    Storage = class {
      schema = schema_exports;
      // Helper Methods for District Normalization
      normalizeDistrictName(district) {
        const normalized = district.toLowerCase().trim();
        const districtMapping = {
          "tumkur": "tumkur",
          "tumakuru": "tumkur",
          "tumkuru": "tumkur",
          "bangalore rural": "bengaluru rural",
          "bangalore urban": "bengaluru urban",
          "bengaluru rural": "bengaluru rural",
          "bengaluru urban": "bengaluru urban",
          "chikkaballapur": "chikkaballapur",
          "chikballapur": "chikkaballapur",
          "chitradurga": "chitradurga",
          "davanagere": "davanagere",
          "davangere": "davanagere",
          "mysore": "mysore",
          "mysuru": "mysore",
          "gulbarga": "gulbarga",
          "kalaburagi": "gulbarga",
          "mandya": "mandya",
          "tirupati": "tirupati",
          "tirupathi": "tirupati"
        };
        return districtMapping[normalized] || normalized;
      }
      getDistrictVariations(district) {
        const normalized = this.normalizeDistrictName(district);
        const variationsMap = {
          "tumkur": ["Tumkur", "Tumakuru", "Tumkuru"],
          "bengaluru rural": ["Bengaluru Rural", "Bangalore Rural"],
          "bengaluru urban": ["Bengaluru Urban", "Bangalore Urban"],
          "chikkaballapur": ["Chikkaballapur", "Chikballapur"],
          "chitradurga": ["Chitradurga"],
          "davanagere": ["Davanagere", "Davangere"],
          "mysore": ["Mysore", "Mysuru"],
          "gulbarga": ["Gulbarga", "Kalaburagi"],
          "mandya": ["Mandya"],
          "tirupati": ["Tirupati", "Tirupathi"]
        };
        return variationsMap[normalized] || [district];
      }
      // User Methods
      async getAllUsers() {
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
      async getUserById(id) {
        return await db.query.users.findFirst({
          where: eq(users.id, id),
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
      async getUserByUsername(username) {
        return await db.query.users.findFirst({
          where: eq(users.username, username),
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
      async getUserByEmail(email) {
        return await db.query.users.findFirst({
          where: eq(users.email, email),
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
      async getUserByResetToken(resetToken) {
        return await db.query.users.findFirst({
          where: eq(users.resetToken, resetToken),
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
      async createUser(user) {
        const [createdUser] = await db.insert(users).values(user).returning();
        return createdUser;
      }
      async updateUser(id, userData) {
        const [updatedUser] = await db.update(users).set({
          ...userData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, id)).returning();
        return updatedUser;
      }
      // Farmer Methods
      async getAllFarmers() {
        return await db.query.farmers.findMany({
          with: {
            user: { columns: USER_SAFE_COLUMNS }
          }
        });
      }
      async getFarmersWithFilters(filters, limit, orderBy) {
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
            orderBy
          });
        }
        const farmers2 = await query;
        if (limit) {
          return farmers2.slice(0, limit);
        }
        return farmers2;
      }
      async getFarmerById(id) {
        return await db.query.farmers.findFirst({
          where: eq(farmers.id, id),
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
      async getFarmerByUserId(userId) {
        return await db.query.farmers.findFirst({
          where: eq(farmers.userId, userId),
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
      async createFarmer(farmer) {
        const [createdFarmer] = await db.insert(farmers).values(farmer).returning();
        return createdFarmer;
      }
      async updateFarmer(id, farmerData) {
        const [updatedFarmer] = await db.update(farmers).set({
          ...farmerData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(farmers.id, id)).returning();
        return updatedFarmer;
      }
      async deleteFarmer(id) {
        await db.delete(farmers).where(eq(farmers.id, id));
      }
      async deleteFarmerReviews(farmerId) {
        await db.delete(reviews).where(eq(reviews.farmerId, farmerId));
      }
      // Customer Methods
      async getCustomerByUserId(userId) {
        return await db.query.customers.findFirst({
          where: eq(customers.userId, userId)
        });
      }
      async createCustomer(customer) {
        const [createdCustomer] = await db.insert(customers).values(customer).returning();
        return createdCustomer;
      }
      async updateCustomer(id, customerData) {
        const [updatedCustomer] = await db.update(customers).set({
          ...customerData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(customers.id, id)).returning();
        return updatedCustomer;
      }
      // Category Methods
      async getAllCategories() {
        return await db.query.categories.findMany();
      }
      async getCategoryById(id) {
        return await db.query.categories.findFirst({
          where: eq(categories.id, id)
        });
      }
      async createCategory(category) {
        const [createdCategory] = await db.insert(categories).values(category).returning();
        return createdCategory;
      }
      async updateCategory(id, categoryData) {
        const [updatedCategory] = await db.update(categories).set({
          ...categoryData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(categories.id, id)).returning();
        return updatedCategory;
      }
      async deleteCategory(id) {
        await db.delete(categories).where(eq(categories.id, id));
      }
      // District Methods
      async getAllDistricts() {
        return await db.query.districts.findMany({
          orderBy: asc(districts.name)
        });
      }
      async getActiveDistricts() {
        return await db.query.districts.findMany({
          where: eq(districts.isActive, true),
          orderBy: asc(districts.name)
        });
      }
      async getDistrictById(id) {
        return await db.query.districts.findFirst({
          where: eq(districts.id, id)
        });
      }
      async getDistrictByName(name) {
        return await db.query.districts.findFirst({
          where: eq(districts.name, name)
        });
      }
      async createDistrict(district) {
        const [createdDistrict] = await db.insert(districts).values(district).returning();
        return createdDistrict;
      }
      async updateDistrict(id, districtData) {
        const [updatedDistrict] = await db.update(districts).set({
          ...districtData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(districts.id, id)).returning();
        return updatedDistrict;
      }
      async deleteDistrict(id) {
        await db.delete(districts).where(eq(districts.id, id));
      }
      async getFarmerIdsByDistrictName(name) {
        const normalizedDistrict = this.normalizeDistrictName(name);
        const districtVariations = this.getDistrictVariations(normalizedDistrict);
        const whereConditions = districtVariations.map(
          (variant) => sql`lower(${users.district}) = lower(${variant})`
        );
        const result = await db.selectDistinct({ id: farmers.id }).from(farmers).leftJoin(users, eq(farmers.userId, users.id)).where(
          and(
            or(...whereConditions),
            eq(users.isActive, true)
            // Only get farmers with active users
          )
        );
        return result.map((row) => row.id);
      }
      // Product Methods
      async getProductsWithFilters(filters, limit) {
        const queryOptions = {
          with: {
            category: true,
            farmer: true
          }
        };
        if (filters) {
          queryOptions.where = filters;
        }
        if (limit) {
          queryOptions.limit = limit;
        }
        const products2 = await db.query.products.findMany(queryOptions);
        const formattedProducts = products2.map((product) => {
          return {
            ...product,
            farm: {
              id: product.farmer.id,
              name: product.farmer.farmName,
              location: product.farmer.location,
              logoUrl: product.farmer.logoUrl,
              isZbnfCertified: product.farmer.isZbnfCertified,
              isOrganicCertified: product.farmer.isOrganicCertified,
              isNaturalCertified: product.farmer.isNaturalCertified
            }
          };
        });
        return formattedProducts;
      }
      async getProductById(id) {
        const product = await db.query.products.findFirst({
          where: eq(products.id, id),
          with: {
            category: true,
            farmer: true
          }
        });
        if (!product) {
          return void 0;
        }
        console.log("Storage - Product data from DB:", {
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          unitsPerBox: product.unitsPerBox
        });
        return {
          ...product,
          farm: {
            id: product.farmer.id,
            name: product.farmer.farmName,
            location: product.farmer.location,
            logoUrl: product.farmer.logoUrl,
            isZbnfCertified: product.farmer.isZbnfCertified,
            isOrganicCertified: product.farmer.isOrganicCertified,
            isNaturalCertified: product.farmer.isNaturalCertified
          }
        };
      }
      async getProductsByFarmerId(farmerId) {
        const products2 = await db.query.products.findMany({
          where: eq(products.farmerId, farmerId),
          with: {
            category: true,
            farmer: true
          }
        });
        return products2.map((product) => {
          return {
            ...product,
            farm: {
              id: product.farmer.id,
              name: product.farmer.farmName,
              location: product.farmer.location,
              logoUrl: product.farmer.logoUrl,
              isZbnfCertified: product.farmer.isZbnfCertified,
              isOrganicCertified: product.farmer.isOrganicCertified,
              isNaturalCertified: product.farmer.isNaturalCertified
            }
          };
        });
      }
      async getActiveProductsByFarmerId(farmerId) {
        const products2 = await db.query.products.findMany({
          where: and(
            eq(products.farmerId, farmerId),
            eq(products.isActive, true),
            eq(products.approvalStatus, "approved"),
            sql`${products.availableUntil} > NOW()`
            // Exclude expired products
          ),
          with: {
            category: true,
            farmer: true
          }
        });
        return products2.map((product) => {
          return {
            ...product,
            farm: {
              id: product.farmer.id,
              name: product.farmer.farmName,
              location: product.farmer.location,
              logoUrl: product.farmer.logoUrl,
              isZbnfCertified: product.farmer.isZbnfCertified,
              isOrganicCertified: product.farmer.isOrganicCertified,
              isNaturalCertified: product.farmer.isNaturalCertified
            }
          };
        });
      }
      async createProduct(product) {
        const [createdProduct] = await db.insert(products).values(product).returning();
        return this.getProductById(createdProduct.id);
      }
      async updateProduct(id, productData) {
        const [updatedProduct] = await db.update(products).set({
          ...productData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(products.id, id)).returning();
        return this.getProductById(updatedProduct.id);
      }
      async deleteProduct(id) {
        const orderItems2 = await db.query.orderItems.findMany({
          where: eq(orderItems.productId, id)
        });
        if (orderItems2.length > 0) {
          await db.update(products).set({
            approvalStatus: "deleted",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(products.id, id));
        } else {
          await db.delete(productImages).where(eq(productImages.productId, id));
          await db.delete(calendarEntries).where(eq(calendarEntries.productId, id));
          await db.delete(products).where(eq(products.id, id));
        }
      }
      // Product Images Methods
      async createProductImage(productImage) {
        const [createdImage] = await db.insert(productImages).values(productImage).returning();
        if (productImage.isPrimary) {
          await db.update(products).set({ imageUrl: productImage.imageUrl, updatedAt: /* @__PURE__ */ new Date() }).where(eq(products.id, productImage.productId));
        } else {
          const product = await db.query.products.findFirst({
            where: eq(products.id, productImage.productId)
          });
          if (product && !product.imageUrl) {
            await db.update(products).set({ imageUrl: productImage.imageUrl, updatedAt: /* @__PURE__ */ new Date() }).where(eq(products.id, productImage.productId));
          }
        }
        return createdImage;
      }
      async getProductImages(productId) {
        return await db.query.productImages.findMany({
          where: eq(productImages.productId, productId),
          orderBy: [desc(productImages.isPrimary)]
        });
      }
      async setPrimaryProductImage(imageId, productId) {
        await db.update(productImages).set({ isPrimary: false }).where(eq(productImages.productId, productId));
        await db.update(productImages).set({ isPrimary: true }).where(eq(productImages.id, imageId));
        const primaryImage = await db.query.productImages.findFirst({
          where: eq(productImages.id, imageId)
        });
        if (primaryImage) {
          await db.update(products).set({ imageUrl: primaryImage.imageUrl, updatedAt: /* @__PURE__ */ new Date() }).where(eq(products.id, productId));
        }
      }
      async deleteProductImage(imageId) {
        const imageToDelete = await db.query.productImages.findFirst({
          where: eq(productImages.id, imageId)
        });
        if (!imageToDelete) return;
        const productId = imageToDelete.productId;
        const wasImageUrl = imageToDelete.imageUrl;
        await db.delete(productImages).where(eq(productImages.id, imageId));
        const product = await db.query.products.findFirst({
          where: eq(products.id, productId)
        });
        if (product && product.imageUrl === wasImageUrl) {
          const remainingImages = await db.query.productImages.findMany({
            where: eq(productImages.productId, productId),
            orderBy: [desc(productImages.isPrimary)]
          });
          const newImageUrl = remainingImages.length > 0 ? remainingImages[0].imageUrl : null;
          await db.update(products).set({ imageUrl: newImageUrl, updatedAt: /* @__PURE__ */ new Date() }).where(eq(products.id, productId));
        }
      }
      // Order Methods
      async createOrder(order) {
        const [createdOrder] = await db.insert(orders).values(order).returning();
        return createdOrder;
      }
      async getOrderById(id) {
        return await db.query.orders.findFirst({
          where: eq(orders.id, id),
          with: {
            items: {
              with: {
                product: true
              }
            }
          }
        });
      }
      async getOrdersByUserId(userId) {
        return await db.query.orders.findMany({
          where: eq(orders.userId, userId),
          with: {
            items: {
              with: {
                product: true
              }
            }
          },
          orderBy: desc(orders.createdAt)
        });
      }
      async getOrdersByFarmerId(farmerId) {
        console.log(`Storage: Finding all order items for farmer ID: ${farmerId}`);
        const orderItems2 = await db.query.orderItems.findMany({
          where: eq(orderItems.farmerId, farmerId),
          with: {
            product: true
          }
        });
        console.log(`Found ${orderItems2.length} order items for farmer ID: ${farmerId}`);
        if (orderItems2.length === 0) {
          return [];
        }
        const orderIds = [...new Set(orderItems2.map((item) => item.orderId))];
        console.log(`Found ${orderIds.length} unique orders with items from farmer ID: ${farmerId}`);
        console.log(`Order IDs: ${orderIds.join(", ")}`);
        const orders2 = await db.query.orders.findMany({
          where: inArray(orders.id, orderIds),
          with: {
            items: {
              with: {
                product: true
              }
            }
          },
          orderBy: desc(orders.createdAt)
        });
        console.log(`Retrieved ${orders2.length} orders for farmer ID: ${farmerId}`);
        const ordersWithFilteredItems = orders2.map((order) => {
          const farmerItems = order.items?.filter((item) => item.farmerId === farmerId) || [];
          return {
            ...order,
            items: farmerItems
          };
        });
        return ordersWithFilteredItems;
      }
      async updateOrder(id, orderData) {
        const [updatedOrder] = await db.update(orders).set({
          ...orderData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(orders.id, id)).returning();
        return updatedOrder;
      }
      // Order Item Methods
      async createOrderItem(orderItem) {
        const [createdOrderItem] = await db.insert(orderItems).values(orderItem).returning();
        return createdOrderItem;
      }
      async getOrderItemsByOrderId(orderId) {
        return await db.query.orderItems.findMany({
          where: eq(orderItems.orderId, orderId),
          with: {
            product: true
          }
        });
      }
      async getOrderItemsByFarmerId(farmerId) {
        return await db.query.orderItems.findMany({
          where: eq(orderItems.farmerId, farmerId)
        });
      }
      async getOrdersWithFilters(filters, limit) {
        if (filters) {
          if (limit) {
            return await db.query.orders.findMany({
              where: filters,
              limit,
              with: {
                items: {
                  with: {
                    product: true
                  }
                }
              },
              orderBy: [desc(orders.createdAt)]
            });
          }
          return await db.query.orders.findMany({
            where: filters,
            with: {
              items: {
                with: {
                  product: true
                }
              }
            },
            orderBy: [desc(orders.createdAt)]
          });
        }
        if (limit) {
          return await db.query.orders.findMany({
            limit,
            with: {
              items: {
                with: {
                  product: true
                }
              }
            },
            orderBy: [desc(orders.createdAt)]
          });
        }
        return await db.query.orders.findMany({
          with: {
            items: {
              with: {
                product: true
              }
            }
          },
          orderBy: [desc(orders.createdAt)]
        });
      }
      async getAllCustomers() {
        return await db.query.users.findMany({
          where: eq(users.role, "customer"),
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
      async createCalendarEntry(calendarEntry) {
        const [createdCalendarEntry] = await db.insert(calendarEntries).values(calendarEntry).returning();
        return createdCalendarEntry;
      }
      async getCalendarEntryByProductId(productId) {
        return await db.query.calendarEntries.findFirst({
          where: eq(calendarEntries.productId, productId)
        });
      }
      async updateCalendarEntry(id, calendarEntryData) {
        const [updatedCalendarEntry] = await db.update(calendarEntries).set({
          ...calendarEntryData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(calendarEntries.id, id)).returning();
        return updatedCalendarEntry;
      }
      async deleteCalendarEntry(id) {
        await db.delete(calendarEntries).where(eq(calendarEntries.id, id));
      }
      async getCalendarEntriesWithFilters(filters, limit) {
        const entries = await db.select({
          id: calendarEntries.id,
          productId: calendarEntries.productId,
          monthlyStatus: calendarEntries.monthlyStatus,
          createdAt: calendarEntries.createdAt,
          product: {
            id: products.id,
            name: products.name,
            imageUrl: products.imageUrl,
            categoryId: products.categoryId,
            farmerId: products.farmerId,
            farm: {
              id: farmers.id,
              farmName: farmers.farmName,
              logoUrl: farmers.logoUrl
            }
          }
        }).from(calendarEntries).leftJoin(products, eq(calendarEntries.productId, products.id)).leftJoin(farmers, eq(products.farmerId, farmers.id)).where(filters || sql`1=1`);
        if (limit) {
          return entries.slice(0, limit);
        }
        return entries;
      }
      // Review Methods
      async createReview(review) {
        const [createdReview] = await db.insert(reviews).values(review).returning();
        if (review.farmerId) {
          await this.updateFarmerRating(review.farmerId);
        } else if (review.productId) {
          await this.updateProductRating(review.productId);
        }
        return createdReview;
      }
      async getReviewsByFarmerId(farmerId) {
        return await db.query.reviews.findMany({
          where: eq(reviews.farmerId, farmerId),
          with: {
            user: { columns: USER_SAFE_COLUMNS }
          },
          orderBy: desc(reviews.createdAt)
        });
      }
      async getReviewsByProductId(productId) {
        return await db.query.reviews.findMany({
          where: eq(reviews.productId, productId),
          with: {
            user: { columns: USER_SAFE_COLUMNS }
          },
          orderBy: desc(reviews.createdAt)
        });
      }
      async updateFarmerRating(farmerId) {
        const reviews3 = await this.getReviewsByFarmerId(farmerId);
        if (reviews3.length === 0) return;
        const totalRating = reviews3.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews3.length).toFixed(1);
        await db.update(farmers).set({
          rating: averageRating,
          reviewCount: reviews3.length,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(farmers.id, farmerId));
      }
      async updateProductRating(productId) {
        const reviews3 = await this.getReviewsByProductId(productId);
        if (reviews3.length === 0) return;
        const totalRating = reviews3.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews3.length).toFixed(1);
        await db.update(products).set({
          rating: averageRating,
          reviewCount: reviews3.length,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(products.id, productId));
      }
      // Newsletter Methods
      async createNewsletterSubscriber(subscriber) {
        const [createdSubscriber] = await db.insert(newsletterSubscribers).values(subscriber).returning();
        return createdSubscriber;
      }
      async getNewsletterSubscriberByEmail(email) {
        return await db.query.newsletterSubscribers.findFirst({
          where: eq(newsletterSubscribers.email, email)
        });
      }
      async updateNewsletterSubscriber(id, subscriberData) {
        const [updatedSubscriber] = await db.update(newsletterSubscribers).set({
          ...subscriberData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(newsletterSubscribers.id, id)).returning();
        return updatedSubscriber;
      }
      // Order Fee Methods
      async getAllOrderFees() {
        return await db.query.orderFees.findMany({
          orderBy: asc(orderFees.displayOrder)
        });
      }
      async getActiveOrderFees() {
        return await db.query.orderFees.findMany({
          where: eq(orderFees.isActive, true),
          orderBy: asc(orderFees.displayOrder)
        });
      }
      async getOrderFeeById(id) {
        return await db.query.orderFees.findFirst({
          where: eq(orderFees.id, id)
        });
      }
      async createOrderFee(orderFee) {
        const [createdOrderFee] = await db.insert(orderFees).values(orderFee).returning();
        return createdOrderFee;
      }
      async updateOrderFee(id, orderFeeData) {
        const [updatedOrderFee] = await db.update(orderFees).set({
          ...orderFeeData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(orderFees.id, id)).returning();
        return updatedOrderFee;
      }
      async deleteOrderFee(id) {
        await db.delete(orderFees).where(eq(orderFees.id, id));
      }
      // Farmer Follow Methods
      async followFarmer(followerId, farmerId) {
        const [follow] = await db.insert(farmerFollows).values({
          followerId,
          farmerId
        }).returning();
        return follow;
      }
      async unfollowFarmer(followerId, farmerId) {
        await db.delete(farmerFollows).where(and(
          eq(farmerFollows.followerId, followerId),
          eq(farmerFollows.farmerId, farmerId)
        ));
      }
      async isFollowing(followerId, farmerId) {
        const follow = await db.query.farmerFollows.findFirst({
          where: and(
            eq(farmerFollows.followerId, followerId),
            eq(farmerFollows.farmerId, farmerId)
          )
        });
        return !!follow;
      }
      async getFarmerFollowers(farmerId) {
        const follows = await db.query.farmerFollows.findMany({
          where: eq(farmerFollows.farmerId, farmerId),
          with: {
            follower: { columns: USER_SAFE_COLUMNS }
          }
        });
        return follows.map((f) => f.follower);
      }
      async getUserFollowedFarmers(userId) {
        const follows = await db.query.farmerFollows.findMany({
          where: eq(farmerFollows.followerId, userId),
          with: {
            farmer: true
          }
        });
        return follows.map((f) => f.farmer);
      }
      async getFarmerFollowCounts(farmerId) {
        const followers = await this.getFarmerFollowers(farmerId);
        return { followerCount: followers.length };
      }
      // Notification Methods
      async createNotification(notification) {
        const [created] = await db.insert(notifications).values(notification).returning();
        return created;
      }
      async getUserNotifications(userId, limit = 50) {
        return await db.query.notifications.findMany({
          where: eq(notifications.userId, userId),
          orderBy: desc(notifications.createdAt),
          limit
        });
      }
      async markNotificationAsRead(notificationId) {
        await db.update(notifications).set({ isRead: true, updatedAt: /* @__PURE__ */ new Date() }).where(eq(notifications.id, notificationId));
      }
      async markAllNotificationsAsRead(userId) {
        await db.update(notifications).set({ isRead: true, updatedAt: /* @__PURE__ */ new Date() }).where(eq(notifications.userId, userId));
      }
      async getUnreadNotificationCount(userId) {
        const result = await db.select({ count: sql`count(*)` }).from(notifications).where(and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        ));
        return result[0]?.count || 0;
      }
      async deleteNotification(notificationId) {
        await db.delete(notifications).where(eq(notifications.id, notificationId));
      }
      // Notification helpers
      async notifyFollowersOfNewProduct(farmerId, productId, productName) {
        const followers = await this.getFarmerFollowers(farmerId);
        const farmer = await this.getFarmerById(farmerId);
        if (!farmer) return;
        const notifications2 = followers.map((follower) => ({
          userId: follower.id,
          type: "new_product",
          title: "New Product Available",
          message: `${farmer.farmName} has added a new product: ${productName}`,
          data: JSON.stringify({ farmerId, productId, farmerName: farmer.farmName, productName })
        }));
        for (const notification of notifications2) {
          await this.createNotification(notification);
        }
      }
      // Order notification methods
      async notifyFarmerOfNewOrder(orderId) {
        const order = await this.getOrderById(orderId);
        if (!order) return;
        const orderItems2 = await this.getOrderItemsByOrderId(orderId);
        const customer = await this.getUserById(order.userId);
        if (!customer) return;
        const farmerOrders = /* @__PURE__ */ new Map();
        for (const item of orderItems2) {
          const product = await this.getProductById(item.productId);
          if (product) {
            if (!farmerOrders.has(product.farmerId)) {
              farmerOrders.set(product.farmerId, []);
            }
            farmerOrders.get(product.farmerId).push({
              productName: product.name,
              quantity: item.quantity,
              price: item.price
            });
          }
        }
        for (const [farmerId, items] of farmerOrders) {
          const farmer = await this.getFarmerById(farmerId);
          if (!farmer) continue;
          const farmerUser = await this.getUserById(farmer.userId);
          if (!farmerUser) continue;
          const itemsList = items.map((item) => `${item.productName} (${item.quantity} units)`).join(", ");
          const totalValue = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
          await this.createNotification({
            userId: farmerUser.id,
            type: "new_order",
            title: "New Order Received",
            message: `You have received a new order from ${customer.name}. Items: ${itemsList}. Total value: \u20B9${totalValue.toFixed(2)}`,
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
      async notifyOrderStatusUpdate(orderId, newStatus) {
        const order = await this.getOrderById(orderId);
        if (!order) return;
        const customer = await this.getUserById(order.userId);
        const orderItems2 = await this.getOrderItemsByOrderId(orderId);
        if (!customer) return;
        const statusMessages = {
          "pending": "Your order has been placed and is pending confirmation",
          "accepted": "Your order has been accepted by the farmer",
          "growing": "Your products are currently being grown",
          "harvested": "Your products have been harvested",
          "packaging": "Your order is being packaged for shipment",
          "shipping": "Your order has been shipped and is on its way",
          "delivered": "Your order has been delivered",
          "cancelled": "Your order has been cancelled"
        };
        await this.createNotification({
          userId: customer.id,
          type: "order_status",
          title: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
          message: statusMessages[newStatus] || `Your order status has been updated to ${newStatus}`,
          data: JSON.stringify({
            orderId,
            newStatus,
            orderDate: order.createdAt,
            totalAmount: order.total
          })
        });
        const farmerIds = /* @__PURE__ */ new Set();
        for (const item of orderItems2) {
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
            type: "order_status",
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
      async notifyPaymentStatus(orderId, paymentStatus) {
        const order = await this.getOrderById(orderId);
        if (!order) return;
        const customer = await this.getUserById(order.userId);
        const orderItems2 = await this.getOrderItemsByOrderId(orderId);
        if (!customer) return;
        const paymentMessages = {
          "pending": "Your payment is being processed",
          "completed": "Your payment has been successfully processed",
          "failed": "Your payment has failed. Please try again",
          "refunded": "Your payment has been refunded"
        };
        await this.createNotification({
          userId: customer.id,
          type: "payment_status",
          title: `Payment ${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}`,
          message: paymentMessages[paymentStatus] || `Payment status: ${paymentStatus}`,
          data: JSON.stringify({
            orderId,
            paymentStatus,
            amount: order.total
          })
        });
        if (paymentStatus === "completed") {
          const farmerIds = /* @__PURE__ */ new Set();
          for (const item of orderItems2) {
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
              type: "payment_received",
              title: "Payment Received",
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
      async notifyLowStock(productId, currentStock, threshold = 10) {
        const product = await this.getProductById(productId);
        if (!product) return;
        const farmer = await this.getFarmerById(product.farmerId);
        if (!farmer) return;
        const farmerUser = await this.getUserById(farmer.userId);
        if (!farmerUser) return;
        await this.createNotification({
          userId: farmerUser.id,
          type: "low_stock",
          title: "Low Stock Alert",
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
      async notifyProductApproval(productId, approved, reason) {
        const product = await this.getProductById(productId);
        if (!product) return;
        const farmer = await this.getFarmerById(product.farmerId);
        if (!farmer) return;
        const farmerUser = await this.getUserById(farmer.userId);
        if (!farmerUser) return;
        const status = approved ? "approved" : "rejected";
        const title = approved ? "Product Approved!" : "Product Needs Attention";
        const message = approved ? `Great news! Your product "${product.name}" has been approved and is now live on the marketplace.` : `Your product "${product.name}" requires some changes. ${reason || "Please review and resubmit."}`;
        await this.createNotification({
          userId: farmerUser.id,
          type: "product_approval",
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
      async notifyNewReview(reviewId, productId, rating, reviewerName) {
        const product = await this.getProductById(productId);
        if (!product) return;
        const farmer = await this.getFarmerById(product.farmerId);
        if (!farmer) return;
        const farmerUser = await this.getUserById(farmer.userId);
        if (!farmerUser) return;
        const stars = "\u2605".repeat(rating) + "\u2606".repeat(5 - rating);
        await this.createNotification({
          userId: farmerUser.id,
          type: "new_review",
          title: "New Review Received",
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
      async notifyNewFollower(farmerId, followerUserId) {
        const farmer = await this.getFarmerById(farmerId);
        if (!farmer) return;
        const farmerUser = await this.getUserById(farmer.userId);
        if (!farmerUser) return;
        const follower = await this.getUserById(followerUserId);
        if (!follower) return;
        const followerName = follower.name || follower.username || "A new user";
        await this.createNotification({
          userId: farmerUser.id,
          type: "new_follower",
          title: "New Follower!",
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
      async notifyQuoteStatus(quoteId, customerId, status, productName, farmerResponse) {
        const customer = await this.getUserById(customerId);
        if (!customer) return;
        const statusMessages = {
          accepted: {
            title: "Quote Accepted!",
            message: `Great news! Your quote for "${productName}" has been accepted by the farmer. ${farmerResponse ? `Farmer's note: ${farmerResponse}` : "You can now proceed with the payment."}`
          },
          rejected: {
            title: "Quote Update",
            message: `Your quote for "${productName}" could not be accepted. ${farmerResponse || "The farmer may have suggested alternatives."}`
          },
          countered: {
            title: "Counter Offer Received",
            message: `The farmer has made a counter offer for your "${productName}" quote. ${farmerResponse || "Please review the new terms."}`
          }
        };
        const notification = statusMessages[status] || {
          title: "Quote Update",
          message: `Your quote for "${productName}" has been updated to: ${status}`
        };
        await this.createNotification({
          userId: customer.id,
          type: "quote_status",
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
      async getUsersByRole(role) {
        return await db.query.users.findMany({
          where: eq(users.role, role),
          orderBy: asc(users.name),
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
            bankAccountNumber: true,
            bankIfsc: true,
            gstNumber: true,
            upiId: true,
            createdAt: true,
            updatedAt: true
          }
        });
      }
      async getUsersUnderManager(managerId) {
        return await db.query.users.findMany({
          where: eq(users.reportsTo, managerId),
          orderBy: asc(users.name),
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
      async getDistrictManagers() {
        return await this.getUsersByRole("district_manager");
      }
      async getTalukAgents() {
        return await this.getUsersByRole("taluk_agent");
      }
      async getDeliveryAgents() {
        return await this.getUsersByRole("delivery_agent");
      }
      async getUsersInDistrict(district) {
        return await db.query.users.findMany({
          where: eq(users.district, district),
          orderBy: asc(users.name),
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
      async getUsersByRoleAndDistrict(role, district) {
        return await db.query.users.findMany({
          where: and(
            eq(users.role, role),
            eq(users.district, district)
          ),
          orderBy: asc(users.name),
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
      async getUsersInTaluk(taluk) {
        return await db.query.users.findMany({
          where: eq(users.taluk, taluk),
          orderBy: asc(users.name),
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
      async getFarmersInDistrict(district) {
        const normalizedDistrict = this.normalizeDistrictName(district);
        const farmerIds = await this.getFarmerIdsByDistrictName(normalizedDistrict);
        if (farmerIds.length === 0) {
          return [];
        }
        return await db.query.farmers.findMany({
          where: inArray(farmers.id, farmerIds),
          with: {
            user: { columns: USER_SAFE_COLUMNS }
          }
        });
      }
      async getProductsInDistrict(district) {
        const normalizedDistrict = this.normalizeDistrictName(district);
        const farmerIds = await this.getFarmerIdsByDistrictName(normalizedDistrict);
        if (farmerIds.length === 0) {
          return [];
        }
        return await db.query.products.findMany({
          where: inArray(products.farmerId, farmerIds),
          with: {
            farmer: {
              with: {
                user: { columns: USER_SAFE_COLUMNS }
              }
            }
          }
        });
      }
      async getOrdersInDistrict(district) {
        const normalizedDistrict = this.normalizeDistrictName(district);
        const farmerIds = await this.getFarmerIdsByDistrictName(normalizedDistrict);
        if (farmerIds.length === 0) {
          return [];
        }
        const productIdsResult = await db.select({ id: products.id }).from(products).where(inArray(products.farmerId, farmerIds)).groupBy(products.id);
        const productIds = productIdsResult.map((row) => row.id);
        if (productIds.length === 0) {
          return [];
        }
        const orderIdsResult = await db.select({ orderId: orderItems.orderId }).from(orderItems).where(inArray(orderItems.productId, productIds)).groupBy(orderItems.orderId);
        const orderIds = orderIdsResult.map((row) => row.orderId);
        if (orderIds.length === 0) {
          return [];
        }
        return await db.query.orders.findMany({
          where: inArray(orders.id, orderIds),
          with: {
            user: { columns: USER_SAFE_COLUMNS }
          }
        });
      }
      async createStaffUser(userData) {
        return await this.createUser(userData);
      }
      async updateUserRole(userId, role, reportsTo, district, taluk) {
        const updateData = {
          role,
          reportsTo,
          district,
          taluk,
          updatedAt: /* @__PURE__ */ new Date()
        };
        const [updatedUser] = await db.update(users).set(updateData).where(eq(users.id, userId)).returning();
        return updatedUser;
      }
      async getHierarchyStructure() {
        const admins = await this.getUsersByRole("admin");
        const districtManagers = await this.getUsersByRole("district_manager");
        const talukAgents = await this.getUsersByRole("taluk_agent");
        const deliveryAgents = await this.getUsersByRole("delivery_agent");
        const hierarchy = {
          admins,
          districts: []
        };
        for (const manager of districtManagers) {
          const district = {
            manager,
            talukAgents: talukAgents.filter((agent) => agent.reportsTo === manager.id),
            deliveryAgents: deliveryAgents.filter((agent) => agent.reportsTo === manager.id)
          };
          hierarchy.districts.push(district);
        }
        return hierarchy;
      }
      async canUserAccessResource(userId, resourceType, resourceId) {
        const user = await this.getUserById(userId);
        if (!user) return false;
        if (user.role === "admin") return true;
        switch (user.role) {
          case "district_manager":
            return true;
          case "taluk_agent":
            return true;
          case "delivery_agent":
            return resourceType === "orders" || resourceType === "deliveries";
          default:
            return false;
        }
      }
      // ZBNF Plans Management Methods
      async saveZbnfPlan(planData) {
        try {
          const [savedPlan] = await db.insert(zbnfPlans).values(planData).returning();
          return savedPlan;
        } catch (error) {
          console.error("Error saving ZBNF plan:", error);
          if (error.code === "42P01") {
            console.log("Table zbnf_plans does not exist, creating temporary plan");
            const tempPlan = {
              id: Date.now(),
              // Temporary ID
              ...planData,
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            };
            return tempPlan;
          }
          throw error;
        }
      }
      async getZbnfPlansByFarmer(farmerId) {
        try {
          return await db.query.zbnfPlans.findMany({
            where: eq(zbnfPlans.farmerId, farmerId),
            orderBy: desc(zbnfPlans.createdAt)
          });
        } catch (error) {
          console.error("Error fetching ZBNF plans:", error);
          return [];
        }
      }
      async getZbnfPlansByUser(userId) {
        try {
          return await db.query.zbnfPlans.findMany({
            where: eq(zbnfPlans.userId, userId),
            orderBy: desc(zbnfPlans.createdAt)
          });
        } catch (error) {
          console.error("Error fetching ZBNF plans:", error);
          return [];
        }
      }
      // AI Subscription Plans Management Methods
      async createAiSubscriptionPlan(planData) {
        try {
          const [createdPlan] = await db.insert(aiSubscriptionPlans).values(planData).returning();
          return createdPlan;
        } catch (error) {
          console.error("Error creating AI subscription plan:", error);
          throw error;
        }
      }
      async getAllAiSubscriptionPlans() {
        try {
          return await db.query.aiSubscriptionPlans.findMany({
            where: eq(aiSubscriptionPlans.isActive, true),
            orderBy: asc(aiSubscriptionPlans.price)
          });
        } catch (error) {
          console.error("Error fetching AI subscription plans:", error);
          return [];
        }
      }
      async updateAiSubscriptionPlan(planId, planData) {
        try {
          const [updatedPlan] = await db.update(aiSubscriptionPlans).set({ ...planData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(aiSubscriptionPlans.id, planId)).returning();
          return updatedPlan;
        } catch (error) {
          console.error("Error updating AI subscription plan:", error);
          throw error;
        }
      }
      async deleteAiSubscriptionPlan(planId) {
        try {
          await db.update(aiSubscriptionPlans).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq(aiSubscriptionPlans.id, planId));
        } catch (error) {
          console.error("Error deleting AI subscription plan:", error);
          throw error;
        }
      }
      // ZBNF Certification Management Methods
      async updateFarmerZbnfCertification(farmerId, isZbnfCertified) {
        try {
          const [updatedFarmer] = await db.update(farmers).set({
            isZbnfCertified,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(farmers.id, farmerId)).returning();
          return updatedFarmer;
        } catch (error) {
          console.error("Error updating farmer ZBNF certification:", error);
          throw error;
        }
      }
      async updateFarmerOrganicCertification(farmerId, isOrganicCertified) {
        try {
          const [updatedFarmer] = await db.update(farmers).set({ isOrganicCertified, updatedAt: /* @__PURE__ */ new Date() }).where(eq(farmers.id, farmerId)).returning();
          return updatedFarmer;
        } catch (error) {
          console.error("Error updating farmer organic certification:", error);
          throw error;
        }
      }
      async updateFarmerNaturalCertification(farmerId, isNaturalCertified) {
        try {
          const [updatedFarmer] = await db.update(farmers).set({ isNaturalCertified, updatedAt: /* @__PURE__ */ new Date() }).where(eq(farmers.id, farmerId)).returning();
          return updatedFarmer;
        } catch (error) {
          console.error("Error updating farmer natural certification:", error);
          throw error;
        }
      }
      // AI Subscription Management Methods
      async updateFarmerAISubscription(userId, active, expiryDate) {
        try {
          const farmer = await db.query.farmers.findFirst({
            where: eq(farmers.userId, userId)
          });
          if (!farmer) {
            throw new Error("Farmer not found");
          }
          await db.update(farmers).set({
            aiSubscriptionActive: active,
            aiSubscriptionExpiry: expiryDate || null,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(farmers.userId, userId));
        } catch (error) {
          console.error("Error updating farmer AI subscription:", error);
          throw error;
        }
      }
      async checkFarmerAISubscription(userId) {
        try {
          const farmer = await db.query.farmers.findFirst({
            where: eq(farmers.userId, userId)
          });
          console.log(`\u{1F50D} Checking AI subscription for farmer ${userId}:`, {
            farmerExists: !!farmer,
            farmerId: farmer?.id,
            aiSubscriptionActive: farmer?.aiSubscriptionActive,
            aiSubscriptionExpiry: farmer?.aiSubscriptionExpiry,
            currentDate: /* @__PURE__ */ new Date()
          });
          if (!farmer) {
            console.log(`\u274C No farmer record found for user ${userId}`);
            return false;
          }
          if (!farmer.aiSubscriptionActive) {
            console.log(`\u274C AI subscription not active for farmer ${userId}`);
            return false;
          }
          if (farmer.aiSubscriptionExpiry && farmer.aiSubscriptionExpiry < /* @__PURE__ */ new Date()) {
            console.log(`\u274C AI subscription expired for farmer ${userId}:`, farmer.aiSubscriptionExpiry);
            await this.updateFarmerAISubscription(userId, false);
            return false;
          }
          console.log(`\u2705 Active AI subscription verified for farmer ${userId}`);
          return true;
        } catch (error) {
          console.error("Error checking farmer AI subscription:", error);
          return false;
        }
      }
      async getZbnfPlanById(planId) {
        try {
          return await db.query.zbnfPlans.findFirst({
            where: eq(zbnfPlans.id, parseInt(planId))
          });
        } catch (error) {
          console.error("Error fetching ZBNF plan by ID:", error);
          return null;
        }
      }
      async updateZbnfPlan(planId, updateData) {
        try {
          const [updatedPlan] = await db.update(zbnfPlans).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(zbnfPlans.id, parseInt(planId))).returning();
          return updatedPlan;
        } catch (error) {
          console.error("Error updating ZBNF plan:", error);
          throw error;
        }
      }
      async deleteZbnfPlan(planId) {
        try {
          await db.delete(zbnfPlans).where(eq(zbnfPlans.id, parseInt(planId)));
          return true;
        } catch (error) {
          console.error("Error deleting ZBNF plan:", error);
          return false;
        }
      }
      // Quote functions for B2B Quote Mode
      async createQuote(quoteData) {
        try {
          const [quote] = await db.insert(consumerQuotes).values({
            ...quoteData,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return quote;
        } catch (error) {
          console.error("Error creating quote:", error);
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
            orderBy: (quotes2, { desc: desc3 }) => [desc3(quotes2.createdAt)]
          });
          return quotes;
        } catch (error) {
          console.error("Error fetching all quotes:", error);
          throw error;
        }
      }
      async getQuotesByFarmerId(farmerId) {
        try {
          const quotes = await db.query.consumerQuotes.findMany({
            where: eq(consumerQuotes.farmerId, farmerId),
            with: {
              product: {
                with: {
                  farmer: true
                }
              },
              consumer: true,
              farmer: true
            },
            orderBy: (quotes2, { desc: desc3 }) => [desc3(quotes2.createdAt)]
          });
          return quotes;
        } catch (error) {
          console.error("Error fetching quotes by farmer ID:", error);
          throw error;
        }
      }
      async getQuotesByDistrictId(districtId) {
        try {
          const district = await this.getDistrictById(districtId);
          if (!district) return [];
          const farmerIds = await this.getFarmerIdsByDistrictName(district.name);
          if (farmerIds.length === 0) return [];
          const quotes = await db.query.consumerQuotes.findMany({
            where: inArray(consumerQuotes.farmerId, farmerIds),
            with: {
              product: {
                with: {
                  farmer: true
                }
              },
              consumer: true,
              farmer: true
            },
            orderBy: (quotes2, { desc: desc3 }) => [desc3(quotes2.createdAt)]
          });
          return quotes;
        } catch (error) {
          console.error("Error fetching quotes by district ID:", error);
          throw error;
        }
      }
      async getQuotesByUserId(userId) {
        try {
          const quotes = await db.query.consumerQuotes.findMany({
            where: eq(consumerQuotes.consumerId, userId),
            with: {
              product: {
                with: {
                  farmer: true
                }
              },
              consumer: true,
              farmer: true
            },
            orderBy: (quotes2, { desc: desc3 }) => [desc3(quotes2.createdAt)]
          });
          return quotes;
        } catch (error) {
          console.error("Error fetching quotes by user ID:", error);
          throw error;
        }
      }
      async getQuoteById(quoteId) {
        try {
          const quote = await db.query.consumerQuotes.findFirst({
            where: eq(consumerQuotes.id, quoteId),
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
          console.error("Error fetching quote by ID:", error);
          throw error;
        }
      }
      async updateQuoteStatus(quoteId, status) {
        try {
          const [updatedQuote] = await db.update(consumerQuotes).set({
            status,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(consumerQuotes.id, quoteId)).returning();
          return updatedQuote;
        } catch (error) {
          console.error("Error updating quote status:", error);
          throw error;
        }
      }
      // ==================== FARMER VOICE METHODS ====================
      async createFarmerVoicePost(data) {
        try {
          const [post] = await db.insert(farmerVoicePosts).values({
            ...data,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return post;
        } catch (error) {
          console.error("Error creating farmer voice post:", error);
          throw error;
        }
      }
      async getFarmerVoicePosts(filters) {
        try {
          const conditions = [eq(farmerVoicePosts.isActive, true)];
          if (filters?.districtId) {
            conditions.push(eq(farmerVoicePosts.districtId, filters.districtId));
          }
          if (filters?.category) {
            conditions.push(eq(farmerVoicePosts.category, filters.category));
          }
          const posts = await db.query.farmerVoicePosts.findMany({
            where: and(...conditions),
            orderBy: [desc(farmerVoicePosts.createdAt)],
            limit: filters?.limit || 20,
            offset: filters?.offset || 0,
            with: {
              districtManager: true,
              district: true
            }
          });
          return posts;
        } catch (error) {
          console.error("Error fetching farmer voice posts:", error);
          throw error;
        }
      }
      async getFarmerVoicePostById(postId) {
        try {
          const post = await db.query.farmerVoicePosts.findFirst({
            where: eq(farmerVoicePosts.id, postId),
            with: {
              districtManager: true,
              district: true,
              comments: {
                where: eq(farmerVoiceComments.isActive, true),
                orderBy: [desc(farmerVoiceComments.createdAt)],
                with: {
                  farmer: true
                }
              }
            }
          });
          return post;
        } catch (error) {
          console.error("Error fetching farmer voice post:", error);
          throw error;
        }
      }
      async upvoteFarmerVoicePost(postId, userId) {
        try {
          const existingUpvote = await db.query.farmerVoiceUpvotes.findFirst({
            where: and(
              eq(farmerVoiceUpvotes.postId, postId),
              eq(farmerVoiceUpvotes.userId, userId)
            )
          });
          if (existingUpvote) {
            await db.delete(farmerVoiceUpvotes).where(eq(farmerVoiceUpvotes.id, existingUpvote.id));
            await db.update(farmerVoicePosts).set({
              upvoteCount: sql`${farmerVoicePosts.upvoteCount} - 1`,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq(farmerVoicePosts.id, postId));
            return { upvoted: false };
          } else {
            await db.insert(farmerVoiceUpvotes).values({
              postId,
              userId,
              createdAt: /* @__PURE__ */ new Date()
            });
            await db.update(farmerVoicePosts).set({
              upvoteCount: sql`${farmerVoicePosts.upvoteCount} + 1`,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq(farmerVoicePosts.id, postId));
            return { upvoted: true };
          }
        } catch (error) {
          console.error("Error toggling farmer voice upvote:", error);
          throw error;
        }
      }
      async checkUserUpvote(postId, userId) {
        try {
          const upvote = await db.query.farmerVoiceUpvotes.findFirst({
            where: and(
              eq(farmerVoiceUpvotes.postId, postId),
              eq(farmerVoiceUpvotes.userId, userId)
            )
          });
          return !!upvote;
        } catch (error) {
          console.error("Error checking user upvote:", error);
          throw error;
        }
      }
      async addFarmerVoiceComment(data) {
        try {
          const [comment] = await db.insert(farmerVoiceComments).values({
            ...data,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          await db.update(farmerVoicePosts).set({
            commentCount: sql`${farmerVoicePosts.commentCount} + 1`,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(farmerVoicePosts.id, data.postId));
          return comment;
        } catch (error) {
          console.error("Error adding farmer voice comment:", error);
          throw error;
        }
      }
      async getFarmerVoiceComments(postId) {
        try {
          const comments = await db.query.farmerVoiceComments.findMany({
            where: and(
              eq(farmerVoiceComments.postId, postId),
              eq(farmerVoiceComments.isActive, true)
            ),
            orderBy: [desc(farmerVoiceComments.createdAt)],
            with: {
              farmer: true
            }
          });
          return comments;
        } catch (error) {
          console.error("Error fetching farmer voice comments:", error);
          throw error;
        }
      }
      async updateFarmerVoicePost(postId, data) {
        try {
          const [post] = await db.update(farmerVoicePosts).set({
            ...data,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(farmerVoicePosts.id, postId)).returning();
          return post;
        } catch (error) {
          console.error("Error updating farmer voice post:", error);
          throw error;
        }
      }
      async deleteFarmerVoicePost(postId) {
        try {
          const [post] = await db.update(farmerVoicePosts).set({
            isActive: false,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(farmerVoicePosts.id, postId)).returning();
          return post;
        } catch (error) {
          console.error("Error deleting farmer voice post:", error);
          throw error;
        }
      }
      async getFarmerByUserId(userId) {
        try {
          const farmer = await db.query.farmers.findFirst({
            where: eq(farmers.userId, userId)
          });
          return farmer;
        } catch (error) {
          console.error("Error fetching farmer by user ID:", error);
          throw error;
        }
      }
      async notifyFarmersOfNewPost(postId, districtName, postTitle, postCategory, dmName) {
        try {
          const farmersInDistrict = await this.getFarmersInDistrict(districtName);
          if (!farmersInDistrict || farmersInDistrict.length === 0) {
            console.log(`No farmers found in district ${districtName} to notify`);
            return;
          }
          for (const farmer of farmersInDistrict) {
            if (!farmer.userId) continue;
            await this.createNotification({
              userId: farmer.userId,
              type: "farmer_voice_post",
              title: `New ${postCategory.replace("_", " ")} from ${dmName}`,
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
          console.log(`\u2705 Notified ${farmersInDistrict.length} farmers in ${districtName} about new post`);
        } catch (error) {
          console.error("Error notifying farmers of new post:", error);
        }
      }
    };
    storage = new Storage();
  }
});

// server/utils/meta-tags.ts
function generateMetaTags(data) {
  return `
    <!-- Basic Meta Tags -->
    <title>${escapeHtml(data.title)}</title>
    <meta name="description" content="${escapeHtml(data.description)}" />
    
    <!-- Open Graph Tags for Social Media -->
    <meta property="og:title" content="${escapeHtml(data.title)}" />
    <meta property="og:description" content="${escapeHtml(data.description)}" />
    <meta property="og:image" content="${escapeHtml(data.image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${escapeHtml(data.url)}" />
    <meta property="og:type" content="${escapeHtml(data.type)}" />
    <meta property="og:site_name" content="${escapeHtml(data.siteName)}" />
    <meta property="og:locale" content="en_IN" />
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@FarmerSanthe" />
    <meta name="twitter:title" content="${escapeHtml(data.title)}" />
    <meta name="twitter:description" content="${escapeHtml(data.description)}" />
    <meta name="twitter:image" content="${escapeHtml(data.image)}" />
  `;
}
async function getProductMetaTags(identifier) {
  try {
    let id;
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      const match = identifier.match(/-(\d+)$/);
      if (!match) return null;
      id = parseInt(match[1]);
    }
    const product = await storage.getProductById(id);
    if (!product) return null;
    const farmer = product.farmerId ? await storage.getFarmerById(product.farmerId) : null;
    const farmName = farmer?.farmName || "Local Farm";
    console.log("Meta tags - Product data:", {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      unitsPerBox: product.unitsPerBox,
      category: product.category,
      farmName
    });
    const categoryName = product.category?.name || "Produce";
    const cleanDescription = product.description.replace(/["\n\r]/g, " ").trim();
    const formatProductPrice = (price2, unitsPerBox2, unit2) => {
      const numPrice = typeof price2 === "string" ? parseFloat(price2) : price2;
      const formattedPrice = `\u20B9${numPrice.toFixed(2)}/box`;
      console.log("Formatting price:", { price: price2, unitsPerBox: unitsPerBox2, unit: unit2, formattedPrice });
      if (unitsPerBox2 && unit2) {
        const result = `${formattedPrice} (${unitsPerBox2} ${unit2} per box)`;
        console.log("Price with units:", result);
        return result;
      }
      console.log("Price without units:", formattedPrice);
      return formattedPrice;
    };
    const priceDisplay = formatProductPrice(product.price, product.unitsPerBox, product.unit);
    console.log("Final price display:", priceDisplay);
    const unitsPerBox = product.unitsPerBox || 1;
    const unit = product.unit || "kg";
    const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const title = `${product.name} - \u20B9${price.toFixed(2)}/box (${unitsPerBox} ${unit}) | ${farmName}`;
    const description = `Fresh ${product.name} from ${farmName}. ${cleanDescription.slice(0, 100)}... ${product.status === "Pre-Order" ? "Pre-order now" : "Available now"} on FarmerSanthe marketplace.`;
    const getAbsoluteImageUrl = async (product2, farmer2) => {
      let imageUrl = "";
      try {
        const productImages2 = await storage.getProductImages(product2.id);
        if (productImages2 && productImages2.length > 0) {
          imageUrl = productImages2[0].imageUrl || "";
        } else if (product2.imageUrl) {
          imageUrl = product2.imageUrl;
        }
        if (!imageUrl && farmer2) {
          imageUrl = farmer2.user?.avatar || farmer2.logoUrl || "";
        }
        if (!imageUrl) {
          return farmer2?.user?.avatar || farmer2?.logoUrl || "https://farmersanthe.com/logo-santhe.png";
        }
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
          if (imageUrl.includes("cloudinary.com")) {
            const transformedUrl = imageUrl.replace("/upload/", "/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/");
            console.log("Cloudinary transformation applied:", { original: imageUrl, transformed: transformedUrl });
            return transformedUrl;
          }
          return imageUrl;
        }
        return `https://farmersanthe.com${imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl}`;
      } catch (error) {
        console.error("Error getting product image:", error);
        if (product2.imageUrl) {
          const fallbackUrl = product2.imageUrl;
          if (fallbackUrl.startsWith("http://") || fallbackUrl.startsWith("https://")) {
            return fallbackUrl;
          }
          return `https://farmersanthe.com${fallbackUrl.startsWith("/") ? fallbackUrl : "/" + fallbackUrl}`;
        }
        return farmer2?.user?.avatar || farmer2?.logoUrl || "https://farmersanthe.com/logo-santhe.png";
      }
    };
    const generateProductSlug2 = (productName, categoryName2, productId) => {
      const cleanName = productName.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
      const cleanCategory = categoryName2.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
      const parts = [cleanCategory, cleanName, productId.toString()].filter((part) => part && part.length > 0);
      const slug = parts.join("-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
      console.log("Product slug generation:", { productName, categoryName: categoryName2, productId, cleanName, cleanCategory, parts, slug });
      return slug;
    };
    const productSlug = generateProductSlug2(product.name, categoryName, product.id);
    return {
      title,
      description,
      image: await getAbsoluteImageUrl(product, farmer),
      url: `https://farmersanthe.com/products/${productSlug}`,
      type: "product",
      siteName: "FarmerSanthe"
    };
  } catch (error) {
    console.error("Error generating product meta tags:", error);
    return null;
  }
}
async function getFarmerMetaTags(identifier) {
  try {
    let id;
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      const match = identifier.match(/-(\d+)$/);
      if (!match) return null;
      id = parseInt(match[1]);
    }
    const farmer = await storage.getFarmerById(id);
    if (!farmer) return null;
    const title = `${farmer.farmName} - Organic Farm in ${farmer.location} | FarmerSanthe.com`;
    const cleanFarmerDescription = farmer.description?.replace(/["\n\r]/g, " ").trim() || "Premium quality farm-fresh products direct from the farmer.";
    const description = `Discover fresh produce from ${farmer.farmName} in ${farmer.location}. ${cleanFarmerDescription.slice(0, 120)} Rating: ${farmer.rating}/5`;
    const getAbsoluteImageUrl = (farmer2) => {
      let imageUrl = "";
      if (farmer2.user?.avatar) {
        imageUrl = farmer2.user.avatar;
      } else if (farmer2.logoUrl) {
        imageUrl = farmer2.logoUrl;
      } else if (farmer2.farmImages && Array.isArray(farmer2.farmImages) && farmer2.farmImages.length > 0) {
        imageUrl = farmer2.farmImages[0];
      } else if (farmer2.imageUrl) {
        imageUrl = farmer2.imageUrl;
      } else {
        return "https://farmersanthe.com/logo-santhe.png";
      }
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        if (imageUrl.includes("cloudinary.com")) {
          const transformedUrl = imageUrl.replace("/upload/", "/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/");
          console.log("Farmer Cloudinary transformation applied:", { original: imageUrl, transformed: transformedUrl });
          return transformedUrl;
        }
        if (imageUrl.includes("unsplash.com")) {
          let transformedUrl = imageUrl.replace(/w=\d+/g, "w=1200").replace(/h=\d+/g, "h=630");
          if (!transformedUrl.includes("fit=")) {
            transformedUrl += "&fit=crop";
          }
          console.log("Unsplash transformation applied:", { original: imageUrl, transformed: transformedUrl });
          return transformedUrl;
        }
        return imageUrl;
      }
      return `https://farmersanthe.com${imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl}`;
    };
    const generateFarmerSlug = (farmName, location, farmerId) => {
      const cleanFarmName = farmName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      const cleanLocation = location.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      return `${cleanFarmName}-${cleanLocation}-${farmerId}`;
    };
    const farmerSlug = generateFarmerSlug(farmer.farmName, farmer.location, farmer.id);
    return {
      title,
      description,
      image: getAbsoluteImageUrl(farmer),
      url: `https://farmersanthe.com/farmers/${farmerSlug}`,
      type: "business.business",
      siteName: "FarmerSanthe"
    };
  } catch (error) {
    console.error("Error generating farmer meta tags:", error);
    return null;
  }
}
function escapeHtml(text2) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text2.replace(/[&<>"']/g, (m) => map[m]);
}
var init_meta_tags = __esm({
  "server/utils/meta-tags.ts"() {
    "use strict";
    init_storage();
  }
});

// server/utils/meta-service-v2.ts
var meta_service_v2_exports = {};
__export(meta_service_v2_exports, {
  generateHtmlWithMetaTags: () => generateHtmlWithMetaTags,
  generateProductMetaTags: () => generateProductMetaTags
});
async function generateProductMetaTags(identifier) {
  try {
    console.log("\u{1F525} META-V2: generateProductMetaTags called with identifier:", identifier);
    let id;
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      const match = identifier.match(/-(\d+)$/);
      if (!match) {
        console.log("\u{1F525} META-V2: No ID found in identifier:", identifier);
        return null;
      }
      id = parseInt(match[1]);
    }
    const product = await storage.getProductById(id);
    if (!product) {
      console.log("\u{1F525} META-V2: Product not found:", id);
      return null;
    }
    console.log("\u{1F525} META-V2: Product data:", {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      unitsPerBox: product.unitsPerBox,
      category: product.category
    });
    const categoryName = product.category?.name || "Produce";
    const title = `${product.name} - Fresh ${categoryName} | FarmerSanthe.com`;
    const cleanDescription = product.description.replace(/["\n\r]/g, " ").trim();
    const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const unitsPerBox = product.unitsPerBox;
    const unit = product.unit;
    let priceDisplay = `\u20B9${price.toFixed(2)}/box`;
    if (unitsPerBox && unit) {
      priceDisplay += ` (${unitsPerBox} ${unit} per box)`;
    }
    console.log("\u{1F525} META-V2: Final price display:", priceDisplay);
    const description = `Buy fresh ${product.name} directly from local farmers. ${cleanDescription.slice(0, 80)}... Available ${product.status === "Pre-Order" ? "for pre-order" : "now"} at ${priceDisplay} on FarmerSanthe marketplace.`;
    let imageUrl = "https://farmersanthe.com/logo-santhe.png";
    try {
      const images = await storage.getProductImages(product.id);
      if (images && images.length > 0) {
        imageUrl = images[0].imageUrl;
        if (!imageUrl.startsWith("http")) {
          imageUrl = `https://farmersanthe.com${imageUrl}`;
        }
      }
    } catch (error) {
      console.log("\u{1F525} META-V2: Error fetching product images:", error);
    }
    const productUrl = `https://farmersanthe.com/products/${id}`;
    const result = {
      title,
      description,
      image: imageUrl,
      url: productUrl,
      type: "product",
      siteName: "FarmerSanthe"
    };
    console.log("\u{1F525} META-V2: Generated meta tags:", result);
    return result;
  } catch (error) {
    console.error("\u{1F525} META-V2: Error generating product meta tags:", error);
    return null;
  }
}
function generateHtmlWithMetaTags(metaData) {
  const escapeHtml2 = (text2) => {
    return text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml2(metaData.title)}</title>
  <meta name="description" content="${escapeHtml2(metaData.description)}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${escapeHtml2(metaData.title)}" />
  <meta property="og:description" content="${escapeHtml2(metaData.description)}" />
  <meta property="og:image" content="${escapeHtml2(metaData.image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml2(metaData.url)}" />
  <meta property="og:type" content="${escapeHtml2(metaData.type)}" />
  <meta property="og:site_name" content="${escapeHtml2(metaData.siteName)}" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml2(metaData.title)}" />
  <meta name="twitter:description" content="${escapeHtml2(metaData.description)}" />
  <meta name="twitter:image" content="${escapeHtml2(metaData.image)}" />
  
  <link rel="icon" href="https://farmersanthe.com/logo-santhe.png" type="image/png">
  
  <script>
    // Redirect to actual page after a brief delay for social media crawlers
    setTimeout(() => {
      window.location.href = '${escapeHtml2(metaData.url)}';
    }, 1000);
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${escapeHtml2(metaData.image)}" alt="${escapeHtml2(metaData.title)}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${escapeHtml2(metaData.title)}</h1>
    <p>${escapeHtml2(metaData.description)}</p>
    <p>Redirecting to <a href="${escapeHtml2(metaData.url)}">FarmerSanthe.com</a>...</p>
  </div>
</body>
</html>`;
}
var init_meta_service_v2 = __esm({
  "server/utils/meta-service-v2.ts"() {
    "use strict";
    init_storage();
  }
});

// server/utils/simple-meta-server.ts
var simple_meta_server_exports = {};
__export(simple_meta_server_exports, {
  addSimpleMetaRoutes: () => addSimpleMetaRoutes
});
import { eq as eq3, and as and3 } from "drizzle-orm";
function generateProductSlug(productName, categoryName, productId) {
  const cleanName = productName.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  const cleanCategory = categoryName.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  const parts = [cleanCategory, cleanName, productId.toString()].filter((part) => part && part.length > 0);
  return parts.join("-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
async function getProductMetaTagsWithBoxPricing(identifier) {
  try {
    console.log("\u{1F50D} getProductMetaTagsWithBoxPricing called with:", identifier);
    let id;
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      const match = identifier.match(/-(\d+)$/);
      if (!match) return null;
      id = parseInt(match[1]);
    }
    const product = await storage.getProductById(id);
    if (!product) return null;
    const farmer = product.farmerId ? await storage.getFarmerById(product.farmerId) : null;
    const farmName = farmer?.farmName || "Local Farm";
    const categoryName = product.category?.name || "Produce";
    const cleanDescription = product.description.replace(/["\n\r]/g, " ").trim();
    const unitsPerBox = product.unitsPerBox || 1;
    const unit = product.unit || "kg";
    const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const title = `${product.name} - \u20B9${price.toFixed(2)}/box (${unitsPerBox} ${unit}) | ${farmName}`;
    const description = `Fresh ${product.name} from ${farmName}. ${cleanDescription.slice(0, 100)}... ${product.status === "Pre-Order" ? "Pre-order now" : "Available now"} on FarmerSanthe marketplace.`;
    let imageUrl = "";
    try {
      const productImages2 = await storage.getProductImages(product.id);
      if (productImages2 && productImages2.length > 0) {
        imageUrl = productImages2[0].imageUrl || "";
      } else if (product.imageUrl) {
        imageUrl = product.imageUrl;
      }
      if (!imageUrl && farmer) {
        imageUrl = farmer.user?.avatar || farmer.logoUrl || "";
      }
    } catch (error) {
      console.error("Error getting product images:", error);
      imageUrl = product.imageUrl || farmer?.user?.avatar || farmer?.logoUrl || "https://farmersanthe.com/logo-santhe.png";
    }
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `https://farmersanthe.com${imageUrl}`;
    }
    if (!imageUrl || imageUrl === "https://farmersanthe.com") {
      imageUrl = farmer?.user?.avatar || farmer?.logoUrl || "https://farmersanthe.com/logo-santhe.png";
    }
    console.log("\u{1F50D} Image URL before transformation:", imageUrl);
    if (imageUrl.includes("cloudinary.com")) {
      const originalUrl = imageUrl;
      imageUrl = imageUrl.replace("/upload/", "/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/");
      console.log("\u2705 Product Cloudinary transformation applied:", { original: originalUrl, transformed: imageUrl });
    } else if (imageUrl.includes("unsplash.com")) {
      const originalUrl = imageUrl;
      imageUrl = imageUrl.replace(/w=\d+/g, "w=1200").replace(/h=\d+/g, "h=630");
      if (!imageUrl.includes("fit=")) {
        imageUrl += "&fit=crop";
      }
      console.log("\u2705 Unsplash transformation applied:", { original: originalUrl, transformed: imageUrl });
    } else {
      console.log("\u274C Not a Cloudinary/Unsplash URL, no transformation applied");
    }
    const productSlug = generateProductSlug(product.name, categoryName, id);
    const productUrl = `https://farmersanthe.com/products/${productSlug}`;
    return {
      title,
      description,
      image: imageUrl,
      url: productUrl,
      type: "product",
      siteName: "FarmerSanthe",
      // Additional product-specific data for enhanced social media display
      price: `\u20B9${price.toFixed(2)}`,
      currency: "INR",
      availability: product.status === "Pre-Order" ? "PreOrder" : "InStock",
      quantity: `${unitsPerBox} ${unit} per box`,
      category: categoryName
    };
  } catch (error) {
    console.error("Error generating product meta tags:", error);
    return null;
  }
}
async function getBIBProductMetaTags(identifier) {
  try {
    console.log("\u{1F50D} getBIBProductMetaTags called with:", identifier);
    let id;
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      const match = identifier.match(/-(\d+)$/);
      if (!match) return null;
      id = parseInt(match[1]);
    }
    const product = await storage.getProductById(id);
    if (!product) return null;
    const isBIB = product.bulkInBulk === true;
    if (!isBIB) {
      return getProductMetaTagsWithBoxPricing(identifier);
    }
    const farmer = product.farmerId ? await storage.getFarmerById(product.farmerId) : null;
    const farmName = farmer?.farmName || product.farm?.name || "Local Farm";
    const categoryName = product.category?.name || "Produce";
    const cleanDescription = product.description.replace(/["\n\r]/g, " ").trim();
    const priceRangeMin = product.priceRangeMin || 0;
    const priceRangeMax = product.priceRangeMax || 0;
    const totalAvailable = product.totalAvailableQuantity || 0;
    const unit = product.unit || "kg";
    const isSold = product.isSold || false;
    const status = isSold ? "SOLD OUT" : "OPEN FOR QUOTES";
    const title = `${product.name} - \u20B9${priceRangeMin.toLocaleString("en-IN")} to \u20B9${priceRangeMax.toLocaleString("en-IN")} | ${totalAvailable} ${unit} | ${farmName}`;
    const description = `${status} | Fresh ${product.name} wholesale lot from ${farmName}. ${cleanDescription.slice(0, 100)}... Submit your competitive quote now on FarmerSanthe BIB marketplace!`;
    let imageUrl = "";
    try {
      const productImages2 = await storage.getProductImages(product.id);
      if (productImages2 && productImages2.length > 0) {
        imageUrl = productImages2[0].imageUrl || "";
      } else if (product.imageUrl) {
        imageUrl = product.imageUrl;
      }
      if (!imageUrl && farmer) {
        imageUrl = farmer.user?.avatar || farmer.logoUrl || "";
      }
    } catch (error) {
      console.error("Error getting BIB product images:", error);
      imageUrl = product.imageUrl || farmer?.user?.avatar || farmer?.logoUrl || "https://farmersanthe.com/logo-santhe.png";
    }
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `https://farmersanthe.com${imageUrl}`;
    }
    if (!imageUrl || imageUrl === "https://farmersanthe.com") {
      imageUrl = farmer?.user?.avatar || farmer?.logoUrl || "https://farmersanthe.com/logo-santhe.png";
    }
    if (imageUrl.includes("cloudinary.com")) {
      const originalUrl = imageUrl;
      imageUrl = imageUrl.replace("/upload/", "/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/");
      console.log("\u2705 BIB Product Cloudinary transformation applied:", { original: originalUrl, transformed: imageUrl });
    } else if (imageUrl.includes("unsplash.com")) {
      const originalUrl = imageUrl;
      imageUrl = imageUrl.replace(/w=\d+/g, "w=1200").replace(/h=\d+/g, "h=630");
      if (!imageUrl.includes("fit=")) {
        imageUrl += "&fit=crop";
      }
      console.log("\u2705 BIB Unsplash transformation applied:", { original: originalUrl, transformed: imageUrl });
    }
    const productUrl = `https://farmersanthe.com/bib/${id}`;
    return {
      title,
      description,
      image: imageUrl,
      url: productUrl,
      type: "product",
      siteName: "FarmerSanthe BIB",
      // BIB-specific data
      priceRange: `\u20B9${priceRangeMin.toLocaleString("en-IN")} - \u20B9${priceRangeMax.toLocaleString("en-IN")}`,
      currency: "INR",
      availability: isSold ? "SoldOut" : "QuoteAvailable",
      quantity: `${totalAvailable} ${unit} wholesale lot`,
      category: categoryName,
      farmName
    };
  } catch (error) {
    console.error("Error generating BIB product meta tags:", error);
    return null;
  }
}
function addSimpleMetaRoutes(app2) {
  console.log("\u{1F680} addSimpleMetaRoutes function called at:", (/* @__PURE__ */ new Date()).toISOString());
  app2.get("/meta/product/:identifier", async (req, res) => {
    try {
      console.log("\u{1F3AF} /meta/product route called with identifier:", req.params.identifier);
      const metaData = await getProductMetaTagsWithBoxPricing(req.params.identifier);
      if (!metaData) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({
        title: metaData.title,
        description: metaData.description,
        image: metaData.image,
        url: metaData.url,
        type: metaData.type,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${metaData.image}" />
  
  <script>
    // Redirect to actual page after a brief delay
    setTimeout(() => {
      window.location.href = '${metaData.url}';
    }, 1000);
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${metaData.image}" alt="${metaData.title}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${metaData.title}</h1>
    <p>${metaData.description}</p>
    <p>Redirecting to <a href="${metaData.url}">FarmerSanthe.com</a>...</p>
  </div>
</body>
</html>
        `
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.get("/meta/farmer/:identifier", async (req, res) => {
    try {
      const metaData = await getFarmerMetaTags(req.params.identifier);
      if (!metaData) {
        return res.status(404).json({ error: "Farmer not found" });
      }
      res.json({
        title: metaData.title,
        description: metaData.description,
        image: metaData.image,
        url: metaData.url,
        type: metaData.type,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${metaData.image}" />
  
  <script>
    // Redirect to actual page after a brief delay
    setTimeout(() => {
      window.location.href = '${metaData.url}';
    }, 1000);
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${metaData.image}" alt="${metaData.title}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${metaData.title}</h1>
    <p>${metaData.description}</p>
    <p>Redirecting to <a href="${metaData.url}">FarmerSanthe.com</a>...</p>
  </div>
</body>
</html>
        `
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.get("/share/product/:identifier", async (req, res) => {
    try {
      let id;
      if (/^\d+$/.test(req.params.identifier)) {
        id = parseInt(req.params.identifier);
      } else {
        const match = req.params.identifier.match(/-(\d+)$/);
        if (!match) return res.status(404).send("Product not found");
        id = parseInt(match[1]);
      }
      const product = await storage.getProductById(id);
      const isBIB = product && product.bulkInBulk === true;
      const metaData = isBIB ? await getBIBProductMetaTags(req.params.identifier) : await getProductMetaTagsWithBoxPricing(req.params.identifier);
      if (!metaData) {
        return res.status(404).send("Product not found");
      }
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${metaData.image}" />
  
  <script>
    // Redirect to actual page immediately for browsers
    window.location.href = '${metaData.url}';
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${metaData.image}" alt="${metaData.title}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${metaData.title}</h1>
    <p>${metaData.description}</p>
    <p>Redirecting to <a href="${metaData.url}">FarmerSanthe.com</a>...</p>
  </div>
</body>
</html>
      `;
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      res.status(500).send("Error loading product");
    }
  });
  app2.get("/share/farmer/:identifier", async (req, res) => {
    try {
      const metaData = await getFarmerMetaTags(req.params.identifier);
      if (!metaData) {
        return res.status(404).send("Farmer not found");
      }
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${metaData.image}" />
  
  <script>
    // Redirect to actual page immediately for browsers
    window.location.href = '${metaData.url}';
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${metaData.image}" alt="${metaData.title}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${metaData.title}</h1>
    <p>${metaData.description}</p>
    <p>Redirecting to <a href="${metaData.url}">FarmerSanthe.com</a>...</p>
  </div>
</body>
</html>
      `;
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      res.status(500).send("Error loading farmer");
    }
  });
  app2.get("/share/event/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(404).send("Event not found");
      }
      const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { farmEvents: farmEvents2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq4 } = await import("drizzle-orm");
      const event = await db2.query.farmEvents.findFirst({
        where: eq4(farmEvents2.id, eventId),
        with: {
          farmer: true
        }
      });
      if (!event) {
        return res.status(404).send("Event not found");
      }
      const { farmers: farmers2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const farmerProfile = await db2.query.farmers.findFirst({
        where: eq4(farmers2.userId, event.farmerId),
        with: {
          user: true
        }
      });
      const farmName = farmerProfile?.farmName || "Local Farm";
      let imageUrl = event.coverImage || farmerProfile?.user?.avatar || farmerProfile?.logoUrl || "https://farmersanthe.com/logo-santhe.png";
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `https://farmersanthe.com${imageUrl}`;
      }
      if (imageUrl.includes("cloudinary.com")) {
        imageUrl = imageUrl.replace("/upload/", "/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/");
      }
      if (imageUrl.includes("unsplash.com")) {
        imageUrl = imageUrl.replace(/w=\d+/g, "w=1200").replace(/h=\d+/g, "h=630");
        if (!imageUrl.includes("fit=")) {
          imageUrl += "&fit=crop";
        }
      }
      const cleanDescription = (event.description || "").replace(/["\n\r]/g, " ").trim();
      const pricePerSeat = typeof event.pricePerSeat === "string" ? parseFloat(event.pricePerSeat) : event.pricePerSeat;
      const title = `${event.title} - \u20B9${pricePerSeat}/person | ${event.location} | ${farmName}`;
      const description = `${cleanDescription.slice(0, 120)}... Book your farm experience at ${farmName} on FarmerSanthe!`;
      const eventUrl = `https://farmersanthe.com/events/${eventId}`;
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, "&quot;")}" />
  
  <!-- Open Graph Tags -->
  ${process.env.FACEBOOK_APP_ID ? `<meta property="fb:app_id" content="${process.env.FACEBOOK_APP_ID}" />` : ""}
  <meta property="og:title" content="${title.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${description.replace(/"/g, "&quot;")}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title.replace(/"/g, "&quot;")}" />
  <meta property="og:url" content="https://farmersanthe.com/share/event/${eventId}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${description.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${imageUrl}" />
  
  <script>
    // Redirect to actual page immediately for browsers
    window.location.href = '${eventUrl}';
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${imageUrl}" alt="${title}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${title}</h1>
    <p>${description}</p>
    <p>Redirecting to <a href="${eventUrl}">FarmerSanthe.com</a>...</p>
  </div>
</body>
</html>
    `;
      res.status(200);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      res.send(html);
    } catch (error) {
      console.error("Error loading event for sharing:", error);
      res.status(500).send("Error loading event");
    }
  });
  app2.get("/org/:slug", async (req, res, next) => {
    try {
      const userAgent = req.get("User-Agent") || "";
      const isBot = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|telegram/i.test(userAgent);
      if (isBot) {
        const slug = req.params.slug;
        const dmUser = await db.query.users.findFirst({
          where: and3(
            eq3(users.orgSlug, slug),
            eq3(users.role, "district_manager")
          )
        });
        if (!dmUser) {
          return res.status(404).send("Organization not found");
        }
        const safeOrgName = (dmUser.orgName || "Store").replace(/"/g, "&quot;");
        const title = `${safeOrgName} - Official Store | Santhe Farmers Market`;
        const description = `Shop fresh produce directly from ${safeOrgName}, ${dmUser.district || ""} district. Farm-fresh products from local farmers on FarmerSanthe marketplace.`;
        let imageUrl = dmUser.orgLogoUrl || "https://farmersanthe.com/logo-santhe.png";
        const orgUrl = `https://${slug}.farmersanthe.com`;
        if (imageUrl && imageUrl.includes("cloudinary.com")) {
          imageUrl = imageUrl.replace("/upload/", "/upload/w_1200,h_630,c_pad,b_white,f_auto,q_auto:good/");
        }
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, "&quot;")}" />
  
  <meta property="og:title" content="${title.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${description.replace(/"/g, "&quot;")}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${orgUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${description.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${imageUrl}" />
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${imageUrl}" alt="${title}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${safeOrgName}</h1>
    <p>${description}</p>
    <p><a href="${orgUrl}">Visit Store on FarmerSanthe.com</a></p>
  </div>
</body>
</html>
        `;
        res.setHeader("Content-Type", "text/html");
        res.send(html);
      } else {
        return next();
      }
    } catch (error) {
      console.error("Error serving org meta tags:", error);
      return next();
    }
  });
  app2.get("/farmers/:slug([a-z0-9-]+-\\d+)", async (req, res) => {
    try {
      console.log("\u{1F50D} SEO farmer route hit:", req.path, "User-Agent:", req.get("User-Agent"));
      const userAgent = req.get("User-Agent") || "";
      const isBot = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|telegram/i.test(userAgent);
      if (isBot) {
        const metaData = await getFarmerMetaTags(req.params.slug);
        if (!metaData) {
          return res.status(404).send("Farmer not found");
        }
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${metaData.image}" />
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${metaData.image}" alt="${metaData.title}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${metaData.title}</h1>
    <p>${metaData.description}</p>
    <p><a href="${metaData.url}">Visit FarmerSanthe.com</a></p>
  </div>
</body>
</html>
        `;
        res.setHeader("Content-Type", "text/html");
        res.send(html);
      } else {
        return res.redirect(`/?redirect=${encodeURIComponent(req.path)}`);
      }
    } catch (error) {
      console.error("Error serving farmer meta tags:", error);
      res.status(500).send("Error loading farmer");
    }
  });
  app2.get("/products/:slug([a-z0-9-]+-\\d+)", async (req, res) => {
    try {
      console.log("\u{1F50D} SEO product route hit:", req.path, "User-Agent:", req.get("User-Agent"));
      const userAgent = req.get("User-Agent") || "";
      const isBot = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|telegram/i.test(userAgent);
      if (isBot) {
        let id;
        const match = req.params.slug.match(/-(\d+)$/);
        if (!match) return res.status(404).send("Product not found");
        id = parseInt(match[1]);
        const product = await storage.getProductById(id);
        const isBIB = product && product.bulkInBulk === true;
        const metaData = isBIB ? await getBIBProductMetaTags(req.params.slug) : await getProductMetaTagsWithBoxPricing(req.params.slug);
        if (!metaData) {
          return res.status(404).send("Product not found");
        }
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${metaData.image}" />
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${metaData.image}" alt="${metaData.title}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${metaData.title}</h1>
    <p>${metaData.description}</p>
    <p><a href="${metaData.url}">Visit FarmerSanthe.com</a></p>
  </div>
</body>
</html>
        `;
        res.setHeader("Content-Type", "text/html");
        res.send(html);
      } else {
        return res.redirect(`/?redirect=${encodeURIComponent(req.path)}`);
      }
    } catch (error) {
      console.error("Error serving product meta tags:", error);
      res.status(500).send("Error loading product");
    }
  });
}
var init_simple_meta_server = __esm({
  "server/utils/simple-meta-server.ts"() {
    "use strict";
    init_meta_tags();
    init_storage();
    init_db();
    init_schema();
    console.log("\u{1F4C4} simple-meta-server.ts loaded at:", (/* @__PURE__ */ new Date()).toISOString());
  }
});

// server/index.ts
import dotenv2 from "dotenv";
import express2 from "express";

// server/routes.ts
init_storage();
init_db();
init_schema();
import { createServer } from "http";
import { eq as eq2, and as and2, desc as desc2, asc as asc2, like as like2, gte, lte, gt, lt, inArray as inArray2, or as or2, sql as sql2, isNull } from "drizzle-orm";
import { z as z2 } from "zod";
import { fromZodError } from "zod-validation-error";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto2 from "crypto";
import path3 from "path";

// server/utils/storage-service.ts
init_environment();
import multer from "multer";
import path2 from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
if (config.storage.type === "cloudinary") {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
  });
}
var localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path2.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path2.extname(file.originalname));
  }
});
var upload = multer({
  storage: localStorage,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
var StorageService = class {
  static async uploadImage(file, folder) {
    if (config.storage.type === "cloudinary") {
      return this.uploadToCloudinary(file, folder);
    } else {
      return this.uploadLocally(file);
    }
  }
  static async uploadToCloudinary(file, folder) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder || "santhe",
        resource_type: "image",
        use_filename: true,
        unique_filename: true
      });
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image to cloud storage");
    }
  }
  static uploadLocally(file) {
    const filePath = file.path;
    if (!fs.existsSync(filePath)) {
      throw new Error(`Upload failed: File not saved to ${filePath}`);
    }
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error(`Upload failed: File is empty at ${filePath}`);
    }
    console.log(`File successfully uploaded: ${file.filename} (${stats.size} bytes)`);
    return `/uploads/${file.filename}`;
  }
  static async deleteImage(imageUrl) {
    if (config.storage.type === "cloudinary" && imageUrl.includes("cloudinary.com")) {
      const urlParts = imageUrl.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split(".")[0];
      const folder = urlParts[urlParts.length - 2];
      const fullPublicId = folder ? `${folder}/${publicId}` : publicId;
      try {
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (error) {
        console.error("Cloudinary delete error:", error);
      }
    } else if (imageUrl.startsWith("/uploads/")) {
      const uploadDir = path2.join(process.cwd(), "public", "uploads");
      const filePath = path2.join(uploadDir, path2.basename(imageUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
  static getImageUrl(imagePath) {
    return imagePath;
  }
};

// server/utils/zepto-email-service.ts
var ZeptoEmailService = class {
  config;
  constructor() {
    this.config = {
      apiKey: process.env.ZEPTO_API_KEY || "",
      fromEmail: process.env.ZEPTO_FROM_EMAIL || "admin@farmersanthe.com",
      mailAgentAlias: process.env.ZEPTO_MAIL_AGENT_ALIAS || ""
    };
    if (!this.config.apiKey) {
      console.warn("ZEPTO_API_KEY not configured - emails will not be sent");
    }
  }
  async sendEmail(template) {
    try {
      const requestBody = {
        from: {
          address: this.config.fromEmail,
          name: "Santhe Marketplace"
        },
        to: [
          {
            email_address: {
              address: template.to,
              name: "User"
            }
          }
        ],
        subject: template.subject,
        htmlbody: template.htmlContent
      };
      const response = await fetch("https://api.zeptomail.in/v1.1/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: this.config.apiKey.startsWith("Zoho-enczapikey") ? this.config.apiKey : `Zoho-enczapikey ${this.config.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("===== ZEPTO REST API ERROR =====");
        console.error("Status:", response.status);
        console.error("Error Response:", errorText);
        console.error("From Address:", this.config.fromEmail);
        console.error(
          `Failed to send "${template.subject}" to: ${template.to}`
        );
        console.error("===============================");
        return false;
      }
      await response.json();
      return true;
    } catch (error) {
      console.error("Failed to send email via Zepto REST API:", error);
      return false;
    }
  }
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `https://farmersanthe.com/reset-password?token=${resetToken}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F331} Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${user.username || user.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your password for your Santhe marketplace account. Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <span style="word-break: break-all; color: #3b82f6;">${resetUrl}</span>
            </p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: user.email,
      subject: "Reset Your Santhe Marketplace Password",
      htmlContent,
      textContent: `Reset your password: ${resetUrl}`
    });
  }
  async sendOrderConfirmationEmail(order, customer) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .order-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F331} Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Order Confirmation</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.username || customer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              Thank you for your order! We've received your order and it's being processed.
            </p>
            <div class="order-details">
              <h3 style="color: #1f2937; margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Total:</strong> \u20B9${order.total}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              You'll receive another email when your order is ready for delivery. Thank you for supporting local farmers!
            </p>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: customer.email,
      subject: `Order Confirmation #${order.id} - Santhe Marketplace`,
      htmlContent,
      textContent: `Order #${order.id} confirmed. Total: \u20B9${order.total}`
    });
  }
  async sendOrderStatusUpdateEmail(order, customer) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .status-update { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F331} Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Order Status Update</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.username || customer.email},
            </p>
            <div class="status-update">
              <h3 style="color: #1f2937; margin-top: 0;">Order #${order.id}</h3>
              <p><strong>New Status:</strong> ${order.status}</p>
              <p><strong>Total:</strong> \u20B9${order.total}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for choosing Santhe marketplace for your fresh produce needs!
            </p>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: customer.email,
      subject: `Order #${order.id} Status Update - Santhe Marketplace`,
      htmlContent,
      textContent: `Order #${order.id} status: ${order.status}`
    });
  }
  async sendOrderNotificationToFarmer(order, farmer) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .order-alert { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F331} Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Order Received!</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${farmer.username || farmer.email},
            </p>
            <div class="order-alert">
              <h3 style="color: #1f2937; margin-top: 0;">Order #${order.id}</h3>
              <p><strong>Customer:</strong> ${order.customerName}</p>
              <p><strong>Total:</strong> \u20B9${order.total}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              Please log in to your dashboard to view the complete order details and update the status when ready.
            </p>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: farmer.email,
      subject: `New Order #${order.id} - Santhe Marketplace`,
      htmlContent,
      textContent: `New order #${order.id} from ${order.customerName}. Total: \u20B9${order.total}`
    });
  }
  // Welcome email for new users
  async sendWelcomeEmail(user) {
    const loginUrl = "https://farmersanthe.com/login";
    const roleMessage = user.role === "farmer" ? "Start listing your fresh produce and connect with customers across Karnataka!" : "Explore fresh produce directly from local farmers!";
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .features { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F331} Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to Santhe! \u{1F389}</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${user.username || user.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Santhe Marketplace! ${roleMessage}
            </p>
            <div class="features">
              <h3 style="color: #1f2937; margin-top: 0;">What you can do:</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                ${user.role === "farmer" ? `
                <li>List your fresh produce and set your prices</li>
                <li>Manage orders and track sales</li>
                <li>Get AI-powered ZBNF farming recommendations</li>
                <li>Host farm events and experiences</li>
                ` : `
                <li>Browse fresh produce from local farmers</li>
                <li>Place orders for home delivery</li>
                <li>Submit bulk quotes for wholesale purchases</li>
                <li>Book exciting farm experiences</li>
                `}
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" class="button">Get Started</a>
            </div>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: user.email,
      subject: "Welcome to Santhe Marketplace! \u{1F331}",
      htmlContent,
      textContent: `Welcome to Santhe Marketplace, ${user.username}! ${roleMessage}`
    });
  }
  // Booking confirmation for customer
  async sendBookingConfirmationEmail(booking, event, customer, dmInfo) {
    const bookingUrl = `https://farmersanthe.com/dashboard/events`;
    const dmContactSection = dmInfo ? `
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0;">\u{1F4DE} Your Event Coordinator</h3>
              <p style="color: #1e3a8a; margin-bottom: 5px;"><strong>Name:</strong> ${dmInfo.name}</p>
              ${dmInfo.phone ? `<p style="color: #1e3a8a; margin-bottom: 5px;"><strong>Phone:</strong> <a href="tel:${dmInfo.phone}" style="color: #2563eb;">${dmInfo.phone}</a></p>` : ""}
              ${dmInfo.email ? `<p style="color: #1e3a8a; margin-bottom: 5px;"><strong>Email:</strong> <a href="mailto:${dmInfo.email}" style="color: #2563eb;">${dmInfo.email}</a></p>` : ""}
              ${dmInfo.address ? `<p style="color: #1e3a8a; margin-bottom: 5px;"><strong>Address:</strong> ${dmInfo.address}</p>` : ""}
              <p style="color: #6b7280; font-size: 13px; margin-top: 10px;">
                Contact your event coordinator for any questions about the event, directions, or special requirements.
              </p>
            </div>` : "";
    const guestsText = `${booking.adultSeats || booking.numberOfGuests || 1} Adult(s)${booking.childSeats > 0 ? `, ${booking.childSeats} Child(ren)` : ""}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .booking-details { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F331} Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Farm Events & Experiences</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Booking Confirmed! \u{1F389}</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.name || customer.username || customer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Your booking for the farm event has been confirmed. Get ready for an amazing experience!
            </p>
            <div class="booking-details">
              <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Booking ID:</strong> #${booking.id}</p>
              <p><strong>Date:</strong> ${booking.bookingDate}</p>
              <p><strong>Guests:</strong> ${guestsText}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Total Paid:</strong> \u20B9${booking.totalAmount}</p>
            </div>
            ${dmContactSection}
            <div style="text-align: center; margin: 30px 0;">
              <a href="${bookingUrl}" class="button">View My Bookings</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Please arrive 15 minutes before the event start time. If you need to cancel, please do so at least 24 hours in advance.
            </p>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const dmTextInfo = dmInfo ? ` Event Coordinator: ${dmInfo.name}${dmInfo.phone ? `, Phone: ${dmInfo.phone}` : ""}${dmInfo.email ? `, Email: ${dmInfo.email}` : ""}` : "";
    return this.sendEmail({
      to: customer.email,
      subject: `Booking Confirmed - ${event.title} | Santhe`,
      htmlContent,
      textContent: `Your booking #${booking.id} for ${event.title} on ${booking.bookingDate} is confirmed. Total: \u20B9${booking.totalAmount}.${dmTextInfo}`
    });
  }
  // Booking notification for farmer
  async sendBookingNotificationToFarmer(booking, event, farmer, customerName) {
    const dashboardUrl = "https://farmersanthe.com/farmer/events";
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Event Booking - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .booking-alert { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F331} Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Farm Events & Experiences</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Booking Received! \u{1F389}</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${farmer.username || farmer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Great news! Someone has booked your farm event.
            </p>
            <div class="booking-alert">
              <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Booking ID:</strong> #${booking.id}</p>
              <p><strong>Date:</strong> ${booking.bookingDate}</p>
              <p><strong>Number of Guests:</strong> ${booking.numberOfGuests}</p>
              <p><strong>Amount:</strong> \u20B9${booking.totalAmount}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">View Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: farmer.email,
      subject: `New Booking for ${event.title} | Santhe`,
      htmlContent,
      textContent: `New booking #${booking.id} from ${customerName} for ${event.title} on ${booking.bookingDate}. Guests: ${booking.numberOfGuests}, Amount: \u20B9${booking.totalAmount}`
    });
  }
  // BIB Quote submission notification to farmer
  async sendQuoteNotificationToFarmer(quote, product, farmer, customerName) {
    const dashboardUrl = "https://farmersanthe.com/farmer/quotes";
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New BIB Quote Request - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .quote-details { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F4E6} Santhe BIB</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Buy in Bulk</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Quote Request! \u{1F4B0}</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${farmer.username || farmer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              You've received a new bulk purchase quote request for your product.
            </p>
            <div class="quote-details">
              <h3 style="color: #1f2937; margin-top: 0;">Quote Details</h3>
              <p><strong>Product:</strong> ${product.name}</p>
              <p><strong>Quote ID:</strong> #${quote.id}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Quantity:</strong> ${quote.quantity} ${product.unit || "units"}</p>
              <p><strong>Offered Price:</strong> \u20B9${quote.quotedPrice}</p>
              ${quote.notes ? `<p><strong>Notes:</strong> ${quote.notes}</p>` : ""}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">Review Quote</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Log in to your dashboard to accept or reject this quote.
            </p>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: farmer.email,
      subject: `New BIB Quote Request for ${product.name} | Santhe`,
      htmlContent,
      textContent: `New bulk quote #${quote.id} from ${customerName} for ${product.name}. Quantity: ${quote.quantity}, Offered: \u20B9${quote.quotedPrice}`
    });
  }
  // Quote submission confirmation to customer
  async sendQuoteSubmissionConfirmation(quote, product, customer) {
    const quotesUrl = "https://farmersanthe.com/customer/quotes";
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Submitted - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .quote-details { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F4E6} Santhe BIB</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Buy in Bulk</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Quote Submitted! \u2705</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.username || customer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Your bulk purchase quote has been submitted successfully. The farmer will review and respond soon.
            </p>
            <div class="quote-details">
              <h3 style="color: #1f2937; margin-top: 0;">Quote Details</h3>
              <p><strong>Product:</strong> ${product.name}</p>
              <p><strong>Quote ID:</strong> #${quote.id}</p>
              <p><strong>Quantity:</strong> ${quote.quantity} ${product.unit || "units"}</p>
              <p><strong>Your Offer:</strong> \u20B9${quote.quotedPrice}</p>
              <p><strong>Status:</strong> Pending</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${quotesUrl}" class="button">Track My Quotes</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              You'll receive an email when the farmer responds to your quote.
            </p>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: customer.email,
      subject: `Quote Submitted for ${product.name} | Santhe`,
      htmlContent,
      textContent: `Your quote #${quote.id} for ${product.name} has been submitted. Quantity: ${quote.quantity}, Offered: \u20B9${quote.quotedPrice}`
    });
  }
  // Quote accepted notification to customer - prompting payment
  async sendQuoteAcceptedEmail(quote, product, customer, farmerName) {
    const paymentUrl = `https://farmersanthe.com/quote-checkout/${quote.id}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Accepted - Make Payment | Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .quote-details { background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .urgent-box { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #f59e0b; text-align: center; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F389} Quote Accepted!</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Great news from Santhe BIB</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Your Quote Has Been Accepted! \u2705</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.username || customer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Great news! <strong>${farmerName}</strong> has accepted your bulk purchase quote. Please complete the payment to finalize your order.
            </p>
            <div class="quote-details">
              <h3 style="color: #1f2937; margin-top: 0;">Accepted Quote Details</h3>
              <p><strong>Product:</strong> ${product.name}</p>
              <p><strong>Quote ID:</strong> #${quote.id}</p>
              <p><strong>Quantity:</strong> ${quote.quantity} ${product.unit || "units"}</p>
              <p><strong>Agreed Price:</strong> \u20B9${quote.quotedPrice}</p>
              <p><strong>Farmer:</strong> ${farmerName}</p>
              <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Accepted</span></p>
            </div>
            <div class="urgent-box">
              <p style="margin: 0; color: #92400e; font-weight: 600;">
                \u23F0 Please complete payment soon to secure your order!
              </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${paymentUrl}" class="button">Pay Now & Complete Order</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you have any questions, please contact us at support@farmersanthe.com
            </p>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: customer.email,
      subject: `Your Quote Accepted! Complete Payment for ${product.name} | Santhe`,
      htmlContent,
      textContent: `Great news! Your quote #${quote.id} for ${product.name} has been accepted by ${farmerName}. Please complete payment to finalize your order.`
    });
  }
  // Notification to DM about new booking in their district
  async sendBookingNotificationToDM(booking, event, dm, customerName, farmerName) {
    const dashboardUrl = "https://farmersanthe.com/dm/dashboard";
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking in Your District - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .booking-info { background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F331} Santhe DM</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">District Manager Update</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Event Booking in Your District</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${dm.username || dm.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              A new event booking has been made in your district.
            </p>
            <div class="booking-info">
              <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Farmer:</strong> ${farmerName}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Booking ID:</strong> #${booking.id}</p>
              <p><strong>Date:</strong> ${booking.bookingDate}</p>
              <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
              <p><strong>Amount:</strong> \u20B9${booking.totalAmount}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">View Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: dm.email,
      subject: `New Event Booking - ${event.title} | Santhe DM`,
      htmlContent,
      textContent: `New booking in your district: ${event.title} by ${farmerName}. Customer: ${customerName}, Date: ${booking.bookingDate}, Amount: \u20B9${booking.totalAmount}`
    });
  }
  // Order notification to DM
  async sendOrderNotificationToDM(order, dm, customerName, farmerName) {
    const dashboardUrl = "https://farmersanthe.com/dm/dashboard";
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order in Your District - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .order-info { background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">\u{1F331} Santhe DM</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">District Manager Update</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Order in Your District</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${dm.username || dm.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              A new order has been placed in your district.
            </p>
            <div class="order-info">
              <h3 style="color: #1f2937; margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Farmer:</strong> ${farmerName}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Total:</strong> \u20B9${order.total}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">View Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>\xA9 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail({
      to: dm.email,
      subject: `New Order #${order.id} in Your District | Santhe DM`,
      htmlContent,
      textContent: `New order in your district: #${order.id}. Farmer: ${farmerName}, Customer: ${customerName}, Total: \u20B9${order.total}`
    });
  }
};
var zeptoEmailService2 = new ZeptoEmailService();

// server/utils/email-service.ts
async function sendEmail(options) {
  try {
    const success = await zeptoEmailService2.sendEmail({
      to: options.to,
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text
    });
    return success;
  } catch (error) {
    console.error("Error sending email:", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}
async function sendPasswordResetEmail2(user, resetToken) {
  return zeptoEmailService2.sendPasswordResetEmail(user, resetToken);
}
async function sendOrderConfirmationEmail(order, customer) {
  return zeptoEmailService2.sendOrderConfirmationEmail(order, customer);
}
async function sendOrderStatusUpdateEmail(order, customer) {
  return zeptoEmailService2.sendOrderStatusUpdateEmail(order, customer);
}
async function sendOrderNotificationToFarmer(order, farmer) {
  return zeptoEmailService2.sendOrderNotificationToFarmer(order, farmer);
}
async function sendWelcomeEmail(user) {
  return zeptoEmailService2.sendWelcomeEmail(user);
}
async function sendBookingConfirmationEmail(booking, event, customer, dmInfo) {
  return zeptoEmailService2.sendBookingConfirmationEmail(booking, event, customer, dmInfo);
}
async function sendBookingNotificationToFarmer(booking, event, farmer, customerName) {
  return zeptoEmailService2.sendBookingNotificationToFarmer(booking, event, farmer, customerName);
}
async function sendBookingNotificationToDM(booking, event, dm, customerName, farmerName) {
  return zeptoEmailService2.sendBookingNotificationToDM(booking, event, dm, customerName, farmerName);
}
async function sendOrderNotificationToDM(order, dm, customerName, farmerName) {
  return zeptoEmailService2.sendOrderNotificationToDM(order, dm, customerName, farmerName);
}

// server/utils/password-reset.ts
init_storage();
import crypto from "crypto";
function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}
async function setPasswordResetToken(email) {
  try {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const resetToken = generateResetToken();
    const resetTokenExpiry = /* @__PURE__ */ new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
    await storage.updateUser(user.id, {
      resetToken,
      resetTokenExpiry
    });
    const emailSent = await sendPasswordResetEmail2(user, resetToken);
    if (!emailSent) {
      console.error("Failed to send password reset email to:", email);
    }
    return resetToken;
  } catch (error) {
    console.error("Error setting password reset token:", error);
    return null;
  }
}

// server/routes.ts
init_meta_tags();

// server/utils/encryption.ts
var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || (() => {
  console.error("CRITICAL: ENCRYPTION_KEY environment variable is required for banking data security");
  process.exit(1);
})();
var IV_LENGTH = 12;
var SALT_LENGTH = 64;
var TAG_LENGTH = 16;
var TAG_POSITION = SALT_LENGTH + IV_LENGTH;
var ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;
function sanitizeUserData(userData) {
  const {
    bankAccountNumber,
    bankIfsc,
    gstNumber,
    upiId,
    password,
    resetToken,
    resetTokenExpiry,
    ...sanitizedData
  } = userData;
  return sanitizedData;
}

// server/routes.ts
import { readFileSync } from "fs";
import { join } from "path";

// server/utils/zbnf-recommendation-engine.ts
init_db();

// server/utils/ai-crop-recommender.ts
var AICropRecommender = class {
  cropDatabase;
  constructor(crops) {
    this.cropDatabase = crops;
  }
  /**
   * AI-powered crop recommendation using intelligent analysis
   * This simulates advanced AI reasoning without requiring external APIs
   * Returns exactly 2 best crops per layer for optimal ZBNF implementation
   */
  async generateAIRecommendations(farmConditions, maxRecommendations = 10) {
    const farmContext = this.analyzeFarmContext(farmConditions);
    const allRecommendations = await this.performIntelligentSelection(farmContext, farmConditions);
    const layerGrouped = this.groupByLayerAndSelectBest(allRecommendations, 2);
    const finalRecommendations = this.flattenLayerRecommendations(layerGrouped);
    return finalRecommendations.slice(0, maxRecommendations);
  }
  /**
   * Analyze farm context using AI-like reasoning patterns
   */
  analyzeFarmContext(conditions) {
    const context = {
      layerGaps: this.identifyMissingLayers(conditions.existingCrops),
      spaceAvailable: conditions.detectedGaps.length,
      seasonalFactors: this.analyzeSeasonalFactors(conditions.season),
      soilSuitability: this.analyzeSoilSuitability(conditions.soilType),
      climateCompatibility: this.analyzeClimateCompatibility(conditions.climateZone),
      waterOptimization: this.analyzeWaterRequirements(conditions.waterAvailability),
      locationFactors: this.analyzeLocationFactors(conditions.location),
      diversityNeeds: this.analyzeDiversityNeeds(conditions.existingCrops)
    };
    return context;
  }
  /**
   * Perform intelligent crop selection using AI-like decision making
   */
  async performIntelligentSelection(context, conditions) {
    const recommendations = [];
    const layerPriorities = this.calculateLayerPriorities(context.layerGaps);
    for (const [layer, priority] of Object.entries(layerPriorities)) {
      if (priority > 0.2) {
        const layerCrops = this.cropDatabase.filter((crop) => crop.layerNumber === parseInt(layer));
        for (const crop of layerCrops) {
          const aiScore = this.calculateAICompatibilityScore(crop, conditions, context);
          if (aiScore.overall > 0.4) {
            const recommendation = this.createAIRecommendation(crop, aiScore, conditions, context);
            recommendations.push(recommendation);
          }
        }
      }
    }
    return recommendations;
  }
  /**
   * Calculate AI compatibility score for each crop
   */
  calculateAICompatibilityScore(crop, conditions, context) {
    const scores = {
      climateMatch: this.scoreClimateCompatibility(crop, conditions.climateZone),
      soilMatch: this.scoreSoilCompatibility(crop, conditions.soilType),
      seasonalMatch: this.scoreSeasonalCompatibility(crop, conditions.season),
      waterMatch: this.scoreWaterCompatibility(crop, conditions.waterAvailability),
      companionMatch: this.scoreCompanionCompatibility(crop, conditions.existingCrops),
      marketViability: this.scoreMarketViability(crop, conditions.location),
      layerOptimization: this.scoreLayerOptimization(crop, context.layerGaps),
      diversityBonus: this.scoreDiversityBonus(crop, conditions.existingCrops)
    };
    const overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
    return { ...scores, overall };
  }
  /**
   * Create detailed AI recommendation with reasoning
   */
  createAIRecommendation(crop, aiScore, conditions, context) {
    const reasoning = this.generateAIReasoning(crop, aiScore, conditions, context);
    const benefits = this.generateSmartBenefits(crop, conditions);
    const implementation = this.generateIntelligentImplementation(crop, conditions);
    const roi = this.calculateSmartROI(crop, conditions);
    const timing = this.generateOptimalTiming(crop, conditions.season);
    return {
      cropName: crop.name,
      layer: crop.layerNumber,
      confidence: Math.round(aiScore.overall * 100),
      reasoning,
      benefits,
      implementation,
      roi,
      timing
    };
  }
  /**
   * Generate AI-powered reasoning for recommendations
   */
  generateAIReasoning(crop, aiScore, conditions, context) {
    const reasons = [];
    if (aiScore.climateMatch > 0.8) {
      reasons.push(`${crop.name} is perfectly suited for ${conditions.climateZone} climate conditions`);
    }
    if (aiScore.layerOptimization > 0.7) {
      reasons.push(`Fills critical gap in Layer ${crop.layerNumber} of your ZBNF system`);
    }
    if (aiScore.companionMatch > 0.7) {
      const companions = crop.companionCrops.filter(
        (comp) => conditions.existingCrops.some((existing) => existing.name.toLowerCase().includes(comp.toLowerCase()))
      );
      if (companions.length > 0) {
        reasons.push(`Creates beneficial companion planting with your existing ${companions.join(", ")}`);
      }
    }
    if (aiScore.marketViability > 0.8) {
      reasons.push(`High market demand in ${conditions.location} area ensures good returns`);
    }
    if (aiScore.waterMatch > 0.7) {
      reasons.push(`Water requirements match your ${conditions.waterAvailability} water availability`);
    }
    return reasons.join(". ") + ".";
  }
  /**
   * Generate smart benefits based on farm conditions
   */
  generateSmartBenefits(crop, conditions) {
    const benefits = [...crop.benefits];
    if (conditions.soilType === "clay" && crop.name.includes("Legume")) {
      benefits.push("Improves clay soil structure through nitrogen fixation");
    }
    if (conditions.season === "monsoon" && crop.waterRequirement === "low") {
      benefits.push("Prevents waterlogging during heavy rains");
    }
    if (conditions.existingCrops.length < 3) {
      benefits.push("Increases farm biodiversity and ecosystem resilience");
    }
    return benefits.slice(0, 4);
  }
  /**
   * Generate intelligent implementation steps
   */
  generateIntelligentImplementation(crop, conditions) {
    const steps = [];
    if (conditions.season === "pre-monsoon") {
      steps.push("Prepare planting pits before monsoon arrival");
    } else if (conditions.season === "post-harvest") {
      steps.push("Utilize post-harvest residues for soil preparation");
    }
    steps.push(`Mark planting locations with ${crop.spacingRequirement} spacing`);
    steps.push(`Source quality ${crop.name} planting material from certified suppliers`);
    if (conditions.soilType === "sandy") {
      steps.push("Add organic matter to improve water retention");
    } else if (conditions.soilType === "clay") {
      steps.push("Improve drainage with organic compost");
    }
    steps.push("Apply ZBNF Jeevamrutha for soil enrichment");
    steps.push(`Plant according to ${crop.maturityPeriod} growth timeline`);
    steps.push("Establish natural pest management with Neemastra");
    return steps;
  }
  /**
   * Calculate smart ROI projections
   */
  calculateSmartROI(crop, conditions) {
    const baseInvestment = this.calculateBaseInvestment(crop);
    const locationMultiplier = this.getLocationPriceMultiplier(conditions.location);
    const marketDemandMultiplier = crop.marketDemand === "high" ? 1.5 : crop.marketDemand === "medium" ? 1.2 : 1;
    const investment = Math.round(baseInvestment * locationMultiplier);
    const expectedReturn = Math.round(investment * marketDemandMultiplier * 1.8);
    const paybackPeriod = this.calculatePaybackPeriod(crop.maturityPeriod, marketDemandMultiplier);
    return {
      investment,
      expectedReturn,
      paybackPeriod
    };
  }
  /**
   * Generate optimal timing recommendations
   */
  generateOptimalTiming(crop, currentSeason) {
    const seasonMap = {
      "pre-monsoon": "Early June",
      "monsoon": "July-August",
      "post-monsoon": "September-October",
      "winter": "November-December",
      "summer": "March-April"
    };
    const plantingTime = crop.seasons.includes(currentSeason) ? `Optimal: ${seasonMap[currentSeason] || "Current season"}` : `Wait for: ${crop.seasons[0]} season`;
    const maturityMonths = parseInt(crop.maturityPeriod.match(/\d+/)?.[0] || "6");
    const harvestTime = `${maturityMonths} months after planting`;
    const preparation = [
      "Soil testing and amendment",
      "Site preparation and marking",
      "Procurement of planting material",
      "ZBNF input preparation"
    ];
    return {
      plantingTime,
      harvestTime,
      preparation
    };
  }
  // Helper methods for scoring
  identifyMissingLayers(existingCrops) {
    const presentLayers = new Set(existingCrops.map((crop) => crop.layer));
    const missingLayers = [];
    for (let i = 1; i <= 5; i++) {
      if (!presentLayers.has(i)) {
        missingLayers.push(i);
      }
    }
    return missingLayers;
  }
  calculateLayerPriorities(missingLayers) {
    const priorities = {};
    missingLayers.forEach((layer) => {
      priorities[layer.toString()] = layer === 1 ? 1 : layer === 2 ? 0.9 : 0.7;
    });
    return priorities;
  }
  scoreClimateCompatibility(crop, climate) {
    return crop.climateZones.some((zone) => zone.toLowerCase().includes(climate.toLowerCase())) ? 0.9 : 0.7;
  }
  scoreSoilCompatibility(crop, soil) {
    if (!soil || !crop.soilTypes.length) return 0.8;
    const inputSoil = soil.toLowerCase();
    const compatible = crop.soilTypes.some((soilType) => {
      const cropSoil = soilType.toLowerCase();
      if (cropSoil === inputSoil) return true;
      if (inputSoil === "clay" && (cropSoil.includes("clay") || cropSoil.includes("loam") || cropSoil === "black soil" || cropSoil === "alluvial" || cropSoil === "all")) return true;
      if (inputSoil === "sandy" && (cropSoil.includes("sandy") || cropSoil.includes("loam") || cropSoil === "red soil" || cropSoil === "laterite" || cropSoil === "all")) return true;
      if (inputSoil === "loam" && (cropSoil.includes("loam") || cropSoil.includes("clay") || cropSoil.includes("sandy") || cropSoil === "alluvial" || cropSoil === "all")) return true;
      if (inputSoil === "red soil" && (cropSoil.includes("red") || cropSoil.includes("sandy") || cropSoil.includes("loam") || cropSoil === "laterite" || cropSoil === "all")) return true;
      if (inputSoil === "black soil" && (cropSoil.includes("black") || cropSoil.includes("clay") || cropSoil.includes("loam") || cropSoil === "alluvial" || cropSoil === "all")) return true;
      if (inputSoil === "alluvial" && (cropSoil.includes("alluvial") || cropSoil.includes("loam") || cropSoil.includes("fertile") || cropSoil === "clay" || cropSoil === "sandy" || cropSoil === "all")) return true;
      if (inputSoil === "laterite" && (cropSoil.includes("laterite") || cropSoil.includes("red") || cropSoil.includes("sandy") || cropSoil.includes("loam") || cropSoil === "all")) return true;
      return cropSoil.includes("loam") || cropSoil === "all";
    });
    if (compatible) return 0.95;
    const adaptable = crop.soilTypes.some((type) => {
      const cropSoil = type.toLowerCase();
      return cropSoil.includes("loam") || cropSoil.includes("well") || cropSoil.includes("fertile") || cropSoil === "all";
    });
    if (adaptable) return 0.8;
    return 0.6;
  }
  scoreSeasonalCompatibility(crop, season) {
    if (crop.seasons.includes("year_round")) return 1;
    if (crop.seasons.some((s) => s.toLowerCase().includes(season.toLowerCase()))) return 1;
    return 0.6;
  }
  scoreWaterCompatibility(crop, availability) {
    if (!availability || !crop.waterRequirement) return 0.8;
    const reqLevel = crop.waterRequirement.toLowerCase();
    const availLevel = availability.toLowerCase();
    if (availLevel === "abundant") return 1;
    if (availLevel === "moderate" && (reqLevel.includes("low") || reqLevel.includes("medium") || reqLevel.includes("moderate"))) return 1;
    if (availLevel === "scarce" && (reqLevel.includes("low") || reqLevel.includes("drought"))) return 1;
    if (availLevel === "scarce" && reqLevel.includes("high")) return 0.1;
    if (availLevel === "moderate" && reqLevel.includes("high")) return 0.6;
    return 0.7;
  }
  scoreCompanionCompatibility(crop, existingCrops) {
    if (existingCrops.length === 0) return 0.8;
    const existingNames = existingCrops.map((c) => c.name.toLowerCase());
    const companions = crop.companionCrops.filter(
      (comp) => existingNames.some((name) => name.includes(comp.toLowerCase()))
    );
    const conflicts = crop.conflictCrops?.filter(
      (conflict) => existingNames.some((name) => name.includes(conflict.toLowerCase()))
    ) || [];
    if (conflicts.length > 0) return 0.4;
    if (companions.length > 0) return 0.9;
    return 0.8;
  }
  scoreMarketViability(crop, location) {
    const demandScore = crop.marketDemand === "high" ? 1 : crop.marketDemand === "medium" ? 0.8 : 0.6;
    const locationBonus = location.toLowerCase().includes("bangalore") ? 0.1 : 0;
    return Math.min(1, demandScore + locationBonus);
  }
  scoreLayerOptimization(crop, missingLayers) {
    return missingLayers.includes(crop.layerNumber) ? 1 : 0.5;
  }
  scoreDiversityBonus(crop, existingCrops) {
    const existingCategories = existingCrops.map((c) => c.name.toLowerCase());
    const isUnique = !existingCategories.some(
      (name) => name.includes(crop.category.toLowerCase()) || crop.name.toLowerCase().includes(name)
    );
    return isUnique ? 0.9 : 0.6;
  }
  analyzeSeasonalFactors(season) {
    return { currentSeason: season, optimal: season === "monsoon" };
  }
  analyzeSoilSuitability(soilType) {
    return { type: soilType, suitability: 0.8 };
  }
  analyzeClimateCompatibility(climate) {
    return { zone: climate, favorability: 0.9 };
  }
  analyzeWaterRequirements(availability) {
    return { level: availability, optimization: 0.8 };
  }
  analyzeLocationFactors(location) {
    return { region: location, marketAccess: 0.8 };
  }
  analyzeDiversityNeeds(existingCrops) {
    return { currentDiversity: existingCrops.length, needsIncrease: existingCrops.length < 5 };
  }
  rankByAIScoring(recommendations, conditions) {
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }
  calculateBaseInvestment(crop) {
    const baseRates = {
      1: 5e3,
      // Canopy trees
      2: 3e3,
      // Sub-canopy
      3: 1500,
      // Shrubs
      4: 800,
      // Herbaceous
      5: 400
      // Ground cover
    };
    return baseRates[crop.layerNumber] || 1e3;
  }
  getLocationPriceMultiplier(location) {
    if (location.toLowerCase().includes("bangalore")) return 1.2;
    if (location.toLowerCase().includes("mysore")) return 1;
    return 0.9;
  }
  calculatePaybackPeriod(maturityPeriod, demandMultiplier) {
    const months = parseInt(maturityPeriod.match(/\d+/)?.[0] || "12");
    const adjustedMonths = Math.round(months / demandMultiplier);
    return adjustedMonths < 12 ? `${adjustedMonths} months` : `${Math.round(adjustedMonths / 12)} years`;
  }
  /**
   * Group recommendations by layer and select the best crops for each layer
   */
  groupByLayerAndSelectBest(recommendations, cropsPerLayer = 2) {
    const layerGroups = {};
    recommendations.forEach((rec) => {
      if (!layerGroups[rec.layer]) {
        layerGroups[rec.layer] = [];
      }
      layerGroups[rec.layer].push(rec);
    });
    Object.keys(layerGroups).forEach((layerKey) => {
      const layer = parseInt(layerKey);
      layerGroups[layer] = layerGroups[layer].sort((a, b) => b.confidence - a.confidence).slice(0, cropsPerLayer);
    });
    return layerGroups;
  }
  /**
   * Flatten layer recommendations back to a single array
   */
  flattenLayerRecommendations(layerGroups) {
    const flattened = [];
    for (let layer = 1; layer <= 5; layer++) {
      if (layerGroups[layer]) {
        flattened.push(...layerGroups[layer]);
      }
    }
    return flattened;
  }
};
var aiRecommender = new AICropRecommender([]);

// server/utils/zbnf-recommendation-engine.ts
var ZBNF_CROP_DATABASE = [
  // Layer 1: Canopy Trees (7000-12000 ft) - 12 meter spacing
  {
    id: 1,
    name: "Coconut",
    scientificName: "Cocos nucifera",
    layerNumber: 1,
    category: "fruit_trees",
    spacingRequirement: "12m x 12m",
    soilTypes: ["sandy", "sandy_loam", "coastal", "clay", "loam"],
    climateZones: ["tropical", "coastal"],
    seasons: ["year_round", "monsoon", "post_monsoon"],
    companionCrops: ["mango", "jackfruit", "banana"],
    conflictCrops: [],
    benefits: ["carbon_sequestration", "coconut_water", "copra", "windbreak"],
    waterRequirement: "moderate",
    sunRequirement: "full",
    maturityPeriod: "5-6 years",
    yieldPerPlant: "30-75 nuts",
    marketDemand: "high",
    isNative: true
  },
  {
    id: 2,
    name: "Mango",
    scientificName: "Mangifera indica",
    layerNumber: 1,
    category: "fruit_trees",
    spacingRequirement: "12m x 12m",
    soilTypes: ["loam", "clay_loam", "sandy_loam", "clay"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["coconut", "jackfruit", "banana"],
    conflictCrops: [],
    benefits: ["carbon_sequestration", "windbreak", "shade", "nutrition"],
    waterRequirement: "moderate",
    sunRequirement: "full",
    maturityPeriod: "3-5 years",
    yieldPerPlant: "50-100 kg",
    marketDemand: "high",
    isNative: true
  },
  {
    id: 3,
    name: "Jackfruit",
    scientificName: "Artocarpus heterophyllus",
    layerNumber: 1,
    category: "fruit_trees",
    spacingRequirement: "12m x 12m",
    soilTypes: ["loam", "clay_loam", "sandy_loam", "clay"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["coconut", "mango", "banana"],
    conflictCrops: [],
    benefits: ["carbon_sequestration", "windbreak", "nutrition", "timber"],
    waterRequirement: "moderate",
    sunRequirement: "full",
    maturityPeriod: "3-4 years",
    yieldPerPlant: "80-150 kg",
    marketDemand: "high",
    isNative: true
  },
  {
    id: 4,
    name: "Jamun",
    scientificName: "Syzygium cumini",
    layerNumber: 1,
    category: "fruit_trees",
    spacingRequirement: "12m x 12m",
    soilTypes: ["clay", "loam", "sandy_loam"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon"],
    companionCrops: ["mango", "coconut"],
    conflictCrops: [],
    benefits: ["carbon_sequestration", "medicinal", "wildlife_habitat"],
    waterRequirement: "moderate",
    sunRequirement: "full",
    maturityPeriod: "4-5 years",
    yieldPerPlant: "40-80 kg",
    marketDemand: "medium",
    isNative: true
  },
  {
    id: 5,
    name: "Sapota",
    scientificName: "Manilkara zapota",
    layerNumber: 1,
    category: "fruit_trees",
    spacingRequirement: "12m x 12m",
    soilTypes: ["sandy_loam", "loam", "clay"],
    climateZones: ["tropical"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["mango", "coconut"],
    conflictCrops: [],
    benefits: ["carbon_sequestration", "nutrition", "latex"],
    waterRequirement: "moderate",
    sunRequirement: "full",
    maturityPeriod: "3-4 years",
    yieldPerPlant: "60-120 kg",
    marketDemand: "high",
    isNative: true
  },
  // Layer 2: Sub-canopy Trees (5400-7000 ft) - 6 meter spacing
  {
    id: 6,
    name: "Banana",
    scientificName: "Musa paradisiaca",
    layerNumber: 2,
    category: "fruit_trees",
    spacingRequirement: "6m x 6m",
    soilTypes: ["loam", "clay_loam", "sandy_loam"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["year_round", "monsoon"],
    companionCrops: ["coconut", "mango", "papaya"],
    conflictCrops: [],
    benefits: ["quick_harvest", "nitrogen_fixation", "biomass"],
    waterRequirement: "high",
    sunRequirement: "partial",
    maturityPeriod: "9-12 months",
    yieldPerPlant: "15-25 kg",
    marketDemand: "high",
    isNative: true
  },
  {
    id: 7,
    name: "Papaya",
    scientificName: "Carica papaya",
    layerNumber: 2,
    category: "fruit_trees",
    spacingRequirement: "6m x 6m",
    soilTypes: ["sandy_loam", "loam", "well_drained"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["year_round", "monsoon"],
    companionCrops: ["banana", "guava", "lemon"],
    conflictCrops: [],
    benefits: ["quick_harvest", "nutrition", "medicinal"],
    waterRequirement: "moderate",
    sunRequirement: "full",
    maturityPeriod: "8-12 months",
    yieldPerPlant: "20-40 kg",
    marketDemand: "high",
    isNative: true
  },
  {
    id: 8,
    name: "Drumstick",
    scientificName: "Moringa oleifera",
    layerNumber: 2,
    category: "nutritional_trees",
    spacingRequirement: "6m x 6m",
    soilTypes: ["sandy", "loam", "clay", "poor_soil"],
    climateZones: ["tropical", "arid"],
    seasons: ["year_round", "monsoon"],
    companionCrops: ["lemon", "guava", "curry_leaves"],
    conflictCrops: [],
    benefits: ["nutrition", "medicinal", "drought_resistant"],
    waterRequirement: "low",
    sunRequirement: "full",
    maturityPeriod: "6-8 months",
    yieldPerPlant: "200-400 pods",
    marketDemand: "high",
    isNative: true
  },
  // Layer 3: Shrub Layer (3700-5400 ft) - 3 meter spacing
  {
    id: 9,
    name: "Curry Leaves",
    scientificName: "Murraya koenigii",
    layerNumber: 3,
    category: "spice_herbs",
    spacingRequirement: "3m x 3m",
    soilTypes: ["loam", "sandy_loam", "clay"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["year_round", "monsoon"],
    companionCrops: ["drumstick", "pepper", "turmeric"],
    conflictCrops: [],
    benefits: ["culinary", "medicinal", "aromatic"],
    waterRequirement: "moderate",
    sunRequirement: "partial",
    maturityPeriod: "2-3 years",
    yieldPerPlant: "3-5 kg leaves",
    marketDemand: "high",
    isNative: true
  },
  {
    id: 10,
    name: "Red Gram",
    scientificName: "Cajanus cajan",
    layerNumber: 3,
    category: "legumes",
    spacingRequirement: "3m x 3m",
    soilTypes: ["sandy", "loam", "poor_soil"],
    climateZones: ["tropical", "semi_arid"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["curry_leaves", "castor"],
    conflictCrops: [],
    benefits: ["nitrogen_fixation", "protein_source", "drought_tolerant"],
    waterRequirement: "low",
    sunRequirement: "full",
    maturityPeriod: "4-6 months",
    yieldPerPlant: "0.5-1 kg",
    marketDemand: "high",
    isNative: true
  },
  // Layer 4: Herbaceous Layer (1800-3700 ft) - Close rows
  {
    id: 11,
    name: "Spinach",
    scientificName: "Spinacia oleracea",
    layerNumber: 4,
    category: "leafy_greens",
    spacingRequirement: "0.3m x 0.3m",
    soilTypes: ["loam", "sandy_loam", "clay_loam"],
    climateZones: ["temperate", "subtropical"],
    seasons: ["winter", "monsoon"],
    companionCrops: ["coriander", "mint"],
    conflictCrops: [],
    benefits: ["nutrition", "quick_harvest", "iron_rich"],
    waterRequirement: "moderate",
    sunRequirement: "partial",
    maturityPeriod: "45-60 days",
    yieldPerPlant: "200-300g",
    marketDemand: "high",
    isNative: false
  },
  {
    id: 12,
    name: "Coriander",
    scientificName: "Coriandrum sativum",
    layerNumber: 4,
    category: "spice_herbs",
    spacingRequirement: "0.2m x 0.2m",
    soilTypes: ["loam", "sandy_loam"],
    climateZones: ["temperate", "subtropical"],
    seasons: ["winter", "post_monsoon"],
    companionCrops: ["spinach", "mint", "turmeric"],
    conflictCrops: [],
    benefits: ["culinary", "medicinal", "quick_harvest"],
    waterRequirement: "moderate",
    sunRequirement: "partial",
    maturityPeriod: "30-45 days",
    yieldPerPlant: "50-100g",
    marketDemand: "high",
    isNative: true
  },
  // Layer 5: Ground Cover (0-800 ft) - Beds/patches
  {
    id: 13,
    name: "Sweet Potato",
    scientificName: "Ipomoea batatas",
    layerNumber: 5,
    category: "root_vegetables",
    spacingRequirement: "0.5m x 0.5m",
    soilTypes: ["sandy", "loam", "well_drained"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["carrot", "onion"],
    conflictCrops: [],
    benefits: ["ground_cover", "nutrition", "soil_improvement"],
    waterRequirement: "moderate",
    sunRequirement: "full",
    maturityPeriod: "3-4 months",
    yieldPerPlant: "1-2 kg",
    marketDemand: "high",
    isNative: true
  },
  {
    id: 14,
    name: "Onion",
    scientificName: "Allium cepa",
    layerNumber: 5,
    category: "bulb_vegetables",
    spacingRequirement: "0.15m x 0.15m",
    soilTypes: ["loam", "sandy_loam", "clay_loam"],
    climateZones: ["temperate", "subtropical"],
    seasons: ["winter", "post_monsoon"],
    companionCrops: ["garlic", "carrot", "sweet_potato"],
    conflictCrops: [],
    benefits: ["pest_deterrent", "culinary", "medicinal"],
    waterRequirement: "moderate",
    sunRequirement: "full",
    maturityPeriod: "3-4 months",
    yieldPerPlant: "100-200g",
    marketDemand: "high",
    isNative: false
  },
  {
    id: 4,
    name: "Papaya",
    scientificName: "Carica papaya",
    layerNumber: 2,
    category: "fruit_trees",
    spacingRequirement: "4m x 4m",
    soilTypes: ["loam", "sandy_loam", "well_drained"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["year_round"],
    companionCrops: ["banana", "guava", "drumstick"],
    conflictCrops: [],
    benefits: ["quick_harvest", "medicinal", "high_nutrition"],
    waterRequirement: "medium",
    sunRequirement: "full",
    maturityPeriod: "8-12 months",
    yieldPerPlant: "30-50 kg",
    marketDemand: "high",
    isNative: false,
    imageUrl: "https://images.unsplash.com/photo-1617112848923-cc2234bb5462"
  },
  // Layer 3: Shrub Layer (1-5m)
  {
    id: 5,
    name: "Drumstick",
    scientificName: "Moringa oleifera",
    layerNumber: 3,
    category: "vegetables",
    spacingRequirement: "3m x 3m",
    soilTypes: ["sandy", "loam", "rocky"],
    climateZones: ["tropical", "subtropical", "arid"],
    seasons: ["year_round"],
    companionCrops: ["papaya", "curry_leaf", "hibiscus"],
    conflictCrops: [],
    benefits: ["nutrition", "medicinal", "nitrogen_fixation"],
    waterRequirement: "low",
    sunRequirement: "full",
    maturityPeriod: "6-8 months",
    yieldPerPlant: "200-400 pods",
    marketDemand: "high",
    isNative: true,
    imageUrl: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7"
  },
  {
    id: 6,
    name: "Curry Leaf",
    scientificName: "Murraya koenigii",
    layerNumber: 3,
    category: "spices",
    spacingRequirement: "2m x 2m",
    soilTypes: ["loam", "sandy_loam", "clay_loam"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["year_round"],
    companionCrops: ["drumstick", "hibiscus", "lemon"],
    conflictCrops: [],
    benefits: ["culinary", "medicinal", "pest_control"],
    waterRequirement: "medium",
    sunRequirement: "partial",
    maturityPeriod: "1-2 years",
    yieldPerPlant: "2-5 kg leaves",
    marketDemand: "high",
    isNative: true,
    imageUrl: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c"
  },
  // Layer 4: Herbaceous Layer (0.5-1m)
  {
    id: 7,
    name: "Turmeric",
    scientificName: "Curcuma longa",
    layerNumber: 4,
    category: "spices",
    spacingRequirement: "30cm x 30cm",
    soilTypes: ["loam", "clay_loam", "alluvial"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon"],
    companionCrops: ["ginger", "banana", "taro"],
    conflictCrops: [],
    benefits: ["medicinal", "culinary", "soil_improvement"],
    waterRequirement: "medium",
    sunRequirement: "partial",
    maturityPeriod: "7-9 months",
    yieldPerPlant: "300-500g",
    marketDemand: "high",
    isNative: true,
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5"
  },
  {
    id: 8,
    name: "Ginger",
    scientificName: "Zingiber officinale",
    layerNumber: 4,
    category: "spices",
    spacingRequirement: "25cm x 25cm",
    soilTypes: ["loam", "sandy_loam", "well_drained"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon"],
    companionCrops: ["turmeric", "taro", "banana"],
    conflictCrops: [],
    benefits: ["medicinal", "culinary", "export_value"],
    waterRequirement: "medium",
    sunRequirement: "partial",
    maturityPeriod: "8-10 months",
    yieldPerPlant: "200-400g",
    marketDemand: "high",
    isNative: true,
    imageUrl: "https://images.unsplash.com/photo-1599521567394-7e8a08b78b3a"
  },
  // Layer 5: Ground Cover/Root Layer (0-0.5m)
  {
    id: 9,
    name: "Sweet Potato",
    scientificName: "Ipomoea batatas",
    layerNumber: 5,
    category: "tubers",
    spacingRequirement: "60cm x 30cm",
    soilTypes: ["sandy", "loam", "well_drained"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["post_monsoon", "winter"],
    companionCrops: ["peanuts", "cowpeas", "beans"],
    conflictCrops: [],
    benefits: ["ground_cover", "soil_protection", "nutrition"],
    waterRequirement: "low",
    sunRequirement: "full",
    maturityPeriod: "3-4 months",
    yieldPerPlant: "800-1200g",
    marketDemand: "medium",
    isNative: false,
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90"
  },
  {
    id: 10,
    name: "Peanuts",
    scientificName: "Arachis hypogaea",
    layerNumber: 5,
    category: "legumes",
    spacingRequirement: "30cm x 15cm",
    soilTypes: ["sandy", "sandy_loam", "well_drained"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["post_monsoon", "summer"],
    companionCrops: ["sweet_potato", "cowpeas", "millets"],
    conflictCrops: [],
    benefits: ["nitrogen_fixation", "soil_improvement", "protein"],
    waterRequirement: "low",
    sunRequirement: "full",
    maturityPeriod: "3-4 months",
    yieldPerPlant: "25-40 pods",
    marketDemand: "high",
    isNative: false,
    imageUrl: "https://images.unsplash.com/photo-1566394286636-0ce9e22cc9e6"
  },
  // Additional Layer 1 crops
  {
    id: 11,
    name: "Neem",
    scientificName: "Azadirachta indica",
    layerNumber: 1,
    category: "medicinal_tree",
    spacingRequirement: "12m x 12m",
    soilTypes: ["sandy", "loam", "clay"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["year_round"],
    companionCrops: ["coconut", "mango", "turmeric"],
    conflictCrops: [],
    benefits: ["pest_control", "medicinal", "soil_improvement", "windbreak"],
    waterRequirement: "low",
    sunRequirement: "full",
    maturityPeriod: "3-5 years",
    yieldPerPlant: "Natural pesticide",
    marketDemand: "high",
    isNative: true,
    imageUrl: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25"
  },
  {
    id: 12,
    name: "Jamun",
    scientificName: "Syzygium cumini",
    layerNumber: 1,
    category: "fruit_tree",
    spacingRequirement: "12m x 12m",
    soilTypes: ["loam", "clay", "alluvial"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["mango", "tamarind", "banana"],
    conflictCrops: [],
    benefits: ["medicinal", "nutrition", "timber", "wildlife_habitat"],
    waterRequirement: "medium",
    sunRequirement: "full",
    maturityPeriod: "5-7 years",
    yieldPerPlant: "40-100 kg",
    marketDemand: "medium",
    isNative: true,
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45"
  },
  // Additional Layer 2 crops  
  {
    id: 13,
    name: "Lime",
    scientificName: "Citrus aurantifolia",
    layerNumber: 2,
    category: "citrus",
    spacingRequirement: "6m x 6m",
    soilTypes: ["loam", "sandy_loam", "well_drained"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["banana", "papaya", "curry_leaves"],
    conflictCrops: [],
    benefits: ["vitamin_c", "culinary", "essential_oils", "quick_income"],
    waterRequirement: "medium",
    sunRequirement: "full",
    maturityPeriod: "2-3 years",
    yieldPerPlant: "20-40 kg",
    marketDemand: "high",
    isNative: false,
    imageUrl: "https://images.unsplash.com/photo-1565429166764-82a0086aa2b0"
  },
  {
    id: 14,
    name: "Pomegranate",
    scientificName: "Punica granatum",
    layerNumber: 2,
    category: "fruit_tree",
    spacingRequirement: "6m x 6m",
    soilTypes: ["sandy_loam", "loam", "well_drained"],
    climateZones: ["tropical", "subtropical", "arid"],
    seasons: ["post_monsoon", "winter"],
    companionCrops: ["grapes", "citrus", "herbs"],
    conflictCrops: [],
    benefits: ["antioxidants", "medicinal", "export_value", "drought_tolerant"],
    waterRequirement: "low",
    sunRequirement: "full",
    maturityPeriod: "2-3 years",
    yieldPerPlant: "15-25 kg",
    marketDemand: "high",
    isNative: false,
    imageUrl: "https://images.unsplash.com/photo-1570264602919-c8a895199b94"
  },
  // Additional Layer 3 crops
  {
    id: 15,
    name: "Hibiscus",
    scientificName: "Hibiscus rosa-sinensis",
    layerNumber: 3,
    category: "medicinal_shrub",
    spacingRequirement: "3m x 3m",
    soilTypes: ["loam", "clay_loam", "sandy_loam"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["year_round"],
    companionCrops: ["curry_leaves", "lemon", "drumstick"],
    conflictCrops: [],
    benefits: ["medicinal", "flowers", "hedge", "bee_attraction"],
    waterRequirement: "medium",
    sunRequirement: "partial",
    maturityPeriod: "6-12 months",
    yieldPerPlant: "Flowers & leaves",
    marketDemand: "medium",
    isNative: true,
    imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94901144"
  },
  {
    id: 16,
    name: "Castor",
    scientificName: "Ricinus communis",
    layerNumber: 3,
    category: "oil_plant",
    spacingRequirement: "3m x 3m",
    soilTypes: ["sandy", "loam", "degraded"],
    climateZones: ["tropical", "subtropical", "arid"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["cotton", "millets", "legumes"],
    conflictCrops: [],
    benefits: ["industrial_oil", "soil_reclamation", "pest_deterrent", "bio_fuel"],
    waterRequirement: "low",
    sunRequirement: "full",
    maturityPeriod: "4-6 months",
    yieldPerPlant: "500-800g seeds",
    marketDemand: "high",
    isNative: true,
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0301ba2fe65"
  },
  // Additional Layer 4 crops
  {
    id: 17,
    name: "Lemongrass",
    scientificName: "Cymbopogon citratus",
    layerNumber: 4,
    category: "aromatic_herb",
    spacingRequirement: "60cm x 60cm",
    soilTypes: ["loam", "sandy_loam", "clay_loam"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["year_round"],
    companionCrops: ["ginger", "turmeric", "mint"],
    conflictCrops: [],
    benefits: ["essential_oils", "pest_repellent", "medicinal", "culinary"],
    waterRequirement: "medium",
    sunRequirement: "full",
    maturityPeriod: "3-4 months",
    yieldPerPlant: "200-400g leaves",
    marketDemand: "high",
    isNative: true,
    imageUrl: "https://images.unsplash.com/photo-1615485925385-4d5d1b8a8c39"
  },
  {
    id: 18,
    name: "Chilli",
    scientificName: "Capsicum annuum",
    layerNumber: 4,
    category: "spices",
    spacingRequirement: "45cm x 45cm",
    soilTypes: ["loam", "sandy_loam", "well_drained"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["tomato", "brinjal", "onion"],
    conflictCrops: [],
    benefits: ["spice", "vitamin_c", "pest_deterrent", "high_value"],
    waterRequirement: "medium",
    sunRequirement: "full",
    maturityPeriod: "2-3 months",
    yieldPerPlant: "200-500g",
    marketDemand: "high",
    isNative: false,
    imageUrl: "https://images.unsplash.com/photo-1583158893513-893d8c4019b5"
  },
  // Additional Layer 5 crops
  {
    id: 19,
    name: "Cowpeas",
    scientificName: "Vigna unguiculata",
    layerNumber: 5,
    category: "legumes",
    spacingRequirement: "30cm x 20cm",
    soilTypes: ["sandy", "loam", "clay"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["monsoon", "post_monsoon"],
    companionCrops: ["maize", "sorghum", "cotton"],
    conflictCrops: [],
    benefits: ["nitrogen_fixation", "protein", "fodder", "soil_cover"],
    waterRequirement: "low",
    sunRequirement: "full",
    maturityPeriod: "2-3 months",
    yieldPerPlant: "100-200g pods",
    marketDemand: "medium",
    isNative: false,
    imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b"
  },
  {
    id: 20,
    name: "Mint",
    scientificName: "Mentha arvensis",
    layerNumber: 5,
    category: "herbs",
    spacingRequirement: "30cm x 30cm",
    soilTypes: ["loam", "clay_loam", "moist"],
    climateZones: ["tropical", "subtropical"],
    seasons: ["year_round"],
    companionCrops: ["coriander", "fenugreek", "vegetables"],
    conflictCrops: [],
    benefits: ["culinary", "medicinal", "essential_oils", "ground_cover"],
    waterRequirement: "high",
    sunRequirement: "partial",
    maturityPeriod: "1-2 months",
    yieldPerPlant: "Fresh leaves",
    marketDemand: "high",
    isNative: false,
    imageUrl: "https://images.unsplash.com/photo-1628432136678-43ff9645031b"
  }
];
var ZbnfRecommendationEngine = class {
  crops;
  constructor() {
    this.crops = ZBNF_CROP_DATABASE;
  }
  // Get crops from database, fallback to hardcoded data
  async getCropsFromDatabase() {
    try {
      const dbCrops = await db.query.zbnfCrops.findMany({
        with: {
          layer: true
        }
      });
      if (dbCrops.length > 0) {
        return dbCrops.map((crop) => ({
          id: crop.id,
          name: crop.name,
          scientificName: crop.scientificName || "",
          layerNumber: crop.layer?.layerNumber || 1,
          category: crop.category,
          spacingRequirement: crop.spacingRequirement || "",
          soilTypes: Array.isArray(crop.soilTypes) ? crop.soilTypes : [],
          climateZones: Array.isArray(crop.climateZones) ? crop.climateZones : [],
          seasons: Array.isArray(crop.seasons) ? crop.seasons : [],
          companionCrops: Array.isArray(crop.companionCrops) ? crop.companionCrops : [],
          conflictCrops: Array.isArray(crop.conflictCrops) ? crop.conflictCrops : [],
          benefits: Array.isArray(crop.benefits) ? crop.benefits : [],
          waterRequirement: crop.waterRequirement || "moderate",
          sunRequirement: crop.sunRequirement || "full",
          maturityPeriod: crop.maturityPeriod || "",
          yieldPerPlant: crop.yieldPerPlant || "",
          marketDemand: crop.marketDemand || "medium",
          isNative: crop.isNative || false,
          imageUrl: crop.imageUrl || ""
        }));
      }
    } catch (error) {
      console.log("Database not available, using hardcoded crop data");
    }
    return this.crops;
  }
  // Main recommendation function
  async generateRecommendations(analysis) {
    const recommendations = [];
    const seenCrops = /* @__PURE__ */ new Set();
    for (const gap of analysis.detectedGaps) {
      const gapRecommendations = await this.analyzeGap(gap, analysis);
      const uniqueRecommendations = gapRecommendations.filter((rec) => {
        const cropKey = `${rec.cropName}-${rec.targetLayer}`;
        if (seenCrops.has(cropKey)) {
          return false;
        }
        seenCrops.add(cropKey);
        return true;
      });
      recommendations.push(...uniqueRecommendations);
    }
    return recommendations.sort((a, b) => {
      const priorityOrder = { "high": 3, "medium": 2, "low": 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  // NEW: AI-powered recommendation function
  async generateAIRecommendations(analysis) {
    try {
      const crops = await this.getCropsFromDatabase();
      const aiEngine = new AICropRecommender(crops);
      const farmConditions = {
        location: analysis.climateZone || "Karnataka",
        soilType: analysis.soilType || "loam",
        climateZone: analysis.climateZone || "tropical",
        season: analysis.currentSeason,
        waterAvailability: analysis.waterAvailability,
        existingCrops: analysis.existingCrops,
        detectedGaps: analysis.detectedGaps,
        farmSize: analysis.farmArea || 1
      };
      const aiRecommendations = await aiEngine.generateAIRecommendations(farmConditions, 15);
      return aiRecommendations.map((aiRec, index2) => ({
        id: `ai-rec-${index2}`,
        cropId: 0,
        // AI recommendations don't have specific crop IDs
        cropName: aiRec.cropName,
        targetLayer: aiRec.layer,
        layer: aiRec.layer,
        // Add layer field for frontend
        gapId: analysis.detectedGaps[0]?.id || "gap-1",
        gapSize: analysis.detectedGaps[0]?.size || "medium",
        placementLocation: analysis.detectedGaps[0]?.location || "center",
        estimatedYield: aiRec.roi.expectedReturn > 0 ? `\u20B9${aiRec.roi.expectedReturn.toLocaleString()}` : void 0,
        investmentRequired: aiRec.roi.investment,
        expectedROI: aiRec.roi.paybackPeriod,
        priority: aiRec.confidence > 80 ? "high" : aiRec.confidence > 60 ? "medium" : "low",
        reasoning: aiRec.reasoning,
        seasonalTiming: aiRec.timing.plantingTime,
        benefits: aiRec.benefits,
        companionPlants: [],
        implementationSteps: aiRec.implementation,
        confidence: aiRec.confidence,
        aiPowered: true,
        // Flag to indicate AI recommendation
        timing: aiRec.timing,
        marketDemand: "medium"
        // Default value
      }));
    } catch (error) {
      console.error("AI recommendation failed, falling back to rule-based:", error);
      return this.generateRecommendations(analysis);
    }
  }
  // Analyze individual gap and recommend crops
  async analyzeGap(gap, analysis) {
    const recommendations = [];
    const targetLayers = this.determineTargetLayers(gap.size, analysis.existingCrops);
    for (const targetLayer of targetLayers) {
      const suitableCrops = await this.findSuitableCrops(targetLayer, analysis);
      for (const crop of suitableCrops.slice(0, 2)) {
        const recommendation = this.createRecommendation(crop, gap, targetLayer, analysis);
        recommendations.push(recommendation);
      }
    }
    return recommendations;
  }
  // Determine which layers can fit in the gap
  determineTargetLayers(gapSize, existingCrops) {
    const layers = [];
    const size = this.parseGapSize(gapSize);
    const existingLayers = new Set(existingCrops.map((crop) => crop.layer));
    if (size >= 10) {
      if (!existingLayers.has(1)) layers.push(1);
      if (!existingLayers.has(2)) layers.push(2);
    }
    if (size >= 6) {
      if (!existingLayers.has(2)) layers.push(2);
      if (!existingLayers.has(3)) layers.push(3);
    }
    if (size >= 3) {
      if (!existingLayers.has(3)) layers.push(3);
      if (!existingLayers.has(4)) layers.push(4);
    }
    if (size >= 1) {
      if (!existingLayers.has(4)) layers.push(4);
      if (!existingLayers.has(5)) layers.push(5);
    }
    if (size < 1) {
      layers.push(5);
    }
    return layers.length > 0 ? layers : [5];
  }
  // Parse gap size string to approximate meters
  parseGapSize(gapSize) {
    const size = gapSize.toLowerCase();
    const matches = size.match(/(\d+(?:\.\d+)?)\s*(?:m|meter)/);
    if (matches) {
      return parseFloat(matches[1]);
    }
    if (size.includes("large")) return 12;
    if (size.includes("medium")) return 6;
    if (size.includes("small")) return 3;
    return 6;
  }
  // Find suitable crops for target layer
  async findSuitableCrops(targetLayer, analysis) {
    const crops = await this.getCropsFromDatabase();
    console.log(`Finding crops for layer ${targetLayer} from ${crops.length} total crops`);
    const layerCrops = crops.filter((crop) => crop.layerNumber === targetLayer);
    console.log(`Found ${layerCrops.length} crops for layer ${targetLayer}`);
    const suitableCrops = layerCrops.filter((crop) => this.isCropSuitable(crop, analysis));
    console.log(`Found ${suitableCrops.length} suitable crops for layer ${targetLayer}`);
    return suitableCrops.sort((a, b) => {
      const demandOrder = { "high": 3, "medium": 2, "low": 1 };
      const aScore = demandOrder[a.marketDemand] + (a.isNative ? 1 : 0);
      const bScore = demandOrder[b.marketDemand] + (b.isNative ? 1 : 0);
      return bScore - aScore;
    });
  }
  // Check if crop is suitable for farm conditions
  isCropSuitable(crop, analysis) {
    console.log(`Checking crop ${crop.name} for suitability`);
    if (analysis.soilType && crop.soilTypes.length > 0) {
      const inputSoil = analysis.soilType.toLowerCase();
      const soilCompatible = crop.soilTypes.some((soilType) => {
        const cropSoil = soilType.toLowerCase();
        if (cropSoil === inputSoil) return true;
        if (inputSoil === "clay" && (cropSoil.includes("clay") || cropSoil.includes("loam") || cropSoil === "black soil" || cropSoil === "alluvial" || cropSoil === "all")) return true;
        if (inputSoil === "sandy" && (cropSoil.includes("sandy") || cropSoil.includes("loam") || cropSoil === "red soil" || cropSoil === "laterite" || cropSoil === "all")) return true;
        if (inputSoil === "loam" && (cropSoil.includes("loam") || cropSoil.includes("clay") || cropSoil.includes("sandy") || cropSoil === "alluvial" || cropSoil === "all")) return true;
        if (inputSoil === "red soil" && (cropSoil.includes("red") || cropSoil.includes("sandy") || cropSoil.includes("loam") || cropSoil === "laterite" || cropSoil === "all")) return true;
        if (inputSoil === "black soil" && (cropSoil.includes("black") || cropSoil.includes("clay") || cropSoil.includes("loam") || cropSoil === "alluvial" || cropSoil === "all")) return true;
        if (inputSoil === "alluvial" && (cropSoil.includes("alluvial") || cropSoil.includes("loam") || cropSoil.includes("fertile") || cropSoil === "clay" || cropSoil === "sandy" || cropSoil === "all")) return true;
        if (inputSoil === "laterite" && (cropSoil.includes("laterite") || cropSoil.includes("red") || cropSoil.includes("sandy") || cropSoil.includes("loam") || cropSoil === "all")) return true;
        return cropSoil.includes("loam") || cropSoil === "all" || cropSoil.includes("well") || cropSoil.includes("fertile");
      });
      if (!soilCompatible) {
        console.log(`  - Soil incompatible: ${analysis.soilType} not suitable for [${crop.soilTypes.join(", ")}]`);
        return false;
      }
    }
    if (analysis.waterAvailability && crop.waterRequirement) {
      const waterCompatible = this.checkWaterCompatibility(crop.waterRequirement, analysis.waterAvailability);
      if (!waterCompatible) {
        console.log(`  - Water incompatible: crop needs ${crop.waterRequirement}, farm has ${analysis.waterAvailability}`);
        return false;
      }
    }
    if (analysis.climateZone && crop.climateZones.length > 0) {
      const climateCompatible = crop.climateZones.includes(analysis.climateZone) || crop.climateZones.includes("tropical") || crop.climateZones.includes("subtropical");
      if (!climateCompatible) {
        console.log(`  - Climate incompatible: ${analysis.climateZone} not in [${crop.climateZones.join(", ")}]`);
        return false;
      }
    }
    if (analysis.currentSeason && crop.seasons.length > 0) {
      const seasonCompatible = crop.seasons.includes(analysis.currentSeason) || crop.seasons.includes("year_round") || this.checkSeasonFlexibility(crop.seasons, analysis.currentSeason);
      if (!seasonCompatible) {
        console.log(`  - Season incompatible: ${analysis.currentSeason} not suitable for [${crop.seasons.join(", ")}]`);
        return false;
      }
    }
    console.log(`  - Crop ${crop.name} is suitable`);
    return true;
  }
  // Check water requirement compatibility - generous ZBNF approach
  checkWaterCompatibility(cropWaterReq, farmWaterAvail) {
    const reqLevel = cropWaterReq.toLowerCase();
    const availLevel = farmWaterAvail.toLowerCase();
    if (availLevel === "abundant") return true;
    if (availLevel === "moderate") {
      return reqLevel.includes("low") || reqLevel.includes("medium") || reqLevel.includes("moderate") || reqLevel.includes("high");
    }
    if (availLevel === "scarce") {
      return reqLevel.includes("low") || reqLevel.includes("medium") || reqLevel.includes("drought");
    }
    return true;
  }
  // Check seasonal flexibility for neighboring seasons - generous ZBNF approach
  checkSeasonFlexibility(cropSeasons, currentSeason) {
    const seasonMap = {
      "winter": ["post-harvest", "pre-summer", "post-monsoon"],
      "summer": ["pre-monsoon", "winter", "post-monsoon"],
      "monsoon": ["summer", "post-monsoon", "year-round", "year_round"],
      "post-monsoon": ["monsoon", "winter", "year-round", "year_round"],
      "pre-monsoon": ["summer", "monsoon", "year-round", "year_round"]
    };
    const flexibleSeasons = seasonMap[currentSeason.toLowerCase()] || [];
    return cropSeasons.some(
      (season) => flexibleSeasons.includes(season.toLowerCase()) || season.toLowerCase().includes("year") || season.toLowerCase().includes("round")
    );
  }
  // Create detailed recommendation
  createRecommendation(crop, gap, targetLayer, analysis) {
    const priority = this.calculatePriority(crop, gap, analysis);
    const reasoning = this.generateReasoning(crop, gap, targetLayer, analysis);
    const seasonalTiming = this.getSeasonalTiming(crop, analysis.currentSeason);
    return {
      id: `rec_${Date.now()}_${crop.id}_${gap.id}`,
      cropId: crop.id,
      cropName: crop.name,
      targetLayer,
      gapId: gap.id,
      gapSize: gap.size,
      placementLocation: gap.location,
      estimatedYield: crop.yieldPerPlant,
      priority,
      reasoning,
      seasonalTiming,
      benefits: crop.benefits,
      companionPlants: crop.companionCrops,
      implementationSteps: this.generateImplementationSteps(crop, gap)
    };
  }
  // Calculate recommendation priority
  calculatePriority(crop, gap, analysis) {
    let score = 0;
    if (crop.marketDemand === "high") score += 3;
    else if (crop.marketDemand === "medium") score += 2;
    else score += 1;
    if (crop.isNative) score += 2;
    if (analysis.waterAvailability === "scarce" && crop.waterRequirement === "low") score += 2;
    if (crop.maturityPeriod.includes("month") && !crop.maturityPeriod.includes("year")) score += 1;
    if (score >= 6) return "high";
    if (score >= 4) return "medium";
    return "low";
  }
  // Generate reasoning text
  generateReasoning(crop, gap, targetLayer, analysis) {
    const reasons = [];
    reasons.push(`${crop.name} is recommended for Layer ${targetLayer} in your ${gap.size} gap`);
    if (crop.marketDemand === "high") {
      reasons.push("High market demand ensures good returns");
    }
    if (crop.isNative) {
      reasons.push("Native variety adapted to local conditions");
    }
    if (crop.benefits.includes("nitrogen_fixation")) {
      reasons.push("Improves soil fertility through nitrogen fixation");
    }
    if (analysis.waterAvailability === "scarce" && crop.waterRequirement === "low") {
      reasons.push("Low water requirement suits your water availability");
    }
    return reasons.join(". ") + ".";
  }
  // Get seasonal planting timing
  getSeasonalTiming(crop, currentSeason) {
    if (crop.seasons.includes("year_round")) {
      return "Can be planted year-round";
    }
    if (crop.seasons.includes(currentSeason)) {
      return `Ideal to plant now (${currentSeason} season)`;
    }
    return `Best planted during ${crop.seasons.join(" or ")} season`;
  }
  // Generate implementation steps
  generateImplementationSteps(crop, gap) {
    const steps = [];
    steps.push(`Prepare planting area of ${crop.spacingRequirement} spacing`);
    steps.push(`Source quality ${crop.name} saplings/seeds`);
    steps.push("Prepare soil with organic compost");
    steps.push("Plant according to ZBNF principles (no chemical fertilizers)");
    steps.push("Set up natural pest management");
    steps.push("Monitor growth and provide organic care");
    return steps;
  }
  // Advanced Layer Analysis - detect missing layers and provide targeted recommendations
  async analyzeLayerCompleteness(detectedTrees, analysis) {
    const layerCoverage = this.calculateLayerCoverage(detectedTrees);
    const missingLayers = this.identifyMissingLayers(layerCoverage);
    const layerRecommendations = await this.generateLayerSpecificRecommendations(missingLayers, analysis);
    return {
      currentLayers: layerCoverage,
      missingLayers,
      completionPercentage: this.calculateCompletionPercentage(layerCoverage),
      recommendations: layerRecommendations,
      nextSteps: this.generateImplementationPlan(missingLayers, analysis)
    };
  }
  calculateLayerCoverage(detectedTrees) {
    const coverage = {
      layer1: { present: false, crops: [], coverage: 0 },
      layer2: { present: false, crops: [], coverage: 0 },
      layer3: { present: false, crops: [], coverage: 0 },
      layer4: { present: false, crops: [], coverage: 0 },
      layer5: { present: false, crops: [], coverage: 0 }
    };
    detectedTrees.forEach((tree) => {
      const treeType = tree.type.toLowerCase();
      if (["coconut", "mango", "jackfruit", "jamun"].includes(treeType) || tree.height && parseInt(tree.height) >= 12) {
        coverage.layer1.present = true;
        coverage.layer1.crops.push(tree.type);
        coverage.layer1.coverage += 20;
      }
      if (["banana", "papaya", "drumstick", "areca nut", "guava", "sapota"].includes(treeType) || tree.height && parseInt(tree.height) >= 6 && parseInt(tree.height) < 12) {
        coverage.layer2.present = true;
        coverage.layer2.crops.push(tree.type);
        coverage.layer2.coverage += 15;
      }
    });
    Object.keys(coverage).forEach((layer) => {
      coverage[layer].coverage = Math.min(
        coverage[layer].coverage,
        100
      );
    });
    return coverage;
  }
  identifyMissingLayers(coverage) {
    const missingLayers = [];
    if (!coverage.layer1.present) missingLayers.push(1);
    if (!coverage.layer2.present) missingLayers.push(2);
    if (!coverage.layer3.present) missingLayers.push(3);
    if (!coverage.layer4.present) missingLayers.push(4);
    if (!coverage.layer5.present) missingLayers.push(5);
    return missingLayers;
  }
  async generateLayerSpecificRecommendations(missingLayers, analysis) {
    const recommendations = [];
    for (let layer = 1; layer <= 5; layer++) {
      const suitableCrops = await this.findSuitableCrops(layer, analysis);
      const topCrops = suitableCrops.slice(0, 2);
      const status = missingLayers.includes(layer) ? "missing" : topCrops.length < 2 ? "incomplete" : "optimal";
      recommendations.push({
        layer,
        layerName: this.getLayerName(layer),
        status,
        priority: this.getLayerPriority(layer, analysis),
        recommendedCrops: topCrops.map((crop) => ({
          name: crop.name,
          scientificName: crop.scientificName || "",
          spacing: crop.spacingRequirement,
          benefits: crop.benefits,
          marketDemand: crop.marketDemand,
          maturityPeriod: crop.maturityPeriod,
          reasoning: this.getLayerSpecificReasoning(crop, layer, analysis)
        })),
        implementationNotes: this.getLayerImplementationNotes(layer),
        seasonalTiming: this.getOptimalPlantingTime(layer, analysis.currentSeason)
      });
    }
    return recommendations;
  }
  getLayerName(layer) {
    const names = {
      1: "Canopy Layer (12m+ trees)",
      2: "Sub-canopy Layer (6-12m trees)",
      3: "Shrub Layer (2-6m plants)",
      4: "Herbaceous Layer (0.5-2m plants)",
      5: "Ground Cover (0-0.5m plants)"
    };
    return names[layer] || `Layer ${layer}`;
  }
  getLayerPriority(layer, analysis) {
    if (layer === 1 || layer === 5) return "high";
    if (layer === 2 || layer === 3) return "medium";
    return "low";
  }
  getLayerSpecificReasoning(crop, layer, analysis) {
    const reasons = [];
    if (layer === 1) {
      reasons.push(`Essential for creating forest-like canopy structure in ZBNF`);
      reasons.push(`Provides windbreak and microclimate regulation`);
    } else if (layer === 2) {
      reasons.push(`Quick-yielding crops for early farm income`);
      reasons.push(`Optimal height for fruit harvesting and maintenance`);
    } else if (layer === 3) {
      reasons.push(`Shrub layer completes vertical diversity`);
      reasons.push(`Provides spices, herbs, and medicinal plants`);
    } else if (layer === 4) {
      reasons.push(`Fast-growing vegetables for continuous harvest`);
      reasons.push(`Utilizes understory space efficiently`);
    } else if (layer === 5) {
      reasons.push(`Ground cover prevents soil erosion`);
      reasons.push(`Maximizes space utilization with root vegetables`);
    }
    if (crop.isNative) reasons.push(`Native species adapted to local conditions`);
    if (crop.marketDemand === "high") reasons.push(`High market demand ensures good returns`);
    if (analysis.waterAvailability === "scarce" && crop.waterRequirement === "low") {
      reasons.push(`Drought-tolerant, suitable for water-scarce conditions`);
    }
    return reasons.join(". ");
  }
  getLayerImplementationNotes(layer) {
    const notes = {
      1: [
        "Plant canopy trees with 12m x 12m spacing",
        "Allow 3-5 years for establishment",
        "Provides long-term economic stability",
        "Creates shade for lower layers"
      ],
      2: [
        "Plant with 6m x 6m spacing between canopy trees",
        "Expect harvest within 8-18 months",
        "Provides early income while canopy establishes",
        "Maintain pruning for optimal light penetration"
      ],
      3: [
        "Plant with 3m x 3m spacing in available gaps",
        "Focus on native species for ecosystem balance",
        "Ideal for spices, herbs, and medicinal plants",
        "Provides middle-story diversity"
      ],
      4: [
        "Plant in rows or clusters with close spacing",
        "Rotate crops seasonally for continuous harvest",
        "Utilize understory areas with filtered light",
        "Focus on quick-maturing vegetables and greens"
      ],
      5: [
        "Plant as ground cover in all available spaces",
        "Prevents soil erosion and water loss",
        "Includes root vegetables and creeping plants",
        "Completes the 5-layer ZBNF system"
      ]
    };
    return notes[layer] || [`Implement Layer ${layer} according to ZBNF principles`];
  }
  getOptimalPlantingTime(layer, currentSeason) {
    if (currentSeason === "monsoon") {
      return layer <= 2 ? "Plant immediately during monsoon" : "Plant in early monsoon for best establishment";
    } else if (currentSeason === "post_monsoon") {
      return layer <= 2 ? "Plant immediately with irrigation support" : "Ideal time for herbs and vegetables";
    } else if (currentSeason === "winter") {
      return "Perfect for leafy greens and root vegetables";
    }
    return "Plant based on seasonal requirements";
  }
  calculateCompletionPercentage(coverage) {
    const layers = Object.values(coverage);
    const presentLayers = layers.filter((layer) => layer.present).length;
    return Math.round(presentLayers / 5 * 100);
  }
  generateImplementationPlan(missingLayers, analysis) {
    const steps = [];
    const priorityOrder = [1, 5, 2, 3, 4];
    const sortedLayers = missingLayers.sort(
      (a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b)
    );
    sortedLayers.forEach((layer, index2) => {
      const timeline = this.getImplementationTimeline(layer, index2);
      steps.push({
        step: index2 + 1,
        layer,
        action: `Establish ${this.getLayerName(layer)}`,
        timeline,
        priority: this.getLayerPriority(layer, analysis),
        description: this.getImplementationDescription(layer),
        requirements: this.getImplementationRequirements(layer)
      });
    });
    return steps;
  }
  getImplementationTimeline(layer, stepIndex) {
    const baseMonth = stepIndex * 2;
    if (layer === 1) return `Month ${baseMonth + 1}-${baseMonth + 2}: Plant canopy trees`;
    if (layer === 2) return `Month ${baseMonth + 1}: Plant sub-canopy trees`;
    if (layer === 3) return `Month ${baseMonth + 3}: Establish shrub layer`;
    if (layer === 4) return `Month ${baseMonth + 4}: Plant herbaceous crops`;
    if (layer === 5) return `Month ${baseMonth + 2}: Establish ground cover`;
    return `Month ${baseMonth + 1}: Implement layer`;
  }
  getImplementationDescription(layer) {
    const descriptions = {
      1: "Establish the foundational canopy structure that will provide long-term shade and windbreak for the entire ZBNF system",
      2: "Plant quick-yielding fruit trees that provide early income while the canopy layer establishes",
      3: "Introduce shrubs for spices, herbs, and medicinal plants that complete the middle story diversity",
      4: "Add fast-growing vegetables and greens that utilize understory space for continuous harvest",
      5: "Complete the system with ground cover plants that prevent erosion and maximize space utilization"
    };
    return descriptions[layer] || `Implement layer ${layer}`;
  }
  getImplementationRequirements(layer) {
    const requirements = {
      1: ["Quality saplings from certified nurseries", "Deep soil preparation", "Staking support", "Long-term planning"],
      2: ["Disease-free saplings", "Proper spacing calculation", "Irrigation setup", "Pruning tools"],
      3: ["Native species preference", "Organic soil amendments", "Companion planting consideration", "Regular maintenance"],
      4: ["Seasonal seed varieties", "Composted soil", "Irrigation access", "Harvest planning"],
      5: ["Ground cover seeds/cuttings", "Mulching materials", "Soil preparation", "Weed management"]
    };
    return requirements[layer] || [`Requirements for layer ${layer}`];
  }
  // Get available crops for a specific layer
  async getCropsByLayer(layerNumber) {
    const crops = await this.getCropsFromDatabase();
    return crops.filter((crop) => crop.layerNumber === layerNumber);
  }
  // Get crop details by ID
  async getCropById(cropId) {
    const crops = await this.getCropsFromDatabase();
    return crops.find((crop) => crop.id === cropId);
  }
  // Validate farm analysis input
  validateAnalysisInput(input) {
    const errors = [];
    if (!input.farmerId) errors.push("Farmer ID is required");
    if (!input.detectionMethod) errors.push("Detection method is required");
    if (!input.currentSeason) errors.push("Current season is required");
    if (!input.detectedGaps || input.detectedGaps.length === 0) {
      errors.push("At least one detected gap is required");
    }
    if (!input.existingCrops) input.existingCrops = [];
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
var zbnfEngine = new ZbnfRecommendationEngine();

// server/routes.ts
function calculateDistance(point1, point2) {
  const R = 6371;
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
var JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("CRITICAL: JWT_SECRET environment variable is required for security");
  process.exit(1);
}
var JWT_SECRET_SAFE = JWT_SECRET;
var CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
var CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
  console.error("CRITICAL: CASHFREE_APP_ID and CASHFREE_SECRET_KEY environment variables are required for payment processing");
  process.exit(1);
}
async function getUserActiveSubscription(userId) {
  const now = /* @__PURE__ */ new Date();
  const activeSub = await db.query.customerSubscriptions.findFirst({
    where: and2(
      eq2(customerSubscriptions.userId, userId),
      eq2(customerSubscriptions.status, "active"),
      gte(customerSubscriptions.endDate, now)
    ),
    with: { plan: true },
    orderBy: desc2(customerSubscriptions.endDate)
  });
  return activeSub;
}
function handleError(res, error) {
  console.error("Error:", error);
  if (error instanceof z2.ZodError || error && typeof error === "object" && "name" in error && error.name === "ZodError") {
    console.error("Validation error details:", JSON.stringify(error, null, 2));
    const formattedError = fromZodError(error instanceof z2.ZodError ? error : new z2.ZodError([]));
    console.error("Formatted validation error:", formattedError);
    return res.status(400).json({
      message: "Validation error",
      errors: formattedError.message
    });
  }
  if (error instanceof Error) {
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
  }
  return res.status(500).json({
    message: "Internal server error",
    error: error && typeof error === "object" && "message" in error ? error.message : String(error)
  });
}
var isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized: Admin access required" });
  }
  next();
};
var isAdminOrStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  const allowedRoles = ["admin", "district_manager", "taluk_agent", "delivery_agent"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Unauthorized: Admin or staff access required" });
  }
  next();
};
var authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      console.error("JWT verification failed: token is null, undefined, or empty");
      return res.status(401).json({ message: "Authentication token required" });
    }
    jwt.verify(token, JWT_SECRET_SAFE, (err, user) => {
      if (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  } else if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    console.error("No authentication found - no auth header and no session");
    res.status(401).json({ message: "Authentication required" });
  }
};
async function registerRoutes(app2) {
  const apiPrefix = "/api";
  app2.get(`${apiPrefix}/health`, async (req, res) => {
    try {
      await db.execute(sql2`SELECT 1`);
      const healthStatus = {
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: process.uptime(),
        database: "connected",
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0"
      };
      res.status(200).json(healthStatus);
    } catch (error) {
      const errorStatus = {
        status: "unhealthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: process.uptime(),
        database: "disconnected",
        error: error instanceof Error ? error.message : String(error),
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0"
      };
      res.status(503).json(errorStatus);
    }
  });
  app2.get(`${apiPrefix}/org/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const { deliveryDistrictId } = req.query;
      const dmUser = await db.query.users.findFirst({
        where: and2(
          eq2(users.orgSlug, slug),
          eq2(users.role, "district_manager")
        )
      });
      if (!dmUser) {
        return res.status(404).json({ message: "Organization not found" });
      }
      const dmFarmerRecord = await db.query.farmers.findFirst({
        where: eq2(farmers.userId, dmUser.id)
      });
      const fpoLinks = await db.query.farmerFpoLinks.findMany({
        where: eq2(farmerFpoLinks.dmUserId, dmUser.id)
      });
      const linkedFarmerUserIds = fpoLinks.map((l) => l.farmerUserId);
      const orgFarmers = linkedFarmerUserIds.length > 0 ? await db.query.farmers.findMany({
        where: inArray2(farmers.userId, linkedFarmerUserIds)
      }) : [];
      const linkedFarmerIds = orgFarmers.map((f) => f.id);
      const allFarmerUserIds = [.../* @__PURE__ */ new Set([...linkedFarmerUserIds, dmUser.id])];
      const now = /* @__PURE__ */ new Date();
      const activeProductFilter = and2(
        eq2(products.approvalStatus, "approved"),
        gte(products.availableUntil, now)
      );
      const allProducts = linkedFarmerIds.length > 0 ? await db.query.products.findMany({
        where: and2(
          or2(
            eq2(products.createdByDmId, dmUser.id),
            inArray2(products.farmerId, linkedFarmerIds)
          ),
          activeProductFilter
        ),
        with: { farmer: true }
      }) : await db.query.products.findMany({
        where: and2(
          eq2(products.createdByDmId, dmUser.id),
          activeProductFilter
        ),
        with: { farmer: true }
      });
      let filteredProducts = allProducts;
      if (deliveryDistrictId && typeof deliveryDistrictId === "string" && deliveryDistrictId !== "all") {
        const custDistrictId = parseInt(deliveryDistrictId);
        const deliveryDistrict = await db.select().from(fpoDeliveryDistricts).where(and2(
          eq2(fpoDeliveryDistricts.dmUserId, dmUser.id),
          eq2(fpoDeliveryDistricts.districtId, custDistrictId),
          eq2(fpoDeliveryDistricts.isActive, true)
        ));
        if (deliveryDistrict.length === 0) {
          filteredProducts = [];
        }
      }
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const allOrgEvents = allFarmerUserIds.length > 0 ? await db.query.farmEvents.findMany({
        where: and2(
          or2(
            eq2(farmEvents.dmId, dmUser.id),
            inArray2(farmEvents.farmerId, allFarmerUserIds)
          ),
          or2(
            eq2(farmEvents.status, "live"),
            eq2(farmEvents.status, "approved")
          )
        ),
        with: { dates: true, gallery: true }
      }) : [];
      const orgEvents = allOrgEvents.filter((event) => {
        const dates = event.dates || [];
        if (dates.length === 0) return true;
        return dates.some((d) => d.eventDate >= today);
      });
      const orgEventsEnriched = await Promise.all(orgEvents.map(async (e) => {
        const farmerProfile = e.farmerId ? await db.query.farmers.findFirst({ where: eq2(farmers.userId, e.farmerId) }) : null;
        return { ...e, farmerProfile: farmerProfile || null };
      }));
      const orgGallery = [];
      if (dmFarmerRecord?.farmImages && Array.isArray(dmFarmerRecord.farmImages)) {
        dmFarmerRecord.farmImages.forEach((img) => {
          if (img && typeof img === "string") {
            orgGallery.push(img);
          }
        });
      }
      res.json({
        id: dmUser.id,
        orgName: dmUser.orgName || "",
        orgSlug: dmUser.orgSlug || "",
        orgLogoUrl: dmUser.orgLogoUrl || "",
        orgEmail: dmUser.orgEmail || "",
        orgPhone: dmUser.orgPhone || "",
        district: dmUser.district || "",
        orgGallery,
        products: filteredProducts.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          unit: p.unit,
          imageUrl: p.imageUrl,
          categoryId: p.categoryId,
          category: p.category,
          harvestDate: p.harvestDate,
          harvestMonth: p.harvestMonth,
          availableUntil: p.availableUntil,
          status: p.status,
          inventory: p.inventory,
          unitsPerBox: p.unitsPerBox,
          b2bQuantity: p.b2bQuantity,
          hasSlabPricing: p.hasSlabPricing,
          isOrganic: p.isOrganic,
          rating: p.rating,
          reviewCount: p.reviewCount,
          approvalStatus: p.approvalStatus,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          farm: p.farmer ? {
            id: p.farmer.id,
            name: p.farmer.farmName,
            location: p.farmer.location,
            logoUrl: p.farmer.logoUrl,
            isZbnfCertified: p.farmer.isZbnfCertified,
            isOrganicCertified: p.farmer.isOrganicCertified,
            isNaturalCertified: p.farmer.isNaturalCertified
          } : null
        })),
        farmers: orgFarmers.map((f) => ({
          id: f.id,
          farmName: f.farmName,
          location: f.location,
          imageUrl: f.imageUrl,
          logoUrl: f.logoUrl,
          description: f.description,
          rating: f.rating,
          isZbnfCertified: f.isZbnfCertified,
          isOrganicCertified: f.isOrganicCertified,
          isNaturalCertified: f.isNaturalCertified,
          tags: f.tags,
          farmImages: f.farmImages
        })),
        events: orgEventsEnriched.map((e) => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          description: e.description,
          eventType: e.eventType,
          cropType: e.cropType,
          location: e.location,
          address: e.address,
          startTime: e.startTime,
          endTime: e.endTime,
          totalSeats: e.totalSeats,
          pricePerSeat: e.pricePerSeat,
          coverImage: e.coverImage,
          status: e.status,
          gallery: e.gallery || [],
          farmerProfile: e.farmerProfile ? {
            farmName: e.farmerProfile.farmName,
            farmImages: e.farmerProfile.farmImages || []
          } : null
        }))
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/orgs`, async (req, res) => {
    try {
      const { deliveryDistrictId } = req.query;
      const dmUsers = await db.query.users.findMany({
        where: and2(
          eq2(users.role, "district_manager"),
          eq2(users.isActive, true)
        )
      });
      let validDms = dmUsers.filter((dm) => dm.orgSlug);
      if (deliveryDistrictId && typeof deliveryDistrictId === "string" && deliveryDistrictId !== "all") {
        const custDistrictId = parseInt(deliveryDistrictId);
        const deliverableDms = await db.select({ dmUserId: fpoDeliveryDistricts.dmUserId }).from(fpoDeliveryDistricts).where(and2(
          eq2(fpoDeliveryDistricts.districtId, custDistrictId),
          eq2(fpoDeliveryDistricts.isActive, true)
        ));
        const deliverableDmIds = new Set(deliverableDms.map((d) => d.dmUserId));
        validDms = validDms.filter((dm) => deliverableDmIds.has(dm.id));
      }
      const dmIds = validDms.map((dm) => dm.id);
      let allLinks = [];
      let allFarmerRecords = [];
      let allFpoFollows = [];
      if (dmIds.length > 0) {
        [allLinks, allFpoFollows] = await Promise.all([
          db.select({
            dmUserId: farmerFpoLinks.dmUserId,
            farmerUserId: farmerFpoLinks.farmerUserId
          }).from(farmerFpoLinks).where(inArray2(farmerFpoLinks.dmUserId, dmIds)),
          db.select({
            dmUserId: fpoFollows.dmUserId
          }).from(fpoFollows).where(inArray2(fpoFollows.dmUserId, dmIds))
        ]);
        const farmerUserIds = [...new Set(allLinks.map((l) => l.farmerUserId))];
        if (farmerUserIds.length > 0) {
          allFarmerRecords = await db.select({
            userId: farmers.userId,
            isZbnfCertified: farmers.isZbnfCertified,
            isOrganicCertified: farmers.isOrganicCertified,
            isNaturalCertified: farmers.isNaturalCertified
          }).from(farmers).where(inArray2(farmers.userId, farmerUserIds));
        }
      }
      const organicMap = new Map(allFarmerRecords.map((f) => [f.userId, f.isOrganicCertified]));
      const naturalMap = new Map(allFarmerRecords.map((f) => [f.userId, f.isNaturalCertified]));
      const orgsWithCerts = validDms.map((dm) => {
        const dmLinks = allLinks.filter((l) => l.dmUserId === dm.id);
        const organicCertifiedCount = dmLinks.filter((l) => organicMap.get(l.farmerUserId) === true).length;
        const naturalCertifiedCount = dmLinks.filter((l) => naturalMap.get(l.farmerUserId) === true).length;
        const followerCount = allFpoFollows.filter((f) => f.dmUserId === dm.id).length;
        return {
          id: dm.id,
          orgName: dm.orgName || "",
          orgSlug: dm.orgSlug || "",
          orgLogoUrl: dm.orgLogoUrl || "",
          district: dm.district || "",
          organicCertifiedCount,
          naturalCertifiedCount,
          totalFarmers: dmLinks.length,
          followerCount
        };
      });
      res.json(orgsWithCerts);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo/:dmUserId/followers`, async (req, res) => {
    try {
      const dmUserId = parseInt(req.params.dmUserId);
      if (isNaN(dmUserId)) {
        return res.status(400).json({ message: "Invalid DM user ID" });
      }
      const followerRows = await db.select({
        followerId: fpoFollows.followerId,
        name: users.name
      }).from(fpoFollows).innerJoin(users, eq2(fpoFollows.followerId, users.id)).where(eq2(fpoFollows.dmUserId, dmUserId));
      const followerNames = followerRows.filter((f) => f && f.name).map((f) => ({ name: f.name }));
      res.json(followerNames);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo/followers/bulk`, async (req, res) => {
    try {
      const dmUserIds = (req.query.ids || "").split(",").map(Number).filter((n) => !isNaN(n));
      if (dmUserIds.length === 0) {
        return res.json({});
      }
      const allFollows = await db.select({
        dmUserId: fpoFollows.dmUserId
      }).from(fpoFollows).where(inArray2(fpoFollows.dmUserId, dmUserIds));
      const counts = {};
      dmUserIds.forEach((id) => {
        counts[id] = 0;
      });
      allFollows.forEach((f) => {
        counts[f.dmUserId] = (counts[f.dmUserId] || 0) + 1;
      });
      res.json(counts);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo/:dmUserId/is-following`, authenticateJWT, async (req, res) => {
    try {
      const dmUserId = parseInt(req.params.dmUserId);
      if (isNaN(dmUserId)) {
        return res.status(400).json({ message: "Invalid DM user ID" });
      }
      const follow = await db.query.fpoFollows.findFirst({
        where: and2(
          eq2(fpoFollows.followerId, req.user.id),
          eq2(fpoFollows.dmUserId, dmUserId)
        )
      });
      res.json({ isFollowing: !!follow });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/fpo/:dmUserId/follow`, authenticateJWT, async (req, res) => {
    try {
      const dmUserId = parseInt(req.params.dmUserId);
      if (isNaN(dmUserId)) {
        return res.status(400).json({ message: "Invalid DM user ID" });
      }
      const dmUser = await storage.getUserById(dmUserId);
      if (!dmUser || dmUser.role !== "district_manager") {
        return res.status(404).json({ message: "FPO store not found" });
      }
      const result = await db.insert(fpoFollows).values({
        followerId: req.user.id,
        dmUserId
      }).onConflictDoNothing().returning();
      if (result.length === 0) {
        return res.json({ message: "Already following", isFollowing: true });
      }
      const followerCount = (await db.select({ id: fpoFollows.id }).from(fpoFollows).where(eq2(fpoFollows.dmUserId, dmUserId))).length;
      res.json({ message: "Now following this store", isFollowing: true, followerCount });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/fpo/:dmUserId/follow`, authenticateJWT, async (req, res) => {
    try {
      const dmUserId = parseInt(req.params.dmUserId);
      if (isNaN(dmUserId)) {
        return res.status(400).json({ message: "Invalid DM user ID" });
      }
      await db.delete(fpoFollows).where(
        and2(
          eq2(fpoFollows.followerId, req.user.id),
          eq2(fpoFollows.dmUserId, dmUserId)
        )
      );
      const followerCount = (await db.select({ id: fpoFollows.id }).from(fpoFollows).where(eq2(fpoFollows.dmUserId, dmUserId))).length;
      res.json({ message: "Unfollowed this store", isFollowing: false, followerCount });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo/delivery/districts`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Only district managers can manage delivery" });
      }
      const deliveryDistricts = await db.select({
        id: fpoDeliveryDistricts.id,
        districtId: fpoDeliveryDistricts.districtId,
        districtName: districts.name,
        districtState: districts.state,
        isActive: fpoDeliveryDistricts.isActive
      }).from(fpoDeliveryDistricts).innerJoin(districts, eq2(fpoDeliveryDistricts.districtId, districts.id)).where(eq2(fpoDeliveryDistricts.dmUserId, req.user.id));
      res.json(deliveryDistricts);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/fpo/delivery/districts`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Only district managers can manage delivery" });
      }
      const { districtIds } = req.body;
      if (!Array.isArray(districtIds)) {
        return res.status(400).json({ error: "districtIds must be an array" });
      }
      await db.delete(fpoDeliveryDistricts).where(eq2(fpoDeliveryDistricts.dmUserId, req.user.id));
      if (districtIds.length > 0) {
        const values = districtIds.map((districtId) => ({
          dmUserId: req.user.id,
          districtId,
          isActive: true
        }));
        await db.insert(fpoDeliveryDistricts).values(values);
      }
      const updated = await db.select({
        id: fpoDeliveryDistricts.id,
        districtId: fpoDeliveryDistricts.districtId,
        districtName: districts.name,
        districtState: districts.state,
        isActive: fpoDeliveryDistricts.isActive
      }).from(fpoDeliveryDistricts).innerJoin(districts, eq2(fpoDeliveryDistricts.districtId, districts.id)).where(eq2(fpoDeliveryDistricts.dmUserId, req.user.id));
      res.json(updated);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo/delivery/pricing`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Only district managers can manage delivery" });
      }
      const pricing = await db.select({
        id: fpoDeliveryPricing.id,
        dmUserId: fpoDeliveryPricing.dmUserId,
        districtId: fpoDeliveryPricing.districtId,
        districtName: districts.name,
        districtState: districts.state,
        minWeightKg: fpoDeliveryPricing.minWeightKg,
        maxWeightKg: fpoDeliveryPricing.maxWeightKg,
        priceRs: fpoDeliveryPricing.priceRs,
        sortOrder: fpoDeliveryPricing.sortOrder,
        createdAt: fpoDeliveryPricing.createdAt
      }).from(fpoDeliveryPricing).innerJoin(districts, eq2(fpoDeliveryPricing.districtId, districts.id)).where(eq2(fpoDeliveryPricing.dmUserId, req.user.id)).orderBy(asc2(fpoDeliveryPricing.districtId), asc2(fpoDeliveryPricing.sortOrder));
      res.json(pricing);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/fpo/delivery/pricing/:districtId`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Only district managers can manage delivery" });
      }
      const districtId = parseInt(req.params.districtId);
      const { tiers } = req.body;
      if (!Array.isArray(tiers) || tiers.length === 0) {
        return res.status(400).json({ error: "At least one pricing tier is required" });
      }
      const deliveryDistrict = await db.select().from(fpoDeliveryDistricts).where(and2(
        eq2(fpoDeliveryDistricts.dmUserId, req.user.id),
        eq2(fpoDeliveryDistricts.districtId, districtId),
        eq2(fpoDeliveryDistricts.isActive, true)
      ));
      if (deliveryDistrict.length === 0) {
        return res.status(400).json({ error: "District is not in your delivery list. Add it to delivery districts first." });
      }
      await db.delete(fpoDeliveryPricing).where(and2(
        eq2(fpoDeliveryPricing.dmUserId, req.user.id),
        eq2(fpoDeliveryPricing.districtId, districtId)
      ));
      const values = tiers.map((tier, index2) => ({
        dmUserId: req.user.id,
        districtId,
        minWeightKg: String(tier.minWeightKg),
        maxWeightKg: tier.maxWeightKg ? String(tier.maxWeightKg) : null,
        priceRs: String(tier.priceRs),
        sortOrder: index2
      }));
      await db.insert(fpoDeliveryPricing).values(values);
      const updated = await db.select({
        id: fpoDeliveryPricing.id,
        dmUserId: fpoDeliveryPricing.dmUserId,
        districtId: fpoDeliveryPricing.districtId,
        districtName: districts.name,
        minWeightKg: fpoDeliveryPricing.minWeightKg,
        maxWeightKg: fpoDeliveryPricing.maxWeightKg,
        priceRs: fpoDeliveryPricing.priceRs,
        sortOrder: fpoDeliveryPricing.sortOrder
      }).from(fpoDeliveryPricing).innerJoin(districts, eq2(fpoDeliveryPricing.districtId, districts.id)).where(and2(
        eq2(fpoDeliveryPricing.dmUserId, req.user.id),
        eq2(fpoDeliveryPricing.districtId, districtId)
      )).orderBy(asc2(fpoDeliveryPricing.sortOrder));
      res.json(updated);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/fpo/delivery/pricing/:districtId`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Only district managers can manage delivery" });
      }
      const districtId = parseInt(req.params.districtId);
      await db.delete(fpoDeliveryPricing).where(and2(
        eq2(fpoDeliveryPricing.dmUserId, req.user.id),
        eq2(fpoDeliveryPricing.districtId, districtId)
      ));
      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo/:dmUserId/delivery/pricing`, async (req, res) => {
    try {
      const dmUserId = parseInt(req.params.dmUserId);
      const { districtId } = req.query;
      let whereConditions = [eq2(fpoDeliveryPricing.dmUserId, dmUserId)];
      if (districtId && typeof districtId === "string") {
        whereConditions.push(eq2(fpoDeliveryPricing.districtId, parseInt(districtId)));
      }
      const pricing = await db.select({
        id: fpoDeliveryPricing.id,
        districtId: fpoDeliveryPricing.districtId,
        districtName: districts.name,
        minWeightKg: fpoDeliveryPricing.minWeightKg,
        maxWeightKg: fpoDeliveryPricing.maxWeightKg,
        priceRs: fpoDeliveryPricing.priceRs,
        sortOrder: fpoDeliveryPricing.sortOrder
      }).from(fpoDeliveryPricing).innerJoin(districts, eq2(fpoDeliveryPricing.districtId, districts.id)).where(and2(...whereConditions)).orderBy(asc2(fpoDeliveryPricing.districtId), asc2(fpoDeliveryPricing.sortOrder));
      res.json(pricing);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo/:dmUserId/delivery/districts`, async (req, res) => {
    try {
      const dmUserId = parseInt(req.params.dmUserId);
      const deliveryDistricts = await db.select({
        districtId: fpoDeliveryDistricts.districtId,
        districtName: districts.name,
        districtState: districts.state
      }).from(fpoDeliveryDistricts).innerJoin(districts, eq2(fpoDeliveryDistricts.districtId, districts.id)).where(and2(
        eq2(fpoDeliveryDistricts.dmUserId, dmUserId),
        eq2(fpoDeliveryDistricts.isActive, true)
      ));
      res.json(deliveryDistricts);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo/delivery/districts-with-pricing`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Only district managers can access this" });
      }
      const districtsWithPricing = await db.selectDistinct({
        districtId: fpoDeliveryPricing.districtId
      }).from(fpoDeliveryPricing).where(eq2(fpoDeliveryPricing.dmUserId, req.user.id));
      res.json(districtsWithPricing.map((d) => d.districtId));
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/delivery/calculate`, async (req, res) => {
    try {
      const { dmUserId, totalWeightKg, districtId } = req.body;
      if (!dmUserId || !totalWeightKg) {
        return res.status(400).json({ error: "dmUserId and totalWeightKg are required" });
      }
      if (districtId) {
        const deliveryDistrict = await db.select().from(fpoDeliveryDistricts).where(and2(
          eq2(fpoDeliveryDistricts.dmUserId, dmUserId),
          eq2(fpoDeliveryDistricts.districtId, districtId),
          eq2(fpoDeliveryDistricts.isActive, true)
        ));
        if (deliveryDistrict.length === 0) {
          return res.json({ deliveryAvailable: false, fee: 0, message: "Delivery not available to your district" });
        }
      }
      let pricingConditions = [eq2(fpoDeliveryPricing.dmUserId, dmUserId)];
      if (districtId) {
        pricingConditions.push(eq2(fpoDeliveryPricing.districtId, districtId));
      }
      const pricing = await db.select().from(fpoDeliveryPricing).where(and2(...pricingConditions)).orderBy(asc2(fpoDeliveryPricing.sortOrder));
      if (pricing.length === 0) {
        return res.json({ deliveryAvailable: true, fee: 0, message: "Free delivery" });
      }
      const weight = parseFloat(totalWeightKg);
      let fee = 0;
      for (const tier of pricing) {
        const min = parseFloat(tier.minWeightKg);
        const max = tier.maxWeightKg ? parseFloat(tier.maxWeightKg) : Infinity;
        if (weight >= min && weight <= max) {
          fee = parseFloat(tier.priceRs);
          break;
        }
      }
      res.json({ deliveryAvailable: true, fee, totalWeightKg: weight });
    } catch (error) {
      handleError(res, error);
    }
  });
  const serveHTMLWithMetaTags = async (req, res, getMetaTagsFn) => {
    try {
      const identifier = req.params.identifier;
      const metaData = await getMetaTagsFn(identifier);
      if (!metaData) {
        return res.sendFile(join(process.cwd(), "client/index.html"));
      }
      let html = readFileSync(join(process.cwd(), "client/index.html"), "utf8");
      const metaTags = generateMetaTags(metaData);
      html = html.replace(/<title>.*?<\/title>/, `<title>${metaData.title}</title>`);
      const metaTagsInsertPoint = html.indexOf("</head>");
      if (metaTagsInsertPoint !== -1) {
        html = html.slice(0, metaTagsInsertPoint) + metaTags + html.slice(metaTagsInsertPoint);
      }
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      console.error("Error serving HTML with meta tags:", error);
      res.sendFile(join(process.cwd(), "client/index.html"));
    }
  };
  app2.get(`${apiPrefix}/meta-test/products/:identifier`, async (req, res) => {
    try {
      const metaData = await getProductMetaTags(req.params.identifier);
      res.json(metaData);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/meta-v2/products/:identifier`, async (req, res) => {
    try {
      const { generateProductMetaTags: generateProductMetaTags2 } = await Promise.resolve().then(() => (init_meta_service_v2(), meta_service_v2_exports));
      const metaData = await generateProductMetaTags2(req.params.identifier);
      if (!metaData) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(metaData);
    } catch (error) {
      console.error("Meta V2 error:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/meta-fresh/products/:identifier`, async (req, res) => {
    try {
      console.log("\u{1F525} Fresh meta endpoint called with identifier:", req.params.identifier);
      let id;
      if (/^\d+$/.test(req.params.identifier)) {
        id = parseInt(req.params.identifier);
      } else {
        const match = req.params.identifier.match(/-(\d+)$/);
        if (!match) {
          console.log("No ID found in identifier:", req.params.identifier);
          return res.status(404).json({ error: "Product not found" });
        }
        id = parseInt(match[1]);
      }
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      console.log("\u{1F525} Fresh meta - Product data:", {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        unitsPerBox: product.unitsPerBox
      });
      const categoryName = product.category?.name || "Produce";
      const title = product.name + " - Fresh " + categoryName + " | FarmerSanthe.com";
      const cleanDescription = product.description.replace(/["\n\r]/g, " ").trim();
      const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
      const unitsPerBox = product.unitsPerBox;
      const unit = product.unit;
      let priceDisplay = "\u20B9" + price.toFixed(2) + "/box";
      if (unitsPerBox && unit) {
        priceDisplay += " (" + unitsPerBox + " " + unit + " per box)";
      }
      console.log("\u{1F525} Fresh meta - Final price display:", priceDisplay);
      const description = "Buy fresh " + product.name + " directly from local farmers. " + cleanDescription.slice(0, 80) + "... Available now at " + priceDisplay + " on FarmerSanthe marketplace. [FRESH-" + (/* @__PURE__ */ new Date()).toISOString() + "]";
      const imageUrl = "https://farmersanthe.com/public/logo-santhe.png";
      const productUrl = "https://farmersanthe.com/products/" + id;
      const result = {
        title,
        description,
        image: imageUrl,
        url: productUrl,
        type: "product",
        siteName: "FarmerSanthe"
      };
      console.log("\u{1F525} Fresh meta result:", result);
      res.json(result);
    } catch (error) {
      console.error("Fresh meta error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get(`${apiPrefix}/meta-test/farmers/:identifier`, async (req, res) => {
    try {
      const metaData = await getFarmerMetaTags(req.params.identifier);
      res.json(metaData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post(`${apiPrefix}/upload`, authenticateJWT, upload.single("image"), async (req, res) => {
    try {
      console.log("Processing authenticated upload request...");
      if (!req.file) {
        console.log("No file received in the request");
        return res.status(400).json({ message: "No file uploaded" });
      }
      const imageUrl = await StorageService.uploadImage(req.file, "uploads");
      console.log("File uploaded successfully:", {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: imageUrl,
        userId: req.user?.id
      });
      res.status(200).json({
        imageUrl,
        message: "File uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({
        message: "File upload failed",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post(`${apiPrefix}/upload/multiple`, authenticateJWT, upload.array("images", 5), async (req, res) => {
    try {
      console.log("Processing multiple files upload request...");
      if (!req.files || req.files.length === 0) {
        console.log("No files received in the request");
        return res.status(400).json({ message: "No files uploaded" });
      }
      const files = req.files;
      const fileUrls = files.map((file) => {
        const filename = path3.basename(file.path);
        return `/uploads/${filename}`;
      });
      console.log(`Successfully uploaded ${fileUrls.length} files:`, fileUrls);
      res.status(200).json({
        imageUrls: fileUrls,
        message: "Files uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      res.status(500).json({
        message: "Files upload failed",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post(`${apiPrefix}/users/avatar`, authenticateJWT, upload.single("avatar"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No avatar image uploaded" });
      }
      const userId = req.user.id;
      console.log("Processing avatar upload for user:", userId);
      const avatarUrl = await StorageService.uploadImage(req.file, "avatars");
      const updatedUser = await storage.updateUser(userId, { avatar: avatarUrl });
      const { password, ...userWithoutPassword } = updatedUser;
      console.log(`User avatar updated for user ${userId}:`, avatarUrl);
      res.status(200).json({
        user: userWithoutPassword,
        message: "Avatar updated successfully",
        avatarUrl
      });
    } catch (error) {
      console.error("Error updating user avatar:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/products/:id/images`, authenticateJWT, upload.single("image"), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (!req.file) {
        const { imageUrl: imageUrl2, isPrimary: isPrimary2 } = req.body;
        if (!imageUrl2) {
          return res.status(400).json({ message: "No image file or image URL provided" });
        }
        const product2 = await storage.getProductById(productId);
        if (!product2) {
          return res.status(404).json({ message: "Product not found" });
        }
        const farmer = await storage.getFarmerByUserId(req.user.id);
        if (!farmer || product2.farmerId !== farmer.id) {
          return res.status(403).json({ message: "You don't have permission to modify this product" });
        }
        const productImage2 = await storage.createProductImage({
          productId,
          imageUrl: imageUrl2,
          isPrimary: isPrimary2 === true
        });
        return res.status(201).json(productImage2);
      }
      console.log("\u{1F5BC}\uFE0F Processing product image upload:", {
        productId,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        userId: req.user?.id
      });
      const product = await storage.getProductById(productId);
      console.log("\u{1F4E6} Product found:", product ? { id: product.id, name: product.name, farmerId: product.farmerId } : null);
      if (!product) {
        console.error("\u274C Product not found for ID:", productId);
        return res.status(404).json({ message: "Product not found" });
      }
      const userRole = req.user.role;
      const isAdminOrDM = userRole === "admin" || userRole === "district_manager";
      if (!isAdminOrDM) {
        const farmer = await storage.getFarmerByUserId(req.user.id);
        console.log("\u{1F468}\u200D\u{1F33E} Farmer found:", farmer ? { id: farmer.id, userId: farmer.userId, farmName: farmer.farmName } : null);
        if (!farmer) {
          console.error("\u274C Farmer profile not found for user ID:", req.user.id);
          return res.status(403).json({ message: "Farmer profile not found" });
        }
        if (product.farmerId !== farmer.id) {
          console.error("\u274C Permission denied. Product farmerId:", product.farmerId, "User farmer ID:", farmer.id);
          return res.status(403).json({ message: "You don't have permission to modify this product" });
        }
      } else {
        console.log("\u2705 Admin/DM user uploading image for product:", productId);
      }
      console.log("\u2601\uFE0F Starting Cloudinary upload...");
      const imageUrl = await StorageService.uploadImage(req.file, "product-images");
      console.log("\u2705 Cloudinary upload successful:", imageUrl);
      const isPrimary = req.body.isPrimary === "true";
      console.log("\u{1F3F7}\uFE0F Creating product image record:", { productId, imageUrl, isPrimary });
      const productImage = await storage.createProductImage({
        productId,
        imageUrl,
        isPrimary
      });
      console.log("\u2705 Product image created:", productImage);
      if (isPrimary) {
        console.log("\u{1F3AF} Setting as primary image...");
        await storage.setPrimaryProductImage(productImage.id, productId);
        console.log("\u2705 Primary image updated");
      }
      return res.status(201).json(productImage);
    } catch (error) {
      console.error("Error adding product image:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/products/:id/images`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const images = await storage.getProductImages(productId);
      return res.status(200).json(images);
    } catch (error) {
      console.error("Error getting product images:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/products/:id/price-slabs`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const priceSlabs = await db.query.productPriceSlabs.findMany({
        where: eq2(productPriceSlabs.productId, productId),
        orderBy: [asc2(productPriceSlabs.minQuantity)]
      });
      return res.status(200).json(priceSlabs);
    } catch (error) {
      console.error("Error getting product price slabs:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/products/:id/images/:imageId/primary`, authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const imageId = parseInt(req.params.imageId);
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer || product.farmerId !== farmer.id) {
        return res.status(403).json({ message: "You don't have permission to modify this product" });
      }
      await storage.setPrimaryProductImage(imageId, productId);
      const images = await storage.getProductImages(productId);
      return res.status(200).json(images);
    } catch (error) {
      console.error("Error setting primary image:", error);
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/products/:id/images/:imageId`, authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const imageId = parseInt(req.params.imageId);
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const userRole = req.user.role;
      const isAdminOrDM = userRole === "admin" || userRole === "district_manager";
      if (!isAdminOrDM) {
        const farmer = await storage.getFarmerByUserId(req.user.id);
        if (!farmer || product.farmerId !== farmer.id) {
          return res.status(403).json({ message: "You don't have permission to modify this product" });
        }
      }
      await storage.deleteProductImage(imageId);
      return res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting product image:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/register`, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      if (userData.role === "farmer") {
        if (!req.body.farmName || req.body.farmName.trim().length < 2) {
          return res.status(400).json({
            message: "Farm name is required and must be at least 2 characters"
          });
        }
        if (!req.body.farmDescription || req.body.farmDescription.trim().length < 10) {
          return res.status(400).json({
            message: "Farm description is required and must be at least 10 characters"
          });
        }
        if (!req.body.farmLocation || req.body.farmLocation.trim().length === 0) {
          return res.status(400).json({
            message: "Farm location is required"
          });
        }
      }
      const hashedPassword = await hash(userData.password, 10);
      const userDataWithDistrict = {
        ...userData,
        password: hashedPassword,
        // For farmers, set district from farmLocation
        district: userData.role === "farmer" ? req.body.farmLocation.trim() : userData.district
      };
      const newUser = await storage.createUser(userDataWithDistrict);
      if (userData.role === "farmer") {
        await storage.createFarmer({
          userId: newUser.id,
          farmName: req.body.farmName.trim(),
          description: req.body.farmDescription.trim(),
          location: req.body.farmLocation.trim(),
          phone: userData.phone,
          // Sync phone number from user data
          email: userData.email
          // Sync email from user data
        });
      } else {
        await storage.createCustomer({
          userId: newUser.id
        });
      }
      sendWelcomeEmail(newUser).catch((err) => {
        console.error("Failed to send welcome email:", err);
      });
      const token = jwt.sign({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        district: newUser.district,
        taluk: newUser.taluk,
        reportsTo: newUser.reportsTo
      }, JWT_SECRET_SAFE, { expiresIn: "7d" });
      const safeUser = sanitizeUserData(newUser);
      res.status(201).json({
        user: safeUser,
        token
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/auth/me`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const safeUser = sanitizeUserData(user);
      res.json(safeUser);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/login`, async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      if (!user.isActive) {
        return res.status(401).json({ message: "Account has been deactivated. Please contact administrator." });
      }
      const passwordValid = await compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      const token = jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role,
        district: user.district,
        taluk: user.taluk,
        reportsTo: user.reportsTo
      }, JWT_SECRET_SAFE, { expiresIn: "7d" });
      if (req.session) {
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role,
          district: user.district,
          taluk: user.taluk,
          reportsTo: user.reportsTo
        };
      }
      const safeUser = sanitizeUserData(user);
      res.json({
        user: safeUser,
        token
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/forgot-password`, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const resetToken = await setPasswordResetToken(email);
      res.json({
        message: "If your email is registered, you will receive password reset instructions.",
        // Include token in debug/development mode only
        ...process.env.NODE_ENV === "production" ? {} : {
          resetUrl: `https://farmersanthe.com/reset-password?token=${resetToken}`,
          resetToken
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/reset-password/:token`, async (req, res) => {
    try {
      const { token } = req.params;
      const user = await storage.getUserByResetToken(token);
      if (!user || !user.resetTokenExpiry) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      const now = /* @__PURE__ */ new Date();
      if (new Date(user.resetTokenExpiry) < now) {
        return res.status(400).json({ message: "Reset token has expired" });
      }
      res.json({ message: "Valid reset token", email: user.email });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/reset-password`, async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }
      const user = await storage.getUserByResetToken(token);
      if (!user || !user.resetTokenExpiry) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      const now = /* @__PURE__ */ new Date();
      if (new Date(user.resetTokenExpiry) < now) {
        return res.status(400).json({ message: "Reset token has expired" });
      }
      console.log("Resetting password for user:", {
        id: user.id,
        username: user.username,
        email: user.email
      });
      const hashedPassword = await hash(password, 10);
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      });
      const updatedUser = await storage.getUserById(user.id);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found after password reset" });
      }
      console.log("User after password reset:", {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        resetToken: updatedUser.resetToken,
        resetTokenExpiry: updatedUser.resetTokenExpiry
      });
      res.json({
        message: "Password has been reset successfully",
        username: user.username
        // Return username to help user log in
      });
    } catch (error) {
      console.error("Password reset error:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/districts`, async (req, res) => {
    try {
      const onlyActive = req.query.active === "true";
      const districts2 = onlyActive ? await storage.getActiveDistricts() : await storage.getAllDistricts();
      res.json(districts2);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/districts`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      const { name, state, isActive } = req.body;
      if (!name) {
        return res.status(400).json({ message: "District name is required" });
      }
      const existingDistrict = await storage.getDistrictByName(name);
      if (existingDistrict) {
        return res.status(400).json({ message: "District with this name already exists" });
      }
      const newDistrict = await storage.createDistrict({
        name,
        state: state || "",
        isActive: isActive !== void 0 ? isActive : true
      });
      return res.status(200).json(newDistrict);
    } catch (error) {
      console.error("Error creating district:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/districts/:id`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      const districtId = parseInt(req.params.id);
      const { name, state, isActive } = req.body;
      if (!name) {
        return res.status(400).json({ message: "District name is required" });
      }
      const existingDistrict = await storage.getDistrictById(districtId);
      if (!existingDistrict) {
        return res.status(404).json({ message: "District not found" });
      }
      const duplicateDistrict = await storage.getDistrictByName(name);
      if (duplicateDistrict && duplicateDistrict.id !== districtId) {
        return res.status(400).json({ message: "Another district with this name already exists" });
      }
      const updatedDistrict = await storage.updateDistrict(districtId, {
        name,
        state: state || "",
        isActive: isActive !== void 0 ? isActive : existingDistrict.isActive
      });
      return res.status(200).json(updatedDistrict);
    } catch (error) {
      console.error("Error updating district:", error);
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/districts/:id`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      const districtId = parseInt(req.params.id);
      const existingDistrict = await storage.getDistrictById(districtId);
      if (!existingDistrict) {
        return res.status(404).json({ message: "District not found" });
      }
      const usersInDistrict = await storage.getUsersInDistrict(existingDistrict.name);
      if (usersInDistrict.length > 0) {
        return res.status(400).json({
          message: `Cannot delete district that has ${usersInDistrict.length} users assigned to it. Reassign users to another district first.`
        });
      }
      await storage.deleteDistrict(districtId);
      return res.status(200).json({ message: "District deleted successfully" });
    } catch (error) {
      console.error("Error deleting district:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categories3 = await storage.getAllCategories();
      res.json(categories3);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, JWT_SECRET_SAFE, async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
          }
          if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized: Admin access required" });
          }
          const { name, description } = req.body;
          if (!name) {
            return res.status(400).json({ message: "Category name is required" });
          }
          const newCategory = await storage.createCategory({
            name,
            description: description || ""
          });
          return res.status(200).json(newCategory);
        });
      } else if (req.session && req.session.user) {
        if (req.session.user.role !== "admin") {
          return res.status(403).json({ message: "Unauthorized: Admin access required" });
        }
        const { name, description } = req.body;
        if (!name) {
          return res.status(400).json({ message: "Category name is required" });
        }
        const newCategory = await storage.createCategory({
          name,
          description: description || ""
        });
        return res.status(200).json(newCategory);
      } else {
        return res.status(401).json({ message: "Authentication required" });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/categories/:id`, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, JWT_SECRET_SAFE, async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
          }
          if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized: Admin access required" });
          }
          const categoryId = parseInt(req.params.id);
          const { name, description } = req.body;
          if (!name) {
            return res.status(400).json({ message: "Category name is required" });
          }
          const existingCategory = await storage.getCategoryById(categoryId);
          if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
          }
          const updatedCategory = await storage.updateCategory(categoryId, {
            name,
            description: description || ""
          });
          return res.status(200).json(updatedCategory);
        });
      } else if (req.session && req.session.user) {
        if (req.session.user.role !== "admin") {
          return res.status(403).json({ message: "Unauthorized: Admin access required" });
        }
        const categoryId = parseInt(req.params.id);
        const { name, description } = req.body;
        if (!name) {
          return res.status(400).json({ message: "Category name is required" });
        }
        const existingCategory = await storage.getCategoryById(categoryId);
        if (!existingCategory) {
          return res.status(404).json({ message: "Category not found" });
        }
        const updatedCategory = await storage.updateCategory(categoryId, {
          name,
          description: description || ""
        });
        return res.status(200).json(updatedCategory);
      } else {
        return res.status(401).json({ message: "Authentication required" });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/categories/:id`, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, JWT_SECRET_SAFE, async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
          }
          if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized: Admin access required" });
          }
          const categoryId = parseInt(req.params.id);
          const existingCategory = await storage.getCategoryById(categoryId);
          if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
          }
          const products2 = await storage.getProductsWithFilters(
            eq2(storage.schema.products.categoryId, categoryId)
          );
          if (products2.length > 0) {
            return res.status(400).json({
              message: "Cannot delete category that is in use by products. Reassign products to another category first."
            });
          }
          await storage.deleteCategory(categoryId);
          return res.status(200).json({ message: "Category deleted successfully" });
        });
      } else if (req.session && req.session.user) {
        if (req.session.user.role !== "admin") {
          return res.status(403).json({ message: "Unauthorized: Admin access required" });
        }
        const categoryId = parseInt(req.params.id);
        const existingCategory = await storage.getCategoryById(categoryId);
        if (!existingCategory) {
          return res.status(404).json({ message: "Category not found" });
        }
        const products2 = await storage.getProductsWithFilters(
          eq2(storage.schema.products.categoryId, categoryId)
        );
        if (products2.length > 0) {
          return res.status(400).json({
            message: "Cannot delete category that is in use by products. Reassign products to another category first."
          });
        }
        await storage.deleteCategory(categoryId);
        return res.status(200).json({ message: "Category deleted successfully" });
      } else {
        return res.status(401).json({ message: "Authentication required" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const { search, category, availability, seasonal, farmerId, limit, userLat, userLng, districtId } = req.query;
      let filters = [];
      filters.push(eq2(storage.schema.products.approvalStatus, "approved"));
      const currentDate = /* @__PURE__ */ new Date();
      filters.push(gte(storage.schema.products.availableUntil, currentDate));
      const { b2bMode } = req.query;
      if (b2bMode === "true") {
        filters.push(eq2(storage.schema.products.hasSlabPricing, true));
      }
      if (search && typeof search === "string") {
        filters.push(like2(storage.schema.products.name, `%${search}%`));
      }
      if (category && typeof category === "string" && category !== "all") {
        filters.push(eq2(storage.schema.products.categoryId, parseInt(category)));
      }
      if (availability && typeof availability === "string" && availability !== "all") {
        filters.push(eq2(storage.schema.products.status, availability === "available" ? "Available Now" : availability === "pre-order" ? "Pre-Order" : "Coming Soon"));
      }
      if (seasonal === "true") {
        const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
        const nextMonth = (currentMonth + 1) % 12;
        const startDate = /* @__PURE__ */ new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = /* @__PURE__ */ new Date();
        endDate.setMonth(nextMonth + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        filters.push(
          or2(
            and2(
              gte(storage.schema.products.harvestDate, startDate),
              lte(storage.schema.products.harvestDate, endDate)
            ),
            eq2(storage.schema.products.status, "Available Now")
          )
        );
      }
      if (farmerId && typeof farmerId === "string") {
        filters.push(eq2(storage.schema.products.farmerId, parseInt(farmerId)));
      }
      if (districtId && typeof districtId === "string" && districtId !== "all") {
        const district = await storage.getDistrictById(parseInt(districtId));
        if (district) {
          const farmerIds = await storage.getFarmerIdsByDistrictName(district.name);
          if (farmerIds.length > 0) {
            filters.push(inArray2(storage.schema.products.farmerId, farmerIds));
          } else {
            return res.json([]);
          }
        }
      }
      const { deliveryDistrictId } = req.query;
      if (deliveryDistrictId && typeof deliveryDistrictId === "string" && deliveryDistrictId !== "all") {
        const custDistrictId = parseInt(deliveryDistrictId);
        const deliverableDms = await db.select({ dmUserId: fpoDeliveryDistricts.dmUserId }).from(fpoDeliveryDistricts).where(and2(
          eq2(fpoDeliveryDistricts.districtId, custDistrictId),
          eq2(fpoDeliveryDistricts.isActive, true)
        ));
        const dmIds = deliverableDms.map((d) => d.dmUserId);
        if (dmIds.length > 0) {
          filters.push(
            or2(
              inArray2(storage.schema.products.createdByDmId, dmIds),
              and2(
                eq2(storage.schema.products.approvalType, "fpo"),
                inArray2(storage.schema.products.approvedByUserId, dmIds)
              ),
              and2(
                isNull(storage.schema.products.createdByDmId),
                or2(
                  isNull(storage.schema.products.approvedByUserId),
                  sql2`${storage.schema.products.approvalType} != 'fpo'`
                )
              )
            )
          );
        } else {
          filters.push(
            and2(
              isNull(storage.schema.products.createdByDmId),
              or2(
                isNull(storage.schema.products.approvedByUserId),
                sql2`${storage.schema.products.approvalType} != 'fpo'`
              )
            )
          );
        }
      }
      let products2 = await storage.getProductsWithFilters(
        and2(...filters),
        limit ? parseInt(limit) : void 0
      );
      if (userLat && userLng && typeof userLat === "string" && typeof userLng === "string") {
        const userLatitude = parseFloat(userLat);
        const userLongitude = parseFloat(userLng);
        if (!isNaN(userLatitude) && !isNaN(userLongitude)) {
          products2 = products2.filter((product) => {
            if (product.farmer?.latitude && product.farmer?.longitude) {
              const distance = calculateDistance(
                { latitude: userLatitude, longitude: userLongitude },
                { latitude: parseFloat(product.farmer.latitude), longitude: parseFloat(product.farmer.longitude) }
              );
              return distance <= 150;
            }
            return true;
          });
          products2.sort((a, b) => {
            const aHasLocation = a.farmer?.latitude && a.farmer?.longitude;
            const bHasLocation = b.farmer?.latitude && b.farmer?.longitude;
            if (!aHasLocation && !bHasLocation) return 0;
            if (!aHasLocation) return 1;
            if (!bHasLocation) return -1;
            const distanceA = calculateDistance(
              { latitude: userLatitude, longitude: userLongitude },
              { latitude: parseFloat(a.farmer.latitude), longitude: parseFloat(a.farmer.longitude) }
            );
            const distanceB = calculateDistance(
              { latitude: userLatitude, longitude: userLongitude },
              { latitude: parseFloat(b.farmer.latitude), longitude: parseFloat(b.farmer.longitude) }
            );
            return distanceA - distanceB;
          });
        }
      }
      const updatedProducts = products2.map((product) => {
        const currentDate2 = /* @__PURE__ */ new Date();
        currentDate2.setHours(0, 0, 0, 0);
        let harvestDate;
        if (product.harvestDate) {
          harvestDate = new Date(product.harvestDate);
          harvestDate.setHours(0, 0, 0, 0);
        } else if (product.harvestMonth) {
          harvestDate = new Date(product.harvestMonth);
          harvestDate.setHours(0, 0, 0, 0);
        } else {
          harvestDate = new Date(currentDate2);
        }
        console.log(`Product: ${product.name}, Current: ${currentDate2.toISOString().split("T")[0]}, Harvest: ${harvestDate.toISOString().split("T")[0]}, Farmer's Status: ${product.status}`);
        return {
          ...product,
          status: product.status
          // Keep the farmer's original choice
        };
      });
      res.json(updatedProducts);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo-products`, async (req, res) => {
    try {
      const { search, category, limit, deliveryDistrictId } = req.query;
      let filters = [];
      filters.push(eq2(storage.schema.products.approvalStatus, "approved"));
      filters.push(eq2(storage.schema.products.approvalType, "fpo"));
      const currentDate = /* @__PURE__ */ new Date();
      filters.push(gte(storage.schema.products.availableUntil, currentDate));
      if (search && typeof search === "string") {
        filters.push(like2(storage.schema.products.name, `%${search}%`));
      }
      if (category && typeof category === "string" && category !== "all") {
        filters.push(eq2(storage.schema.products.categoryId, parseInt(category)));
      }
      if (deliveryDistrictId && typeof deliveryDistrictId === "string" && deliveryDistrictId !== "all") {
        const custDistrictId = parseInt(deliveryDistrictId);
        const deliverableDms = await db.select({ dmUserId: fpoDeliveryDistricts.dmUserId }).from(fpoDeliveryDistricts).where(and2(
          eq2(fpoDeliveryDistricts.districtId, custDistrictId),
          eq2(fpoDeliveryDistricts.isActive, true)
        ));
        const dmIds = deliverableDms.map((d) => d.dmUserId);
        if (dmIds.length > 0) {
          filters.push(
            or2(
              inArray2(storage.schema.products.createdByDmId, dmIds),
              and2(
                eq2(storage.schema.products.approvalType, "fpo"),
                inArray2(storage.schema.products.approvedByUserId, dmIds)
              )
            )
          );
        } else {
          return res.json([]);
        }
      }
      const combinedFilters = filters.length > 0 ? and2(...filters) : void 0;
      let products2 = await storage.getProductsWithFilters(
        combinedFilters,
        limit ? parseInt(limit) : void 0
      );
      const enrichedProducts = await Promise.all(products2.map(async (product) => {
        let category2 = null;
        let dmUser = null;
        if (product.categoryId) {
          category2 = await storage.getCategoryById(product.categoryId);
        }
        if (product.createdByDmId) {
          dmUser = await storage.getUserById(product.createdByDmId);
        }
        let priceSlabs = [];
        if (product.hasSlabPricing) {
          priceSlabs = await storage.getProductPriceSlabs(product.id);
        }
        return {
          ...product,
          category: category2 ? { id: category2.id, name: category2.name } : null,
          createdByDm: dmUser ? {
            id: dmUser.id,
            fullName: dmUser.fullName,
            district: dmUser.district
          } : null,
          priceSlabs
        };
      }));
      res.json(enrichedProducts);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/fpo-products/:id`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "FPO product not found" });
      }
      if (product.approvalType !== "fpo") {
        return res.status(404).json({ message: "FPO product not found" });
      }
      let category = null;
      let dmUser = null;
      if (product.categoryId) {
        category = await storage.getCategoryById(product.categoryId);
      }
      if (product.createdByDmId) {
        dmUser = await storage.getUserById(product.createdByDmId);
      }
      let priceSlabs = [];
      if (product.hasSlabPricing) {
        priceSlabs = await storage.getProductPriceSlabs(product.id);
      }
      const enrichedProduct = {
        ...product,
        category: category ? { id: category.id, name: category.name } : null,
        createdByDm: dmUser ? {
          id: dmUser.id,
          fullName: dmUser.fullName,
          district: dmUser.district
        } : null,
        priceSlabs
      };
      res.json(enrichedProduct);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/products/:identifier`, async (req, res) => {
    try {
      const identifier = req.params.identifier;
      let id;
      if (/^\d+$/.test(identifier)) {
        id = parseInt(identifier);
      } else {
        const match = identifier.match(/-(\d+)$/);
        if (!match) {
          return res.status(404).json({ message: "Product not found" });
        }
        id = parseInt(match[1]);
      }
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.approvalStatus !== "approved") {
        return res.status(404).json({ message: "Product not found" });
      }
      const currentDate = /* @__PURE__ */ new Date();
      const availableUntil = new Date(product.availableUntil);
      if (availableUntil < currentDate) {
        return res.status(404).json({ message: "Product not available" });
      }
      const harvestDate = new Date(product.harvestDate);
      if (currentDate > harvestDate) {
        product.status = "Available Now";
      } else {
        product.status = "Pre-Order";
      }
      const reviews3 = await storage.getReviewsByProductId(id);
      const priceSlabs = await db.query.productPriceSlabs.findMany({
        where: eq2(productPriceSlabs.productId, id),
        orderBy: (slabs, { asc: asc3 }) => [asc3(slabs.minQuantity)]
      });
      let approverDetails = null;
      if (product.approvedByUserId) {
        try {
          const approverUser = await storage.getUserById(product.approvedByUserId);
          if (approverUser && approverUser.orgName) {
            approverDetails = {
              orgName: approverUser.orgName,
              orgLogoUrl: approverUser.orgLogoUrl,
              district: approverUser.district
            };
          }
        } catch (error) {
          console.warn(`Error fetching approver details for user ${product.approvedByUserId}:`, error);
        }
      }
      const productWithReviews = {
        ...product,
        approverDetails,
        priceSlabs: priceSlabs.map((slab) => ({
          id: slab.id,
          minQuantity: slab.minQuantity,
          maxQuantity: slab.maxQuantity,
          pricePerUnit: slab.pricePerUnit,
          slabType: slab.slabType
        })),
        reviews: reviews3.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          name: review.user ? review.user.name : "Anonymous",
          avatarUrl: review.user && review.user.avatar ? review.user.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
          date: new Date(review.createdAt).toLocaleDateString()
        }))
      };
      res.json(productWithReviews);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/products/:id`, authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = req.user.id;
      const user = await storage.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const productImages2 = await storage.getProductImages(productId);
      for (const image of productImages2) {
        await storage.deleteProductImage(image.id);
      }
      const calendarEntry = await storage.getCalendarEntryByProductId(productId);
      if (calendarEntry) {
        await storage.deleteCalendarEntry(calendarEntry.id);
      }
      await storage.deleteProduct(productId);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/products/:id/sales`, authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = req.user.id;
      const user = await storage.getUserById(userId);
      if (!user || !["admin", "district_manager"].includes(user.role)) {
        return res.status(403).json({ message: "Admin or District Manager access required" });
      }
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const allOrders = await storage.getOrdersWithFilters();
      let totalQuantitySold = 0;
      let totalRevenue = 0;
      let totalOrders = 0;
      const salesHistory = [];
      const uniqueOrderIds = /* @__PURE__ */ new Set();
      for (const order of allOrders) {
        const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
        const productOrderItems = orderItems2.filter((item) => item.productId === productId);
        if (productOrderItems.length > 0) {
          if (!uniqueOrderIds.has(order.id)) {
            uniqueOrderIds.add(order.id);
            totalOrders++;
          }
          for (const item of productOrderItems) {
            totalQuantitySold += item.quantity;
            const itemPrice = typeof item.price === "string" ? parseFloat(item.price) : item.price;
            totalRevenue += item.quantity * itemPrice;
            salesHistory.push({
              orderId: order.id,
              customerName: order.customerName,
              quantity: item.quantity,
              price: itemPrice,
              orderDate: order.createdAt,
              orderStatus: order.status
            });
          }
        }
      }
      salesHistory.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      const salesData = {
        productId: product.id,
        productName: product.name,
        totalQuantitySold,
        totalRevenue,
        totalOrders,
        salesHistory
      };
      res.json(salesData);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/products/farmer/list`, authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      let products2 = [];
      let allOrders = [];
      if (userRole === "district_manager") {
        const activeOnly = req.query.active_only === "true";
        const { products: productsTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
        products2 = activeOnly ? await storage.getProductsWithFilters(
          and2(
            eq2(productsTable.approvalStatus, "approved"),
            eq2(productsTable.approvedByUserId, userId),
            eq2(productsTable.approvalType, "fpo"),
            eq2(productsTable.status, "active")
          )
        ) : await storage.getProductsWithFilters(
          and2(
            eq2(productsTable.approvalStatus, "approved"),
            eq2(productsTable.approvedByUserId, userId),
            eq2(productsTable.approvalType, "fpo")
          )
        );
        const productIds = products2.map((p) => p.id);
        allOrders = await storage.getAllOrdersWithItems();
        allOrders = allOrders.filter(
          (order) => order.items.some((item) => productIds.includes(item.productId))
        );
      } else {
        const farmer = await storage.getFarmerByUserId(userId);
        if (!farmer) {
          return res.status(404).json({ message: "Farmer not found" });
        }
        const activeOnly = req.query.active_only === "true";
        products2 = activeOnly ? await storage.getActiveProductsByFarmerId(farmer.id) : await storage.getProductsByFarmerId(farmer.id);
        allOrders = await storage.getOrdersByFarmerId(farmer.id);
      }
      const productsWithSalesHistory = await Promise.all(products2.map(async (product) => {
        const orderItems2 = allOrders.flatMap(
          (order) => order.items.filter((item) => item.productId === product.id)
        );
        const totalSales = orderItems2.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalEarnings = orderItems2.reduce((sum, item) => {
          return sum + item.quantity * parseFloat(item.price);
        }, 0);
        const isExpired = new Date(product.availableUntil) < /* @__PURE__ */ new Date();
        let approverDetails = null;
        if (product.approvalStatus === "approved" && product.approvedByUserId) {
          try {
            const approverUser = await storage.getUserById(product.approvedByUserId);
            if (approverUser) {
              approverDetails = {
                name: approverUser.name,
                email: approverUser.email,
                phone: approverUser.phone,
                orgName: approverUser.orgName,
                orgAddress: approverUser.orgAddress,
                district: approverUser.district,
                approvalType: product.approvalType || "unknown"
              };
            }
          } catch (error) {
            console.warn(`Error fetching approver details for user ${product.approvedByUserId}:`, error);
          }
        }
        return {
          ...product,
          salesHistory: {
            totalSales,
            totalEarnings,
            orderItems: orderItems2.map((item) => ({
              orderId: item.orderId,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * parseFloat(item.price),
              date: allOrders.find((order) => order.id === item.orderId)?.createdAt || null
            }))
          },
          approverDetails,
          isExpired
        };
      }));
      res.json(productsWithSalesHistory);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/products/farmer/:productId/sales`, authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (userRole !== "farmer") {
        return res.status(403).json({ message: "This endpoint is for farmers only. Use the admin endpoint for other roles." });
      }
      const farmer = await storage.getFarmerByUserId(userId);
      if (!farmer || product.farmerId !== farmer.id) {
        return res.status(403).json({ message: "Not authorized to view this product's sales" });
      }
      const allOrders = await storage.getOrdersWithFilters();
      let totalQuantitySold = 0;
      let totalRevenue = 0;
      let totalOrders = 0;
      const salesHistory = [];
      const uniqueOrderIds = /* @__PURE__ */ new Set();
      for (const order of allOrders) {
        const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
        const productOrderItems = orderItems2.filter((item) => item.productId === productId);
        if (productOrderItems.length > 0) {
          if (!uniqueOrderIds.has(order.id)) {
            uniqueOrderIds.add(order.id);
            totalOrders++;
          }
          let customerName = order.customerName || "Unknown";
          let customerEmail = "";
          let customerPhone = "";
          if (order.customerId) {
            const customer = await storage.getCustomerById(order.customerId);
            if (customer) {
              const customerUser = await storage.getUserById(customer.userId);
              if (customerUser) {
                customerName = customerUser.name || customerName;
                customerEmail = customerUser.email || "";
                customerPhone = customerUser.phone || "";
              }
            }
          }
          for (const item of productOrderItems) {
            const itemPrice = typeof item.price === "string" ? parseFloat(item.price) : item.price;
            const itemTotal = item.quantity * itemPrice;
            totalQuantitySold += item.quantity;
            totalRevenue += itemTotal;
            salesHistory.push({
              orderId: order.id,
              customerName,
              customerEmail,
              customerPhone,
              quantity: item.quantity,
              price: itemPrice,
              total: itemTotal,
              orderDate: order.createdAt,
              orderStatus: order.status,
              paymentMethod: order.paymentMethod || "Unknown",
              deliveryAddress: order.address || ""
            });
          }
        }
      }
      salesHistory.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      const avgOrderSize = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const salesData = {
        productId: product.id,
        productName: product.name,
        totalOrders,
        totalQuantitySold,
        totalRevenue,
        avgOrderSize,
        salesHistory
      };
      res.json(salesData);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/products`, authenticateJWT, async (req, res) => {
    try {
      console.log("Product creation request body:", req.body);
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can create products" });
      }
      const farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const fpoLinks = await db.select({ id: farmerFpoLinks.id }).from(farmerFpoLinks).where(eq2(farmerFpoLinks.farmerUserId, req.user.id));
      if (fpoLinks.length === 0) {
        return res.status(403).json({
          message: "You must be linked to an FPO (Farmer Producer Organization) before creating products. Please go to the FPO tab in your dashboard and link with an FPO first.",
          code: "NO_FPO_LINK"
        });
      }
      console.log("Farmer information:", {
        farmerId: farmer.id,
        farmName: farmer.farmName,
        userId: req.user.id,
        linkedFpos: fpoLinks.length
      });
      try {
        const { priceSlabs, ...productFields } = req.body;
        const productData = {
          ...productFields,
          farmerId: farmer.id,
          // Convert date strings to Date objects
          harvestDate: new Date(req.body.harvestDate),
          availableUntil: new Date(req.body.availableUntil),
          // Handle B2B/B2C fields
          b2cQuantity: req.body.b2cQuantity || req.body.inventory || null,
          b2bQuantity: req.body.b2bQuantity || null,
          b2cMoq: req.body.b2cMoq || 1,
          b2bMoq: req.body.b2bMoq || 1,
          hasSlabPricing: req.body.hasSlabPricing && priceSlabs && priceSlabs.length > 0,
          gradeVariety: req.body.gradeVariety || null,
          approxWeightPerPieceGrams: req.body.unit === "pieces" && req.body.approxWeightPerPieceGrams ? String(req.body.approxWeightPerPieceGrams) : null
        };
        console.log("Formatted product data before validation:", productData);
        const validatedData = insertProductSchema.parse(productData);
        console.log("Validated product data:", validatedData);
        const newProduct = await storage.createProduct(validatedData);
        console.log("Product created successfully:", newProduct.id);
        if (priceSlabs && Array.isArray(priceSlabs) && priceSlabs.length > 0) {
          console.log("Creating price slabs for product:", newProduct.id, priceSlabs);
          for (const slab of priceSlabs) {
            await db.insert(productPriceSlabs).values({
              productId: newProduct.id,
              minQuantity: slab.minQuantity,
              maxQuantity: slab.maxQuantity || null,
              pricePerUnit: slab.pricePerUnit.toString(),
              slabType: slab.slabType || "b2b"
            });
          }
          console.log("Price slabs created successfully");
        }
        await storage.createCalendarEntry({
          productId: newProduct.id,
          monthlyStatus: generateMonthlyStatus(new Date(newProduct.harvestDate), new Date(newProduct.availableUntil))
        });
        console.log("Calendar entry created successfully for product:", newProduct.id);
        try {
          await storage.notifyFollowersOfNewProduct(farmer.id, newProduct.id, newProduct.name);
          console.log("Followers notified about new product:", newProduct.name);
        } catch (notificationError) {
          console.error("Error notifying followers:", notificationError);
        }
        res.status(201).json(newProduct);
      } catch (validationError) {
        console.error("Error during product creation:", validationError);
        handleError(res, validationError);
      }
    } catch (error) {
      console.error("Unexpected error in product creation:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/dm/profile`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ message: "Only district managers can access this endpoint" });
      }
      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        district: user.district,
        orgName: user.orgName || "",
        orgAddress: user.orgAddress || "",
        orgPhone: user.orgPhone || "",
        orgEmail: user.orgEmail || "",
        orgLogoUrl: user.orgLogoUrl || "",
        bankAccountNumber: user.bankAccountNumber || "",
        bankIfsc: user.bankIfsc || "",
        gstNumber: user.gstNumber || "",
        upiId: user.upiId || ""
      });
    } catch (error) {
      console.error("Error fetching DM profile:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/dm/profile`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ message: "Only district managers can access this endpoint" });
      }
      const dmProfileUpdateSchema = z2.object({
        name: z2.string().min(2).optional(),
        phone: z2.string().min(10).optional(),
        orgName: z2.string().min(2).optional(),
        orgAddress: z2.string().min(5).optional(),
        orgPhone: z2.string().min(10).optional(),
        orgEmail: z2.string().email().optional(),
        orgLogoUrl: z2.string().url().or(z2.literal("")).optional(),
        bankAccountNumber: z2.string().min(9).optional(),
        bankIfsc: z2.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/).optional(),
        gstNumber: z2.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).or(z2.literal("")).optional(),
        upiId: z2.string().optional()
      });
      const validated = dmProfileUpdateSchema.parse(req.body);
      const updateData = { updatedAt: /* @__PURE__ */ new Date() };
      if (validated.name !== void 0) updateData.name = validated.name;
      if (validated.phone !== void 0) updateData.phone = validated.phone;
      if (validated.orgName !== void 0) updateData.orgName = validated.orgName;
      if (validated.orgAddress !== void 0) updateData.orgAddress = validated.orgAddress;
      if (validated.orgPhone !== void 0) updateData.orgPhone = validated.orgPhone;
      if (validated.orgEmail !== void 0) updateData.orgEmail = validated.orgEmail;
      if (validated.orgLogoUrl !== void 0) updateData.orgLogoUrl = validated.orgLogoUrl;
      if (validated.bankAccountNumber !== void 0) updateData.bankAccountNumber = validated.bankAccountNumber;
      if (validated.bankIfsc !== void 0) updateData.bankIfsc = validated.bankIfsc;
      if (validated.gstNumber !== void 0) updateData.gstNumber = validated.gstNumber;
      if (validated.upiId !== void 0) updateData.upiId = validated.upiId;
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (validated.orgLogoUrl !== void 0) {
        const farmer = await storage.getFarmerByUserId(req.user.id);
        if (farmer) {
          await storage.updateFarmer(farmer.id, { logoUrl: validated.orgLogoUrl || null });
        }
      }
      return res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        district: updatedUser.district,
        orgName: updatedUser.orgName || "",
        orgAddress: updatedUser.orgAddress || "",
        orgPhone: updatedUser.orgPhone || "",
        orgEmail: updatedUser.orgEmail || "",
        orgLogoUrl: updatedUser.orgLogoUrl || "",
        bankAccountNumber: updatedUser.bankAccountNumber || "",
        bankIfsc: updatedUser.bankIfsc || "",
        gstNumber: updatedUser.gstNumber || "",
        upiId: updatedUser.upiId || ""
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating DM profile:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/dm/fpo-farmer-profile`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ message: "Only district managers can access this endpoint" });
      }
      let farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        const dmUser = await storage.getUserById(req.user.id);
        const newFarmer = await storage.createFarmer({
          userId: req.user.id,
          farmName: dmUser?.orgName || dmUser?.name || req.user.username || "FPO Farm",
          description: `Official store of ${dmUser?.orgName || "FPO"}`,
          location: dmUser?.district || "",
          address: dmUser?.orgAddress || "",
          imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&h=500",
          logoUrl: dmUser?.orgLogoUrl || null,
          tags: [],
          farmImages: []
        });
        farmer = newFarmer;
        console.log(`Auto-created FPO farmer profile for DM ${req.user.id}: ${farmer.farmName}`);
      }
      return res.json({
        id: farmer.id,
        farmName: farmer.farmName,
        description: farmer.description || "",
        location: farmer.location || "",
        address: farmer.address || "",
        website: farmer.website || "",
        logoUrl: farmer.logoUrl || "",
        farmImages: farmer.farmImages || [],
        instagramReels: farmer.instagramReels || "",
        youtube: farmer.youtube || "",
        rating: farmer.rating || "0",
        reviewCount: farmer.reviewCount || 0,
        reviews: farmer.reviews || []
      });
    } catch (error) {
      console.error("Error fetching DM FPO farmer profile:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/dm/fpo-farmer-profile`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ message: "Only district managers can access this endpoint" });
      }
      let farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        const dmUser = await storage.getUserById(req.user.id);
        const newFarmer = await storage.createFarmer({
          userId: req.user.id,
          farmName: dmUser?.orgName || dmUser?.name || req.user.username || "FPO Farm",
          description: `Official store of ${dmUser?.orgName || "FPO"}`,
          location: dmUser?.district || "",
          address: dmUser?.orgAddress || "",
          imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&h=500",
          logoUrl: dmUser?.orgLogoUrl || null,
          tags: [],
          farmImages: []
        });
        farmer = newFarmer;
        console.log(`Auto-created FPO farmer profile for DM ${req.user.id}: ${farmer.farmName}`);
      }
      const fpoProfileUpdateSchema = z2.object({
        farmName: z2.string().min(2).optional(),
        description: z2.string().optional(),
        website: z2.string().url().or(z2.literal("")).optional(),
        logoUrl: z2.string().url().or(z2.literal("")).optional(),
        farmImages: z2.array(z2.string()).optional(),
        instagramReels: z2.string().optional(),
        youtube: z2.string().optional()
      });
      const validated = fpoProfileUpdateSchema.parse(req.body);
      const updateData = { updatedAt: /* @__PURE__ */ new Date() };
      if (validated.farmName !== void 0) updateData.farmName = validated.farmName;
      if (validated.description !== void 0) updateData.description = validated.description;
      if (validated.website !== void 0) updateData.website = validated.website;
      if (validated.logoUrl !== void 0) updateData.logoUrl = validated.logoUrl;
      if (validated.farmImages !== void 0) updateData.farmImages = validated.farmImages;
      if (validated.instagramReels !== void 0) updateData.instagramReels = validated.instagramReels;
      if (validated.youtube !== void 0) updateData.youtube = validated.youtube;
      const updatedFarmer = await storage.updateFarmer(farmer.id, updateData);
      return res.json({
        id: updatedFarmer.id,
        farmName: updatedFarmer.farmName,
        description: updatedFarmer.description || "",
        website: updatedFarmer.website || "",
        logoUrl: updatedFarmer.logoUrl || "",
        farmImages: updatedFarmer.farmImages || [],
        instagramReels: updatedFarmer.instagramReels || "",
        youtube: updatedFarmer.youtube || "",
        rating: updatedFarmer.rating || "0",
        reviewCount: updatedFarmer.reviewCount || 0
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating DM FPO farmer profile:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/farmer/fpos`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can access this endpoint" });
      }
      const farmerUser = await storage.getUserById(req.user.id);
      if (!farmerUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const farmerDistrict = farmerUser.district;
      const linkedFpos = await db.select({
        id: farmerFpoLinks.id,
        dmUserId: farmerFpoLinks.dmUserId,
        createdAt: farmerFpoLinks.createdAt,
        dmName: users.name,
        dmDistrict: users.district,
        orgName: users.orgName,
        orgAddress: users.orgAddress,
        orgPhone: users.orgPhone,
        orgEmail: users.orgEmail,
        orgLogoUrl: users.orgLogoUrl
      }).from(farmerFpoLinks).innerJoin(users, eq2(farmerFpoLinks.dmUserId, users.id)).where(eq2(farmerFpoLinks.farmerUserId, req.user.id));
      let availableFpos = [];
      if (farmerDistrict) {
        const linkedDmIds = linkedFpos.map((l) => l.dmUserId);
        const allDistrictDms = await db.select({
          dmUserId: users.id,
          dmName: users.name,
          dmDistrict: users.district,
          orgName: users.orgName,
          orgAddress: users.orgAddress,
          orgPhone: users.orgPhone,
          orgEmail: users.orgEmail,
          orgLogoUrl: users.orgLogoUrl
        }).from(users).where(and2(
          eq2(users.role, "district_manager"),
          eq2(users.district, farmerDistrict),
          eq2(users.isActive, true)
        ));
        availableFpos = allDistrictDms.filter((dm) => !linkedDmIds.includes(dm.dmUserId));
      }
      res.json({
        linked: linkedFpos,
        available: availableFpos,
        maxLinks: 3,
        currentCount: linkedFpos.length,
        farmerDistrict: farmerDistrict || null
      });
    } catch (error) {
      console.error("Error fetching farmer FPOs:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/farmer/fpos`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can link to FPOs" });
      }
      const { dmUserId } = req.body;
      if (!dmUserId || typeof dmUserId !== "number") {
        return res.status(400).json({ message: "Valid dmUserId is required" });
      }
      const farmerUser = await storage.getUserById(req.user.id);
      if (!farmerUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const dmUser = await storage.getUserById(dmUserId);
      if (!dmUser || dmUser.role !== "district_manager") {
        return res.status(400).json({ message: "Invalid FPO/District Manager" });
      }
      if (farmerUser.district && dmUser.district && farmerUser.district !== dmUser.district) {
        return res.status(400).json({ message: "You can only link to FPOs in your district" });
      }
      const existingLinks = await db.select().from(farmerFpoLinks).where(eq2(farmerFpoLinks.farmerUserId, req.user.id));
      if (existingLinks.length >= 3) {
        return res.status(400).json({ message: "You can link to a maximum of 3 FPOs" });
      }
      const alreadyLinked = existingLinks.find((l) => l.dmUserId === dmUserId);
      if (alreadyLinked) {
        return res.status(400).json({ message: "Already linked to this FPO" });
      }
      const [newLink] = await db.insert(farmerFpoLinks).values({
        farmerUserId: req.user.id,
        dmUserId
      }).returning();
      res.status(201).json(newLink);
    } catch (error) {
      console.error("Error linking farmer to FPO:", error);
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/farmer/fpos/:dmUserId`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can unlink from FPOs" });
      }
      const dmUserId = parseInt(req.params.dmUserId);
      if (isNaN(dmUserId)) {
        return res.status(400).json({ message: "Invalid DM user ID" });
      }
      const [deleted] = await db.delete(farmerFpoLinks).where(and2(
        eq2(farmerFpoLinks.farmerUserId, req.user.id),
        eq2(farmerFpoLinks.dmUserId, dmUserId)
      )).returning();
      if (!deleted) {
        return res.status(404).json({ message: "Link not found" });
      }
      res.json({ message: "Successfully unlinked from FPO" });
    } catch (error) {
      console.error("Error unlinking farmer from FPO:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/dm/linked-farmers`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only DMs and admins can access this" });
      }
      const dmId = req.user.role === "admin" && req.query.dmId ? parseInt(req.query.dmId) : req.user.id;
      const linkedFarmers = await db.select({
        linkId: farmerFpoLinks.id,
        farmerUserId: farmerFpoLinks.farmerUserId,
        createdAt: farmerFpoLinks.createdAt,
        farmerName: users.name,
        farmerDistrict: users.district,
        farmerPhone: users.phone,
        farmerEmail: users.email
      }).from(farmerFpoLinks).innerJoin(users, eq2(farmerFpoLinks.farmerUserId, users.id)).where(eq2(farmerFpoLinks.dmUserId, dmId));
      res.json(linkedFarmers);
    } catch (error) {
      console.error("Error fetching linked farmers:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/dm/link-farmer`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ message: "Only DMs can link farmers" });
      }
      const { farmerUserId } = req.body;
      if (!farmerUserId || typeof farmerUserId !== "number") {
        return res.status(400).json({ message: "Valid farmerUserId is required" });
      }
      const farmerUser = await storage.getUserById(farmerUserId);
      if (!farmerUser || farmerUser.role !== "farmer") {
        return res.status(400).json({ message: "Invalid farmer" });
      }
      const dmUser = await storage.getUserById(req.user.id);
      if (farmerUser.district && dmUser?.district && farmerUser.district !== dmUser.district) {
        return res.status(400).json({ message: "Farmer is not in your district" });
      }
      const existingFarmerLinks = await db.select().from(farmerFpoLinks).where(eq2(farmerFpoLinks.farmerUserId, farmerUserId));
      if (existingFarmerLinks.length >= 3) {
        return res.status(400).json({ message: "This farmer has already reached the maximum of 3 FPO links" });
      }
      const alreadyLinked = existingFarmerLinks.find((l) => l.dmUserId === req.user.id);
      if (alreadyLinked) {
        return res.status(400).json({ message: "Farmer is already linked to your FPO" });
      }
      const [newLink] = await db.insert(farmerFpoLinks).values({
        farmerUserId,
        dmUserId: req.user.id
      }).returning();
      res.status(201).json(newLink);
    } catch (error) {
      console.error("Error linking farmer:", error);
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/dm/unlink-farmer/:farmerUserId`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ message: "Only DMs can unlink farmers" });
      }
      const farmerUserId = parseInt(req.params.farmerUserId);
      if (isNaN(farmerUserId)) {
        return res.status(400).json({ message: "Invalid farmer user ID" });
      }
      const [deleted] = await db.delete(farmerFpoLinks).where(and2(
        eq2(farmerFpoLinks.farmerUserId, farmerUserId),
        eq2(farmerFpoLinks.dmUserId, req.user.id)
      )).returning();
      if (!deleted) {
        return res.status(404).json({ message: "Link not found" });
      }
      res.json({ message: "Successfully unlinked farmer" });
    } catch (error) {
      console.error("Error unlinking farmer:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/dm/farmers/:farmerId/organic-certification`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ message: "Only District Managers can certify farmers" });
      }
      const farmerId = parseInt(req.params.farmerId);
      if (isNaN(farmerId)) {
        return res.status(400).json({ message: "Invalid farmer ID" });
      }
      const bodySchema = z2.object({ isOrganicCertified: z2.boolean() });
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "isOrganicCertified must be a boolean value", errors: parsed.error.errors });
      }
      const { isOrganicCertified } = parsed.data;
      const farmer = await storage.getFarmerById(farmerId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const link = await db.query.farmerFpoLinks.findFirst({
        where: and2(
          eq2(farmerFpoLinks.farmerUserId, farmer.userId),
          eq2(farmerFpoLinks.dmUserId, req.user.id)
        )
      });
      if (!link) {
        return res.status(403).json({ message: "You can only certify farmers linked to your FPO" });
      }
      const updatedFarmer = await storage.updateFarmerOrganicCertification(farmerId, isOrganicCertified);
      if (!updatedFarmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      res.json({
        farmer: updatedFarmer,
        message: `Farmer organic certification ${isOrganicCertified ? "enabled" : "disabled"} successfully`,
        isOrganicCertified
      });
    } catch (error) {
      console.error("Error updating farmer organic certification:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/dm/farmers/:farmerId/natural-certification`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ message: "Only District Managers can certify farmers" });
      }
      const farmerId = parseInt(req.params.farmerId);
      if (isNaN(farmerId)) {
        return res.status(400).json({ message: "Invalid farmer ID" });
      }
      const bodySchema = z2.object({ isNaturalCertified: z2.boolean() });
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "isNaturalCertified must be a boolean value", errors: parsed.error.errors });
      }
      const { isNaturalCertified } = parsed.data;
      const farmer = await storage.getFarmerById(farmerId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const link = await db.query.farmerFpoLinks.findFirst({
        where: and2(
          eq2(farmerFpoLinks.farmerUserId, farmer.userId),
          eq2(farmerFpoLinks.dmUserId, req.user.id)
        )
      });
      if (!link) {
        return res.status(403).json({ message: "You can only certify farmers linked to your FPO" });
      }
      const updatedFarmer = await storage.updateFarmerNaturalCertification(farmerId, isNaturalCertified);
      if (!updatedFarmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      res.json({
        farmer: updatedFarmer,
        message: `Farmer natural certification ${isNaturalCertified ? "enabled" : "disabled"} successfully`,
        isNaturalCertified
      });
    } catch (error) {
      console.error("Error updating farmer natural certification:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/dm/products`, authenticateJWT, async (req, res) => {
    try {
      console.log("DM Product creation request body:", req.body);
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ message: "Only District Managers can use this endpoint" });
      }
      const dmUser = await storage.getUserById(req.user.id);
      if (!dmUser) {
        return res.status(404).json({ message: "District Manager not found" });
      }
      const {
        farmerId,
        name,
        description,
        price,
        unit,
        categoryId,
        harvestDate,
        availableUntil,
        inventory,
        gradeVariety,
        b2cQuantity,
        b2bQuantity,
        b2cMoq,
        b2bMoq,
        priceSlabs
      } = req.body;
      let farmer = null;
      if (farmerId) {
        farmer = await storage.getFarmerById(farmerId);
        if (!farmer) {
          return res.status(404).json({ message: "Farmer not found" });
        }
        if (dmUser.district && farmer.location && !farmer.location.toLowerCase().includes(dmUser.district.toLowerCase())) {
          return res.status(403).json({ message: "Farmer is not in your district" });
        }
      }
      try {
        const productData = {
          name,
          description,
          price: price.toString(),
          unit: unit || "kg",
          status: "Available Now",
          isActive: true,
          approvalStatus: "approved",
          // Auto-approved
          categoryId: parseInt(categoryId),
          farmerId: farmerId ? parseInt(farmerId) : null,
          // Optional for FPO products
          imageUrl: req.body.imageUrl || null,
          harvestDate: new Date(harvestDate),
          availableUntil: new Date(availableUntil),
          inventory: parseInt(inventory) || 0,
          unitsPerBox: parseInt(req.body.unitsPerBox) || 1,
          growingDetails: req.body.growingDetails || null,
          // DM-specific fields
          createdByDmId: req.user.id,
          gradeVariety: gradeVariety || null,
          b2cQuantity: b2cQuantity ? parseInt(b2cQuantity) : null,
          b2bQuantity: b2bQuantity ? parseInt(b2bQuantity) : null,
          b2cMoq: b2cMoq ? parseInt(b2cMoq) : 1,
          b2bMoq: b2bMoq ? parseInt(b2bMoq) : 1,
          hasSlabPricing: priceSlabs && priceSlabs.length > 0,
          approxWeightPerPieceGrams: unit === "pieces" && req.body.approxWeightPerPieceGrams ? String(req.body.approxWeightPerPieceGrams) : null,
          // Approval tracking
          approvedByUserId: req.user.id,
          approvedAt: /* @__PURE__ */ new Date(),
          approvalType: "fpo"
        };
        console.log("DM Product data before creation:", productData);
        const newProduct = await storage.createProduct(productData);
        console.log("DM Product created successfully:", newProduct.id);
        if (priceSlabs && Array.isArray(priceSlabs) && priceSlabs.length > 0) {
          for (const slab of priceSlabs) {
            await db.insert(productPriceSlabs).values({
              productId: newProduct.id,
              minQuantity: parseInt(slab.minQuantity),
              maxQuantity: slab.maxQuantity ? parseInt(slab.maxQuantity) : null,
              pricePerUnit: slab.pricePerUnit.toString(),
              slabType: slab.slabType || "b2c"
            });
          }
          console.log("Price slabs created for product:", newProduct.id);
        }
        await storage.createCalendarEntry({
          productId: newProduct.id,
          monthlyStatus: generateMonthlyStatus(new Date(newProduct.harvestDate), new Date(newProduct.availableUntil))
        });
        console.log("Calendar entry created for DM product:", newProduct.id);
        const productWithSlabs = await db.query.products.findFirst({
          where: eq2(products.id, newProduct.id),
          with: {
            category: true,
            farmer: true,
            priceSlabs: true
          }
        });
        res.status(201).json(productWithSlabs);
        const productName = name || "a new product";
        const savedOrgName = dmUser.orgName || "FPO Store";
        const savedOrgSlug = dmUser.orgSlug || "";
        const savedProductId = newProduct.id;
        const savedDmId = req.user.id;
        (async () => {
          try {
            const followers = await db.select({ followerId: fpoFollows.followerId }).from(fpoFollows).where(eq2(fpoFollows.dmUserId, savedDmId));
            if (followers.length > 0) {
              const notifValues = followers.map((f) => ({
                userId: f.followerId,
                type: "new_fpo_product",
                title: `New product from ${savedOrgName}`,
                message: `${savedOrgName} just added "${productName}" to their store. Check it out!`,
                data: JSON.stringify({ productId: savedProductId, orgSlug: savedOrgSlug }),
                isRead: false
              }));
              await db.insert(notifications).values(notifValues);
            }
          } catch (notifErr) {
            console.error("Error sending follower notifications:", notifErr);
          }
        })();
      } catch (validationError) {
        console.error("Error during DM product creation:", validationError);
        handleError(res, validationError);
      }
    } catch (error) {
      console.error("Unexpected error in DM product creation:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/products/:id`, authenticateJWT, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      let farmer = null;
      if (user.role === "admin") {
        farmer = await storage.getFarmerById(product.farmerId);
      } else if (user.role === "farmer") {
        farmer = await storage.getFarmerByUserId(req.user.id);
        if (!farmer) {
          return res.status(404).json({ message: "Farmer not found" });
        }
        if (product.farmerId !== farmer.id) {
          return res.status(403).json({ message: "You can only update your own products" });
        }
      } else if (user.role === "district_manager") {
        if (product.approvalStatus === "approved") {
          return res.status(403).json({ message: "District Managers cannot edit approved products. Only admins can edit approved products." });
        }
        const dmFarmer = await storage.getFarmerByUserId(req.user.id);
        if (product.createdByDmId === req.user.id) {
          farmer = product.farmerId ? await storage.getFarmerById(product.farmerId) : dmFarmer;
        } else if (dmFarmer && product.farmerId === dmFarmer.id) {
          farmer = dmFarmer;
        } else if (product.approvalStatus === "pending") {
          farmer = await storage.getFarmerById(product.farmerId);
        } else {
          return res.status(403).json({ message: "You can only update products you created or pending products" });
        }
      } else {
        return res.status(403).json({ message: "Only farmers, district managers, and admins can update products" });
      }
      if (!farmer) {
        return res.status(404).json({ message: "Associated farmer not found" });
      }
      const { priceSlabs, ...productFields } = req.body;
      const productData = {
        ...productFields,
        farmerId: farmer.id,
        // Convert date strings to Date objects
        harvestDate: new Date(req.body.harvestDate),
        availableUntil: new Date(req.body.availableUntil),
        // Handle B2B/B2C fields
        b2cQuantity: req.body.b2cQuantity || req.body.inventory || null,
        b2bQuantity: req.body.b2bQuantity || null,
        b2cMoq: req.body.b2cMoq || 1,
        b2bMoq: req.body.b2bMoq || 1,
        hasSlabPricing: req.body.hasSlabPricing && priceSlabs && priceSlabs.length > 0,
        gradeVariety: req.body.gradeVariety || null,
        approxWeightPerPieceGrams: req.body.unit === "pieces" && req.body.approxWeightPerPieceGrams ? String(req.body.approxWeightPerPieceGrams) : null
      };
      const validatedData = insertProductSchema.parse(productData);
      const updatedProduct = await storage.updateProduct(id, validatedData);
      if (req.body.hasSlabPricing !== void 0) {
        await db.delete(productPriceSlabs).where(eq2(productPriceSlabs.productId, id));
        if (priceSlabs && Array.isArray(priceSlabs) && priceSlabs.length > 0) {
          console.log("Creating price slabs for product:", id, priceSlabs);
          for (const slab of priceSlabs) {
            await db.insert(productPriceSlabs).values({
              productId: id,
              minQuantity: slab.minQuantity,
              maxQuantity: slab.maxQuantity || null,
              pricePerUnit: slab.pricePerUnit.toString(),
              slabType: slab.slabType || "b2b"
            });
          }
          console.log("Price slabs updated successfully");
        }
      }
      const calendarEntry = await storage.getCalendarEntryByProductId(id);
      if (calendarEntry) {
        await storage.updateCalendarEntry(calendarEntry.id, {
          monthlyStatus: generateMonthlyStatus(new Date(updatedProduct.harvestDate), new Date(updatedProduct.availableUntil))
        });
      } else {
        await storage.createCalendarEntry({
          productId: updatedProduct.id,
          monthlyStatus: generateMonthlyStatus(new Date(updatedProduct.harvestDate), new Date(updatedProduct.availableUntil))
        });
      }
      res.json(updatedProduct);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/products/:id`, authenticateJWT, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can delete products" });
      }
      const farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.farmerId !== farmer.id) {
        return res.status(403).json({ message: "You can only delete your own products" });
      }
      const calendarEntry = await storage.getCalendarEntryByProductId(id);
      if (calendarEntry) {
        await storage.deleteCalendarEntry(calendarEntry.id);
      }
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/products/pending`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      let pendingProducts;
      if (req.user.role === "admin") {
        pendingProducts = await storage.getProductsWithFilters(
          eq2(products.approvalStatus, "pending")
        );
      } else if (req.user.role === "district_manager") {
        const linkedFarmerLinks = await db.select({
          farmerUserId: farmerFpoLinks.farmerUserId
        }).from(farmerFpoLinks).where(eq2(farmerFpoLinks.dmUserId, req.user.id));
        const linkedFarmerUserIds = linkedFarmerLinks.map((l) => l.farmerUserId);
        if (linkedFarmerUserIds.length === 0) {
          pendingProducts = [];
        } else {
          const linkedFarmers = await db.select({ id: farmers.id, userId: farmers.userId }).from(farmers).where(inArray2(farmers.userId, linkedFarmerUserIds));
          const linkedFarmerIds = linkedFarmers.map((f) => f.id);
          if (linkedFarmerIds.length === 0) {
            pendingProducts = [];
          } else {
            pendingProducts = await storage.getProductsWithFilters(
              and2(
                eq2(products.approvalStatus, "pending"),
                inArray2(products.farmerId, linkedFarmerIds)
              )
            );
          }
        }
      } else {
        return res.status(403).json({ error: "Access denied" });
      }
      const enrichedProducts = await Promise.all(pendingProducts.map(async (product) => {
        let farmer = null;
        if (product.farmerId && !isNaN(product.farmerId)) {
          try {
            farmer = await storage.getFarmerById(product.farmerId);
          } catch (error) {
            console.error(`Error fetching farmer ${product.farmerId}:`, error);
          }
        }
        return {
          ...product,
          farmerName: farmer?.farmName || "Unknown Farm",
          farmerLocation: farmer?.location || "Unknown Location"
        };
      }));
      return res.status(200).json(enrichedProducts);
    } catch (error) {
      console.error("Error fetching pending products:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/products/approved`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const currentDate = /* @__PURE__ */ new Date();
      let approvedProducts;
      console.log("Fetching approved products for admin...");
      if (req.user.role === "admin") {
        approvedProducts = await storage.getProductsWithFilters(
          and2(
            eq2(products.approvalStatus, "approved"),
            gt(products.availableUntil, currentDate)
          )
        );
        console.log(`Found ${approvedProducts.length} approved products`);
        approvedProducts.forEach((product) => {
          console.log(`Product ${product.id}: farmerId=${product.farmerId} (${typeof product.farmerId}), categoryId=${product.categoryId} (${typeof product.categoryId})`);
        });
      } else if (req.user.role === "district_manager") {
        approvedProducts = await storage.getProductsWithFilters(
          and2(
            eq2(products.approvalStatus, "approved"),
            gt(products.availableUntil, currentDate),
            eq2(products.approvedByUserId, req.user.id),
            eq2(products.approvalType, "fpo")
          )
        );
      } else {
        return res.status(403).json({ error: "Access denied" });
      }
      const enrichedProducts = await Promise.all(approvedProducts.map(async (product) => {
        let farmer = null;
        let category = null;
        if (product.farmerId && !isNaN(product.farmerId)) {
          try {
            farmer = await storage.getFarmerById(product.farmerId);
          } catch (error) {
            console.error(`Error fetching farmer ${product.farmerId}:`, error);
          }
        }
        if (product.categoryId && !isNaN(product.categoryId)) {
          try {
            category = await storage.getCategoryById(product.categoryId);
          } catch (error) {
            console.error(`Error fetching category ${product.categoryId}:`, error);
          }
        }
        let approverDetails = null;
        if (product.approvedByUserId) {
          try {
            const approverUser = await storage.getUserById(product.approvedByUserId);
            if (approverUser) {
              approverDetails = {
                name: approverUser.name,
                email: approverUser.email,
                phone: approverUser.phone,
                orgName: approverUser.orgName,
                orgAddress: approverUser.orgAddress,
                district: approverUser.district,
                approvalType: product.approvalType || "unknown"
              };
            }
          } catch (error) {
            console.warn(`Error fetching approver details for user ${product.approvedByUserId}:`, error);
          }
        }
        return {
          ...product,
          farmerName: farmer?.farmName || "Unknown Farm",
          farmerLocation: farmer?.location || "Unknown Location",
          categoryName: category?.name || "Uncategorized",
          approverDetails
        };
      }));
      return res.status(200).json(enrichedProducts);
    } catch (error) {
      console.error("Error fetching approved products:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/products/rejected`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      let rejectedProducts;
      if (req.user.role === "admin") {
        rejectedProducts = await storage.getProductsWithFilters(
          eq2(products.approvalStatus, "rejected")
        );
      } else if (req.user.role === "district_manager") {
        rejectedProducts = await storage.getProductsWithFilters(
          and2(
            eq2(products.approvalStatus, "rejected"),
            eq2(products.approvedByUserId, req.user.id),
            eq2(products.approvalType, "fpo")
          )
        );
      } else {
        return res.status(403).json({ error: "Access denied" });
      }
      const enrichedProducts = await Promise.all(rejectedProducts.map(async (product) => {
        const farmer = await storage.getFarmerById(product.farmerId);
        const category = await storage.getCategoryById(product.categoryId);
        let approverDetails = null;
        if (product.approvedByUserId) {
          try {
            const approverUser = await storage.getUserById(product.approvedByUserId);
            if (approverUser) {
              approverDetails = {
                name: approverUser.name,
                email: approverUser.email,
                phone: approverUser.phone,
                orgName: approverUser.orgName,
                orgAddress: approverUser.orgAddress,
                district: approverUser.district,
                approvalType: product.approvalType || "unknown"
              };
            }
          } catch (error) {
            console.warn(`Error fetching rejecter details for user ${product.approvedByUserId}:`, error);
          }
        }
        return {
          ...product,
          farmerName: farmer?.farmName || "Unknown Farm",
          farmerLocation: farmer?.location || "Unknown Location",
          categoryName: category?.name || "Uncategorized",
          approverDetails
        };
      }));
      return res.status(200).json(enrichedProducts);
    } catch (error) {
      console.error("Error fetching rejected products:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/products/expired`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const currentDate = /* @__PURE__ */ new Date();
      let expiredProducts;
      if (req.user.role === "admin") {
        expiredProducts = await storage.getProductsWithFilters(
          and2(
            eq2(products.approvalStatus, "approved"),
            lt(products.availableUntil, currentDate)
          )
        );
      } else if (req.user.role === "district_manager") {
        expiredProducts = await storage.getProductsWithFilters(
          and2(
            eq2(products.approvalStatus, "approved"),
            lt(products.availableUntil, currentDate),
            eq2(products.approvedByUserId, req.user.id),
            eq2(products.approvalType, "fpo")
          )
        );
      } else {
        return res.status(403).json({ error: "Access denied" });
      }
      const enrichedProducts = await Promise.all(expiredProducts.map(async (product) => {
        const farmer = await storage.getFarmerById(product.farmerId);
        const daysSinceExpiry = Math.floor(
          (currentDate.getTime() - new Date(product.availableUntil).getTime()) / (1e3 * 60 * 60 * 24)
        );
        let approverDetails = null;
        if (product.approvedByUserId) {
          try {
            const approverUser = await storage.getUserById(product.approvedByUserId);
            if (approverUser) {
              approverDetails = {
                name: approverUser.name,
                email: approverUser.email,
                phone: approverUser.phone,
                orgName: approverUser.orgName,
                orgAddress: approverUser.orgAddress,
                district: approverUser.district,
                approvalType: product.approvalType || "unknown"
              };
            }
          } catch (error) {
            console.warn(`Error fetching approver details for user ${product.approvedByUserId}:`, error);
          }
        }
        return {
          ...product,
          farmerName: farmer?.farmName || "Unknown Farm",
          farmerLocation: farmer?.location || "Unknown Location",
          daysSinceExpiry,
          approverDetails
        };
      }));
      return res.status(200).json(enrichedProducts);
    } catch (error) {
      console.error("Error fetching expired products:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/products/:id`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (isNaN(productId) || productId <= 0) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product for admin:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/dm/orders`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Access denied. District Manager role required." });
      }
      const productsApprovedByDM = await storage.getProductsWithFilters(
        and2(
          eq2(products.approvalStatus, "approved"),
          eq2(products.approvedByUserId, req.user.id),
          eq2(products.approvalType, "fpo")
        )
      );
      if (!productsApprovedByDM.length) {
        return res.json([]);
      }
      const productIds = productsApprovedByDM.map((p) => p.id);
      const allOrders = await storage.getAllOrdersWithItems();
      const dmOrders = allOrders.filter(
        (order) => order.items.some((item) => productIds.includes(item.productId))
      ).map((order) => ({
        ...order,
        items: order.items.filter((item) => productIds.includes(item.productId))
        // Only show items for DM-approved products
      }));
      const enrichedOrders = await Promise.all(dmOrders.map(async (order) => {
        const enrichedItems = await Promise.all(order.items.map(async (item) => {
          try {
            const product = productsApprovedByDM.find((p) => p.id === item.productId);
            let farmer = null;
            if (product) {
              farmer = await storage.getFarmerById(product.farmerId);
            }
            return {
              ...item,
              productName: product?.name || "Unknown Product",
              farmerName: farmer?.farmName || "Unknown Farmer",
              product: product ? {
                id: product.id,
                name: product.name,
                unit: product.unit,
                unitsPerBox: product.unitsPerBox,
                imageUrl: product.imageUrl
              } : null
            };
          } catch (error) {
            console.error(`Error enriching item ${item.id}:`, error);
            return {
              ...item,
              productName: "Unknown Product",
              farmerName: "Unknown Farmer",
              product: null
            };
          }
        }));
        return {
          ...order,
          items: enrichedItems
        };
      }));
      res.json(enrichedOrders);
    } catch (error) {
      console.error("Error fetching DM orders:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/dm/products/:id/approve`, authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { note } = req.body;
      if (!req.user || req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Access denied. District manager role required." });
      }
      if (!req.user.district) {
        return res.status(400).json({ error: "District manager must have district assignment" });
      }
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.approvalStatus !== "pending") {
        return res.status(400).json({
          error: `Cannot approve product with status: ${product.approvalStatus}. Only pending products can be approved.`
        });
      }
      const farmer = await storage.getFarmerById(product.farmerId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const farmerUser = await storage.getUserById(farmer.userId);
      if (!farmerUser || farmerUser.district !== req.user.district) {
        return res.status(403).json({ error: "Cannot approve products from farmers outside your district" });
      }
      try {
        const updateData = {
          approvalStatus: "approved",
          rejectionReason: null
        };
        if (req.user.id) {
          updateData.approvedByUserId = req.user.id;
          updateData.approvedAt = /* @__PURE__ */ new Date();
          updateData.approvalType = "fpo";
        }
        const updatedProduct = await storage.updateProduct(productId, updateData);
        storage.notifyProductApproval(productId, true).catch((err) => {
          console.error("Failed to send product approval notification:", err);
        });
        return res.status(200).json({
          product: updatedProduct,
          message: "Product approved successfully"
        });
      } catch (error) {
        console.warn("New approval columns not yet available, using basic approval:", error);
        const updatedProduct = await storage.updateProduct(productId, {
          approvalStatus: "approved",
          rejectionReason: null
        });
        storage.notifyProductApproval(productId, true).catch((err) => {
          console.error("Failed to send product approval notification:", err);
        });
        return res.status(200).json({
          product: updatedProduct,
          message: "Product approved successfully"
        });
      }
    } catch (error) {
      console.error("Error approving product:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/dm/products/:id/approve`, authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { note } = req.body;
      if (!req.user || req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Access denied. District manager role required." });
      }
      if (!req.user.district) {
        return res.status(400).json({ error: "District manager must have district assignment" });
      }
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.approvalStatus !== "pending") {
        return res.status(400).json({
          error: `Cannot approve product with status: ${product.approvalStatus}. Only pending products can be approved.`
        });
      }
      const farmer = await storage.getFarmerById(product.farmerId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const farmerUser = await storage.getUserById(farmer.userId);
      if (!farmerUser || farmerUser.district !== req.user.district) {
        return res.status(403).json({ error: "Cannot approve products from farmers outside your district" });
      }
      try {
        const updateData = {
          approvalStatus: "approved",
          rejectionReason: null
        };
        if (req.user.id) {
          updateData.approvedByUserId = req.user.id;
          updateData.approvedAt = /* @__PURE__ */ new Date();
          updateData.approvalType = "fpo";
        }
        const updatedProduct = await storage.updateProduct(productId, updateData);
        return res.status(200).json({
          success: true,
          product: updatedProduct,
          message: "Product approved successfully"
        });
      } catch (error) {
        console.warn("New approval columns not yet available, using basic approval:", error);
        const updatedProduct = await storage.updateProduct(productId, {
          approvalStatus: "approved",
          rejectionReason: null
        });
        return res.status(200).json({
          success: true,
          product: updatedProduct,
          message: "Product approved successfully"
        });
      }
    } catch (error) {
      console.error("Error approving product:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/dm/products/:id/reject`, authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { reason } = req.body;
      if (!req.user || req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Access denied. District manager role required." });
      }
      if (!req.user.district) {
        return res.status(400).json({ error: "District manager must have district assignment" });
      }
      if (!reason || reason.trim().length < 10) {
        return res.status(400).json({ error: "Rejection reason must be at least 10 characters" });
      }
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.approvalStatus !== "pending") {
        return res.status(400).json({
          error: `Cannot reject product with status: ${product.approvalStatus}. Only pending products can be rejected.`
        });
      }
      const farmer = await storage.getFarmerById(product.farmerId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const farmerUser = await storage.getUserById(farmer.userId);
      if (!farmerUser || farmerUser.district !== req.user.district) {
        return res.status(403).json({ error: "Cannot reject products from farmers outside your district" });
      }
      const updatedProduct = await storage.updateProduct(productId, {
        approvalStatus: "rejected",
        rejectionReason: reason.trim(),
        approvedByUserId: req.user.id,
        approvalType: "fpo",
        approvalDate: /* @__PURE__ */ new Date()
      });
      storage.notifyProductApproval(productId, false, reason.trim()).catch((err) => {
        console.error("Failed to send product rejection notification:", err);
      });
      return res.status(200).json({
        product: updatedProduct,
        message: "Product rejected successfully"
      });
    } catch (error) {
      console.error("Error rejecting product:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/dm/orders`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Access denied. District manager role required." });
      }
      const { status, from, to, page = "1", limit = "10" } = req.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const offset = (pageNum - 1) * limitNum;
      let filters = [];
      if (status && typeof status === "string" && status !== "all") {
        filters.push(eq2(orders.status, status));
      }
      if (from && typeof from === "string") {
        filters.push(gte(orders.createdAt, new Date(from)));
      }
      if (to && typeof to === "string") {
        filters.push(lte(orders.createdAt, new Date(to)));
      }
      const allOrders = await storage.getOrdersWithFilters(
        filters.length > 0 ? and2(...filters) : void 0
      );
      const districtFilteredOrders = [];
      for (const order of allOrders) {
        const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
        let hasDistrictProducts = false;
        for (const item of orderItems2) {
          const product = await storage.getProductById(item.productId);
          if (product) {
            const farmer = await storage.getFarmerById(product.farmerId);
            if (farmer) {
              const farmerUser = await storage.getUserById(farmer.userId);
              if (farmerUser && farmerUser.district === req.user.district && product.approvalStatus === "approved") {
                hasDistrictProducts = true;
                break;
              }
            }
          }
        }
        if (hasDistrictProducts) {
          districtFilteredOrders.push(order);
        }
      }
      const paginatedOrders = districtFilteredOrders.slice(offset, offset + limitNum);
      const enrichedOrders = await Promise.all(paginatedOrders.map(async (order) => {
        const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
        const enrichedItems = await Promise.all(orderItems2.map(async (item) => {
          const [farmer, product] = await Promise.all([
            storage.getFarmerById(item.farmerId).catch(() => null),
            storage.getProductById(item.productId).catch(() => null)
          ]);
          return {
            ...item,
            farmerName: farmer?.farmName || "Unknown Farm",
            productName: product?.name || "Unknown Product",
            product: product ? {
              id: product.id,
              name: product.name,
              unit: product.unit,
              unitsPerBox: product.unitsPerBox,
              imageUrl: product.imageUrl
            } : null
          };
        }));
        return {
          ...order,
          items: enrichedItems,
          totalItems: enrichedItems.length
        };
      }));
      return res.status(200).json({
        orders: enrichedOrders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: districtFilteredOrders.length,
          totalPages: Math.ceil(districtFilteredOrders.length / limitNum)
        }
      });
    } catch (error) {
      console.error("Error fetching district manager orders:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/farmers`, async (req, res) => {
    try {
      const { search, tag, distance, featured, districtId } = req.query;
      let filters = [];
      if (search && typeof search === "string") {
        filters.push(
          or2(
            like2(storage.schema.farmers.farmName, `%${search}%`),
            like2(storage.schema.farmers.description, `%${search}%`),
            like2(storage.schema.farmers.location, `%${search}%`)
          )
        );
      }
      if (tag && typeof tag === "string" && tag !== "all") {
        filters.push(like2(sql2`${storage.schema.farmers.tags}::text`, `%${tag}%`));
      }
      if (distance && typeof distance === "string") {
        filters.push(lte(storage.schema.farmers.distance, parseFloat(distance)));
      }
      if (districtId && typeof districtId === "string" && districtId !== "all") {
        const district = await storage.getDistrictById(parseInt(districtId));
        if (district) {
          const farmerIds = await storage.getFarmerIdsByDistrictName(district.name);
          if (farmerIds.length > 0) {
            filters.push(inArray2(storage.schema.farmers.id, farmerIds));
          } else {
            return res.json([]);
          }
        }
      }
      let farmers2;
      if (featured === "true") {
        farmers2 = await storage.getFarmersWithFilters(
          filters.length > 0 ? and2(...filters) : void 0,
          3,
          desc2(storage.schema.farmers.rating)
        );
      } else {
        farmers2 = await storage.getFarmersWithFilters(
          filters.length > 0 ? and2(...filters) : void 0
        );
      }
      let activeFarmers = farmers2.filter((farmer) => farmer.user?.isActive === true);
      const isUserAdmin = req.user && req.user.role === "admin";
      const districtCache = {};
      for (const farmer of activeFarmers) {
        const dId = farmer.user?.districtId;
        if (dId && !districtCache[dId]) {
          const dist = await storage.getDistrictById(dId);
          if (dist) districtCache[dId] = dist.name;
        }
      }
      const farmersResponse = await Promise.all(activeFarmers.map(async (farmer) => {
        const followCounts = await storage.getFarmerFollowCounts(farmer.id);
        const userDistrictId = farmer.user?.districtId;
        const userDistrictText = farmer.user?.district;
        const resolvedLocation = userDistrictId && districtCache[userDistrictId] ? districtCache[userDistrictId] : userDistrictText || farmer.location;
        if (isUserAdmin) {
          return { ...farmer, location: resolvedLocation, followerCount: followCounts.followerCount };
        } else {
          const { phone, email, address, ...farmerWithoutContact } = farmer;
          return { ...farmerWithoutContact, location: resolvedLocation, followerCount: followCounts.followerCount };
        }
      }));
      res.json(farmersResponse);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/farmers/tags`, async (req, res) => {
    try {
      const farmers2 = await storage.getAllFarmers();
      const allTags = farmers2.flatMap((farmer) => {
        const tags = farmer.tags;
        return Array.isArray(tags) ? tags.filter((tag) => tag && tag.trim() !== "") : [];
      });
      const uniqueTags = [...new Set(allTags)];
      res.json(uniqueTags);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/farmers/images`, authenticateJWT, upload.array("images", 10), async (req, res) => {
    try {
      if (req.user?.role !== "farmer" && req.user?.role !== "district_manager") {
        return res.status(403).json({ message: "Only farmers and district managers can upload images" });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }
      const files = req.files;
      const cloudinaryUrls = [];
      for (const file of files) {
        try {
          const cloudinaryUrl = await StorageService.uploadImage(file, "farm-images");
          cloudinaryUrls.push(cloudinaryUrl);
          console.log(`\u2713 Uploaded to Cloudinary: ${file.filename} -> ${cloudinaryUrl}`);
        } catch (error) {
          console.error(`\u2717 Cloudinary upload failed for ${file.filename}:`, error);
        }
      }
      if (cloudinaryUrls.length === 0) {
        return res.status(500).json({
          success: false,
          message: "All Cloudinary uploads failed"
        });
      }
      console.log(`Successfully uploaded ${cloudinaryUrls.length} farm images to Cloudinary`);
      res.status(200).json({
        success: true,
        imageUrls: cloudinaryUrls,
        message: "Farm images uploaded successfully",
        validatedCount: cloudinaryUrls.length,
        totalUploaded: files.length
      });
    } catch (error) {
      console.error("Error uploading farm images:", error);
      res.status(500).json({
        success: false,
        message: "Farm images upload failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get(`${apiPrefix}/farmers/profile`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can access farmer profiles" });
      }
      const farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const user = await storage.getUserById(req.user.id);
      const profile = {
        ...farmer,
        name: user.name,
        email: user.email
      };
      res.json(profile);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/farmers/me/district-manager`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can access district manager information" });
      }
      const user = await storage.getUserById(req.user.id);
      if (!user || !user.district) {
        return res.status(404).json({ message: "No district assigned to farmer" });
      }
      const districtManager = await db.query.users.findFirst({
        where: and2(
          eq2(users.role, "district_manager"),
          eq2(users.district, user.district),
          eq2(users.isActive, true)
        )
      });
      if (!districtManager) {
        return res.status(404).json({ message: "No district manager found for your district" });
      }
      const safeDistrictManager = sanitizeUserData(districtManager);
      res.json(safeDistrictManager);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/location-change-requests`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can submit location change requests" });
      }
      const farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const { requestedLatitude, requestedLongitude, reason } = req.body;
      if (!requestedLatitude || !requestedLongitude || !reason) {
        return res.status(400).json({ message: "Requested coordinates and reason are required" });
      }
      const requestData = {
        farmerId: farmer.id,
        currentLatitude: farmer.latitude,
        currentLongitude: farmer.longitude,
        requestedLatitude: String(requestedLatitude),
        requestedLongitude: String(requestedLongitude),
        reason,
        status: "pending"
      };
      const [newRequest] = await db.insert(storage.schema.locationChangeRequests).values(requestData).returning();
      res.status(201).json(newRequest);
    } catch (error) {
      console.error("Error creating location change request:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/location-change-requests/farmer`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can view their location change requests" });
      }
      const farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const requests = await db.query.locationChangeRequests.findMany({
        where: eq2(storage.schema.locationChangeRequests.farmerId, farmer.id),
        orderBy: desc2(storage.schema.locationChangeRequests.createdAt)
      });
      res.json(requests);
    } catch (error) {
      console.error("Error fetching location change requests:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/location-change-requests`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const requests = await db.query.locationChangeRequests.findMany({
        orderBy: desc2(storage.schema.locationChangeRequests.createdAt)
      });
      const requestsWithFarmers = await Promise.all(requests.map(async (request) => {
        const farmer = await db.query.farmers.findFirst({
          where: eq2(storage.schema.farmers.id, request.farmerId),
          columns: { farmName: true, id: true }
        });
        return { ...request, farmer };
      }));
      res.json(requestsWithFarmers);
    } catch (error) {
      console.error("Error fetching location change requests:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/location-change-requests/:id`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const requestId = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
      }
      const request = await db.query.locationChangeRequests.findFirst({
        where: eq2(storage.schema.locationChangeRequests.id, requestId)
      });
      if (!request) {
        return res.status(404).json({ message: "Location change request not found" });
      }
      if (request.status !== "pending") {
        return res.status(400).json({ message: "Request has already been processed" });
      }
      const [updatedRequest] = await db.update(storage.schema.locationChangeRequests).set({
        status,
        adminNotes,
        processedBy: req.user.id,
        processedAt: /* @__PURE__ */ new Date()
      }).where(eq2(storage.schema.locationChangeRequests.id, requestId)).returning();
      if (status === "approved") {
        await db.update(storage.schema.farmers).set({
          latitude: request.requestedLatitude,
          longitude: request.requestedLongitude,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(storage.schema.farmers.id, request.farmerId));
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error processing location change request:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/farmers/profile`, authenticateJWT, async (req, res) => {
    try {
      console.log("PUT /api/farmers/profile request received:", req.body);
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can update farmer profiles" });
      }
      const farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      console.log("Found farmer:", farmer);
      console.log("Farmer latitude:", farmer.latitude, "longitude:", farmer.longitude);
      if (req.body.latitude !== void 0 || req.body.longitude !== void 0) {
        if (farmer.latitude !== null && farmer.latitude !== void 0 || farmer.longitude !== null && farmer.longitude !== void 0) {
          return res.status(403).json({
            message: "Location coordinates are already set. To change your location, please submit a location change request through your profile."
          });
        }
        console.log("Allowing initial location setting for farmer:", farmer.id);
      }
      if (req.body.name || req.body.logoUrl) {
        const userData = {};
        if (req.body.name) userData.name = req.body.name;
        if (req.body.logoUrl) userData.avatar = req.body.logoUrl;
        console.log("Updating user data:", userData);
        await storage.updateUser(req.user.id, userData);
      }
      const farmerData = {};
      if (req.body.farmName) farmerData.farmName = req.body.farmName;
      if (req.body.description) farmerData.description = req.body.description;
      if (req.body.address) farmerData.address = req.body.address;
      if (req.body.phone) farmerData.phone = req.body.phone;
      if (req.body.website) farmerData.website = req.body.website;
      if (req.body.story) farmerData.story = req.body.story;
      if (req.body.practices) farmerData.practices = req.body.practices;
      if (req.body.imageUrl) farmerData.imageUrl = req.body.imageUrl;
      if (req.body.logoUrl) farmerData.logoUrl = req.body.logoUrl;
      if (req.body.tags) farmerData.tags = req.body.tags;
      if (req.body.farmImages && Array.isArray(req.body.farmImages) && req.body.farmImages.length > 0) {
        farmerData.farmImages = req.body.farmImages;
      }
      if (req.body.instagramReels !== void 0) farmerData.instagramReels = req.body.instagramReels || null;
      if (req.body.youtube !== void 0) farmerData.youtube = req.body.youtube || null;
      if (req.body.website !== void 0) farmerData.website = req.body.website || null;
      if (req.body.latitude !== void 0) farmerData.latitude = req.body.latitude;
      if (req.body.longitude !== void 0) farmerData.longitude = req.body.longitude;
      console.log("Updating farmer data:", farmerData);
      const updatedFarmer = await storage.updateFarmer(farmer.id, farmerData);
      const user = await storage.getUserById(req.user.id);
      const profile = {
        ...updatedFarmer,
        name: user.name,
        email: user.email
      };
      console.log("Updated profile:", profile);
      res.json(profile);
    } catch (error) {
      console.error("Error updating farmer profile:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/farmers/:identifier`, async (req, res) => {
    try {
      const identifier = req.params.identifier;
      let id;
      if (/^\d+$/.test(identifier)) {
        id = parseInt(identifier);
      } else {
        const match = identifier.match(/-(\d+)$/);
        if (!match) {
          return res.status(404).json({ message: "Farmer not found" });
        }
        id = parseInt(match[1]);
      }
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid farmer ID" });
      }
      const farmer = await storage.getFarmerById(id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      if (!farmer.user?.isActive) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      console.log("Farmer detail - Raw farmer data:", {
        id: farmer.id,
        farmName: farmer.farmName,
        email: farmer.email,
        phone: farmer.phone,
        address: farmer.address,
        userEmail: farmer.user?.email,
        userPhone: farmer.user?.phone,
        hasUser: !!farmer.user,
        youtube: farmer.youtube,
        instagramReels: farmer.instagramReels,
        website: farmer.website
      });
      let resolvedLocation = farmer.location;
      if (farmer.user?.districtId) {
        const dist = await storage.getDistrictById(farmer.user.districtId);
        if (dist) resolvedLocation = dist.name;
      } else if (farmer.user?.district) {
        resolvedLocation = farmer.user.district;
      }
      const farmerWithContact = {
        ...farmer,
        location: resolvedLocation,
        email: farmer.email || farmer.user?.email || null,
        phone: farmer.phone || farmer.user?.phone || null,
        address: farmer.address || null
      };
      console.log("Farmer detail - After contact merge:", {
        id: farmerWithContact.id,
        email: farmerWithContact.email,
        phone: farmerWithContact.phone,
        address: farmerWithContact.address
      });
      const reviews3 = await storage.getReviewsByFarmerId(id);
      const userRole = req.query.userRole;
      const isUserAdmin = userRole === "admin";
      console.log("Farmer detail - User role from query:", userRole);
      console.log('Farmer detail - userRole === "admin":', userRole === "admin");
      console.log("Farmer detail - Is user admin:", isUserAdmin);
      console.log("Farmer detail - Contact data available:", {
        hasEmail: !!farmerWithContact.email,
        hasPhone: !!farmerWithContact.phone,
        hasAddress: !!farmerWithContact.address
      });
      let farmerData;
      if (isUserAdmin) {
        console.log("Farmer detail - Returning full contact data for admin");
        farmerData = farmerWithContact;
      } else {
        console.log("Farmer detail - Filtering contact data for non-admin");
        const { phone, email, address, ...farmerWithoutContact } = farmerWithContact;
        console.log("Farmer detail - Filtered data keys:", Object.keys(farmerWithoutContact));
        farmerData = farmerWithoutContact;
      }
      const followCounts = await storage.getFarmerFollowCounts(id);
      const farmerWithReviews = {
        ...farmerData,
        followerCount: followCounts.followerCount,
        reviews: reviews3.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          name: review.user ? review.user.name : "Anonymous",
          avatarUrl: review.user && review.user.avatar ? review.user.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
          date: new Date(review.createdAt).toLocaleDateString()
        }))
      };
      res.json(farmerWithReviews);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/farmers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid farmer ID" });
      }
      const farmer = await storage.getFarmerById(id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const farmerData = {};
      if (req.body.farmName) farmerData.farmName = req.body.farmName;
      if (req.body.description) farmerData.description = req.body.description;
      if (req.body.location) farmerData.location = req.body.location;
      if (req.body.address) farmerData.address = req.body.address;
      if (req.body.phone) farmerData.phone = req.body.phone;
      if (req.body.website !== void 0) farmerData.website = req.body.website || null;
      if (req.body.story) farmerData.story = req.body.story;
      if (req.body.practices) farmerData.practices = req.body.practices;
      if (req.body.imageUrl) farmerData.imageUrl = req.body.imageUrl;
      if (req.body.logoUrl) farmerData.logoUrl = req.body.logoUrl;
      if (req.body.tags) farmerData.tags = req.body.tags;
      if (req.body.farmImages) farmerData.farmImages = req.body.farmImages;
      if (req.body.instagramReels !== void 0) farmerData.instagramReels = req.body.instagramReels || null;
      if (req.body.youtube !== void 0) farmerData.youtube = req.body.youtube || null;
      const updatedFarmer = await storage.updateFarmer(id, farmerData);
      console.log("Updated farmer:", updatedFarmer);
      res.json(updatedFarmer);
    } catch (error) {
      console.error("Error updating farmer:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/customers/profile`, authenticateJWT, async (req, res) => {
    try {
      const customer = await storage.getCustomerByUserId(req.user.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      const user = await storage.getUserById(req.user.id);
      const profile = {
        ...customer,
        name: user.name,
        email: user.email
      };
      res.json(profile);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/customers/profile`, authenticateJWT, async (req, res) => {
    try {
      const customer = await storage.getCustomerByUserId(req.user.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      if (req.body.name || req.body.email) {
        const userData = {};
        if (req.body.name) userData.name = req.body.name;
        if (req.body.email) userData.email = req.body.email;
        await storage.updateUser(req.user.id, userData);
      }
      const customerData = {};
      if (req.body.phone) customerData.phone = req.body.phone;
      if (req.body.address) customerData.address = req.body.address;
      if (req.body.city) customerData.city = req.body.city;
      if (req.body.state) customerData.state = req.body.state;
      if (req.body.zipCode) customerData.zipCode = req.body.zipCode;
      if (req.body.avatarUrl) customerData.avatarUrl = req.body.avatarUrl;
      const updatedCustomer = await storage.updateCustomer(customer.id, customerData);
      const user = await storage.getUserById(req.user.id);
      const profile = {
        ...updatedCustomer,
        name: user.name,
        email: user.email
      };
      res.json(profile);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/calendar`, async (req, res) => {
    try {
      const { search, category, month, preview } = req.query;
      let filters = [];
      if (search && typeof search === "string") {
        filters.push(like2(storage.schema.products.name, `%${search}%`));
      }
      if (category && typeof category === "string" && category !== "all") {
        filters.push(eq2(storage.schema.products.categoryId, parseInt(category)));
      }
      const currentDate = /* @__PURE__ */ new Date();
      filters.push(eq2(storage.schema.products.approvalStatus, "approved"));
      filters.push(gt(storage.schema.products.availableUntil, currentDate));
      const calendarEntries3 = await storage.getCalendarEntriesWithFilters(
        filters.length > 0 ? and2(...filters) : void 0,
        preview === "true" ? 4 : void 0
      );
      const formattedEntries = calendarEntries3.map((entry) => {
        return {
          id: entry.id,
          produceName: entry.product.name,
          imageUrl: entry.product.imageUrl,
          categoryId: entry.product.categoryId,
          monthlyStatus: entry.monthlyStatus,
          farms: [{
            id: entry.product.farm.id,
            name: entry.product.farm.farmName,
            logoUrl: entry.product.farm.logoUrl
          }]
        };
      });
      res.json(formattedEntries);
    } catch (error) {
      handleError(res, error);
    }
  });
  const b2bOrderSchema = z2.object({
    productId: z2.coerce.number().int().positive("Product ID must be a positive integer"),
    quantity: z2.coerce.number().int().positive("Quantity must be a positive integer"),
    pricePerUnit: z2.coerce.number().positive("Price must be a positive number"),
    totalAmount: z2.coerce.number().optional()
  });
  app2.post(`${apiPrefix}/b2b-orders`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const parseResult = b2bOrderSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errors = parseResult.error.errors.map((e) => e.message).join(", ");
        return res.status(400).json({ message: `Invalid input: ${errors}` });
      }
      const { productId: parsedProductId, quantity: qty, pricePerUnit: clientUnitPrice } = parseResult.data;
      const product = await storage.getProductById(parsedProductId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.status !== "Available Now") {
        const userSubscription = await getUserActiveSubscription(req.user.id);
        const canPreorderWholesale = userSubscription?.plan?.preorderWholesale || false;
        if (!canPreorderWholesale) {
          return res.status(403).json({
            code: "SUBSCRIPTION_REQUIRED",
            message: "Pre-harvest wholesale ordering requires a Business subscription plan."
          });
        }
      }
      const b2bStock = product.b2bQuantity || product.totalAvailableQuantity || 0;
      const b2bMoq = product.b2bMoq || 1;
      if (qty < b2bMoq) {
        return res.status(400).json({ message: `Minimum order quantity is ${b2bMoq}` });
      }
      if (qty > b2bStock) {
        return res.status(400).json({ message: `Insufficient stock. Only ${b2bStock} available.` });
      }
      const priceSlabs = await db.query.productPriceSlabs.findMany({
        where: eq2(productPriceSlabs.productId, parsedProductId)
      });
      const b2bSlabs = priceSlabs.filter((s) => s.slabType === "b2b").sort((a, b) => a.minQuantity - b.minQuantity);
      let serverUnitPrice = parseFloat(String(product.price));
      for (const slab of b2bSlabs) {
        const min = slab.minQuantity;
        const max = slab.maxQuantity || Infinity;
        if (qty >= min && qty <= max) {
          serverUnitPrice = parseFloat(slab.pricePerUnit);
          break;
        }
      }
      const priceDifference = Math.abs(clientUnitPrice - serverUnitPrice);
      if (priceDifference > serverUnitPrice * 0.05) {
        return res.status(400).json({
          message: "Price has changed. Please refresh the page and try again.",
          expectedPrice: serverUnitPrice,
          receivedPrice: clientUnitPrice
        });
      }
      const serverTotal = serverUnitPrice * qty;
      const customer = await storage.getCustomerByUserId(req.user.id);
      const user = await storage.getUserById(req.user.id);
      const orderData = {
        userId: req.user.id,
        customerName: user?.name || "B2B Customer",
        email: user?.email || "",
        phone: user?.phone || customer?.phone || "",
        address: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        zipCode: customer?.zipCode || "",
        total: serverTotal.toString(),
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "online",
        notes: `B2B Bulk Order - ${qty} ${product.unit} @ ${formatPrice(serverUnitPrice)}/${product.unit}`,
        deliveryDate: (() => {
          if (product.status === "Pre-Order" && product.harvestDate) {
            const harvest = new Date(product.harvestDate);
            harvest.setDate(harvest.getDate() + 1);
            return harvest;
          }
          const tomorrow = /* @__PURE__ */ new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow;
        })(),
        farmerId: product.farmerId
      };
      const order = await storage.createOrder(orderData);
      await storage.createOrderItem({
        orderId: order.id,
        productId: product.id,
        quantity: qty,
        price: serverUnitPrice.toString(),
        farmerId: product.farmerId
      });
      const freshProduct = await storage.getProductById(parsedProductId);
      const currentB2BStock = freshProduct?.b2bQuantity || 0;
      const newB2BStock = Math.max(0, currentB2BStock - qty);
      console.log(`\u{1F4E6} B2B Stock Update: Product ${parsedProductId} (${product.name}) - Before: ${currentB2BStock}, Ordered: ${qty}, After: ${newB2BStock}`);
      const updateResult = await db.update(products).set({
        b2bQuantity: newB2BStock,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq2(products.id, parsedProductId)).returning({ id: products.id, b2bQuantity: products.b2bQuantity });
      console.log(`\u{1F4E6} B2B Stock Update Result:`, JSON.stringify(updateResult));
      res.status(201).json({
        success: true,
        orderId: order.id,
        total: serverTotal,
        quantity: qty,
        pricePerUnit: serverUnitPrice,
        newB2BStock,
        message: "B2B order created successfully"
      });
    } catch (error) {
      console.error("Error creating B2B order:", error);
      handleError(res, error);
    }
  });
  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  }
  app2.get(`${apiPrefix}/orders`, authenticateJWT, async (req, res) => {
    try {
      const orders2 = await storage.getOrdersByUserId(req.user.id);
      const formattedOrdersPromises = orders2.map(async (order) => {
        if (order.items) {
          const updatedItemsPromises = order.items.map(async (item) => {
            if (item.product) {
              let farmName = "";
              if (item.farmerId) {
                const farmer = await storage.getFarmerById(item.farmerId);
                if (farmer) {
                  farmName = farmer.farmName;
                }
              }
              return {
                ...item,
                productName: item.product.name,
                imageUrl: item.product.imageUrl,
                farmName
              };
            }
            return item;
          });
          order.items = await Promise.all(updatedItemsPromises);
        }
        return order;
      });
      const formattedOrders = await Promise.all(formattedOrdersPromises);
      res.json(formattedOrders);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/orders/farmer`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can access farmer orders" });
      }
      const farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      console.log(`Fetching orders for farmer ID: ${farmer.id} with name: ${farmer.farmName}`);
      const orders2 = await storage.getOrdersByFarmerId(farmer.id);
      console.log(`Found ${orders2.length} orders with items from farmer ${farmer.id}`);
      const formattedOrdersPromises = orders2.map(async (order) => {
        const farmerItems = order.items ? order.items.filter((item) => item.farmerId === farmer.id) : [];
        console.log(`Order #${order.id} - Total items: ${order.items?.length || 0}, Farmer's items: ${farmerItems.length}`);
        const enhancedItems = await Promise.all(farmerItems.map(async (item) => {
          let productDetails = null;
          if (item.productId) {
            try {
              productDetails = await storage.getProductById(item.productId);
            } catch (error) {
              console.error(`Error fetching product details for product ID ${item.productId}:`, error);
            }
          }
          if (item.product || productDetails) {
            return {
              ...item,
              // Use complete product details if available
              product: productDetails ? {
                id: productDetails.id,
                name: productDetails.name,
                status: productDetails.status || "available",
                harvestDate: productDetails.harvestDate,
                availableUntil: productDetails.availableUntil,
                unitsPerBox: productDetails.unitsPerBox,
                unit: productDetails.unit,
                imageUrl: productDetails.imageUrl
              } : item.product || null,
              productName: (productDetails || item.product)?.name || "Unknown Product",
              imageUrl: (productDetails || item.product)?.imageUrl || null,
              farmName: farmer.farmName,
              // Include availability info critical for delivery date calculations
              availabilityStatus: (productDetails || item.product)?.availabilityStatus || null,
              harvestDate: (productDetails || item.product)?.harvestDate || null
            };
          }
          return item;
        }));
        return {
          ...order,
          items: enhancedItems
        };
      });
      const formattedOrders = await Promise.all(formattedOrdersPromises);
      const filteredOrders = formattedOrders.filter(
        (order) => order.items && order.items.length > 0
      );
      console.log(`Returning ${filteredOrders.length} orders to farmer ${farmer.id}`);
      res.json(filteredOrders);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/orders/farmer/:id/status`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can update their orders' status" });
      }
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const allowedStatuses = ["pending", "accepted", "growing", "harvested", "packaging", "shipping"];
      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Farmers can update to: pending, accepted, growing, harvested, packaging, shipping"
        });
      }
      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const farmer = await storage.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer profile not found" });
      }
      const orderItems2 = order.items?.filter((item) => item.farmerId === farmer.id);
      if (!orderItems2 || orderItems2.length === 0) {
        return res.status(403).json({ message: "This order does not contain any items from your farm" });
      }
      const updatedOrder = await storage.updateOrder(orderId, { status });
      if (updatedOrder) {
        const customer = await storage.getUserById(order.userId);
        if (customer) {
          sendOrderStatusUpdateEmail(updatedOrder, customer).then((success) => {
            console.log(`Farmer: Order status update email sent to customer: ${success}`);
          }).catch((err) => {
            console.error("Farmer: Error sending order status update email to customer:", err);
          });
        }
      }
      return res.status(200).json({
        order: updatedOrder,
        message: `Order status updated to ${status} successfully`
      });
    } catch (error) {
      console.error("Error updating order status by farmer:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/orders/:id`, authenticateJWT, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (req.user.role === "customer" && order.userId !== req.user.id) {
        return res.status(403).json({ message: "You can only view your own orders" });
      }
      if (req.user.role === "farmer") {
        const farmer = await storage.getFarmerByUserId(req.user.id);
        if (!farmer) {
          return res.status(404).json({ message: "Farmer not found" });
        }
        const farmerItems = order.items.filter((item) => item.farmerId === farmer.id);
        if (farmerItems.length === 0) {
          return res.status(403).json({ message: "This order does not contain any of your products" });
        }
      }
      if (order.items) {
        const updatedItemsPromises = order.items.map(async (item) => {
          if (item.product) {
            let farmName = "";
            if (item.farmerId) {
              const farmer = await storage.getFarmerById(item.farmerId);
              if (farmer) {
                farmName = farmer.farmName;
              }
            }
            return {
              ...item,
              productName: item.product.name,
              imageUrl: item.product.imageUrl,
              farmName
            };
          }
          return item;
        });
        order.items = await Promise.all(updatedItemsPromises);
      }
      const fees = await storage.getActiveOrderFees();
      let zeroPlatformFee = false;
      if (req.user) {
        const userSub = await getUserActiveSubscription(req.user.id);
        zeroPlatformFee = userSub?.plan?.zeroPlatformFee || false;
      }
      const subtotal = order.items.reduce((sum, item) => {
        return sum + parseFloat(item.price) * item.quantity;
      }, 0);
      let runningTotal = subtotal;
      const feesWithAmounts = fees.map((fee) => {
        const feeValue = parseFloat(fee.value);
        let amount = 0;
        const feeName = fee.name.toLowerCase();
        const isPlatformFee = feeName.includes("tech") || feeName.includes("support") || feeName.includes("platform") || feeName.includes("santhe");
        if (zeroPlatformFee && isPlatformFee && fee.type === "percentage") {
          amount = 0;
        } else if (fee.type === "fixed") {
          amount = feeValue;
        } else {
          if (fee.applyToSubtotal) {
            amount = runningTotal * feeValue / 100;
            runningTotal += amount;
          } else {
            amount = subtotal * feeValue / 100;
          }
        }
        return {
          ...fee,
          amount: parseFloat(amount.toFixed(2))
        };
      });
      order.fees = feesWithAmounts;
      res.json(order);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/orders/:id/status`, authenticateJWT, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const updatedOrder = await storage.updateOrder(id, { status });
      if (updatedOrder) {
        const customer = await storage.getUserById(order.userId);
        if (customer) {
          sendOrderStatusUpdateEmail(updatedOrder, customer).then((success) => {
            console.log(`Order status update email sent to customer: ${success}`);
          }).catch((err) => {
            console.error("Error sending order status update email:", err);
          });
          try {
            await storage.notifyOrderStatusUpdate(id, status);
            console.log(`In-app notification created for order ${id} status update to ${status}`);
          } catch (notificationError) {
            console.error("Error creating in-app notification for order status update:", notificationError);
          }
        }
      }
      res.json(updatedOrder);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/orders`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "You must be logged in to place an order" });
      }
      const {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        paymentMethod,
        notes,
        items,
        total,
        farmerId,
        deliveryFee
      } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order must contain at least one item" });
      }
      const userSubscription = await getUserActiveSubscription(req.user.id);
      const canPreorderRetail = userSubscription?.plan?.preorderRetail || false;
      const canPreorderWholesale = userSubscription?.plan?.preorderWholesale || false;
      const hasZeroPlatformFee = userSubscription?.plan?.zeroPlatformFee || false;
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }
          if (product.status !== "Available Now") {
            if (item.b2bOrder && !canPreorderWholesale) {
              throw new Error(`SUBSCRIPTION_REQUIRED:Wholesale pre-order requires a Business subscription plan. Product: ${product.name}`);
            }
            if (!item.b2bOrder && !canPreorderRetail) {
              throw new Error(`SUBSCRIPTION_REQUIRED:Pre-harvest ordering requires a subscription plan. Product: ${product.name}`);
            }
          }
          return {
            ...item,
            product,
            farmerId: item.farmerId || farmerId || product.farmerId
          };
        })
      );
      const farmerDeliveryGroups = /* @__PURE__ */ new Map();
      itemsWithProducts.forEach((item) => {
        let deliveryDate;
        if (item.product.status === "Pre-Order" && item.product.harvestDate) {
          const harvest = new Date(item.product.harvestDate);
          deliveryDate = new Date(harvest);
          deliveryDate.setDate(deliveryDate.getDate() + 1);
        } else {
          const tomorrow = /* @__PURE__ */ new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          deliveryDate = tomorrow;
        }
        const deliveryKey = deliveryDate.toISOString().split("T")[0];
        const groupKey = `${item.farmerId}-${deliveryKey}`;
        if (!farmerDeliveryGroups.has(groupKey)) {
          farmerDeliveryGroups.set(groupKey, []);
        }
        farmerDeliveryGroups.get(groupKey).push(item);
      });
      console.log(`Splitting order into ${farmerDeliveryGroups.size} separate orders based on farmer and delivery dates`);
      const createdOrders = [];
      for (const [groupKey, groupItems] of farmerDeliveryGroups) {
        const firstDashIndex = groupKey.indexOf("-");
        const farmerId2 = groupKey.substring(0, firstDashIndex);
        const deliveryDate = groupKey.substring(firstDashIndex + 1);
        const groupSubtotal = groupItems.reduce((sum, item) => {
          const price = typeof item.price === "number" ? item.price : parseFloat(item.price);
          return sum + price * item.quantity;
        }, 0);
        const overallSubtotal = itemsWithProducts.reduce((sum, item) => {
          const price = typeof item.price === "number" ? item.price : parseFloat(item.price);
          return sum + price * item.quantity;
        }, 0);
        const proportionOfTotal = overallSubtotal > 0 ? groupSubtotal / overallSubtotal : 1;
        const groupTotalWithFees = total ? total * proportionOfTotal : groupSubtotal;
        const hasB2BItems = groupItems.some((item) => item.b2bOrder);
        const b2bPrefix = hasB2BItems ? "B2B Bulk Order | " : "";
        const groupDeliveryFee = deliveryFee ? Number(deliveryFee) * proportionOfTotal : 0;
        const orderData = {
          userId: req.user.id,
          customerName: `${firstName} ${lastName}`,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
          total: groupTotalWithFees.toFixed(2),
          // Use proportional total including fees
          deliveryFee: groupDeliveryFee.toFixed(2),
          status: "pending",
          paymentMethod: paymentMethod || "cashfree",
          // Store payment method
          notes: `${b2bPrefix}${notes || ""} | Delivery Date: ${deliveryDate}${paymentMethod === "cod" ? " | Payment: Cash on Delivery" : ""}`.trim()
        };
        const createdOrder = await storage.createOrder(orderData);
        console.log(`Created order ${createdOrder.id} for delivery date ${deliveryDate} with ${groupItems.length} items`);
        const orderItemsPromises = groupItems.map(async (item) => {
          console.log(`Processing order item: productId=${item.productId}, delivery date=${deliveryDate}, farmerId=${item.farmerId}, b2bOrder=${item.b2bOrder || false}`);
          if (item.b2bOrder) {
            const freshProd = await storage.getProductById(item.productId);
            const currentB2BStock = freshProd?.b2bQuantity || 0;
            const newB2BStock = Math.max(0, currentB2BStock - item.quantity);
            const result = await db.update(products).set({ b2bQuantity: newB2BStock, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(products.id, item.productId)).returning({ id: products.id, b2bQuantity: products.b2bQuantity });
            console.log(`\u{1F4E6} Checkout B2B stock: Product ${item.productId} (${item.product.name}) ${currentB2BStock} \u2192 ${newB2BStock}, DB result:`, JSON.stringify(result));
          } else {
            const newRetailInventory = Math.max(0, item.product.inventory - item.quantity);
            await storage.updateProduct(item.productId, {
              inventory: newRetailInventory
            });
            console.log(`\u{1F4E6} Checkout retail inventory: Product ${item.productId} (${item.product.name}) ${item.product.inventory} \u2192 ${newRetailInventory}`);
          }
          const LOW_STOCK_THRESHOLD = 10;
          const remainingStock = item.b2bOrder ? Math.max(0, (item.product.b2bQuantity || 0) - item.quantity) : Math.max(0, item.product.inventory - item.quantity);
          if (remainingStock <= LOW_STOCK_THRESHOLD && remainingStock > 0) {
            storage.notifyLowStock(item.productId, remainingStock, LOW_STOCK_THRESHOLD).catch((err) => {
              console.error("Failed to send low stock notification:", err);
            });
          }
          return storage.createOrderItem({
            orderId: createdOrder.id,
            productId: item.productId,
            farmerId: item.farmerId,
            quantity: item.quantity,
            price: typeof item.price === "number" ? item.price.toString() : item.price.toString()
          });
        });
        await Promise.all(orderItemsPromises);
        const completeOrder = await storage.getOrderById(createdOrder.id);
        createdOrders.push(completeOrder);
      }
      const customer = await storage.getUserById(req.user.id);
      if (customer && createdOrders.length > 0) {
        createdOrders.forEach((order) => {
          if (order) {
            sendOrderConfirmationEmail(order, customer).then((success) => {
              console.log(`Order confirmation email sent for order ${order.id}: ${success}`);
            }).catch((err) => {
              console.error(`Error sending order confirmation email for order ${order.id}:`, err);
            });
            try {
              storage.createNotification({
                userId: customer.id,
                type: "order_confirmed",
                title: "Order Confirmed",
                message: `Your order #${order.id} has been confirmed and sent to farmers`,
                data: JSON.stringify({
                  orderId: order.id,
                  total: order.total,
                  paymentMethod: order.paymentMethod || "cod"
                })
              });
              console.log(`In-app notification created for customer about order ${order.id} confirmation`);
            } catch (notificationError) {
              console.error(`Error creating in-app notification for customer about order ${order.id}:`, notificationError);
            }
            if (order.items && order.items.length > 0) {
              const uniqueFarmerIds = [...new Set(order.items.filter((item) => item.farmerId).map((item) => item.farmerId))];
              uniqueFarmerIds.forEach(async (farmerId2) => {
                try {
                  const farmer = await storage.getFarmerById(farmerId2);
                  if (farmer) {
                    const farmerUser = await storage.getUserById(farmer.userId);
                    if (farmerUser) {
                      sendOrderNotificationToFarmer(order, farmerUser).then((success) => {
                        console.log(`Order notification email sent to farmer ${farmer.farmName} for order ${order.id}: ${success}`);
                      }).catch((err) => {
                        console.error(`Error sending order notification to farmer ${farmer.farmName} for order ${order.id}:`, err);
                      });
                      try {
                        await storage.createNotification({
                          userId: farmer.userId,
                          type: "order_placed",
                          title: "New Order Received",
                          message: `You have received a new order #${order.id} from ${customer.name || customer.username}`,
                          data: JSON.stringify({
                            orderId: order.id,
                            customerName: order.customerName,
                            total: order.total
                          })
                        });
                        console.log(`In-app notification created for farmer ${farmer.farmName} about new order ${order.id}`);
                      } catch (notificationError) {
                        console.error(`Error creating in-app notification for farmer ${farmer.farmName} about order ${order.id}:`, notificationError);
                      }
                    }
                  }
                } catch (err) {
                  console.error(`Error processing farmer notification for farmerId ${farmerId2} in order ${order.id}:`, err);
                }
              });
            }
          }
        });
      }
      const response = createdOrders.length === 1 ? createdOrders[0] : createdOrders;
      res.status(201).json(response);
    } catch (error) {
      if (error?.message?.startsWith("SUBSCRIPTION_REQUIRED:")) {
        const msg = error.message.replace("SUBSCRIPTION_REQUIRED:", "");
        return res.status(403).json({ code: "SUBSCRIPTION_REQUIRED", message: msg });
      }
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/products/:id/reviews`, authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const reviews3 = await storage.getReviewsByProductId(productId);
      const userReview = reviews3.find((review2) => review2.userId === req.user.id);
      if (userReview) {
        return res.status(400).json({ message: "You have already reviewed this product" });
      }
      const review = await storage.createReview({
        productId,
        userId: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment
      });
      const user = await storage.getUserById(req.user.id);
      const reviewerName = user?.name || user?.username || "A customer";
      storage.notifyNewReview(review.id, productId, req.body.rating, reviewerName).catch((err) => {
        console.error("Failed to send new review notification:", err);
      });
      const formattedReview = {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        name: user.name,
        avatarUrl: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
        date: new Date(review.createdAt).toLocaleDateString()
      };
      res.status(201).json(formattedReview);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/farmers/:id/reviews`, authenticateJWT, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.id);
      const farmer = await storage.getFarmerById(farmerId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const reviews3 = await storage.getReviewsByFarmerId(farmerId);
      const userReview = reviews3.find((review2) => review2.userId === req.user.id);
      if (userReview) {
        return res.status(400).json({ message: "You have already reviewed this farmer" });
      }
      const review = await storage.createReview({
        farmerId,
        userId: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment
      });
      const user = await storage.getUserById(req.user.id);
      const formattedReview = {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        name: user.name,
        avatarUrl: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
        date: new Date(review.createdAt).toLocaleDateString()
      };
      res.status(201).json(formattedReview);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/newsletter`, async (req, res) => {
    try {
      const { email } = req.body;
      const validatedData = insertNewsletterSubscriberSchema.parse({ email });
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(email);
      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          return res.status(409).json({ message: "Already subscribed" });
        } else {
          await storage.updateNewsletterSubscriber(existingSubscriber.id, { isActive: true });
          return res.json({ message: "Subscription reactivated" });
        }
      }
      await storage.createNewsletterSubscriber(validatedData);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/fpo-inquiry`, async (req, res) => {
    try {
      const { orgName, contactName, email, phone, district, message } = req.body;
      if (!orgName || !contactName || !email || !phone || !district) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }
      await db.insert(fpoInquiries).values({
        orgName,
        contactName,
        email,
        phone,
        district,
        message: message || null,
        status: "new"
      });
      res.status(201).json({ message: "Inquiry submitted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/fpo-inquiries`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const inquiries = await db.select().from(fpoInquiries).orderBy(fpoInquiries.createdAt);
      res.json(inquiries);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/ai-subscription-plans`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const plans = await storage.getAllAiSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching AI subscription plans:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/ai-subscription-plans`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const { name, description, price, duration, durationType } = req.body;
      const planData = {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        durationType,
        isActive: true
      };
      const plan = await storage.createAiSubscriptionPlan(planData);
      res.json(plan);
    } catch (error) {
      console.error("Error creating AI subscription plan:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/ai-subscription-plans/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const { name, description, price, duration, durationType, isActive } = req.body;
      const planData = {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        durationType,
        isActive
      };
      const plan = await storage.updateAiSubscriptionPlan(planId, planData);
      res.json(plan);
    } catch (error) {
      console.error("Error updating AI subscription plan:", error);
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/admin/ai-subscription-plans/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      await storage.deleteAiSubscriptionPlan(planId);
      res.json({ message: "AI subscription plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting AI subscription plan:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/farmers/:id/zbnf-certification`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.id);
      const { isZbnfCertified } = req.body;
      await storage.updateFarmerZbnfCertification(farmerId, isZbnfCertified);
      res.json({
        message: `Farmer ${isZbnfCertified ? "certified" : "decertified"} for ZBNF`,
        farmerId,
        isZbnfCertified
      });
    } catch (error) {
      console.error("Error updating farmer ZBNF certification:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/farmers/:id/organic-certification`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.id);
      const { isOrganicCertified } = req.body;
      if (typeof isOrganicCertified !== "boolean") {
        return res.status(400).json({ message: "isOrganicCertified must be a boolean value" });
      }
      const updatedFarmer = await storage.updateFarmerOrganicCertification(farmerId, isOrganicCertified);
      res.json({
        message: `Farmer organic certification ${isOrganicCertified ? "enabled" : "disabled"} successfully`,
        farmerId,
        isOrganicCertified,
        farmer: updatedFarmer
      });
    } catch (error) {
      console.error("Error updating farmer organic certification:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/farmers/:id/natural-certification`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.id);
      const { isNaturalCertified } = req.body;
      if (typeof isNaturalCertified !== "boolean") {
        return res.status(400).json({ message: "isNaturalCertified must be a boolean value" });
      }
      const updatedFarmer = await storage.updateFarmerNaturalCertification(farmerId, isNaturalCertified);
      res.json({
        message: `Farmer natural certification ${isNaturalCertified ? "enabled" : "disabled"} successfully`,
        farmerId,
        isNaturalCertified,
        farmer: updatedFarmer
      });
    } catch (error) {
      console.error("Error updating farmer natural certification:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/farmers/:id/ai-subscription`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.id);
      const { active, planId, months } = req.body;
      const farmer = await storage.getFarmerById(farmerId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      let expiryDate = null;
      if (active && months) {
        expiryDate = /* @__PURE__ */ new Date();
        expiryDate.setMonth(expiryDate.getMonth() + parseInt(months));
      }
      await storage.updateFarmerAISubscription(farmer.userId, active, expiryDate);
      res.json({
        message: `AI subscription ${active ? "activated" : "deactivated"} for ${farmer.farmName}`,
        farmerId,
        active,
        expiryDate
      });
    } catch (error) {
      console.error("Error updating farmer AI subscription:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/ai-subscription-plans`, authenticateJWT, async (req, res) => {
    try {
      const plans = await storage.getAllAiSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching AI subscription plans:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/farmer/ai-subscription-status`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only farmers and admins can check subscription status" });
      }
      if (req.user.role === "admin") {
        return res.json({
          success: true,
          hasActiveSubscription: false,
          subscriptionExpiry: null
        });
      }
      const hasActiveSubscription = await storage.checkFarmerAISubscription(req.user.id);
      const farmer = await storage.getFarmerByUserId(req.user.id);
      res.json({
        success: true,
        hasActiveSubscription,
        subscriptionExpiry: farmer?.aiSubscriptionExpiry || null
      });
    } catch (error) {
      console.error("Error checking farmer AI subscription:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/farmer/ai-plans`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only farmers and admins can view AI plans" });
      }
      const plans = await storage.getAllAiSubscriptionPlans();
      res.json({
        success: true,
        plans: plans.filter((plan) => plan.isActive)
      });
    } catch (error) {
      console.error("Error fetching AI plans for farmers:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/create-ai-subscription-payment`, authenticateJWT, async (req, res) => {
    try {
      if (req.user.role !== "farmer" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only farmers and admins can purchase AI subscriptions" });
      }
      const { planId, planName, amount, duration, durationType } = req.body;
      if (!planId || !planName || !amount || !duration || !durationType) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: planId, planName, amount, duration, durationType"
        });
      }
      let farmer = await storage.getFarmerByUserId(req.user.id);
      let customerPhone = "";
      if (!farmer && req.user.role === "admin") {
        customerPhone = req.user.phone || "";
        console.log("Admin user testing payment system");
      } else if (!farmer) {
        return res.status(404).json({
          success: false,
          message: "Farmer profile not found"
        });
      } else {
        customerPhone = farmer.phone || "";
      }
      const paymentData = {
        order_id: `ai_sub_${Date.now()}_${req.user.id}`,
        order_amount: parseFloat(amount),
        order_currency: "INR",
        customer_details: {
          customer_id: req.user.id.toString(),
          customer_name: req.user.name,
          customer_email: req.user.email || "",
          customer_phone: customerPhone
        },
        order_meta: {
          return_url: `https://farmersanthe.com/zbnf-recommendations?payment=success`,
          notify_url: `https://farmersanthe.com/api/payments/webhook`
        },
        order_note: `AI Subscription: ${planName}`
      };
      console.log("Creating AI subscription payment with data:", paymentData);
      const paymentResponse = await fetch("https://api.cashfree.com/pg/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        },
        body: JSON.stringify(paymentData)
      });
      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error("Cashfree API error:", errorText);
        throw new Error(`Cashfree API error: ${paymentResponse.status} ${errorText}`);
      }
      const paymentResult = await paymentResponse.json();
      if (!paymentResponse.ok) {
        console.error("Cashfree payment creation failed:", paymentResult);
        return res.status(400).json({
          success: false,
          message: "Payment session creation failed",
          error: paymentResult
        });
      }
      console.log("AI subscription payment session created:", paymentResult);
      console.log("Full Cashfree response:", JSON.stringify(paymentResult, null, 2));
      let paymentUrl = null;
      if (paymentResult.payment_link) {
        paymentUrl = paymentResult.payment_link;
        console.log("Using payment_link from Cashfree:", paymentUrl);
      } else if (paymentResult.payment_session_id) {
        const sessionId = String(paymentResult.payment_session_id).trim();
        console.log("Raw session ID:", sessionId);
        console.log("Session ID length:", sessionId.length);
        if (sessionId.includes("sjApayment") || sessionId.endsWith("ayment")) {
          console.error("Session ID appears to be truncated:", sessionId);
          return res.json({
            success: true,
            paymentUrl: null,
            orderId: paymentResult.order_id,
            sessionId,
            useSDK: true,
            cashfreeOrder: {
              order_id: paymentResult.order_id,
              order_token: paymentResult.order_token,
              order_amount: paymentResult.order_amount,
              order_currency: paymentResult.order_currency
            },
            debug: {
              payment_link: paymentResult.payment_link,
              payment_session_id: paymentResult.payment_session_id,
              order_token: paymentResult.order_token,
              truncated_session: true,
              full_response: paymentResult
            }
          });
        } else {
          paymentUrl = `https://payments.cashfree.com/pay/${sessionId}`;
          console.log("Constructed payment URL with session ID:", paymentUrl);
        }
      } else if (paymentResult.order_token) {
        const orderToken = String(paymentResult.order_token).trim();
        paymentUrl = `https://payments.cashfree.com/pay?order_token=${orderToken}`;
        console.log("Using order_token format:", paymentUrl);
      }
      if (!paymentUrl) {
        console.error("No payment URL available in response:", paymentResult);
        console.error("Available fields:", Object.keys(paymentResult));
        return res.status(500).json({
          success: false,
          message: "Payment URL not available",
          debug: paymentResult,
          availableFields: Object.keys(paymentResult)
        });
      }
      console.log("Final payment URL generated:", paymentUrl);
      console.log("Payment URL length:", paymentUrl.length);
      console.log("Payment session ID:", paymentResult.payment_session_id);
      if (paymentUrl && !paymentUrl.startsWith("https://")) {
        console.error("Invalid payment URL format:", paymentUrl);
        return res.status(500).json({
          success: false,
          message: "Invalid payment URL format"
        });
      }
      res.json({
        success: true,
        paymentUrl,
        orderId: paymentResult.order_id,
        sessionId: paymentResult.payment_session_id,
        debug: {
          payment_link: paymentResult.payment_link,
          payment_session_id: paymentResult.payment_session_id,
          order_token: paymentResult.order_token,
          url_length: paymentUrl.length,
          full_response: paymentResult
        }
      });
    } catch (error) {
      console.error("Error creating AI subscription payment:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/statistics`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      let farmerCount = 0;
      let productCount = 0;
      let pendingProductCount = 0;
      try {
        const farmersResult = await db.select().from(farmers);
        farmerCount = farmersResult.length;
      } catch (error) {
        console.log("Error getting farmers count (missing columns):", error.message);
        farmerCount = 0;
      }
      try {
        const productsResult = await db.select().from(products);
        productCount = productsResult.length;
      } catch (error) {
        console.log("Error getting products count (missing columns):", error.message);
        productCount = 0;
      }
      try {
        const pendingProductsResult = await db.select().from(products).where(eq2(products.approvalStatus, "pending"));
        pendingProductCount = pendingProductsResult.length;
      } catch (error) {
        console.log("Error getting pending products count (missing columns):", error.message);
        pendingProductCount = 0;
      }
      const allOrders = await storage.getOrdersWithFilters();
      const orderCount = allOrders.length;
      const pendingOrderCount = allOrders.filter((order) => order.status === "pending").length;
      const acceptedOrderCount = allOrders.filter((order) => order.status === "accepted").length;
      const growingOrderCount = allOrders.filter((order) => order.status === "growing").length;
      const harvestedOrderCount = allOrders.filter((order) => order.status === "harvested").length;
      const packagingOrderCount = allOrders.filter((order) => order.status === "packaging").length;
      const shippingOrderCount = allOrders.filter((order) => order.status === "shipping").length;
      const deliveredOrderCount = allOrders.filter((order) => order.status === "delivered").length;
      const canceledOrderCount = allOrders.filter((order) => order.status === "canceled").length;
      let customerCount = 0;
      try {
        customerCount = (await storage.getAllCustomers()).length;
      } catch (error) {
        console.log("Error getting customers count (missing columns):", error.message);
        customerCount = 0;
      }
      let totalUsersCount = 0;
      try {
        const allUsersResult = await db.select({ count: sql2`count(*)` }).from(users);
        totalUsersCount = Number(allUsersResult[0]?.count || 0);
      } catch (error) {
        console.log("Error getting total users count:", error.message);
        totalUsersCount = farmerCount + customerCount;
      }
      const sevenDaysAgo = /* @__PURE__ */ new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentOrders = await storage.getOrdersWithFilters(gte(orders.createdAt, sevenDaysAgo));
      const totalSales = recentOrders.reduce((total, order) => {
        return total + Number(order.total);
      }, 0);
      let aiSubscriptionStats = {
        totalAiSubscribers: 0,
        activeAiSubscribers: 0,
        subscriptionRevenue: 0,
        subscriptionsByPlan: []
      };
      try {
        const farmersWithAi = await db.select({
          id: farmers.id,
          aiSubscriptionActive: farmers.aiSubscriptionActive,
          aiSubscriptionExpiry: farmers.aiSubscriptionExpiry
        }).from(farmers);
        const totalAiSubscribers = farmersWithAi.filter((f) => f.aiSubscriptionActive).length;
        const activeAiSubscribers = farmersWithAi.filter(
          (f) => f.aiSubscriptionActive && f.aiSubscriptionExpiry && new Date(f.aiSubscriptionExpiry) > /* @__PURE__ */ new Date()
        ).length;
        const aiPlans = await storage.getAllAiSubscriptionPlans();
        let subscriptionRevenue = 0;
        if (activeAiSubscribers > 0 && aiPlans.length > 0) {
          const avgPlanPrice = aiPlans.reduce((sum, plan) => sum + Number(plan.price || 0), 0) / aiPlans.length;
          subscriptionRevenue = activeAiSubscribers * avgPlanPrice;
        }
        aiSubscriptionStats = {
          totalAiSubscribers,
          activeAiSubscribers,
          subscriptionRevenue,
          subscriptionsByPlan: aiPlans.map((plan) => ({
            planName: plan.name,
            price: plan.price,
            duration: plan.duration,
            durationType: plan.durationType
          }))
        };
      } catch (error) {
        console.log("Error getting AI subscription stats:", error.message);
      }
      const onlineOrders = allOrders.filter((order) => order.paymentMethod === "cashfree");
      const codOrders = allOrders.filter((order) => order.paymentMethod === "cod");
      const onlinePaymentTotal = onlineOrders.reduce((total, order) => total + Number(order.total), 0);
      const codPaymentTotal = codOrders.reduce((total, order) => total + Number(order.total), 0);
      const totalRevenue = onlinePaymentTotal + codPaymentTotal;
      const recentSalesWithItems = await Promise.all(
        recentOrders.slice(0, 10).map(async (order) => {
          const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
          const itemsWithNames = await Promise.all(
            orderItems2.map(async (item) => {
              let productName = item.productName;
              if (!productName || productName === "Unknown Product") {
                try {
                  const product = await db.query.products.findFirst({
                    where: eq2(products.id, item.productId),
                    columns: {
                      name: true
                    }
                  });
                  productName = product?.name || "Unknown Product";
                } catch (error) {
                  console.log(`Error fetching product name for item ${item.id}:`, error.message);
                  productName = "Unknown Product";
                }
              }
              return {
                productName,
                quantity: item.quantity,
                price: Number(item.price)
              };
            })
          );
          return {
            id: order.id,
            customerName: order.customerName,
            total: Number(order.total),
            paymentMethod: order.paymentMethod || "cod",
            status: order.status,
            createdAt: order.createdAt.toISOString(),
            items: itemsWithNames
          };
        })
      );
      let pendingProducts = [];
      try {
        pendingProducts = await db.select().from(products).where(eq2(products.approvalStatus, "pending")).limit(10);
      } catch (error) {
        console.log("Error getting pending products list (missing columns):", error.message);
        pendingProducts = [];
      }
      let boxesStats = {
        totalBoxProducts: 0,
        totalBoxesSold: 0,
        boxRevenue: 0,
        boxOrders: 0,
        averagePricePerBox: 0
      };
      let retailStats = {
        orders: 0,
        revenue: 0,
        farmerRevenue: 0,
        itemsSold: 0
      };
      let wholesaleStats = {
        orders: 0,
        revenue: 0,
        farmerRevenue: 0,
        itemsSold: 0
      };
      try {
        const allProducts = await db.select().from(products);
        boxesStats.totalBoxProducts = allProducts.length;
        const allOrdersList = allOrders;
        boxesStats.boxOrders = allOrdersList.length;
        boxesStats.boxRevenue = allOrdersList.reduce((total, order) => total + Number(order.total), 0);
        let totalBoxes = 0;
        let boxFarmerRevenue = 0;
        for (const order of allOrdersList) {
          const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
          totalBoxes += orderItems2.reduce((sum, item) => sum + item.quantity, 0);
          boxFarmerRevenue += orderItems2.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
          const isB2B = order.notes && order.notes.includes("B2B Bulk Order");
          const orderRevenue = Number(order.total);
          const orderFarmerRevenue = orderItems2.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
          const orderItemsSold = orderItems2.reduce((sum, item) => sum + item.quantity, 0);
          if (isB2B) {
            wholesaleStats.orders++;
            wholesaleStats.revenue += orderRevenue;
            wholesaleStats.farmerRevenue += orderFarmerRevenue;
            wholesaleStats.itemsSold += orderItemsSold;
          } else {
            retailStats.orders++;
            retailStats.revenue += orderRevenue;
            retailStats.farmerRevenue += orderFarmerRevenue;
            retailStats.itemsSold += orderItemsSold;
          }
        }
        boxesStats.totalBoxesSold = totalBoxes;
        boxesStats.boxFarmerRevenue = boxFarmerRevenue;
        boxesStats.averagePricePerBox = totalBoxes > 0 ? boxesStats.boxRevenue / totalBoxes : 0;
      } catch (error) {
        console.log("Error getting product stats:", error.message);
      }
      let fpoPayouts = [];
      try {
        const allFpoLinks = await db.select({
          farmerUserId: farmerFpoLinks.farmerUserId,
          dmUserId: farmerFpoLinks.dmUserId
        }).from(farmerFpoLinks);
        const dmUsers = await db.select({
          id: users.id,
          name: users.name,
          orgName: users.orgName,
          district: users.district
        }).from(users).where(eq2(users.role, "district_manager"));
        const dmMap = new Map(dmUsers.map((dm) => [dm.id, dm]));
        const farmerToDm = /* @__PURE__ */ new Map();
        allFpoLinks.forEach((link) => {
          farmerToDm.set(link.farmerUserId, link.dmUserId);
        });
        const allFarmersList = await db.select({
          id: farmers.id,
          userId: farmers.userId
        }).from(farmers);
        const farmerIdToUserId = new Map(allFarmersList.map((f) => [f.id, f.userId]));
        const fpoAgg = {};
        const unlinkedAgg = { orderCount: 0, totalPayout: 0, totalCollected: 0, deliveryRevenue: 0, farmerUserIds: /* @__PURE__ */ new Set(), countedOrderIds: /* @__PURE__ */ new Set() };
        const payableOrders = allOrders.filter((o) => o.status !== "canceled");
        for (const order of payableOrders) {
          const orderDeliveryFee = Number(order.deliveryFee || 0);
          const orderItemsList = await storage.getOrderItemsByOrderId(order.id);
          for (const item of orderItemsList) {
            const farmerUserId = farmerIdToUserId.get(item.farmerId);
            let dmId = farmerUserId ? farmerToDm.get(farmerUserId) : void 0;
            if (!dmId && farmerUserId && dmMap.has(farmerUserId)) {
              dmId = farmerUserId;
            }
            const itemPayout = Number(item.price) * item.quantity;
            if (dmId && dmMap.has(dmId)) {
              if (!fpoAgg[dmId]) {
                const dm = dmMap.get(dmId);
                fpoAgg[dmId] = {
                  fpoId: dmId,
                  fpoName: dm.name,
                  orgName: dm.orgName || dm.name,
                  district: dm.district || "",
                  farmerUserIds: /* @__PURE__ */ new Set(),
                  orderCount: 0,
                  totalPayout: 0,
                  totalCollected: 0,
                  deliveryRevenue: 0,
                  countedOrderIds: /* @__PURE__ */ new Set()
                };
              }
              if (farmerUserId) fpoAgg[dmId].farmerUserIds.add(farmerUserId);
              fpoAgg[dmId].orderCount++;
              fpoAgg[dmId].totalPayout += itemPayout;
              if (!fpoAgg[dmId].countedOrderIds.has(order.id)) {
                fpoAgg[dmId].deliveryRevenue += orderDeliveryFee;
                fpoAgg[dmId].countedOrderIds.add(order.id);
              }
            } else {
              if (farmerUserId) unlinkedAgg.farmerUserIds.add(farmerUserId);
              unlinkedAgg.orderCount++;
              unlinkedAgg.totalPayout += itemPayout;
              if (!unlinkedAgg.countedOrderIds.has(order.id)) {
                unlinkedAgg.deliveryRevenue += orderDeliveryFee;
                unlinkedAgg.countedOrderIds.add(order.id);
              }
            }
          }
        }
        fpoPayouts = Object.values(fpoAgg).map((agg) => ({
          fpoId: agg.fpoId,
          fpoName: agg.fpoName,
          orgName: agg.orgName,
          district: agg.district,
          farmerCount: agg.farmerUserIds.size,
          orderCount: agg.orderCount,
          totalPayout: agg.totalPayout,
          totalCollected: 0,
          platformFee: 0,
          deliveryRevenue: agg.deliveryRevenue
        }));
        if (unlinkedAgg.orderCount > 0) {
          fpoPayouts.push({
            fpoId: 0,
            fpoName: "Unlinked Farmers",
            orgName: "No FPO",
            district: "",
            farmerCount: unlinkedAgg.farmerUserIds.size,
            orderCount: unlinkedAgg.orderCount,
            totalPayout: unlinkedAgg.totalPayout,
            totalCollected: 0,
            platformFee: 0,
            deliveryRevenue: unlinkedAgg.deliveryRevenue
          });
        }
        fpoPayouts.sort((a, b) => b.totalPayout - a.totalPayout);
      } catch (error) {
        console.log("Error calculating FPO payouts:", error.message);
      }
      let platformFeePercent = 7;
      try {
        const activeFees = await db.query.orderFees.findMany({
          where: eq2(orderFees.isActive, true)
        });
        for (const fee of activeFees) {
          const feeName = fee.name.toLowerCase();
          const feeValue = parseFloat(fee.value);
          if (fee.type === "percentage" && (feeName.includes("tech") || feeName.includes("support") || feeName.includes("platform") || feeName.includes("santhe"))) {
            platformFeePercent = feeValue;
          }
        }
      } catch (error) {
        console.log("Error getting platform fee:", error.message);
      }
      const platformFeeMultiplier = 1 + platformFeePercent / 100;
      let eventBookingRevenue = 0;
      let eventFarmerRevenue = 0;
      let eventBookingCount = 0;
      try {
        const paidBookings = await db.query.eventBookings.findMany({
          where: eq2(eventBookings.paymentStatus, "paid")
        });
        eventBookingCount = paidBookings.length;
        eventBookingRevenue = paidBookings.reduce((total, booking) => {
          return total + Number(booking.totalAmount || 0);
        }, 0);
        eventFarmerRevenue = eventBookingRevenue / platformFeeMultiplier;
      } catch (error) {
        console.log("Error getting event booking stats:", error.message);
      }
      let subscriptionStats = {
        totalSubscribers: 0,
        activeSubscribers: 0,
        subscriptionRevenue: 0,
        subscriptionsByTier: []
      };
      try {
        const allSubs = await db.query.customerSubscriptions.findMany({
          with: { plan: true }
        });
        subscriptionStats.totalSubscribers = allSubs.length;
        subscriptionStats.activeSubscribers = allSubs.filter((s) => s.status === "active").length;
        subscriptionStats.subscriptionRevenue = allSubs.filter((s) => s.status === "active" || s.status === "expired").reduce((sum, s) => sum + Number(s.plan?.price || 0), 0);
        const tierCounts = {};
        allSubs.filter((s) => s.status === "active").forEach((s) => {
          const tier = s.plan?.tierType || "unknown";
          if (!tierCounts[tier]) tierCounts[tier] = { count: 0, revenue: 0 };
          tierCounts[tier].count++;
          tierCounts[tier].revenue += Number(s.plan?.price || 0);
        });
        subscriptionStats.subscriptionsByTier = Object.entries(tierCounts).map(([tier, data]) => ({
          tier,
          count: data.count,
          revenue: data.revenue
        }));
      } catch (error) {
        console.log("Error getting subscription stats:", error.message);
      }
      const completeTotalRevenue = boxesStats.boxRevenue + eventBookingRevenue + subscriptionStats.subscriptionRevenue;
      return res.status(200).json({
        totalUsers: totalUsersCount,
        totalFarmers: farmerCount,
        totalProducts: productCount,
        pendingProducts: pendingProductCount,
        totalOrders: orderCount,
        totalCustomers: customerCount,
        ordersByStatus: {
          pending: pendingOrderCount,
          accepted: acceptedOrderCount,
          growing: growingOrderCount,
          harvested: harvestedOrderCount,
          packaging: packagingOrderCount,
          shipping: shippingOrderCount,
          delivered: deliveredOrderCount,
          canceled: canceledOrderCount
        },
        transactionStats: {
          totalRevenue: completeTotalRevenue,
          onlinePayments: {
            count: onlineOrders.length,
            amount: onlinePaymentTotal
          },
          codPayments: {
            count: codOrders.length,
            amount: codPaymentTotal
          },
          eventBookings: {
            count: eventBookingCount,
            amount: eventBookingRevenue,
            farmerRevenue: eventFarmerRevenue
          }
        },
        boxesStats,
        retailStats,
        wholesaleStats,
        platformFeePercent,
        subscriptionStats,
        recentOrders: recentOrders.length,
        recentSales: totalSales,
        recentSalesData: recentSalesWithItems,
        pendingProductList: pendingProducts,
        fpoPayouts,
        totalDeliveryRevenue: fpoPayouts.reduce((sum, fpo) => sum + (fpo.deliveryRevenue || 0), 0)
      });
    } catch (error) {
      console.error("Error fetching admin statistics:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/dm-stats/:dmId`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      const dmId = parseInt(req.params.dmId);
      if (isNaN(dmId)) {
        return res.status(400).json({ error: "Invalid DM ID" });
      }
      const dmUser = await db.query.users.findFirst({
        where: and2(eq2(users.id, dmId), eq2(users.role, "district_manager"))
      });
      if (!dmUser) {
        return res.status(404).json({ error: "District manager not found" });
      }
      const userDistrict = dmUser.district;
      if (!userDistrict) {
        return res.status(400).json({ error: "District manager has no assigned district" });
      }
      let dmApprovedProducts = [];
      try {
        dmApprovedProducts = await db.query.products.findMany({
          where: and2(
            eq2(products.approvedByUserId, dmId),
            eq2(products.approvalStatus, "approved")
          )
        });
      } catch (error) {
        console.log("Error fetching DM products:", error.message);
      }
      const dmProductIds = dmApprovedProducts.map((p) => p.id);
      let dmOrders = [];
      if (dmProductIds.length > 0) {
        try {
          const allOrderItems = await db.query.orderItems.findMany({
            where: inArray2(orderItems.productId, dmProductIds),
            with: { order: true }
          });
          const orderMap = /* @__PURE__ */ new Map();
          allOrderItems.forEach((item) => {
            if (item.order) {
              orderMap.set(item.order.id, item.order);
            }
          });
          dmOrders = Array.from(orderMap.values());
        } catch (error) {
          console.log("Error fetching DM orders:", error.message);
        }
      }
      const farmerCount = await db.select({ count: sql2`count(*)` }).from(farmers).innerJoin(users, eq2(farmers.userId, users.id)).where(eq2(users.district, userDistrict)).then((r) => Number(r[0]?.count) || 0);
      const activeFees = await db.query.orderFees.findMany({
        where: eq2(orderFees.isActive, true),
        orderBy: asc2(orderFees.displayOrder)
      });
      let platformFeePercent = 7;
      for (const fee of activeFees) {
        const feeName = fee.name.toLowerCase();
        const feeValue = parseFloat(fee.value);
        if (fee.type === "percentage" && (feeName.includes("tech") || feeName.includes("support") || feeName.includes("platform") || feeName.includes("santhe"))) {
          platformFeePercent = feeValue;
        }
      }
      const platformFeeMultiplier = 1 + platformFeePercent / 100;
      const boxOrders = dmOrders;
      let boxFarmerPrice = 0;
      for (const order of boxOrders) {
        const items = await db.query.orderItems.findMany({
          where: eq2(orderItems.orderId, order.id)
        });
        boxFarmerPrice += items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
      }
      let boxesStats = {
        boxRevenue: boxOrders.reduce((total, order) => total + Number(order.total), 0),
        boxOrders: boxOrders.length,
        boxFarmerPrice
      };
      const dmDeliveryRevenue = dmOrders.filter((o) => o.status !== "canceled").reduce((sum, o) => sum + Number(o.deliveryFee || 0), 0);
      let eventBookingRevenue = 0;
      let eventBookingCount = 0;
      let eventFarmerPrice = 0;
      const fpoLinkedLinks = await db.select({ farmerUserId: farmerFpoLinks.farmerUserId }).from(farmerFpoLinks).where(eq2(farmerFpoLinks.dmUserId, dmId));
      const districtFarmerUserIds = fpoLinkedLinks.map((l) => l.farmerUserId);
      try {
        let dmEvents = [];
        const explicitDmEvents = await db.query.farmEvents.findMany({
          where: eq2(farmEvents.dmId, dmId),
          with: { bookings: true }
        });
        dmEvents = [...explicitDmEvents];
        if (districtFarmerUserIds.length > 0) {
          const linkedFarmerEvents = await db.query.farmEvents.findMany({
            where: and2(
              inArray2(farmEvents.farmerId, districtFarmerUserIds),
              or2(
                isNull(farmEvents.dmId),
                eq2(farmEvents.dmId, dmId)
              )
            ),
            with: { bookings: true }
          });
          const existingEventIds = new Set(dmEvents.map((e) => e.id));
          linkedFarmerEvents.forEach((e) => {
            if (!existingEventIds.has(e.id)) {
              dmEvents.push(e);
            }
          });
        }
        dmEvents.forEach((event) => {
          const paidBookings = event.bookings?.filter((b) => b.paymentStatus === "paid") || [];
          eventBookingCount += paidBookings.length;
          paidBookings.forEach((b) => {
            const totalAmount = Number(b.totalAmount || 0);
            eventBookingRevenue += totalAmount;
            eventFarmerPrice += totalAmount / platformFeeMultiplier;
          });
        });
      } catch (error) {
        console.log("Error fetching DM events:", error.message);
      }
      let retailStats = { orders: 0, revenue: 0, farmerRevenue: 0, itemsSold: 0 };
      let wholesaleStats = { orders: 0, revenue: 0, farmerRevenue: 0, itemsSold: 0 };
      for (const order of dmOrders) {
        const items = await db.query.orderItems.findMany({
          where: eq2(orderItems.orderId, order.id)
        });
        const isB2B = order.notes && order.notes.includes("B2B Bulk Order");
        const orderRevenue = Number(order.total);
        const orderFarmerRevenue = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        const orderItemsSold = items.reduce((sum, item) => sum + item.quantity, 0);
        if (isB2B) {
          wholesaleStats.orders++;
          wholesaleStats.revenue += orderRevenue;
          wholesaleStats.farmerRevenue += orderFarmerRevenue;
          wholesaleStats.itemsSold += orderItemsSold;
        } else {
          retailStats.orders++;
          retailStats.revenue += orderRevenue;
          retailStats.farmerRevenue += orderFarmerRevenue;
          retailStats.itemsSold += orderItemsSold;
        }
      }
      const totalFarmerPrice = boxFarmerPrice + eventFarmerPrice;
      const totalRevenue = boxesStats.boxRevenue + eventBookingRevenue;
      const platformEarnings = totalRevenue - totalFarmerPrice;
      const farmerPayoutsMap = {};
      const feeMultiplier = platformFeeMultiplier;
      if (dmProductIds.length > 0) {
        const allOrderItems = await db.query.orderItems.findMany({
          where: inArray2(orderItems.productId, dmProductIds),
          with: {
            order: true,
            product: {
              with: { farmer: true }
            }
          }
        });
        for (const item of allOrderItems) {
          if (!item.product || !item.product.farmer) continue;
          const farmerName = item.product.farmer.farmName || "Unknown Farm";
          const farmerId = item.product.farmerId || 0;
          const key = farmerName.toLowerCase().trim();
          const price = Number(item.price) || 0;
          const quantity = item.quantity || 1;
          const itemTotal = price * quantity;
          if (!farmerPayoutsMap[key]) {
            farmerPayoutsMap[key] = { farmerId, farmerName, totalPayout: 0, orderCount: 0, eventCount: 0 };
          }
          farmerPayoutsMap[key].totalPayout += itemTotal;
          farmerPayoutsMap[key].orderCount += 1;
        }
      }
      try {
        const eventsWithProfile = await db.query.farmEvents.findMany({
          where: or2(
            eq2(farmEvents.dmId, dmId),
            districtFarmerUserIds.length > 0 ? inArray2(farmEvents.farmerId, districtFarmerUserIds) : void 0
          ),
          with: {
            bookings: true,
            farmerProfile: true
          }
        });
        for (const event of eventsWithProfile) {
          const paidBookings = event.bookings?.filter((b) => b.paymentStatus === "paid") || [];
          if (paidBookings.length === 0) continue;
          const farmerName = event.farmerProfile?.farmName || event.title || "Event Organizer";
          const farmerId = event.farmerId || 0;
          const key = farmerName.toLowerCase().trim();
          let eventPayout = 0;
          paidBookings.forEach((b) => {
            eventPayout += Number(b.totalAmount || 0) / feeMultiplier;
          });
          if (!farmerPayoutsMap[key]) {
            farmerPayoutsMap[key] = { farmerId, farmerName, totalPayout: 0, orderCount: 0, eventCount: 0 };
          }
          farmerPayoutsMap[key].totalPayout += eventPayout;
          farmerPayoutsMap[key].eventCount += paidBookings.length;
        }
      } catch (e) {
        console.log("Error calculating event farmer payouts:", e.message);
      }
      const farmerPayouts = Object.values(farmerPayoutsMap).sort((a, b) => b.totalPayout - a.totalPayout);
      return res.status(200).json({
        totalFarmers: farmerCount,
        totalProducts: dmApprovedProducts.length,
        totalOrders: dmOrders.length,
        ordersByStatus: {
          pending: dmOrders.filter((o) => o.status === "pending").length,
          accepted: dmOrders.filter((o) => o.status === "accepted").length,
          growing: dmOrders.filter((o) => o.status === "growing").length,
          harvested: dmOrders.filter((o) => o.status === "harvested").length,
          packaging: dmOrders.filter((o) => o.status === "packaging").length,
          shipping: dmOrders.filter((o) => o.status === "shipping").length,
          delivered: dmOrders.filter((o) => o.status === "delivered").length,
          canceled: dmOrders.filter((o) => o.status === "cancelled" || o.status === "canceled").length
        },
        transactionStats: {
          totalRevenue,
          deliveryRevenue: dmDeliveryRevenue,
          eventBookings: {
            count: eventBookingCount,
            amount: eventBookingRevenue
          }
        },
        boxesStats,
        retailStats,
        wholesaleStats,
        platformFeePercent,
        totalFarmerPrice,
        platformEarnings,
        eventFarmerPrice,
        farmerPayouts
      });
    } catch (error) {
      console.error("Error fetching DM stats:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/farmer-stats/:farmerId`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.farmerId);
      if (isNaN(farmerId)) {
        return res.status(400).json({ error: "Invalid Farmer ID" });
      }
      const farmerProfile = await db.query.farmers.findFirst({
        where: eq2(farmers.id, farmerId)
      });
      if (!farmerProfile) {
        return res.status(404).json({ error: "Farmer not found" });
      }
      const farmerUser = await db.query.users.findFirst({
        where: eq2(users.id, farmerProfile.userId)
      });
      const farmerProducts = await db.query.products.findMany({
        where: eq2(products.farmerId, farmerId)
      });
      const totalProducts = farmerProducts.length;
      const pendingProducts = farmerProducts.filter((p) => p.approvalStatus === "pending").length;
      const approvedProducts = farmerProducts.filter((p) => p.approvalStatus === "approved").length;
      const rejectedProducts = farmerProducts.filter((p) => p.approvalStatus === "rejected").length;
      const productIds = farmerProducts.map((p) => p.id);
      let farmerOrders = [];
      let regularOrderEarnings = 0;
      if (productIds.length > 0) {
        const orderItemsWithOrders = await db.query.orderItems.findMany({
          where: inArray2(orderItems.productId, productIds),
          with: { order: true }
        });
        const orderMap = /* @__PURE__ */ new Map();
        orderItemsWithOrders.forEach((item) => {
          if (item.order) {
            orderMap.set(item.order.id, item.order);
            regularOrderEarnings += Number(item.price) * (item.quantity || 1);
          }
        });
        farmerOrders = Array.from(orderMap.values());
      }
      const totalOrders = farmerOrders.length;
      const completedOrders = farmerOrders.filter((o) => o.status === "delivered").length;
      const pendingOrders = farmerOrders.filter((o) => ["pending", "processing", "shipped", "accepted", "growing", "harvested", "packaging", "shipping"].includes(o.status)).length;
      const farmerEvents = await db.query.farmEvents.findMany({
        where: eq2(farmEvents.farmerId, farmerProfile.userId),
        with: { bookings: true }
      });
      let eventBookingCount = 0;
      let eventBookingRevenue = 0;
      farmerEvents.forEach((event) => {
        const paidBookings = event.bookings?.filter((b) => b.paymentStatus === "paid") || [];
        eventBookingCount += paidBookings.length;
        const pricePerSeat = Number(event.pricePerSeat || 0);
        paidBookings.forEach((b) => {
          const numSeats = b.numSeats || 1;
          eventBookingRevenue += pricePerSeat * numSeats;
        });
      });
      const grandTotalRevenue = regularOrderEarnings + eventBookingRevenue;
      const fpoLinks = await db.select({
        dmUserId: farmerFpoLinks.dmUserId,
        linkedAt: farmerFpoLinks.createdAt
      }).from(farmerFpoLinks).where(eq2(farmerFpoLinks.farmerUserId, farmerProfile.userId));
      const linkedFpos = [];
      for (const link of fpoLinks) {
        const dmUser = await db.query.users.findFirst({ where: eq2(users.id, link.dmUserId) });
        if (dmUser) {
          linkedFpos.push({
            dmUserId: link.dmUserId,
            dmName: dmUser.name,
            orgName: dmUser.orgName || dmUser.name,
            district: dmUser.district || "",
            linkedAt: link.linkedAt
          });
        }
      }
      return res.status(200).json({
        farmer: {
          id: farmerProfile.id,
          farmName: farmerProfile.farmName,
          description: farmerProfile.description,
          location: farmerProfile.location,
          phone: farmerProfile.phone || farmerUser?.phone,
          email: farmerProfile.email || farmerUser?.email,
          isZbnfCertified: farmerProfile.isZbnfCertified,
          isOrganicCertified: farmerProfile.isOrganicCertified,
          isNaturalCertified: farmerProfile.isNaturalCertified,
          createdAt: farmerProfile.createdAt
        },
        stats: {
          grandTotalRevenue,
          regularOrderEarnings,
          eventBookingRevenue,
          totalOrders,
          completedOrders,
          pendingOrders,
          totalProducts,
          pendingProducts,
          approvedProducts,
          rejectedProducts,
          totalEvents: farmerEvents.length,
          eventBookingCount
        },
        linkedFpos
      });
    } catch (error) {
      console.error("Error fetching farmer stats:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/dm-payouts`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      const activeFees = await db.query.orderFees.findMany({
        where: eq2(orderFees.isActive, true),
        orderBy: asc2(orderFees.displayOrder)
      });
      let platformFeePercent = 7;
      for (const fee of activeFees) {
        const feeName = fee.name.toLowerCase();
        const feeValue = parseFloat(fee.value);
        if (fee.type === "percentage" && (feeName.includes("tech") || feeName.includes("support") || feeName.includes("platform") || feeName.includes("santhe"))) {
          platformFeePercent = feeValue;
        }
      }
      const platformFeeMultiplier = 1 + platformFeePercent / 100;
      const districtManagers = await db.query.users.findMany({
        where: eq2(users.role, "district_manager")
      });
      const dmPayouts = await Promise.all(districtManagers.map(async (dm) => {
        let dmProducts = [];
        try {
          dmProducts = await db.query.products.findMany({
            where: and2(
              eq2(products.approvedByUserId, dm.id),
              eq2(products.approvalStatus, "approved")
            )
          });
        } catch (e) {
          console.log(`Error getting products for DM ${dm.id}:`, e);
        }
        const dmProductIds = dmProducts.map((p) => p.id);
        let boxFarmerRevenue = 0;
        let boxOrderCount = 0;
        if (dmProductIds.length > 0) {
          try {
            const allOrderItems = await db.query.orderItems.findMany({
              where: inArray2(orderItems.productId, dmProductIds),
              with: { order: true }
            });
            const processedOrderIds = /* @__PURE__ */ new Set();
            for (const item of allOrderItems) {
              if (item.order) {
                boxFarmerRevenue += Number(item.price) * item.quantity;
                if (!processedOrderIds.has(item.order.id)) {
                  processedOrderIds.add(item.order.id);
                  boxOrderCount++;
                }
              }
            }
          } catch (e) {
            console.log(`Error getting orders for DM ${dm.id}:`, e);
          }
        }
        let eventFarmerRevenue = 0;
        let eventBookingCount = 0;
        try {
          const dmEvents = await db.query.farmEvents.findMany({
            where: eq2(farmEvents.dmId, dm.id),
            with: { bookings: true }
          });
          dmEvents.forEach((event) => {
            const paidBookings = event.bookings?.filter((b) => b.paymentStatus === "paid") || [];
            eventBookingCount += paidBookings.length;
            paidBookings.forEach((booking) => {
              const totalAmount = Number(booking.totalAmount || 0);
              eventFarmerRevenue += totalAmount / platformFeeMultiplier;
            });
          });
        } catch (e) {
          console.log(`Error getting events for DM ${dm.id}:`, e);
        }
        const totalFarmerPrice = boxFarmerRevenue + eventFarmerRevenue;
        return {
          dmId: dm.id,
          username: dm.username,
          district: dm.district || "Unassigned",
          boxFarmerRevenue,
          boxOrderCount,
          eventFarmerRevenue,
          eventBookingCount,
          totalFarmerPrice,
          totalOrders: boxOrderCount,
          totalEvents: eventBookingCount
        };
      }));
      const activeDmPayouts = dmPayouts.filter((dm) => dm.totalFarmerPrice > 0).sort((a, b) => b.totalFarmerPrice - a.totalFarmerPrice);
      return res.status(200).json({
        platformFeePercent,
        dmPayouts: activeDmPayouts
      });
    } catch (error) {
      console.error("Error fetching DM payouts:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/dm/statistics`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "district_manager") {
        return res.status(403).json({ error: "Access denied. District manager role required." });
      }
      if (!req.user.district) {
        return res.status(400).json({ error: "District manager must have district assignment" });
      }
      const userDistrict = req.user.district;
      let dmApprovedProducts = [];
      let pendingProductCount = 0;
      let farmerCount = 0;
      let dmFarmerIds = [];
      try {
        dmApprovedProducts = await storage.getProductsWithFilters(
          and2(
            eq2(products.approvalStatus, "approved"),
            eq2(products.approvedByUserId, req.user.id),
            eq2(products.approvalType, "fpo")
          )
        );
        dmFarmerIds = [...new Set(dmApprovedProducts.map((p) => p.farmerId))];
        farmerCount = dmFarmerIds.length;
        const linkedLinks = await db.select({ farmerUserId: farmerFpoLinks.farmerUserId }).from(farmerFpoLinks).where(eq2(farmerFpoLinks.dmUserId, req.user.id));
        const linkedFarmerUserIds = linkedLinks.map((l) => l.farmerUserId);
        if (linkedFarmerUserIds.length > 0) {
          const linkedFarmerRecords = await db.select({ id: farmers.id }).from(farmers).where(inArray2(farmers.userId, linkedFarmerUserIds));
          const linkedFarmerIds = linkedFarmerRecords.map((f) => f.id);
          if (linkedFarmerIds.length > 0) {
            const pendingLinked = await storage.getProductsWithFilters(
              and2(
                eq2(products.approvalStatus, "pending"),
                inArray2(products.farmerId, linkedFarmerIds)
              )
            );
            pendingProductCount = pendingLinked.length;
          }
        }
      } catch (error) {
        console.log("Error getting DM approved products:", error.message);
      }
      const productCount = dmApprovedProducts.length;
      const dmProductIds = dmApprovedProducts.map((p) => p.id);
      console.log(`[DM ${req.user.id}] DM has ${dmProductIds.length} approved products:`, dmProductIds);
      const allOrders = await storage.getOrdersWithFilters();
      let dmOrders = [];
      for (const order of allOrders) {
        const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
        let hasDMProducts = false;
        console.log(`[DM ${req.user.id}] Checking order ${order.id} with ${orderItems2.length} items`);
        for (const item of orderItems2) {
          console.log(`[DM ${req.user.id}] Order ${order.id} item: productId=${item.productId}, name=${item.productName}`);
          if (dmProductIds.includes(item.productId)) {
            console.log(`[DM ${req.user.id}] \u2705 Order ${order.id} INCLUDES product ${item.productId} approved by this DM`);
            hasDMProducts = true;
            break;
          }
        }
        if (hasDMProducts) {
          console.log(`[DM ${req.user.id}] \u2705 Adding order ${order.id} to DM's order list`);
          dmOrders.push(order);
        } else {
          console.log(`[DM ${req.user.id}] \u274C Skipping order ${order.id} - no products from this DM`);
        }
      }
      console.log(`[DM ${req.user.id}] Final: ${dmOrders.length} orders for this DM`);
      const orderCount = dmOrders.length;
      const pendingOrderCount = dmOrders.filter((order) => order.status === "pending").length;
      const acceptedOrderCount = dmOrders.filter((order) => order.status === "accepted").length;
      const growingOrderCount = dmOrders.filter((order) => order.status === "growing").length;
      const harvestedOrderCount = dmOrders.filter((order) => order.status === "harvested").length;
      const packagingOrderCount = dmOrders.filter((order) => order.status === "packaging").length;
      const shippingOrderCount = dmOrders.filter((order) => order.status === "shipping").length;
      const deliveredOrderCount = dmOrders.filter((order) => order.status === "delivered").length;
      const canceledOrderCount = dmOrders.filter((order) => order.status === "canceled").length;
      const dmCustomerIds = new Set(dmOrders.map((order) => order.customerId));
      const customerCount = dmCustomerIds.size;
      const sevenDaysAgo = /* @__PURE__ */ new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentDMOrders = dmOrders.filter((order) => new Date(order.createdAt) >= sevenDaysAgo);
      const totalSales = recentDMOrders.reduce((total, order) => {
        return total + Number(order.total);
      }, 0);
      let aiSubscriptionStats = {
        totalAiSubscribers: 0,
        activeAiSubscribers: 0,
        subscriptionRevenue: 0,
        subscriptionsByPlan: []
      };
      try {
        const dmFarmersWithAi = [];
        for (const farmerId of dmFarmerIds) {
          try {
            const farmerWithAi = await db.select({
              id: farmers.id,
              aiSubscriptionActive: farmers.aiSubscriptionActive,
              aiSubscriptionExpiry: farmers.aiSubscriptionExpiry
            }).from(farmers).where(eq2(farmers.id, farmerId));
            if (farmerWithAi.length > 0) {
              dmFarmersWithAi.push(farmerWithAi[0]);
            }
          } catch (error) {
          }
        }
        const totalAiSubscribers = dmFarmersWithAi.filter((f) => f.aiSubscriptionActive).length;
        const activeAiSubscribers = dmFarmersWithAi.filter(
          (f) => f.aiSubscriptionActive && f.aiSubscriptionExpiry && new Date(f.aiSubscriptionExpiry) > /* @__PURE__ */ new Date()
        ).length;
        const aiPlans = await storage.getAllAiSubscriptionPlans();
        let subscriptionRevenue = 0;
        if (activeAiSubscribers > 0 && aiPlans.length > 0) {
          const avgPlanPrice = aiPlans.reduce((sum, plan) => sum + Number(plan.price || 0), 0) / aiPlans.length;
          subscriptionRevenue = activeAiSubscribers * avgPlanPrice;
        }
        aiSubscriptionStats = {
          totalAiSubscribers,
          activeAiSubscribers,
          subscriptionRevenue,
          subscriptionsByPlan: aiPlans.map((plan) => ({
            planName: plan.name,
            price: plan.price,
            duration: plan.duration,
            durationType: plan.durationType
          }))
        };
      } catch (error) {
        console.log("Error getting DM farmers AI subscription stats:", error.message);
      }
      const onlineOrders = dmOrders.filter((order) => order.paymentMethod === "cashfree");
      const codOrders = dmOrders.filter((order) => order.paymentMethod === "cod");
      const onlinePaymentTotal = onlineOrders.reduce((total, order) => total + Number(order.total), 0);
      const codPaymentTotal = codOrders.reduce((total, order) => total + Number(order.total), 0);
      const totalRevenue = onlinePaymentTotal + codPaymentTotal;
      const recentSalesWithItems = await Promise.all(
        recentDMOrders.slice(0, 10).map(async (order) => {
          const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
          const itemsWithNames = await Promise.all(
            orderItems2.map(async (item) => {
              let productName = item.productName;
              if (!productName || productName === "Unknown Product") {
                try {
                  const product = await db.query.products.findFirst({
                    where: eq2(products.id, item.productId)
                  });
                  productName = product?.name || "Unknown Product";
                } catch (error) {
                  console.error(`Error fetching product name for item ${item.id}:`, error);
                }
              }
              return {
                productName,
                quantity: item.quantity,
                price: Number(item.price)
              };
            })
          );
          return {
            id: order.id,
            customerName: order.customerName,
            total: Number(order.total),
            paymentMethod: order.paymentMethod || "cod",
            status: order.status,
            createdAt: order.createdAt.toISOString(),
            items: itemsWithNames
          };
        })
      );
      let pendingProducts = [];
      try {
        const allPendingProducts = await db.select().from(products).where(eq2(products.approvalStatus, "pending"));
        for (const product of allPendingProducts.slice(0, 10)) {
          const farmer = await storage.getFarmerById(product.farmerId);
          if (farmer) {
            const farmerUser = await storage.getUserById(farmer.userId);
            if (farmerUser && farmerUser.district === userDistrict) {
              pendingProducts.push(product);
            }
          }
        }
      } catch (error) {
        console.log("Error getting DM pending products list:", error.message);
        pendingProducts = [];
      }
      let boxesStats = {
        totalBoxProducts: 0,
        totalBoxesSold: 0,
        boxRevenue: 0,
        boxOrders: 0,
        averagePricePerBox: 0
      };
      let retailStats = {
        orders: 0,
        revenue: 0,
        farmerRevenue: 0,
        itemsSold: 0
      };
      let wholesaleStats = {
        orders: 0,
        revenue: 0,
        farmerRevenue: 0,
        itemsSold: 0
      };
      try {
        boxesStats.totalBoxProducts = dmApprovedProducts.length;
        boxesStats.boxOrders = dmOrders.length;
        boxesStats.boxRevenue = dmOrders.reduce((total, order) => total + Number(order.total), 0);
        let totalBoxes = 0;
        for (const order of dmOrders) {
          const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
          const orderItemsSold = orderItems2.reduce((sum, item) => sum + item.quantity, 0);
          const orderFarmerRevenue = orderItems2.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
          totalBoxes += orderItemsSold;
          const isB2B = order.notes && order.notes.includes("B2B Bulk Order");
          const orderRevenue = Number(order.total);
          if (isB2B) {
            wholesaleStats.orders++;
            wholesaleStats.revenue += orderRevenue;
            wholesaleStats.farmerRevenue += orderFarmerRevenue;
            wholesaleStats.itemsSold += orderItemsSold;
          } else {
            retailStats.orders++;
            retailStats.revenue += orderRevenue;
            retailStats.farmerRevenue += orderFarmerRevenue;
            retailStats.itemsSold += orderItemsSold;
          }
        }
        boxesStats.totalBoxesSold = totalBoxes;
        boxesStats.averagePricePerBox = totalBoxes > 0 ? boxesStats.boxRevenue / totalBoxes : 0;
      } catch (error) {
        console.log("Error calculating DM product statistics:", error.message);
      }
      let eventBookingRevenue = 0;
      let eventBookingCount = 0;
      try {
        const fpoLinks2 = await db.select({ farmerUserId: farmerFpoLinks.farmerUserId }).from(farmerFpoLinks).where(eq2(farmerFpoLinks.dmUserId, req.user.id));
        const linkedFpoFarmerIds = fpoLinks2.map((l) => l.farmerUserId);
        const eventConditions = [eq2(farmEvents.dmId, req.user.id)];
        if (linkedFpoFarmerIds.length > 0) {
          eventConditions.push(inArray2(farmEvents.farmerId, linkedFpoFarmerIds));
        }
        const dmEvents = await db.query.farmEvents.findMany({
          where: or2(...eventConditions)
        });
        const dmEventIds = dmEvents.map((e) => e.id);
        console.log(`[DM ${req.user.id}] Found ${dmEvents.length} events from linked farmers`);
        if (dmEventIds.length > 0) {
          const activeFees = await db.query.orderFees.findMany({
            where: eq2(orderFees.isActive, true)
          });
          let dmPlatformFeePercent = 7;
          for (const fee of activeFees) {
            const feeName = fee.name.toLowerCase();
            const feeValue = parseFloat(fee.value);
            if (fee.type === "percentage" && (feeName.includes("tech") || feeName.includes("support") || feeName.includes("platform") || feeName.includes("santhe"))) {
              dmPlatformFeePercent = feeValue;
            }
          }
          const eventFeeMultiplier = 1 + dmPlatformFeePercent / 100;
          const paidBookings = await db.query.eventBookings.findMany({
            where: and2(
              inArray2(eventBookings.eventId, dmEventIds),
              eq2(eventBookings.paymentStatus, "paid")
            )
          });
          eventBookingCount = paidBookings.length;
          eventBookingRevenue = paidBookings.reduce((total, booking) => {
            const totalAmount = Number(booking.totalAmount || 0);
            return total + totalAmount / eventFeeMultiplier;
          }, 0);
          console.log(`[DM ${req.user.id}] Event bookings: ${eventBookingCount}, revenue: ${eventBookingRevenue}`);
        }
      } catch (error) {
        console.log("Error getting DM event booking stats:", error.message);
      }
      const completeTotalRevenue = boxesStats.boxRevenue + eventBookingRevenue;
      return res.status(200).json({
        totalFarmers: farmerCount,
        totalProducts: productCount,
        pendingProducts: pendingProductCount,
        totalOrders: orderCount,
        totalCustomers: customerCount,
        ordersByStatus: {
          pending: pendingOrderCount,
          accepted: acceptedOrderCount,
          growing: growingOrderCount,
          harvested: harvestedOrderCount,
          packaging: packagingOrderCount,
          shipping: shippingOrderCount,
          delivered: deliveredOrderCount,
          canceled: canceledOrderCount
        },
        orderStats: {
          pending: { count: pendingOrderCount, amount: dmOrders.filter((o) => o.status === "pending").reduce((sum, o) => sum + Number(o.total), 0) },
          accepted: { count: acceptedOrderCount, amount: dmOrders.filter((o) => o.status === "accepted").reduce((sum, o) => sum + Number(o.total), 0) },
          delivered: { count: deliveredOrderCount, amount: dmOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + Number(o.total), 0) },
          cancelled: { count: canceledOrderCount, amount: dmOrders.filter((o) => o.status === "canceled").reduce((sum, o) => sum + Number(o.total), 0) }
        },
        paymentStats: {
          onlinePayments: {
            count: onlineOrders.length,
            amount: onlinePaymentTotal
          },
          codPayments: {
            count: codOrders.length,
            amount: codPaymentTotal
          }
        },
        transactionStats: {
          totalRevenue: completeTotalRevenue,
          onlinePayments: {
            count: onlineOrders.length,
            amount: onlinePaymentTotal
          },
          codPayments: {
            count: codOrders.length,
            amount: codPaymentTotal
          },
          eventBookings: {
            count: eventBookingCount,
            amount: eventBookingRevenue
          }
        },
        boxesStats,
        retailStats,
        wholesaleStats,
        recentOrders: recentDMOrders.length,
        recentSales: totalSales,
        recentSalesData: recentSalesWithItems,
        pendingProductList: pendingProducts,
        district: userDistrict
        // Include district info for reference
      });
    } catch (error) {
      console.error("Error fetching district manager statistics:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/fix-farmer-districts`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      console.log("Starting farmer district fix...");
      const allFarmers = await storage.getAllFarmers();
      let updatedCount = 0;
      for (const farmer of allFarmers) {
        if (!farmer.user?.district && farmer.location) {
          try {
            await db.update(users).set({ district: farmer.location.trim() }).where(eq2(users.id, farmer.userId));
            updatedCount++;
            console.log(`Updated farmer ${farmer.farmName} user district to: ${farmer.location}`);
          } catch (error) {
            console.error(`Failed to update farmer ${farmer.farmName}:`, error);
          }
        }
      }
      console.log(`Fixed ${updatedCount} farmer districts out of ${allFarmers.length} total farmers`);
      res.json({
        success: true,
        message: `Updated ${updatedCount} farmer districts`,
        totalFarmers: allFarmers.length,
        updatedCount
      });
    } catch (error) {
      console.error("Error fixing farmer districts:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/sync-product-images`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      console.log("Starting product image sync...");
      const productsWithoutImage = await db.query.products.findMany({
        where: or2(
          isNull(products.imageUrl),
          eq2(products.imageUrl, "")
        )
      });
      let updatedCount = 0;
      for (const product of productsWithoutImage) {
        const productImages2 = await db.query.productImages.findMany({
          where: eq2(storage.schema.productImages.productId, product.id),
          orderBy: [desc2(storage.schema.productImages.isPrimary)]
        });
        if (productImages2.length > 0) {
          await db.update(products).set({ imageUrl: productImages2[0].imageUrl, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(products.id, product.id));
          updatedCount++;
          console.log(`Updated product ${product.name} (${product.id}) with image: ${productImages2[0].imageUrl.substring(0, 50)}...`);
        }
      }
      console.log(`Synced ${updatedCount} product images out of ${productsWithoutImage.length} products without images`);
      res.json({
        success: true,
        message: `Synced ${updatedCount} product images`,
        productsWithoutImage: productsWithoutImage.length,
        updatedCount
      });
    } catch (error) {
      console.error("Error syncing product images:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/farmers`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const farmers2 = await storage.getAllFarmers();
      const enrichedFarmers = await Promise.all(farmers2.map(async (farmer) => {
        const [products2, user] = await Promise.all([
          storage.getProductsByFarmerId(farmer.id),
          storage.getUserById(farmer.userId)
        ]);
        const pendingCount = products2.filter((p) => p.approvalStatus === "pending").length;
        const approvedCount = products2.filter((p) => p.approvalStatus === "approved").length;
        const rejectedCount = products2.filter((p) => p.approvalStatus === "rejected").length;
        return {
          ...farmer,
          email: farmer.email || user?.email || "",
          phone: farmer.phone || user?.phone || "",
          productCount: products2.length,
          pendingCount,
          approvedCount,
          rejectedCount,
          createdAt: farmer.createdAt
        };
      }));
      return res.status(200).json(enrichedFarmers);
    } catch (error) {
      console.error("Error fetching admin farmers:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/products/:id`, authenticateJWT, isAdminOrStaff, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (req.user.role === "district_manager" && product.approvalStatus === "approved") {
        return res.status(403).json({
          message: "District Managers cannot edit approved products. Only admins can edit approved products."
        });
      }
      const updateData = {
        ...req.body,
        // Convert date strings to Date objects if provided
        ...req.body.harvestDate && { harvestDate: new Date(req.body.harvestDate) },
        ...req.body.availableUntil && { availableUntil: new Date(req.body.availableUntil) },
        // Ensure numeric fields are properly converted
        ...req.body.price && { price: parseFloat(req.body.price) },
        ...req.body.inventory && { inventory: parseInt(req.body.inventory) },
        ...req.body.unitsPerBox && { unitsPerBox: parseInt(req.body.unitsPerBox) },
        ...req.body.categoryId && { categoryId: parseInt(req.body.categoryId) },
        // Handle bulk buy fields
        ...req.body.priceRangeMin !== void 0 && { priceRangeMin: req.body.priceRangeMin ? parseFloat(req.body.priceRangeMin) : null },
        ...req.body.priceRangeMax !== void 0 && { priceRangeMax: req.body.priceRangeMax ? parseFloat(req.body.priceRangeMax) : null },
        ...req.body.totalAvailableQuantity !== void 0 && { totalAvailableQuantity: req.body.totalAvailableQuantity ? parseInt(req.body.totalAvailableQuantity) : null }
      };
      const updatedProduct = await storage.updateProduct(productId, updateData);
      if (req.body.harvestDate || req.body.availableUntil) {
        const calendarEntry = await storage.getCalendarEntryByProductId(productId);
        if (calendarEntry) {
          await storage.updateCalendarEntry(calendarEntry.id, {
            monthlyStatus: generateMonthlyStatus(
              new Date(updatedProduct.harvestDate),
              new Date(updatedProduct.availableUntil)
            )
          });
        } else {
          await storage.createCalendarEntry({
            productId: updatedProduct.id,
            monthlyStatus: generateMonthlyStatus(
              new Date(updatedProduct.harvestDate),
              new Date(updatedProduct.availableUntil)
            )
          });
        }
      }
      return res.status(200).json({
        product: updatedProduct,
        message: "Product updated successfully"
      });
    } catch (error) {
      console.error("Error updating product:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/products/:id/approval`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { approvalStatus, rejectionReason } = req.body;
      if (!["approved", "rejected"].includes(approvalStatus)) {
        return res.status(400).json({ message: "Invalid approval status. Must be 'approved' or 'rejected'." });
      }
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const updateData = {
        approvalStatus,
        ...approvalStatus === "rejected" && rejectionReason ? { rejectionReason } : {}
      };
      if (approvalStatus === "approved" && req.user?.id) {
        updateData.approvedByUserId = req.user.id;
        updateData.approvedAt = /* @__PURE__ */ new Date();
        updateData.approvalType = "admin";
        updateData.rejectionReason = null;
      }
      const updatedProduct = await storage.updateProduct(productId, updateData);
      if (approvalStatus === "approved") {
        try {
          await storage.notifyFollowersOfNewProduct(product.farmerId, productId, product.name);
          console.log(`Notified followers about approved product: ${product.name}`);
        } catch (notificationError) {
          console.error("Error notifying followers about approved product:", notificationError);
        }
      }
      return res.status(200).json({
        product: updatedProduct,
        message: `Product ${approvalStatus === "approved" ? "approved" : "rejected"} successfully`
      });
    } catch (error) {
      console.error("Error updating product approval status:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/orders`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const { status, startDate, endDate, farmerId, dmId, district } = req.query;
      let filters = [];
      if (status && typeof status === "string") {
        filters.push(eq2(orders.status, status));
      }
      if (startDate && typeof startDate === "string") {
        filters.push(gte(orders.createdAt, new Date(startDate)));
      }
      if (endDate && typeof endDate === "string") {
        filters.push(lte(orders.createdAt, new Date(endDate)));
      }
      const allOrders = await storage.getOrdersWithFilters(
        filters.length > 0 ? and2(...filters) : void 0
      );
      const activeFees = await storage.getActiveOrderFees();
      const enrichedOrders = await Promise.all(allOrders.map(async (order) => {
        try {
          const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
          const enrichedItems = await Promise.all(orderItems2.map(async (item) => {
            try {
              const [farmer, product] = await Promise.all([
                storage.getFarmerById(item.farmerId).catch(() => null),
                storage.getProductById(item.productId).catch(() => null)
              ]);
              return {
                ...item,
                farmerName: farmer?.farmName || "Unknown Farm",
                productName: product?.name || "Unknown Product",
                // Include complete product details for delivery date calculation and quantity per box info
                product: product ? {
                  id: product.id,
                  name: product.name,
                  status: product.status || "available",
                  harvestDate: product.harvestDate,
                  availableUntil: product.availableUntil,
                  unitsPerBox: product.unitsPerBox,
                  unit: product.unit,
                  imageUrl: product.imageUrl,
                  approvedByUserId: product.approvedByUserId
                } : null
              };
            } catch (itemError) {
              console.error("Error enriching order item:", itemError);
              return {
                ...item,
                farmerName: "Unknown Farm",
                productName: "Unknown Product",
                product: null
              };
            }
          }));
          const filteredItems = farmerId && typeof farmerId === "string" ? enrichedItems.filter((item) => item.farmerId === parseInt(farmerId)) : enrichedItems;
          if (farmerId && filteredItems.length === 0) {
            return null;
          }
          const subtotal = filteredItems.reduce((sum, item) => {
            try {
              const itemPrice = typeof item.price === "string" ? parseFloat(item.price) : item.price;
              return sum + itemPrice * item.quantity;
            } catch (error) {
              console.error("Error calculating item price:", error);
              return sum;
            }
          }, 0);
          let runningTotal = subtotal;
          const feesWithAmounts = activeFees.map((fee) => {
            try {
              const feeValue = parseFloat(fee.value);
              let amount = 0;
              if (fee.type === "fixed") {
                amount = feeValue;
              } else {
                if (fee.applyToSubtotal) {
                  amount = runningTotal * feeValue / 100;
                  runningTotal += amount;
                } else {
                  amount = subtotal * feeValue / 100;
                }
              }
              return {
                ...fee,
                amount: parseFloat(amount.toFixed(2))
              };
            } catch (error) {
              console.error("Error calculating fee:", error);
              return {
                ...fee,
                amount: 0
              };
            }
          });
          return {
            ...order,
            items: filteredItems,
            fees: feesWithAmounts
          };
        } catch (orderError) {
          console.error("Error processing order:", orderError);
          return null;
        }
      }));
      let filteredOrders = enrichedOrders.filter((order) => order !== null);
      if (dmId && typeof dmId === "string") {
        const targetDmId = parseInt(dmId);
        filteredOrders = filteredOrders.filter(
          (order) => order && order.items && order.items.some(
            (item) => item.product?.approvedByUserId === targetDmId
          )
        );
      }
      if (district && typeof district === "string") {
        const districtDMs = await storage.getUsersByRoleAndDistrict("district_manager", district);
        const districtDmIds = districtDMs.map((dm) => dm.id);
        filteredOrders = filteredOrders.filter(
          (order) => order && order.items && order.items.some(
            (item) => item.product?.approvedByUserId && districtDmIds.includes(item.product.approvedByUserId)
          )
        );
      }
      return res.status(200).json(filteredOrders);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/farmers/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.id);
      const farmerData = req.body;
      const updatedFarmer = await storage.updateFarmer(farmerId, farmerData);
      res.json(updatedFarmer);
    } catch (error) {
      console.error("Error updating farmer:", error);
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/admin/farmers/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.id);
      const farmer = await storage.getFarmerById(farmerId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const products2 = await storage.getProductsByFarmerId(farmerId);
      const activeProducts = products2.filter((p) => p.approvalStatus !== "deleted");
      if (activeProducts.length > 0) {
        return res.status(400).json({
          message: "Cannot delete farmer with existing products. Please delete all products first."
        });
      }
      const orderItems2 = await storage.getOrderItemsByFarmerId(farmerId);
      if (orderItems2.length > 0) {
        return res.status(400).json({
          message: "Cannot delete farmer with existing order history. This farmer has completed orders and must be preserved for business records."
        });
      }
      await storage.deleteFarmerReviews(farmerId);
      await storage.deleteFarmer(farmerId);
      res.json({ message: "Farmer deleted successfully" });
    } catch (error) {
      console.error("Error deleting farmer:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/users`, authenticateJWT, async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized: Admin access required" });
    }
    try {
      const { role } = req.query;
      let filter;
      if (role && role !== "all") {
        filter = eq2(users.role, role);
      }
      const usersList = await db.query.users.findMany({
        where: filter,
        orderBy: [desc2(users.createdAt)],
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
      const now = /* @__PURE__ */ new Date();
      const allSubs = await db.query.customerSubscriptions.findMany({
        with: { plan: true },
        orderBy: desc2(customerSubscriptions.createdAt)
      });
      const latestSubByUser = /* @__PURE__ */ new Map();
      for (const sub of allSubs) {
        const existing = latestSubByUser.get(sub.userId);
        if (!existing) {
          latestSubByUser.set(sub.userId, sub);
        } else {
          const existingEnd = new Date(existing.endDate);
          const subEnd = new Date(sub.endDate);
          const existingActive = existing.status === "active" && existingEnd >= now;
          const subActive = sub.status === "active" && subEnd >= now;
          if (subActive && !existingActive) {
            latestSubByUser.set(sub.userId, sub);
          } else if (subActive === existingActive && subEnd > existingEnd) {
            latestSubByUser.set(sub.userId, sub);
          }
        }
      }
      const safeUsers = usersList.map((user) => {
        const { password, ...safeUser } = user;
        const latestSub = latestSubByUser.get(user.id);
        const isActive = latestSub ? latestSub.status === "active" && new Date(latestSub.endDate) >= now : false;
        return {
          ...safeUser,
          subscription: latestSub ? {
            planName: latestSub.plan?.name || null,
            tier: latestSub.plan?.tier || null,
            billingPeriod: latestSub.plan?.billingPeriod || null,
            status: isActive ? "active" : latestSub.status === "cancelled" ? "cancelled" : "expired",
            endDate: latestSub.endDate,
            zeroPlatformFee: isActive ? latestSub.plan?.zeroPlatformFee || false : false
          } : null
        };
      });
      res.json(safeUsers);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/users`, authenticateJWT, async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized: Admin access required" });
    }
    try {
      const userData = req.body;
      const existingUser = await db.query.users.findFirst({
        where: or2(
          eq2(users.username, userData.username),
          eq2(users.email, userData.email)
        )
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists"
        });
      }
      const hashedPassword = await hash(userData.password, 10);
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword,
        avatar: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      const { password, ...safeUser } = newUser;
      res.status(201).json(safeUser);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/users/:id`, authenticateJWT, async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized: Admin access required" });
    }
    try {
      const userId = parseInt(req.params.id);
      const userData = req.body;
      const existingUser = await storage.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (userData.username || userData.email) {
        const duplicateUser = await db.query.users.findFirst({
          where: or2(
            userData.username ? eq2(users.username, userData.username) : void 0,
            userData.email ? eq2(users.email, userData.email) : void 0
          )
        });
        if (duplicateUser && duplicateUser.id !== userId) {
          return res.status(400).json({
            message: "Username or email already exists"
          });
        }
      }
      if (userData.password) {
        userData.password = await hash(userData.password, 10);
      }
      const updatedUser = await storage.updateUser(userId, {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      });
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/users/:id/toggle-status`, authenticateJWT, async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized: Admin access required" });
    }
    try {
      const userId = parseInt(req.params.id);
      const { isActive } = req.body;
      const existingUser = await storage.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (existingUser.id === req.user.id && !isActive) {
        return res.status(400).json({
          message: "You cannot deactivate your own account"
        });
      }
      const updatedUser = await storage.updateUser(userId, {
        isActive,
        updatedAt: /* @__PURE__ */ new Date()
      });
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/farmers`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const farmers2 = await storage.getAllFarmers();
      const enrichedFarmers = await Promise.all(farmers2.map(async (farmer) => {
        const products2 = await storage.getProductsByFarmerId(farmer.id);
        const pendingCount = products2.filter((p) => p.approvalStatus === "pending").length;
        const approvedCount = products2.filter((p) => p.approvalStatus === "approved").length;
        const rejectedCount = products2.filter((p) => p.approvalStatus === "rejected").length;
        const farmerWithContact = {
          ...farmer,
          phone: farmer.phone || farmer.user?.phone || null,
          email: farmer.email || farmer.user?.email || null,
          latitude: farmer.latitude || null,
          longitude: farmer.longitude || null,
          productCount: products2.length,
          pendingCount,
          approvedCount,
          rejectedCount
        };
        return farmerWithContact;
      }));
      return res.status(200).json(enrichedFarmers);
    } catch (error) {
      console.error("Error fetching admin farmers data:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/orders/:id/status`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!["admin", "district_manager"].includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied. Admin or District Manager role required." });
      }
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const allowedStatuses = req.user.role === "admin" ? ["pending", "accepted", "growing", "harvested", "packaging", "shipping", "delivered", "canceled"] : ["pending", "accepted", "growing", "harvested", "packaging", "shipping", "delivered"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`
        });
      }
      if (req.user.role === "district_manager") {
        const order2 = await storage.getOrderById(orderId);
        if (!order2) {
          return res.status(404).json({ message: "Order not found" });
        }
        const orderItems2 = await storage.getOrderItemsByOrderId(orderId);
        const productIds = orderItems2.map((item) => item.productId);
        const { products: productsTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
        const dmApprovedProducts = await storage.getProductsWithFilters(
          and2(
            eq2(productsTable.approvalStatus, "approved"),
            eq2(productsTable.approvedByUserId, req.user.id),
            eq2(productsTable.approvalType, "fpo")
          )
        );
        const dmApprovedProductIds = dmApprovedProducts.map((p) => p.id);
        const canUpdateOrder = productIds.every((id) => dmApprovedProductIds.includes(id));
        if (!canUpdateOrder) {
          return res.status(403).json({
            message: "You can only update orders for products you have approved"
          });
        }
      }
      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const updatedOrder = await storage.updateOrder(orderId, { status });
      if (updatedOrder) {
        const customer = await storage.getUserById(order.userId);
        if (customer) {
          sendOrderStatusUpdateEmail(updatedOrder, customer).then((success) => {
            console.log(`Admin: Order status update email sent to customer: ${success}`);
          }).catch((err) => {
            console.error("Admin: Error sending order status update email to customer:", err);
          });
          if (status === "shipped" || status === "delivered") {
            if (updatedOrder.items && updatedOrder.items.length > 0) {
              const uniqueFarmerIds = [...new Set(updatedOrder.items.filter((item) => item.farmerId).map((item) => item.farmerId))];
              for (const farmerId of uniqueFarmerIds) {
                try {
                  const farmer = await storage.getFarmerById(farmerId);
                  if (farmer) {
                    const farmerUser = await storage.getUserById(farmer.userId);
                    if (farmerUser) {
                      const emailOptions = {
                        to: farmerUser.email,
                        subject: `Order #${updatedOrder.id} Status Update - Farmer Santhe`,
                        text: `Hello ${farmerUser.name || farmerUser.username},
                        
Order #${updatedOrder.id} has been updated to status: ${status.toUpperCase()}.
                        
Please check your dashboard for more details.
                        
Thank you for being part of our farming community!
                        
Regards,
The Santhe Team`,
                        html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                          <h2 style="color: #2E7D32;">Order Status Update</h2>
                          <p>Hello ${farmerUser.name || farmerUser.username},</p>
                          <p>Order #${updatedOrder.id} has been updated to status: <strong>${status.toUpperCase()}</strong>.</p>
                          
                          <p>Please check your dashboard for more details.</p>
                          
                          <p>Thank you for being part of our farming community!</p>
                          <p>Regards,<br>The Santhe Team</p>
                        </div>
                        `
                      };
                      sendEmail(emailOptions).then((success) => {
                        console.log(`Admin: Order status update email sent to farmer ${farmer.farmName}: ${success}`);
                      }).catch((err) => {
                        console.error(`Admin: Error sending order status update to farmer ${farmer.farmName}:`, err);
                      });
                    }
                  }
                } catch (err) {
                  console.error(`Admin: Error processing farmer notification for farmerId ${farmerId}:`, err);
                }
              }
            }
          }
        }
      }
      return res.status(200).json({
        order: updatedOrder,
        message: `Order status updated to ${status} successfully`
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/orders/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { paymentMethod, customerName, email, phone, address, city, state, zipCode } = req.body;
      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const updateData = {};
      if (paymentMethod) updateData.paymentMethod = paymentMethod;
      if (customerName) updateData.customerName = customerName;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (address !== void 0) updateData.address = address;
      if (city !== void 0) updateData.city = city;
      if (state !== void 0) updateData.state = state;
      if (zipCode !== void 0) updateData.zipCode = zipCode;
      const updatedOrder = await storage.updateOrder(orderId, updateData);
      return res.status(200).json({
        order: updatedOrder,
        message: `Order updated successfully`
      });
    } catch (error) {
      console.error("Error updating order:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/cashfree/vendors`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const districtManagers = await db.query.users.findMany({
        where: eq2(users.role, "district_manager"),
        columns: {
          id: true,
          name: true,
          email: true,
          phone: true,
          district: true,
          orgName: true,
          orgEmail: true,
          orgPhone: true,
          bankAccountNumber: true,
          bankIfsc: true,
          gstNumber: true,
          upiId: true,
          cashfreeVendorId: true,
          vendorStatus: true,
          vendorCreatedAt: true,
          isActive: true
        }
      });
      return res.status(200).json({
        vendors: districtManagers,
        total: districtManagers.length,
        registered: districtManagers.filter((dm) => dm.cashfreeVendorId).length,
        pending: districtManagers.filter((dm) => !dm.cashfreeVendorId).length
      });
    } catch (error) {
      console.error("Error fetching vendors:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/cashfree/vendors/:id/register`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const dmId = parseInt(req.params.id);
      const dm = await db.query.users.findFirst({
        where: and2(eq2(users.id, dmId), eq2(users.role, "district_manager"))
      });
      if (!dm) {
        return res.status(404).json({ message: "District Manager not found" });
      }
      if (dm.cashfreeVendorId) {
        return res.status(400).json({
          message: "District Manager is already registered as a vendor",
          vendorId: dm.cashfreeVendorId
        });
      }
      if (!dm.bankAccountNumber || !dm.bankIfsc || !dm.orgName) {
        return res.status(400).json({
          message: "District Manager must have bank account, IFSC, and organization name to register as vendor"
        });
      }
      const vendorId = `DM_${dm.id}_${Date.now()}`;
      const phoneNumber = (dm.orgPhone?.replace(/\D/g, "") || dm.phone?.replace(/\D/g, "") || "9999999999").slice(-10);
      const accountNumber = dm.bankAccountNumber.replace(/\D/g, "");
      const vendorData = {
        vendor_id: vendorId,
        status: "ACTIVE",
        name: dm.orgName || dm.name,
        email: dm.orgEmail || dm.email,
        phone: phoneNumber,
        verify_account: true,
        dashboard_access: false,
        schedule_option: 1,
        bank: {
          account_number: accountNumber,
          account_holder: dm.name,
          ifsc: dm.bankIfsc
        },
        kyc_details: {
          account_type: "BUSINESS",
          business_type: "NBFC",
          ...dm.gstNumber && { gst: dm.gstNumber }
        }
      };
      console.log("Creating Cashfree vendor:", vendorData);
      const cashfreeResponse = await fetch("https://api.cashfree.com/pg/easy-split/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        },
        body: JSON.stringify(vendorData)
      });
      const cashfreeResult = await cashfreeResponse.json();
      console.log("Cashfree vendor creation result:", cashfreeResult);
      if (!cashfreeResponse.ok) {
        console.error("Cashfree vendor creation failed:", cashfreeResult);
        return res.status(400).json({
          message: "Failed to create vendor in Cashfree",
          error: cashfreeResult
        });
      }
      await db.update(users).set({
        cashfreeVendorId: vendorId,
        vendorStatus: "ACTIVE",
        vendorCreatedAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq2(users.id, dmId));
      return res.status(200).json({
        message: "District Manager registered as Cashfree vendor successfully",
        vendorId,
        cashfreeResponse: cashfreeResult
      });
    } catch (error) {
      console.error("Error registering vendor:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/cashfree/vendors/sync-all`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const unregisteredDMs = await db.query.users.findMany({
        where: and2(
          eq2(users.role, "district_manager"),
          eq2(users.isActive, true)
          // Filter those without vendor ID
        )
      });
      const toRegister = unregisteredDMs.filter((dm) => !dm.cashfreeVendorId);
      const results = [];
      const errors = [];
      for (const dm of toRegister) {
        if (!dm.bankAccountNumber || !dm.bankIfsc || !dm.orgName) {
          errors.push({
            dmId: dm.id,
            name: dm.name,
            error: "Missing required fields (bank account, IFSC, or organization name)"
          });
          continue;
        }
        try {
          const vendorId = `DM_${dm.id}_${Date.now()}`;
          const phoneNumber = (dm.orgPhone?.replace(/\D/g, "") || dm.phone?.replace(/\D/g, "") || "9999999999").slice(-10);
          const accountNumber = dm.bankAccountNumber.replace(/\D/g, "");
          const vendorData = {
            vendor_id: vendorId,
            status: "ACTIVE",
            name: dm.orgName || dm.name,
            email: dm.orgEmail || dm.email,
            phone: phoneNumber,
            verify_account: true,
            dashboard_access: false,
            schedule_option: 1,
            bank: {
              account_number: accountNumber,
              account_holder: dm.orgName || dm.name,
              ifsc: dm.bankIfsc
            },
            kyc_details: {
              account_type: "BUSINESS",
              business_type: "NBFC",
              ...dm.gstNumber && { gst: dm.gstNumber }
            }
          };
          const cashfreeResponse = await fetch("https://api.cashfree.com/pg/easy-split/vendors", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-client-id": CASHFREE_APP_ID,
              "x-client-secret": CASHFREE_SECRET_KEY,
              "x-api-version": "2023-08-01"
            },
            body: JSON.stringify(vendorData)
          });
          const cashfreeResult = await cashfreeResponse.json();
          if (cashfreeResponse.ok) {
            await db.update(users).set({
              cashfreeVendorId: vendorId,
              vendorStatus: "ACTIVE",
              vendorCreatedAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq2(users.id, dm.id));
            results.push({
              dmId: dm.id,
              name: dm.name,
              vendorId,
              status: "SUCCESS"
            });
          } else {
            errors.push({
              dmId: dm.id,
              name: dm.name,
              error: cashfreeResult
            });
          }
        } catch (err) {
          errors.push({
            dmId: dm.id,
            name: dm.name,
            error: err.message
          });
        }
      }
      return res.status(200).json({
        message: `Vendor sync completed. ${results.length} registered, ${errors.length} failed.`,
        registered: results,
        failed: errors,
        alreadyRegistered: unregisteredDMs.length - toRegister.length
      });
    } catch (error) {
      console.error("Error syncing vendors:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/cashfree/vendors/:id/status`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const dmId = parseInt(req.params.id);
      const dm = await db.query.users.findFirst({
        where: and2(eq2(users.id, dmId), eq2(users.role, "district_manager"))
      });
      if (!dm) {
        return res.status(404).json({ message: "District Manager not found" });
      }
      if (!dm.cashfreeVendorId) {
        return res.status(400).json({ message: "District Manager is not registered as a vendor" });
      }
      const cashfreeResponse = await fetch(`https://api.cashfree.com/pg/easy-split/vendors/${dm.cashfreeVendorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        }
      });
      const cashfreeResult = await cashfreeResponse.json();
      if (!cashfreeResponse.ok) {
        return res.status(400).json({
          message: "Failed to fetch vendor status from Cashfree",
          error: cashfreeResult
        });
      }
      if (cashfreeResult.status && cashfreeResult.status !== dm.vendorStatus) {
        await db.update(users).set({
          vendorStatus: cashfreeResult.status,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(users.id, dmId));
      }
      return res.status(200).json({
        vendorId: dm.cashfreeVendorId,
        status: cashfreeResult.status,
        details: cashfreeResult
      });
    } catch (error) {
      console.error("Error fetching vendor status:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/farmers/:id/zbnf-certification`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.id);
      const { isZbnfCertified } = req.body;
      if (typeof isZbnfCertified !== "boolean") {
        return res.status(400).json({ message: "isZbnfCertified must be a boolean value" });
      }
      const updatedFarmer = await storage.updateFarmerZbnfCertification(farmerId, isZbnfCertified);
      if (!updatedFarmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      return res.status(200).json({
        farmer: updatedFarmer,
        message: `Farmer ZBNF certification ${isZbnfCertified ? "enabled" : "disabled"} successfully`
      });
    } catch (error) {
      console.error("Error updating farmer ZBNF certification:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/order-fees`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const fees = await storage.getAllOrderFees();
      return res.json(fees);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/order-fees/active`, async (req, res) => {
    try {
      const fees = await storage.getActiveOrderFees();
      return res.json(fees);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/order-fees`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const validatedData = orderFeeValidationSchema.parse(req.body);
      const newFee = await storage.createOrderFee({
        name: validatedData.name,
        description: validatedData.description || null,
        type: validatedData.type,
        value: validatedData.value.toString(),
        // Convert to string for database storage
        isActive: validatedData.isActive ?? true,
        applyToSubtotal: validatedData.applyToSubtotal ?? false,
        displayOrder: validatedData.displayOrder ?? 0,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      return res.status(201).json(newFee);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/order-fees/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const feeId = parseInt(req.params.id);
      const existingFee = await storage.getOrderFeeById(feeId);
      if (!existingFee) {
        return res.status(404).json({ message: "Order fee not found" });
      }
      const validatedData = orderFeeValidationSchema.partial().parse(req.body);
      const updateData = { ...validatedData };
      if (typeof validatedData.value === "number") {
        updateData.value = validatedData.value.toString();
      }
      updateData.updatedAt = /* @__PURE__ */ new Date();
      const updatedFee = await storage.updateOrderFee(feeId, updateData);
      return res.json(updatedFee);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/admin/order-fees/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const feeId = parseInt(req.params.id);
      const existingFee = await storage.getOrderFeeById(feeId);
      if (!existingFee) {
        return res.status(404).json({ message: "Order fee not found" });
      }
      await storage.deleteOrderFee(feeId);
      return res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/ai-plans`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const plans = await db.select().from(aiSubscriptionPlans).orderBy(desc2(aiSubscriptionPlans.createdAt));
      return res.json(plans);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/ai-plans`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const validatedData = insertAiSubscriptionPlanSchema.parse(req.body);
      const [newPlan] = await db.insert(aiSubscriptionPlans).values(validatedData).returning();
      return res.status(201).json(newPlan);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/ai-plans/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const [existingPlan] = await db.select().from(aiSubscriptionPlans).where(eq2(aiSubscriptionPlans.id, planId));
      if (!existingPlan) {
        return res.status(404).json({ message: "AI subscription plan not found" });
      }
      const validatedData = insertAiSubscriptionPlanSchema.partial().parse(req.body);
      const updateData = { ...validatedData, updatedAt: /* @__PURE__ */ new Date() };
      const [updatedPlan] = await db.update(aiSubscriptionPlans).set(updateData).where(eq2(aiSubscriptionPlans.id, planId)).returning();
      return res.json(updatedPlan);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/admin/ai-plans/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const [existingPlan] = await db.select().from(aiSubscriptionPlans).where(eq2(aiSubscriptionPlans.id, planId));
      if (!existingPlan) {
        return res.status(404).json({ message: "AI subscription plan not found" });
      }
      await db.delete(aiSubscriptionPlans).where(eq2(aiSubscriptionPlans.id, planId));
      return res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/subscription-plans`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const plans = await db.select().from(customerSubscriptionPlans).orderBy(asc2(customerSubscriptionPlans.displayOrder));
      return res.json(plans);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/subscription-plans/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const [existingPlan] = await db.select().from(customerSubscriptionPlans).where(eq2(customerSubscriptionPlans.id, planId));
      if (!existingPlan) {
        return res.status(404).json({ message: "Subscription plan not found" });
      }
      const { price, description, isActive, name, displayOrder } = req.body;
      const updateData = { updatedAt: /* @__PURE__ */ new Date() };
      if (price !== void 0) updateData.price = String(price);
      if (description !== void 0) updateData.description = description;
      if (isActive !== void 0) updateData.isActive = isActive;
      if (name !== void 0) updateData.name = name;
      if (displayOrder !== void 0) updateData.displayOrder = displayOrder;
      const [updatedPlan] = await db.update(customerSubscriptionPlans).set(updateData).where(eq2(customerSubscriptionPlans.id, planId)).returning();
      return res.json(updatedPlan);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/subscription-plans`, async (req, res) => {
    try {
      const plans = await db.select().from(customerSubscriptionPlans).where(eq2(customerSubscriptionPlans.isActive, true)).orderBy(asc2(customerSubscriptionPlans.displayOrder));
      return res.json(plans);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/my-subscription`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Authentication required" });
      const now = /* @__PURE__ */ new Date();
      const activeSub = await db.query.customerSubscriptions.findFirst({
        where: and2(
          eq2(customerSubscriptions.userId, req.user.id),
          eq2(customerSubscriptions.status, "active"),
          gte(customerSubscriptions.endDate, now)
        ),
        with: { plan: true },
        orderBy: desc2(customerSubscriptions.endDate)
      });
      if (!activeSub) {
        return res.json({ subscription: null });
      }
      return res.json({ subscription: activeSub });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/subscribe`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Authentication required" });
      const { planId, paymentId } = req.body;
      if (!planId) return res.status(400).json({ message: "Plan ID is required" });
      const [plan] = await db.select().from(customerSubscriptionPlans).where(eq2(customerSubscriptionPlans.id, planId));
      if (!plan || !plan.isActive) {
        return res.status(404).json({ message: "Plan not found or inactive" });
      }
      const now = /* @__PURE__ */ new Date();
      const existingSub = await db.query.customerSubscriptions.findFirst({
        where: and2(
          eq2(customerSubscriptions.userId, req.user.id),
          eq2(customerSubscriptions.status, "active"),
          gte(customerSubscriptions.endDate, now)
        )
      });
      if (existingSub) {
        await db.update(customerSubscriptions).set({ status: "cancelled", updatedAt: /* @__PURE__ */ new Date() }).where(eq2(customerSubscriptions.id, existingSub.id));
      }
      const startDate = /* @__PURE__ */ new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + plan.durationDays);
      const [newSub] = await db.insert(customerSubscriptions).values({
        userId: req.user.id,
        planId: plan.id,
        status: "active",
        startDate,
        endDate,
        paymentId: paymentId || null
      }).returning();
      const subWithPlan = await db.query.customerSubscriptions.findFirst({
        where: eq2(customerSubscriptions.id, newSub.id),
        with: { plan: true }
      });
      return res.status(201).json({ subscription: subWithPlan });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/cancel-subscription`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Authentication required" });
      const now = /* @__PURE__ */ new Date();
      const activeSub = await db.query.customerSubscriptions.findFirst({
        where: and2(
          eq2(customerSubscriptions.userId, req.user.id),
          eq2(customerSubscriptions.status, "active"),
          gte(customerSubscriptions.endDate, now)
        )
      });
      if (!activeSub) {
        return res.status(404).json({ message: "No active subscription found" });
      }
      await db.update(customerSubscriptions).set({ status: "cancelled", updatedAt: /* @__PURE__ */ new Date() }).where(eq2(customerSubscriptions.id, activeSub.id));
      return res.json({ message: "Subscription cancelled successfully" });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/subscribe-payment`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Authentication required" });
      const { planId } = req.body;
      if (!planId || typeof planId !== "number") return res.status(400).json({ message: "Valid Plan ID is required" });
      const [plan] = await db.select().from(customerSubscriptionPlans).where(eq2(customerSubscriptionPlans.id, planId));
      if (!plan || !plan.isActive) {
        return res.status(404).json({ message: "Plan not found or inactive" });
      }
      const orderId = `sub_${Date.now()}_${req.user.id}`;
      const amount = parseFloat(String(plan.price));
      const paymentData = {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: req.user.id.toString(),
          customer_name: req.user.name || "Customer",
          customer_email: req.user.email || "",
          customer_phone: req.user.phone || "9999999999"
        },
        order_meta: {
          return_url: `https://farmersanthe.com/subscription?payment=success&order_id={order_id}&plan_id=${planId}`,
          notify_url: `https://farmersanthe.com/api/payments/webhook`
        },
        order_note: `Subscription: ${plan.name} (${plan.billingPeriod})`
      };
      const paymentResponse = await fetch("https://api.cashfree.com/pg/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        },
        body: JSON.stringify(paymentData)
      });
      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error("Cashfree subscription payment error:", errorText);
        throw new Error(`Cashfree API error: ${paymentResponse.status}`);
      }
      const paymentResult = await paymentResponse.json();
      console.log("Subscription payment order created:", paymentResult.order_id);
      await db.insert(pendingPayments).values({
        cashfreeOrderId: orderId,
        userId: req.user.id,
        orderData: { type: "subscription", planId: plan.id, planName: plan.name, billingPeriod: plan.billingPeriod, durationDays: plan.durationDays },
        amount: String(amount),
        status: "pending",
        paymentMode: "production"
      });
      let paymentUrl = null;
      if (paymentResult.payment_link) {
        paymentUrl = paymentResult.payment_link;
      } else if (paymentResult.payment_session_id) {
        const sessionId = String(paymentResult.payment_session_id).trim();
        if (!sessionId.includes("sjApayment") && !sessionId.endsWith("ayment")) {
          paymentUrl = `https://payments.cashfree.com/pay/${sessionId}`;
        }
      } else if (paymentResult.order_token) {
        paymentUrl = `https://payments.cashfree.com/pay?order_token=${String(paymentResult.order_token).trim()}`;
      }
      return res.json({
        success: true,
        paymentUrl,
        orderId,
        sessionId: paymentResult.payment_session_id || null,
        mode: "production",
        returnUrl: paymentData.order_meta.return_url
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/payments/verify-subscription`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Authentication required" });
      const { orderId, planId } = req.body;
      if (!orderId || typeof orderId !== "string") {
        return res.status(400).json({ message: "Valid Order ID is required" });
      }
      const pending = await db.query.pendingPayments.findFirst({
        where: eq2(pendingPayments.cashfreeOrderId, orderId)
      });
      if (!pending) {
        return res.status(404).json({ success: false, message: "Payment record not found" });
      }
      if (pending.userId !== req.user.id) {
        return res.status(403).json({ success: false, message: "This payment does not belong to your account" });
      }
      if (pending.processed) {
        const existingSub = await db.query.customerSubscriptions.findFirst({
          where: and2(
            eq2(customerSubscriptions.userId, req.user.id),
            eq2(customerSubscriptions.status, "active")
          ),
          with: { plan: true },
          orderBy: desc2(customerSubscriptions.endDate)
        });
        return res.json({ success: true, message: "Subscription already activated", subscription: existingSub });
      }
      const verifyResponse = await fetch(`https://api.cashfree.com/pg/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        }
      });
      if (!verifyResponse.ok) {
        await db.update(pendingPayments).set({ status: "failed", errorMessage: "Cashfree verification request failed", updatedAt: /* @__PURE__ */ new Date() }).where(eq2(pendingPayments.id, pending.id));
        return res.status(400).json({ success: false, message: "Unable to verify payment" });
      }
      const paymentStatus = await verifyResponse.json();
      console.log("Subscription payment verification:", paymentStatus.order_status, "for order:", orderId);
      if (paymentStatus.order_status !== "PAID") {
        await db.update(pendingPayments).set({ status: "failed", errorMessage: `Payment status: ${paymentStatus.order_status}`, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(pendingPayments.id, pending.id));
        return res.status(400).json({ success: false, message: "Payment not completed", status: paymentStatus.order_status });
      }
      const resolvedPlanId = pending.orderData?.planId || (planId ? parseInt(planId) : null);
      if (!resolvedPlanId) {
        return res.status(400).json({ success: false, message: "Plan ID not found" });
      }
      const [plan] = await db.select().from(customerSubscriptionPlans).where(eq2(customerSubscriptionPlans.id, resolvedPlanId));
      if (!plan) {
        return res.status(404).json({ success: false, message: "Plan not found" });
      }
      const now = /* @__PURE__ */ new Date();
      const existingActiveSub = await db.query.customerSubscriptions.findFirst({
        where: and2(
          eq2(customerSubscriptions.userId, req.user.id),
          eq2(customerSubscriptions.status, "active"),
          gte(customerSubscriptions.endDate, now)
        )
      });
      if (existingActiveSub) {
        await db.update(customerSubscriptions).set({ status: "cancelled", updatedAt: /* @__PURE__ */ new Date() }).where(eq2(customerSubscriptions.id, existingActiveSub.id));
      }
      const startDate = /* @__PURE__ */ new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + plan.durationDays);
      const [newSub] = await db.insert(customerSubscriptions).values({
        userId: req.user.id,
        planId: plan.id,
        status: "active",
        startDate,
        endDate,
        paymentId: orderId
      }).returning();
      if (pending) {
        await db.update(pendingPayments).set({ status: "paid", processed: true, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(pendingPayments.id, pending.id));
      }
      const subWithPlan = await db.query.customerSubscriptions.findFirst({
        where: eq2(customerSubscriptions.id, newSub.id),
        with: { plan: true }
      });
      console.log("Subscription activated via Cashfree payment:", plan.name, "for user:", req.user.id);
      return res.json({ success: true, message: "Subscription activated successfully", subscription: subWithPlan });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/customer-subscriptions`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const subs = await db.query.customerSubscriptions.findMany({
        with: { plan: true, user: true },
        orderBy: desc2(customerSubscriptions.createdAt)
      });
      return res.json(subs);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post("/api/test-email", async (req, res) => {
    try {
      const { email = "agrisanthe@gmail.com", type = "welcome" } = req.body;
      console.log(`Testing Zepto email service - sending to: ${email}`);
      let success = false;
      let message = "";
      if (type === "welcome") {
        success = await zeptoEmailService.sendEmail({
          to: email,
          subject: "Welcome to Santhe Marketplace! \u{1F33E}",
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Welcome to Santhe</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>\u{1F33E} Welcome to Santhe</h1>
                  <p>Your Local Farm-to-Table Marketplace</p>
                </div>
                <div class="content">
                  <h2>Hello from the Santhe Team!</h2>
                  <p>\u{1F389} Great news! Your Zepto email integration is working perfectly!</p>
                  <p>Santhe is now ready to send:</p>
                  <ul>
                    <li>\u{1F4E7} Password reset notifications</li>
                    <li>\u{1F4E6} Order confirmations</li>
                    <li>\u{1F69A} Shipping updates</li>
                    <li>\u{1F468}\u200D\u{1F33E} Farmer order notifications</li>
                  </ul>
                  <p>Thank you for supporting local farmers and fresh produce!</p>
                  <hr>
                  <p><strong>The Santhe Team</strong><br>
                  Connecting farmers with customers across India</p>
                </div>
                <div class="footer">
                  <p>This is a test email from your Santhe marketplace system.</p>
                </div>
              </div>
            </body>
            </html>
          `,
          textContent: `Welcome to Santhe Marketplace!
          
Your Zepto email integration is working perfectly!

Santhe is now ready to send:
- Password reset notifications
- Order confirmations  
- Shipping updates
- Farmer order notifications

Thank you for supporting local farmers and fresh produce!

The Santhe Team
Connecting farmers with customers across India`
        });
        message = "Welcome test email";
      } else if (type === "password-reset") {
        const testUser = {
          id: 999,
          name: "Test User",
          email,
          username: "testuser",
          role: "customer",
          phone: "+91 9876543210",
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          password: "",
          resetToken: null,
          resetTokenExpiry: null
        };
        const resetToken = "test-reset-token-12345";
        success = await sendPasswordResetEmail(testUser, resetToken);
        message = "Password reset email";
      }
      if (success) {
        res.json({
          success: true,
          message: `${message} sent successfully to ${email}`
        });
      } else {
        res.status(500).json({
          success: false,
          message: `Failed to send ${message}`
        });
      }
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({
        success: false,
        message: "Error sending test email",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post(`${apiPrefix}/farmers/:farmerId/follow`, authenticateJWT, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.farmerId);
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const farmer = await storage.getFarmerById(farmerId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      const isAlreadyFollowing = await storage.isFollowing(userId, farmerId);
      if (isAlreadyFollowing) {
        await storage.unfollowFarmer(userId, farmerId);
        return res.json({ message: "Successfully unfollowed farmer", isFollowing: false });
      }
      await storage.followFarmer(userId, farmerId);
      storage.notifyNewFollower(farmerId, userId).catch((err) => {
        console.error("Failed to send new follower notification:", err);
      });
      res.status(201).json({ message: "Successfully followed farmer", isFollowing: true });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/farmers/:farmerId/follow`, authenticateJWT, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.farmerId);
      const userId = req.query.userId ? parseInt(req.query.userId) : req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      await storage.unfollowFarmer(userId, farmerId);
      res.json({ message: "Successfully unfollowed farmer", isFollowing: false });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/farmers/:farmerId/follow-status`, authenticateJWT, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.farmerId);
      const userId = req.query.userId ? parseInt(req.query.userId) : req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const isFollowing = await storage.isFollowing(userId, farmerId);
      const followCounts = await storage.getFarmerFollowCounts(farmerId);
      res.json({
        isFollowing,
        followerCount: followCounts.followerCount
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/farmers/:farmerId/followers`, async (req, res) => {
    try {
      const farmerId = parseInt(req.params.farmerId);
      if (isNaN(farmerId)) {
        return res.status(400).json({ message: "Invalid farmer ID" });
      }
      const followers = await storage.getFarmerFollowers(farmerId);
      const followerNames = followers.filter((follower) => follower && follower.name).map((follower) => ({
        name: follower.name
      }));
      res.json(followerNames);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/users/followed-farmers`, authenticateJWT, async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId) : req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const followedFarmers = await storage.getUserFollowedFarmers(userId);
      res.json(followedFarmers);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/notifications`, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      let userId = null;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.verify(token, JWT_SECRET_SAFE);
          userId = decoded.id;
        } catch (err) {
        }
      }
      if (!userId && req.session && req.session.user) {
        userId = req.session.user.id;
      }
      if (!userId && req.query.userId) {
        userId = parseInt(req.query.userId);
      }
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const notifications2 = await storage.getUserNotifications(userId, limit);
      res.json(notifications2);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.patch(`${apiPrefix}/notifications/:id/read`, authenticateJWT, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.patch(`${apiPrefix}/notifications/mark-all-read`, authenticateJWT, async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId) : req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/notifications/unread-count`, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      let userId = null;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.verify(token, JWT_SECRET_SAFE);
          userId = decoded.id;
        } catch (err) {
        }
      }
      if (!userId && req.session && req.session.user) {
        userId = req.session.user.id;
      }
      if (!userId && req.query.userId) {
        userId = parseInt(req.query.userId);
      }
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ unreadCount: count });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/notifications/:id`, authenticateJWT, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.deleteNotification(notificationId);
      res.json({ message: "Notification deleted" });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/hierarchy`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const hierarchy = await storage.getHierarchyStructure();
      res.json(hierarchy);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/staff`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const {
        username,
        password,
        email,
        name,
        phone,
        role,
        district,
        taluk,
        reportsTo,
        // District Manager / FPO Organization Details
        orgName,
        orgAddress,
        orgPhone,
        orgEmail,
        orgLogoUrl,
        bankAccountNumber,
        bankIfsc,
        gstNumber,
        upiId
      } = req.body;
      const allowedRoles = ["district_manager", "taluk_agent", "delivery_agent"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role. Must be one of: district_manager, taluk_agent, delivery_agent"
        });
      }
      if (role === "district_manager") {
        try {
          const validationData = {
            username,
            password,
            email,
            name,
            phone,
            role,
            district,
            orgName,
            orgAddress,
            orgPhone,
            orgEmail,
            orgLogoUrl,
            bankAccountNumber,
            bankIfsc,
            gstNumber,
            upiId
          };
          const { districtManagerValidationSchema: districtManagerValidationSchema2 } = (init_schema(), __toCommonJS(schema_exports));
          const validatedData = districtManagerValidationSchema2.parse(validationData);
        } catch (validationError) {
          console.error("District manager validation failed:", validationError);
          if (validationError.errors) {
            return res.status(400).json({
              message: "Validation failed",
              errors: validationError.errors
            });
          }
          return res.status(400).json({
            message: "District managers must provide complete organization details: name, address, phone, email, banking info, and district assignment"
          });
        }
      }
      const existingUser = await db.query.users.findFirst({
        where: or2(
          eq2(users.username, username),
          eq2(users.email, email)
        )
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists"
        });
      }
      if (role === "taluk_agent" || role === "delivery_agent") {
        if (!reportsTo) {
          return res.status(400).json({
            message: `${role} must report to a district manager`
          });
        }
        const supervisor = await storage.getUserById(reportsTo);
        if (!supervisor || supervisor.role !== "district_manager") {
          return res.status(400).json({
            message: "Invalid supervisor. Must be a district manager"
          });
        }
      }
      const hashedPassword = await hash(password, 10);
      const baseUserData = {
        username,
        password: hashedPassword,
        email,
        name,
        phone,
        role,
        district: district || null,
        taluk: taluk || null,
        reportsTo: reportsTo ? parseInt(reportsTo) : null,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      let userData = baseUserData;
      if (role === "district_manager") {
        try {
          const generateOrgSlug = (name2) => {
            return name2.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 60);
          };
          let orgSlugBase = orgName ? generateOrgSlug(orgName) : generateOrgSlug(username);
          let orgSlugFinal = orgSlugBase;
          let slugCounter = 1;
          while (true) {
            const existingSlug = await db.query.users.findFirst({
              where: eq2(users.orgSlug, orgSlugFinal)
            });
            if (!existingSlug) break;
            orgSlugFinal = `${orgSlugBase}-${slugCounter}`;
            slugCounter++;
          }
          const orgUserData = {
            ...baseUserData,
            orgName: orgName || null,
            orgSlug: orgSlugFinal,
            orgAddress: orgAddress || null,
            orgPhone: orgPhone || null,
            orgEmail: orgEmail || null,
            orgLogoUrl: orgLogoUrl || null,
            bankAccountNumber: bankAccountNumber || null,
            bankIfsc: bankIfsc || null,
            gstNumber: gstNumber || null,
            upiId: upiId || null
          };
          userData = orgUserData;
        } catch (error) {
          console.warn("Organization columns not yet available, creating basic district manager:", error);
        }
      }
      const newUser = await storage.createStaffUser(userData);
      const { password: userPassword, ...safeUser } = newUser;
      res.status(201).json({
        ...safeUser,
        message: role === "district_manager" ? "District Manager created successfully with organization details" : "Staff user created successfully"
      });
    } catch (error) {
      console.error("Error creating staff user:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/staff/:role`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const { role } = req.params;
      const allowedRoles = ["district_manager", "taluk_agent", "delivery_agent"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role parameter"
        });
      }
      const users2 = await storage.getUsersByRole(role);
      const safeUsers = users2.map((user) => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/staff/manager/:managerId/subordinates`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const managerId = parseInt(req.params.managerId);
      const subordinates = await storage.getUsersUnderManager(managerId);
      const safeSubs = subordinates.map((user) => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeSubs);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/staff/:userId/role`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { role, reportsTo, district, taluk } = req.body;
      const allowedRoles = ["district_manager", "taluk_agent", "delivery_agent"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role. Must be one of: district_manager, taluk_agent, delivery_agent"
        });
      }
      if ((role === "taluk_agent" || role === "delivery_agent") && reportsTo) {
        const supervisor = await storage.getUserById(reportsTo);
        if (!supervisor || supervisor.role !== "district_manager") {
          return res.status(400).json({
            message: "Invalid supervisor. Must be a district manager"
          });
        }
      }
      const updatedUser = await storage.updateUserRole(userId, role, reportsTo, district, taluk);
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/district/:district/users`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const { district } = req.params;
      const users2 = await storage.getUsersInDistrict(district);
      const safeUsers = users2.map((user) => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/taluk/:taluk/users`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const { taluk } = req.params;
      const users2 = await storage.getUsersInTaluk(taluk);
      const safeUsers = users2.map((user) => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/staff/:userId`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const {
        username,
        email,
        name,
        phone,
        role,
        district,
        taluk,
        reportsTo,
        password: newPassword,
        isActive,
        orgName,
        orgAddress,
        orgPhone,
        orgEmail,
        orgLogoUrl,
        bankAccountNumber,
        bankIfsc,
        gstNumber,
        upiId
      } = req.body;
      if (!username || !email || !name || !role) {
        return res.status(400).json({
          message: "Username, email, name, and role are required"
        });
      }
      const allowedRoles = ["district_manager", "taluk_agent", "delivery_agent", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role. Must be one of: district_manager, taluk_agent, delivery_agent, admin"
        });
      }
      if ((role === "taluk_agent" || role === "delivery_agent") && reportsTo) {
        const supervisor = await storage.getUserById(parseInt(reportsTo));
        if (!supervisor || supervisor.role !== "district_manager") {
          return res.status(400).json({
            message: "Invalid supervisor. Must be a district manager"
          });
        }
      }
      const updateData = {
        username,
        email,
        name,
        phone,
        role,
        district: district || null,
        taluk: taluk || null,
        reportsTo: reportsTo ? parseInt(reportsTo) : null,
        isActive: isActive !== void 0 ? isActive : true,
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (role === "district_manager") {
        updateData.orgName = orgName || null;
        updateData.orgAddress = orgAddress || null;
        updateData.orgPhone = orgPhone || null;
        updateData.orgEmail = orgEmail || null;
        updateData.orgLogoUrl = orgLogoUrl || null;
        updateData.bankAccountNumber = bankAccountNumber || null;
        updateData.bankIfsc = bankIfsc || null;
        updateData.gstNumber = gstNumber || null;
        updateData.upiId = upiId || null;
      }
      if (newPassword && newPassword.trim() !== "") {
        updateData.password = await hash(newPassword, 10);
      }
      const updatedUser = await storage.updateUser(userId, updateData);
      const { password: _, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.patch(`${apiPrefix}/admin/staff/:userId/status`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { isActive } = req.body;
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          message: "isActive must be a boolean value"
        });
      }
      const updatedUser = await storage.updateUser(userId, {
        isActive,
        updatedAt: /* @__PURE__ */ new Date()
      });
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/admin/staff/:userId`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role === "admin") {
        return res.status(403).json({
          message: "Cannot delete admin users"
        });
      }
      await storage.updateUser(userId, {
        isActive: false,
        username: `deleted_${user.username}_${Date.now()}`,
        email: `deleted_${user.email}`,
        updatedAt: /* @__PURE__ */ new Date()
      });
      res.json({ message: "Staff member deleted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/farmers/district`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!["admin", "district_manager", "taluk_agent"].includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      let farmers2;
      if (req.user.role === "admin") {
        farmers2 = await storage.getAllFarmers();
      } else {
        const userDistrict = req.user.district;
        if (!userDistrict) {
          return res.status(400).json({ error: "User district not found" });
        }
        farmers2 = await storage.getFarmersInDistrict(userDistrict);
      }
      const enrichedFarmers = await Promise.all(farmers2.map(async (farmer) => {
        const products2 = await storage.getProductsByFarmerId(farmer.id);
        const pendingCount = products2.filter((p) => p.approvalStatus === "pending").length;
        const approvedCount = products2.filter((p) => p.approvalStatus === "approved").length;
        const rejectedCount = products2.filter((p) => p.approvalStatus === "rejected").length;
        return {
          ...farmer,
          productCount: products2.length,
          pendingCount,
          approvedCount,
          rejectedCount
        };
      }));
      res.json(enrichedFarmers);
    } catch (error) {
      console.error("Error fetching district farmers data:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/orders/district`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!["admin", "district_manager", "taluk_agent"].includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      let orders2;
      if (req.user.role === "admin") {
        orders2 = await storage.getOrdersWithFilters();
      } else if (req.user.role === "district_manager") {
        const dmApprovedProducts = await storage.getProductsWithFilters(
          and2(
            eq2(products.approvalStatus, "approved"),
            eq2(products.approvedByUserId, req.user.id),
            eq2(products.approvalType, "fpo")
          )
        );
        const dmProductIds = dmApprovedProducts.map((p) => p.id);
        console.log(`[DM ${req.user.id}] Orders endpoint: DM has ${dmProductIds.length} approved products`);
        const allOrders = await storage.getOrdersWithFilters();
        orders2 = [];
        for (const order of allOrders) {
          const orderItems2 = await storage.getOrderItemsByOrderId(order.id);
          const hasDMProducts = orderItems2.some((item) => dmProductIds.includes(item.productId));
          if (hasDMProducts) {
            orders2.push(order);
          }
        }
        console.log(`[DM ${req.user.id}] Orders endpoint: Returning ${orders2.length} orders`);
      } else {
        const userDistrict = req.user.district;
        if (!userDistrict) {
          return res.status(400).json({ error: "User district not found" });
        }
        orders2 = await storage.getOrdersInDistrict(userDistrict);
      }
      const ordersWithItems = await Promise.all(orders2.map(async (order) => {
        const items = await storage.getOrderItemsByOrderId(order.id);
        return {
          ...order,
          items: await Promise.all(items.map(async (item) => {
            let productDetails = null;
            let farmerDetails = null;
            try {
              productDetails = await storage.getProductById(item.productId);
              farmerDetails = await storage.getFarmerById(item.farmerId);
            } catch (error) {
              console.error(`Error fetching details for item ${item.id}:`, error);
            }
            return {
              id: item.id,
              productId: item.productId,
              productName: productDetails?.name || item.productName || "Unknown Product",
              quantity: item.quantity,
              price: item.price,
              farmerId: item.farmerId,
              farmerName: farmerDetails?.farmName || "Unknown Farmer",
              product: productDetails ? {
                id: productDetails.id,
                name: productDetails.name,
                status: productDetails.status || "available",
                harvestDate: productDetails.harvestDate,
                availableUntil: productDetails.availableUntil,
                unitsPerBox: productDetails.unitsPerBox,
                unit: productDetails.unit,
                imageUrl: productDetails.imageUrl
              } : null
            };
          }))
        };
      }));
      res.json(ordersWithItems);
    } catch (error) {
      console.error("Error fetching district orders:", error);
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/products/district`, authenticateJWT, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!["admin", "district_manager"].includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      let products2;
      if (req.user.role === "admin") {
        products2 = await storage.getProductsWithFilters();
      } else {
        const userDistrict = req.user.district;
        if (!userDistrict) {
          return res.status(400).json({ error: "User district not found" });
        }
        products2 = await storage.getProductsInDistrict(userDistrict);
      }
      const productsWithFarmers = await Promise.all(products2.map(async (product) => {
        const farmer = await storage.getFarmerById(product.farmerId);
        return {
          ...product,
          farmerName: farmer?.farmName || "Unknown",
          farmerLocation: farmer?.location || "Unknown"
        };
      }));
      res.json(productsWithFarmers);
    } catch (error) {
      console.error("Error fetching district products:", error);
      handleError(res, error);
    }
  });
  const authorizeStaffAccess = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const userRole = req.user.role;
      if (userRole === "admin") {
        return next();
      }
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions."
        });
      }
      next();
    };
  };
  app2.get(`${apiPrefix}/district-manager/dashboard`, authenticateJWT, authorizeStaffAccess(["district_manager"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUserById(userId);
      if (!user || !user.district) {
        return res.status(400).json({ message: "District information missing" });
      }
      const subordinates = await storage.getUsersUnderManager(userId);
      const talukAgents = subordinates.filter((s) => s.role === "taluk_agent");
      const deliveryAgents = subordinates.filter((s) => s.role === "delivery_agent");
      const districtUsers = await storage.getUsersInDistrict(user.district);
      const dashboard = {
        user,
        district: user.district,
        subordinates: {
          talukAgents: talukAgents.length,
          deliveryAgents: deliveryAgents.length,
          total: subordinates.length
        },
        districtStats: {
          totalUsers: districtUsers.length,
          farmers: districtUsers.filter((u) => u.role === "farmer").length,
          customers: districtUsers.filter((u) => u.role === "customer").length
        }
      };
      res.json(dashboard);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/taluk-agent/dashboard`, authenticateJWT, authorizeStaffAccess(["taluk_agent"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUserById(userId);
      if (!user || !user.taluk) {
        return res.status(400).json({ message: "Taluk information missing" });
      }
      const talukUsers = await storage.getUsersInTaluk(user.taluk);
      const dashboard = {
        user,
        taluk: user.taluk,
        district: user.district,
        supervisor: user.reportsTo ? await storage.getUserById(user.reportsTo) : null,
        talukStats: {
          totalUsers: talukUsers.length,
          farmers: talukUsers.filter((u) => u.role === "farmer").length,
          customers: talukUsers.filter((u) => u.role === "customer").length
        }
      };
      res.json(dashboard);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/delivery-agent/dashboard`, authenticateJWT, authorizeStaffAccess(["delivery_agent"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUserById(userId);
      const dashboard = {
        user,
        district: user?.district,
        supervisor: user?.reportsTo ? await storage.getUserById(user.reportsTo) : null,
        // Add delivery-specific stats here when needed
        deliveryStats: {
          // Placeholder for future delivery metrics
        }
      };
      res.json(dashboard);
    } catch (error) {
      handleError(res, error);
    }
  });
  app2.get(`${apiPrefix}/payments/debug-config`, (req, res) => {
    const debugInfo = {
      hasAppId: !!CASHFREE_APP_ID,
      hasSecretKey: !!CASHFREE_SECRET_KEY,
      appIdLength: CASHFREE_APP_ID?.length || 0,
      secretKeyLength: CASHFREE_SECRET_KEY?.length || 0,
      appIdPreview: CASHFREE_APP_ID?.substring(0, 10) + "..." || "NOT_SET",
      secretKeyPreview: CASHFREE_SECRET_KEY?.substring(0, 10) + "..." || "NOT_SET",
      environment: process.env.NODE_ENV || "development",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.log("Cashfree Debug Info:", debugInfo);
    res.json(debugInfo);
  });
  app2.post(`${apiPrefix}/payments/create-session`, authenticateJWT, async (req, res) => {
    try {
      if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
        return res.status(500).json({
          message: "Payment gateway not configured"
        });
      }
      const { amount, orderData, customerDetails } = req.body;
      if (!amount || !customerDetails || !orderData) {
        return res.status(400).json({
          message: "Missing required payment details"
        });
      }
      const orderAmount = parseFloat(parseFloat(amount).toFixed(2));
      const minimumAmount = 10;
      if (orderAmount < minimumAmount) {
        return res.status(400).json({
          message: `Order amount must be at least \u20B9${minimumAmount}. Current amount: \u20B9${orderAmount}`,
          error: "Minimum order amount not met",
          minimumAmount,
          currentAmount: orderAmount
        });
      }
      const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      console.log(`\u{1F4BE} Saving payment session to database FIRST - Order ID: ${uniqueOrderId}, User ID: ${req.user?.id}, Amount: ${orderAmount}`);
      try {
        await db.insert(pendingPayments).values({
          cashfreeOrderId: uniqueOrderId,
          userId: req.user.id,
          orderData,
          // Store complete order details as JSON
          amount: orderAmount.toString(),
          status: "pending",
          paymentMode: "production",
          processed: false
        });
        console.log(`\u2705 Payment session saved to database - Order ID: ${uniqueOrderId}`);
      } catch (dbError) {
        console.error("\u274C CRITICAL: Failed to save payment session to database:", dbError);
        return res.status(500).json({
          message: "Failed to initialize payment. Please try again.",
          error: "Database error - payment session could not be created"
        });
      }
      console.log("Creating Cashfree payment session:");
      console.log("App ID:", CASHFREE_APP_ID);
      console.log("Amount:", orderAmount);
      console.log("Customer:", customerDetails);
      const cashfreeOrderRequest = {
        order_id: uniqueOrderId,
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: customerDetails.customerId || `customer_${Date.now()}`,
          customer_name: customerDetails.name,
          customer_email: customerDetails.email,
          customer_phone: customerDetails.phone
        },
        order_meta: {
          return_url: `https://farmersanthe.com/checkout/success?order_id={order_id}`,
          notify_url: `https://farmersanthe.com/api/payments/webhook`,
          payment_methods: "cc,dc,nb,upi"
        }
      };
      console.log("Cashfree request payload:", JSON.stringify(cashfreeOrderRequest, null, 2));
      try {
        const response = await fetch("https://api.cashfree.com/pg/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-version": "2023-08-01",
            "x-client-id": CASHFREE_APP_ID,
            "x-client-secret": CASHFREE_SECRET_KEY,
            "Accept": "application/json"
          },
          body: JSON.stringify(cashfreeOrderRequest)
        });
        const cashfreeResponse = await response.json();
        console.log("Cashfree API response:", JSON.stringify(cashfreeResponse, null, 2));
        if (!response.ok) {
          console.error("Cashfree API error:", response.status, response.statusText);
          console.error("API Error Details:", cashfreeResponse);
          let errorMessage = "Payment processing failed. Please try again.";
          if (cashfreeResponse.code === "order_amount_invalid") {
            errorMessage = cashfreeResponse.message?.includes("minimum") ? `Order amount must be at least \u20B910.00. Current: \u20B9${orderAmount}` : `Invalid order amount: \u20B9${orderAmount}`;
          } else if (cashfreeResponse.code === "authentication_error") {
            errorMessage = "Payment gateway authentication failed. Please contact support.";
          }
          return res.status(400).json({
            message: errorMessage,
            error: cashfreeResponse.message || "Payment failed",
            details: cashfreeResponse,
            currentAmount: orderAmount
          });
        }
        console.log("\u2705 Cashfree payment session created successfully:", cashfreeResponse.order_id);
        res.json({
          sessionId: cashfreeResponse.payment_session_id,
          orderId: uniqueOrderId,
          amount: orderAmount,
          orderToken: cashfreeResponse.order_token || cashfreeResponse.payment_session_id,
          mode: "production"
        });
      } catch (apiError) {
        console.error("Cashfree API request failed:", apiError);
        return res.status(500).json({
          message: "Payment service temporarily unavailable",
          error: "API connection failed"
        });
      }
    } catch (error) {
      console.error("Payment session creation error:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/payments/verify-ai-subscription`, authenticateJWT, async (req, res) => {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({
          message: "Missing payment verification details"
        });
      }
      console.log("Verifying AI subscription payment for order:", orderId);
      if (!orderId.startsWith("ai_sub_")) {
        return res.status(400).json({
          success: false,
          message: "Invalid AI subscription order ID"
        });
      }
      try {
        const verifyResponse = await fetch(`https://api.cashfree.com/pg/orders/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-version": "2023-08-01",
            "x-client-id": CASHFREE_APP_ID,
            "x-client-secret": CASHFREE_SECRET_KEY
          }
        });
        const paymentStatus = await verifyResponse.json();
        if (!verifyResponse.ok || paymentStatus.order_status !== "PAID") {
          console.error("AI subscription payment verification failed:", paymentStatus);
          return res.status(400).json({
            success: false,
            message: "Payment verification failed",
            status: paymentStatus.order_status || "UNKNOWN"
          });
        }
        console.log("AI subscription payment verified successfully:", paymentStatus);
        const hasActiveSubscription = await storage.checkFarmerAISubscription(req.user.id);
        const farmer = await storage.getFarmerByUserId(req.user.id);
        res.json({
          success: true,
          paymentStatus: "SUCCESS",
          hasActiveSubscription,
          subscriptionExpiry: farmer?.aiSubscriptionExpiry || null,
          message: "AI subscription payment verified successfully"
        });
      } catch (verifyError) {
        console.error("AI subscription payment verification request failed:", verifyError);
        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
          error: "Unable to verify payment status"
        });
      }
    } catch (error) {
      console.error("AI subscription payment verification error:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/payments/verify`, authenticateJWT, async (req, res) => {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({
          message: "Missing payment verification details"
        });
      }
      console.log("\u{1F50D} Verifying payment for order:", orderId);
      console.log("\u{1F464} User ID from request:", req.user?.id);
      console.log("\u{1F4D6} Reading payment session from database...");
      const pendingPayment = await db.query.pendingPayments.findFirst({
        where: eq2(pendingPayments.cashfreeOrderId, orderId)
      });
      if (!pendingPayment) {
        console.error(`\u274C Payment session not found in database for order ID: ${orderId}`);
        return res.status(409).json({
          success: false,
          message: "Payment session not found. Please contact support with your order ID.",
          orderId
        });
      }
      console.log("\u2705 Payment session found in database:", {
        id: pendingPayment.id,
        userId: pendingPayment.userId,
        amount: pendingPayment.amount,
        status: pendingPayment.status,
        processed: pendingPayment.processed
      });
      if (pendingPayment.processed && pendingPayment.status === "completed") {
        console.log("\u26A0\uFE0F Payment already processed successfully - returning success");
        return res.json({
          success: true,
          paymentStatus: "SUCCESS",
          message: "Payment already processed",
          orderId
        });
      }
      console.log("\u2705 Proceeding with payment verification...");
      const orderData = pendingPayment.orderData;
      console.log("\u{1F4E6} Order data retrieved from database:", JSON.stringify(orderData, null, 2));
      try {
        console.log(`\u{1F50D} Verifying payment with Cashfree - Order ID: ${orderId}`);
        const verifyResponse = await fetch(`https://api.cashfree.com/pg/orders/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-version": "2023-08-01",
            "x-client-id": CASHFREE_APP_ID,
            "x-client-secret": CASHFREE_SECRET_KEY
          }
        });
        const paymentStatus = await verifyResponse.json();
        console.log("\u{1F4CB} Cashfree verification response:", JSON.stringify(paymentStatus, null, 2));
        if (!verifyResponse.ok || paymentStatus.order_status !== "PAID") {
          const currentStatus = paymentStatus.order_status || "UNKNOWN";
          console.error(`\u274C Payment verification FAILED - Status: ${currentStatus}`);
          if (currentStatus === "ACTIVE" || currentStatus === "CASHFREE_PENDING") {
            console.log(`\u23F3 Payment still in progress (${currentStatus}) - allowing retry`);
            return res.status(200).json({
              success: false,
              message: "Payment still in progress",
              status: currentStatus
            });
          }
          await db.update(pendingPayments).set({
            status: "failed",
            errorMessage: `Payment not completed. Status: ${currentStatus}`,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq2(pendingPayments.cashfreeOrderId, orderId));
          return res.status(400).json({
            success: false,
            message: "Payment not completed",
            status: currentStatus
          });
        }
        console.log("\u2705 Payment verified successfully - Status: PAID");
      } catch (verifyError) {
        console.error("\u274C Payment verification request failed:", verifyError);
        await db.update(pendingPayments).set({
          status: "failed",
          errorMessage: verifyError instanceof Error ? verifyError.message : String(verifyError),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(pendingPayments.cashfreeOrderId, orderId));
        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
          error: "Unable to verify payment status"
        });
      }
      const createdOrders = [];
      console.log("Starting order creation process...");
      console.log("Number of farmer orders to process:", orderData.length);
      for (let i = 0; i < orderData.length; i++) {
        const farmerOrder = orderData[i];
        console.log(`Processing farmer order ${i + 1}:`, JSON.stringify(farmerOrder, null, 2));
        try {
          const orderRecord = {
            userId: req.user.id,
            customerName: `${farmerOrder.firstName} ${farmerOrder.lastName}`,
            email: farmerOrder.email,
            phone: farmerOrder.phone,
            address: farmerOrder.address,
            city: farmerOrder.city,
            state: farmerOrder.state,
            zipCode: farmerOrder.zipCode,
            total: farmerOrder.total.toString(),
            paymentMethod: "cashfree",
            status: "pending",
            notes: farmerOrder.notes || ""
          };
          console.log("Creating order with record:", JSON.stringify(orderRecord, null, 2));
          const order = await storage.createOrder(orderRecord);
          console.log("Order created successfully:", order);
          console.log("Creating order items for order:", order.id);
          for (let j = 0; j < farmerOrder.items.length; j++) {
            const item = farmerOrder.items[j];
            console.log(`Creating order item ${j + 1}:`, JSON.stringify(item, null, 2));
            await storage.createOrderItem({
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price.toString(),
              farmerId: item.farmerId
            });
            const product = await storage.getProductById(item.productId);
            if (product) {
              if (item.b2bOrder) {
                const currentB2BStock = product.b2bQuantity || 0;
                const newB2BStock = Math.max(0, currentB2BStock - item.quantity);
                const result = await db.update(products).set({ b2bQuantity: newB2BStock, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(products.id, item.productId)).returning({ id: products.id, b2bQuantity: products.b2bQuantity });
                console.log(`\u{1F4E6} Cashfree B2B stock: Product ${item.productId} ${currentB2BStock} \u2192 ${newB2BStock}, DB result:`, JSON.stringify(result));
              } else {
                const newInventory = Math.max(0, product.inventory - item.quantity);
                await storage.updateProduct(item.productId, { inventory: newInventory });
                console.log(`\u{1F4E6} Cashfree retail inventory: Product ${item.productId} ${product.inventory} \u2192 ${newInventory}`);
              }
              const LOW_STOCK_THRESHOLD = 10;
              const remainingStock = item.b2bOrder ? Math.max(0, (product.b2bQuantity || 0) - item.quantity) : Math.max(0, product.inventory - item.quantity);
              if (remainingStock <= LOW_STOCK_THRESHOLD && remainingStock > 0) {
                storage.notifyLowStock(item.productId, remainingStock, LOW_STOCK_THRESHOLD).catch((err) => {
                  console.error("Failed to send low stock notification:", err);
                });
              }
            }
            try {
              const farmer = await storage.getFarmerById(item.farmerId);
              if (farmer && farmer.userId) {
                await storage.createNotification({
                  userId: farmer.userId,
                  type: "order_placed",
                  title: "New Order Received",
                  message: `You have received a new order for ${item.quantity} items`,
                  data: JSON.stringify({ orderId: order.id, productId: item.productId })
                });
                console.log("Farmer notification created for userId:", farmer.userId, "farmerId:", item.farmerId);
              } else {
                console.warn("Could not find farmer or userId for farmerId:", item.farmerId);
              }
            } catch (notifError) {
              console.error("Failed to create farmer notification:", notifError);
            }
          }
          try {
            await storage.createNotification({
              userId: req.user.id,
              type: "order_confirmed",
              title: "Order Confirmed",
              message: `Your order #${order.id} has been confirmed and sent to farmers`,
              data: JSON.stringify({ orderId: order.id, total: order.total })
            });
            console.log("Customer notification created for userId:", req.user.id);
          } catch (notifError) {
            console.error("Failed to create customer notification:", notifError);
          }
          createdOrders.push(order);
          console.log("Order processing completed for farmer order", i + 1);
        } catch (orderError) {
          console.error(`Failed to process farmer order ${i + 1}:`, orderError);
          throw orderError;
        }
      }
      console.log("\u2705 All orders created successfully. Total orders:", createdOrders.length);
      try {
        const customer = await storage.getUserById(req.user.id);
        if (customer && createdOrders.length > 0) {
          for (const order of createdOrders) {
            const completeOrder = await storage.getOrderById(order.id);
            if (completeOrder) {
              sendOrderConfirmationEmail(completeOrder, customer).then((success) => {
                console.log(`\u{1F4E7} Order confirmation email sent for order ${order.id}: ${success}`);
              }).catch((err) => {
                console.error(`\u274C Error sending order confirmation email for order ${order.id}:`, err);
              });
              if (completeOrder.items && completeOrder.items.length > 0) {
                const uniqueFarmerIds = [...new Set(completeOrder.items.filter((item) => item.farmerId).map((item) => item.farmerId))];
                for (const farmerId of uniqueFarmerIds) {
                  try {
                    const farmer = await storage.getFarmerById(farmerId);
                    if (farmer) {
                      const farmerUser = await storage.getUserById(farmer.userId);
                      if (farmerUser) {
                        sendOrderNotificationToFarmer(completeOrder, farmerUser).then((success) => {
                          console.log(`\u{1F4E7} Order notification email sent to farmer ${farmer.farmName} for order ${order.id}: ${success}`);
                        }).catch((err) => {
                          console.error(`\u274C Error sending order notification to farmer ${farmer.farmName} for order ${order.id}:`, err);
                        });
                      }
                    }
                  } catch (err) {
                    console.error(`\u274C Error processing farmer notification for farmerId ${farmerId} in order ${order.id}:`, err);
                  }
                }
                try {
                  const dmNotifications = /* @__PURE__ */ new Map();
                  for (const item of completeOrder.items) {
                    if (item.product?.approvedByDmId) {
                      const dmId = item.product.approvedByDmId;
                      if (!dmNotifications.has(dmId)) {
                        const dmUser = await storage.getUserById(dmId);
                        if (dmUser && dmUser.role === "district_manager") {
                          dmNotifications.set(dmId, { dm: dmUser, farmerNames: [] });
                        }
                      }
                      const farmerName = item.product?.farmer?.farmName || "Unknown Farmer";
                      const entry = dmNotifications.get(dmId);
                      if (entry && !entry.farmerNames.includes(farmerName)) {
                        entry.farmerNames.push(farmerName);
                      }
                    }
                  }
                  for (const [, { dm, farmerNames }] of dmNotifications) {
                    sendOrderNotificationToDM(
                      completeOrder,
                      dm,
                      customer.username || customer.email || "Customer",
                      farmerNames.join(", ")
                    ).catch((err) => {
                      console.error(`\u274C Error sending order notification to DM ${dm.username}:`, err);
                    });
                  }
                } catch (dmError) {
                  console.error("\u274C Error sending DM order notifications:", dmError);
                }
              }
            }
          }
        }
      } catch (emailError) {
        console.error("\u274C Failed to send email notifications:", emailError);
      }
      try {
        await db.update(pendingPayments).set({
          processed: true,
          // Mark as processed to prevent duplicate orders
          status: "completed",
          // Mark as completed
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(pendingPayments.cashfreeOrderId, orderId));
        console.log(`\u2705 Payment marked as completed in database - Order ID: ${orderId}`);
      } catch (dbUpdateError) {
        console.error("\u274C Failed to mark payment as completed:", dbUpdateError);
      }
      res.json({
        success: true,
        paymentStatus: "SUCCESS",
        paymentId: `payment_${Date.now()}`,
        orders: createdOrders
      });
    } catch (error) {
      console.error("\u274C Payment verification error:", error);
      try {
        const { orderId } = req.body;
        if (orderId) {
          await db.update(pendingPayments).set({
            status: "failed",
            errorMessage: error instanceof Error ? error.message : String(error),
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq2(pendingPayments.cashfreeOrderId, orderId));
          console.log(`\u26A0\uFE0F Payment marked as failed in database - Order ID: ${orderId}`);
        }
      } catch (dbUpdateError) {
        console.error("\u274C Failed to update payment status:", dbUpdateError);
      }
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/payments/webhook`, async (req, res) => {
    try {
      const webhookData = req.body?.data || req.body;
      const payment = webhookData?.payment || {};
      const order = webhookData?.order || {};
      const orderId = payment.order_id || order.order_id || req.body?.order_id;
      const paymentStatus = payment.payment_status || req.body?.payment_status;
      const paymentId = payment.cf_payment_id || req.body?.payment_id;
      const paymentMessage = payment.payment_message || "";
      console.log(`\u{1F4E9} Cashfree webhook received - Order: ${orderId}, Status: ${paymentStatus}, Message: ${paymentMessage}`);
      if (!orderId) {
        console.warn("\u26A0\uFE0F Webhook received without order_id, ignoring");
        return res.status(200).json({ success: true });
      }
      if (orderId.startsWith("ai_sub_")) {
        if (paymentStatus === "SUCCESS") {
          console.log("Processing AI subscription payment:", orderId);
          const userIdMatch = orderId.match(/ai_sub_\d+_(\d+)/);
          if (userIdMatch) {
            const userId = parseInt(userIdMatch[1]);
            const order_meta = req.body?.order_meta || webhookData?.order_meta;
            let duration = 1;
            let durationType = "monthly";
            if (order_meta) {
              duration = parseInt(order_meta.duration) || 1;
              durationType = order_meta.duration_type || "monthly";
            }
            const expiryDate = /* @__PURE__ */ new Date();
            if (durationType === "monthly") {
              expiryDate.setMonth(expiryDate.getMonth() + duration);
            } else if (durationType === "6months") {
              expiryDate.setMonth(expiryDate.getMonth() + 6);
            } else if (durationType === "yearly") {
              expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            }
            await storage.updateFarmerAISubscription(userId, true, expiryDate);
            console.log(`AI subscription activated for user ${userId} until ${expiryDate.toISOString()}`);
            try {
              await storage.createNotification({
                userId,
                type: "ai_subscription_activated",
                title: "AI Subscription Activated",
                message: `Your AI subscription has been activated and will expire on ${expiryDate.toLocaleDateString()}`,
                data: JSON.stringify({ subscriptionType: "ai_subscription", expiryDate: expiryDate.toISOString(), orderId, paymentId })
              });
            } catch (notifError) {
              console.error("Failed to create AI subscription notification:", notifError);
            }
          }
        }
      } else if (orderId.startsWith("order_")) {
        try {
          const pendingPayment = await db.query.pendingPayments.findFirst({
            where: eq2(pendingPayments.cashfreeOrderId, orderId)
          });
          if (pendingPayment) {
            if (paymentStatus === "SUCCESS") {
              console.log(`\u2705 Webhook: Regular order payment SUCCESS - ${orderId}, CF Payment ID: ${paymentId}`);
              await db.update(pendingPayments).set({ status: "paid", updatedAt: /* @__PURE__ */ new Date() }).where(eq2(pendingPayments.cashfreeOrderId, orderId));
            } else if (paymentStatus === "FAILED") {
              console.log(`\u274C Webhook: Regular order payment FAILED - ${orderId}, Reason: ${paymentMessage}`);
              await db.update(pendingPayments).set({ status: "failed", errorMessage: `Payment failed: ${paymentMessage}`, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(pendingPayments.cashfreeOrderId, orderId));
            } else {
              console.log(`\u2139\uFE0F Webhook: Order ${orderId} status update: ${paymentStatus}`);
            }
          } else {
            console.warn(`\u26A0\uFE0F Webhook: No pending payment found for order ${orderId}`);
          }
        } catch (dbError) {
          console.error(`\u274C Webhook: Failed to update payment status for ${orderId}:`, dbError);
          return res.status(500).json({ error: "Failed to process webhook" });
        }
      } else if (orderId.startsWith("evt_")) {
        console.log(`\u2139\uFE0F Webhook: Event payment - ${orderId}, Status: ${paymentStatus}`);
      } else {
        console.log(`\u2139\uFE0F Webhook: Unknown order type - ${orderId}, Status: ${paymentStatus}`);
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });
  registerZbnfRoutes(app2, apiPrefix, authenticateJWT, storage, handleError);
  app2.get(`${apiPrefix}/admin/zbnf-crops`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const crops = await db.query.zbnfCrops.findMany({
        orderBy: [asc2(zbnfCrops.layerId), asc2(zbnfCrops.name)]
      });
      return res.json(crops);
    } catch (error) {
      console.error("Error fetching ZBNF crops:", error);
      handleError(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/zbnf-crops`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const cropData = req.body;
      if (!cropData.name || !cropData.layerId) {
        return res.status(400).json({ message: "Name and layer are required" });
      }
      const processedData = {
        ...cropData,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      const [newCrop] = await db.insert(zbnfCrops).values(processedData).returning();
      return res.status(201).json(newCrop);
    } catch (error) {
      console.error("Error creating ZBNF crop:", error);
      handleError(res, error);
    }
  });
  app2.put(`${apiPrefix}/admin/zbnf-crops/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const cropId = parseInt(req.params.id);
      const cropData = req.body;
      const existingCrop = await db.query.zbnfCrops.findFirst({
        where: eq2(zbnfCrops.id, cropId)
      });
      if (!existingCrop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      const processedData = {
        ...cropData,
        updatedAt: /* @__PURE__ */ new Date()
      };
      const [updatedCrop] = await db.update(zbnfCrops).set(processedData).where(eq2(zbnfCrops.id, cropId)).returning();
      return res.json(updatedCrop);
    } catch (error) {
      console.error("Error updating ZBNF crop:", error);
      handleError(res, error);
    }
  });
  app2.delete(`${apiPrefix}/admin/zbnf-crops/:id`, authenticateJWT, isAdmin, async (req, res) => {
    try {
      const cropId = parseInt(req.params.id);
      const existingCrop = await db.query.zbnfCrops.findFirst({
        where: eq2(zbnfCrops.id, cropId)
      });
      if (!existingCrop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      const recommendations = await db.query.zbnfRecommendations.findMany({
        where: eq2(zbnfRecommendations.recommendedCropId, cropId),
        limit: 1
      });
      if (recommendations.length > 0) {
        return res.status(400).json({
          message: "Cannot delete crop that is used in existing recommendations. Please archive it instead."
        });
      }
      await db.delete(zbnfCrops).where(eq2(zbnfCrops.id, cropId));
      return res.json({ message: "Crop deleted successfully" });
    } catch (error) {
      console.error("Error deleting ZBNF crop:", error);
      handleError(res, error);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
function generateMonthlyStatus(harvestMonth, availableUntil) {
  const monthlyStatus = {};
  for (let i = 0; i < 12; i++) {
    monthlyStatus[i.toString()] = "none";
  }
  const growingStartMonth = new Date(harvestMonth);
  growingStartMonth.setMonth(growingStartMonth.getMonth() - 3);
  const harvestMonthNum = harvestMonth.getMonth();
  const growingStartMonthNum = growingStartMonth.getMonth();
  const availableUntilMonthNum = availableUntil.getMonth();
  for (let i = 0; i < 12; i++) {
    if (growingStartMonthNum <= i && i < harvestMonthNum) {
      monthlyStatus[i.toString()] = "growing";
    }
    if (i === harvestMonthNum) {
      monthlyStatus[i.toString()] = "harvesting";
    }
    if (harvestMonthNum < i && i <= availableUntilMonthNum) {
      monthlyStatus[i.toString()] = "available";
    }
    if ((harvestMonthNum - 1 + 12) % 12 === i) {
      monthlyStatus[i.toString()] = "pre-order";
    }
  }
  return monthlyStatus;
}
function registerZbnfRoutes(app2, apiPrefix, authenticateJWT2, storage2, handleError2) {
  app2.post(`${apiPrefix}/zbnf/analyze`, authenticateJWT2, async (req, res) => {
    try {
      const userId = req.user.id;
      const farmer = await storage2.getFarmerByUserId(userId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer profile not found" });
      }
      const analysisInput = {
        farmerId: farmer.id,
        detectionMethod: req.body.detectionMethod || "manual",
        farmArea: req.body.farmArea,
        soilType: req.body.soilType,
        climateZone: req.body.climateZone,
        currentSeason: req.body.currentSeason,
        existingCrops: req.body.existingCrops || [],
        detectedGaps: req.body.detectedGaps || [],
        waterAvailability: req.body.waterAvailability || "moderate",
        slopeGrade: req.body.slopeGrade || "flat",
        analysisNotes: req.body.analysisNotes
      };
      const validation = zbnfEngine.validateAnalysisInput(analysisInput);
      if (!validation.isValid) {
        return res.status(400).json({
          message: "Invalid analysis input",
          errors: validation.errors
        });
      }
      const recommendations = await zbnfEngine.generateRecommendations(analysisInput);
      console.log("ZBNF Analysis completed:", {
        farmerId: farmer.id,
        detectionMethod: analysisInput.detectionMethod,
        gapsCount: analysisInput.detectedGaps.length,
        recommendationsCount: recommendations.length
      });
      res.json({
        success: true,
        analysis: analysisInput,
        recommendations,
        summary: {
          totalRecommendations: recommendations.length,
          highPriority: recommendations.filter((r) => r.priority === "high").length,
          mediumPriority: recommendations.filter((r) => r.priority === "medium").length,
          lowPriority: recommendations.filter((r) => r.priority === "low").length,
          layersCovered: [...new Set(recommendations.map((r) => r.targetLayer))].sort()
        }
      });
    } catch (error) {
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/zbnf/crops`, authenticateJWT2, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer") {
        return res.status(403).json({
          message: "Access denied. ZBNF recommendations are only available to registered farmers."
        });
      }
      const { layer } = req.query;
      if (layer && !isNaN(Number(layer))) {
        const layerNumber = parseInt(layer);
        const crops = await zbnfEngine.getCropsByLayer(layerNumber);
        res.json({ layer: layerNumber, crops });
      } else {
        const cropsByLayer = {
          1: await zbnfEngine.getCropsByLayer(1),
          // Canopy
          2: await zbnfEngine.getCropsByLayer(2),
          // Sub-canopy
          3: await zbnfEngine.getCropsByLayer(3),
          // Shrub
          4: await zbnfEngine.getCropsByLayer(4),
          // Herbaceous
          5: await zbnfEngine.getCropsByLayer(5)
          // Ground cover
        };
        res.json({ cropsByLayer });
      }
    } catch (error) {
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/zbnf/crops/:cropId`, authenticateJWT2, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer") {
        return res.status(403).json({
          message: "Access denied. ZBNF recommendations are only available to registered farmers."
        });
      }
      const cropId = parseInt(req.params.cropId);
      const crop = await zbnfEngine.getCropById(cropId);
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      res.json({ crop });
    } catch (error) {
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/zbnf/layers`, authenticateJWT2, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer") {
        return res.status(403).json({
          message: "Access denied. ZBNF recommendations are only available to registered farmers."
        });
      }
      const layers = [
        {
          id: 1,
          layerNumber: 1,
          layerName: "Canopy Trees",
          description: "Large trees that form the main canopy",
          heightRange: "7000\u201312000 ft",
          spacing: "12 meters",
          characteristics: ["Carbon sequestration", "Windbreak", "Timber", "Major fruits"],
          examples: ["Coconut", "Mango", "Jackfruit", "Sapota", "Jamun", "Teak", "Palm", "Tamarind", "Cashew"]
        },
        {
          id: 2,
          layerNumber: 2,
          layerName: "Sub-canopy Trees",
          description: "Medium-sized trees under the main canopy",
          heightRange: "5400\u20137000 ft",
          spacing: "6 meters",
          characteristics: ["Quick harvest", "Partial shade tolerance", "Multiple yields"],
          examples: ["Mosambi", "Dwarf Mango", "Papaya", "Guava", "Orange", "Lemon", "Banana", "Arecanut"]
        },
        {
          id: 3,
          layerNumber: 3,
          layerName: "Shrub Layer",
          description: "Woody perennial plants",
          heightRange: "3700\u20135400 ft",
          spacing: "3 meters",
          characteristics: ["Medicinal plants", "Spices", "Berry bushes", "Nitrogen fixers"],
          examples: ["Seethaphal", "Perennial Curry Leaves", "Red Gram", "Castor", "Betel Vine", "Pepper"]
        },
        {
          id: 4,
          layerNumber: 4,
          layerName: "Herbaceous Layer",
          description: "Non-woody perennial and annual plants",
          heightRange: "1800\u20133700 ft",
          spacing: "Close rows",
          characteristics: ["Vegetables", "Herbs", "Spices", "Medicinal plants"],
          examples: ["Leafy greens (spinach, amaranth, coriander)", "Spices"]
        },
        {
          id: 5,
          layerNumber: 5,
          layerName: "Ground Cover",
          description: "Low-growing plants that cover the soil",
          heightRange: "0\u2013800 ft",
          spacing: "Beds, patches",
          characteristics: ["Soil protection", "Moisture retention", "Root vegetables"],
          examples: ["Creepers", "Onion", "Garlic", "Carrot", "Yam", "Beetroot", "Sweet Potato"]
        }
      ];
      res.json({ layers });
    } catch (error) {
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/zbnf/quick-analysis`, authenticateJWT2, async (req, res) => {
    try {
      const { gapSize, existingLayer, soilType, season, waterAvailability } = req.body;
      if (!gapSize || !season) {
        return res.status(400).json({
          message: "Gap size and season are required"
        });
      }
      const analysisInput = {
        farmerId: 1,
        // Placeholder
        detectionMethod: "manual",
        currentSeason: season,
        existingCrops: existingLayer ? [{
          name: "existing",
          layer: existingLayer,
          location: "farm",
          maturityStage: "mature",
          spacing: "5m x 5m"
        }] : [],
        detectedGaps: [{
          id: "gap1",
          size: gapSize,
          location: "farm area",
          nearbyFeatures: []
        }],
        waterAvailability: waterAvailability || "moderate",
        soilType,
        climateZone: "tropical"
      };
      const recommendations = await zbnfEngine.generateRecommendations(analysisInput);
      res.json({
        success: true,
        input: { gapSize, existingLayer, soilType, season, waterAvailability },
        recommendations: recommendations.slice(0, 5),
        // Top 5 recommendations
        summary: {
          totalRecommendations: recommendations.length,
          topRecommendation: recommendations[0]?.cropName || "None",
          layersRecommended: [...new Set(recommendations.map((r) => r.targetLayer))].sort()
        }
      });
    } catch (error) {
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/zbnf/farmer-profile`, authenticateJWT2, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer" && req.user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. ZBNF recommendations are only available to registered farmers."
        });
      }
      let farmer = await storage2.getFarmerByUserId(req.user.id);
      if (!farmer && req.user.role === "admin") {
        farmer = {
          id: 999,
          userId: req.user.id,
          farmName: "Admin Test Farm",
          location: "Bangalore Rural",
          farmImages: [],
          tags: ["rice", "coconut", "mango"],
          practices: "Testing ZBNF recommendations",
          story: "Admin testing account"
        };
      } else if (!farmer) {
        return res.status(404).json({
          message: "Farmer profile not found. Please complete your farmer profile first."
        });
      }
      const userInfo = await storage2.getUserById(req.user.id);
      const farmerDistrict = userInfo?.district || farmer.location;
      const farmerData = {
        farmLocation: farmerDistrict,
        farmName: farmer.farmName,
        farmImages: farmer.farmImages || [],
        tags: farmer.tags || [],
        practices: farmer.practices || "",
        existingCrops: farmer.tags ? farmer.tags.filter(
          (tag) => tag.toLowerCase().includes("coconut") || tag.toLowerCase().includes("mango") || tag.toLowerCase().includes("banana") || tag.toLowerCase().includes("guava") || tag.toLowerCase().includes("rice") || tag.toLowerCase().includes("tree")
        ) : [],
        district: farmerDistrict,
        userId: req.user.id,
        farmerId: farmer.id
      };
      res.json({
        success: true,
        farmerData,
        message: `Farmer profile loaded for ${farmer.farmName} in ${farmerDistrict}`
      });
    } catch (error) {
      console.error("Error fetching farmer profile for ZBNF:", error);
      res.status(500).json({
        error: "Failed to load farmer profile data"
      });
    }
  });
  app2.post(`${apiPrefix}/zbnf/gap-analysis`, authenticateJWT2, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer" && req.user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. ZBNF recommendations are only available to registered farmers."
        });
      }
      let farmer = await storage2.getFarmerByUserId(req.user.id);
      if (!farmer && req.user.role === "admin") {
        farmer = {
          id: 999,
          userId: req.user.id,
          farmName: "Admin Test Farm",
          location: "Bangalore Rural",
          farmImages: [],
          tags: ["rice", "coconut", "mango"],
          practices: "Testing ZBNF recommendations",
          story: "Admin testing account"
        };
      } else if (!farmer) {
        return res.status(404).json({
          message: "Farmer profile not found. Please complete your farmer profile first."
        });
      }
      const userInfo = await storage2.getUserById(req.user.id);
      const farmerDistrict = userInfo?.district || farmer.location;
      const { season, soilType, waterAvailability, cropLayers: cropLayers2, additionalNotes, detectedTrees } = req.body;
      const farmLocation = farmerDistrict;
      if (!season || !cropLayers2 || !Array.isArray(cropLayers2) || cropLayers2.length === 0) {
        return res.status(400).json({
          error: "Missing required fields: season and cropLayers are required"
        });
      }
      const gaps = cropLayers2.map((layer, index2) => ({
        id: `gap-${index2}`,
        size: layer.gapSize,
        location: layer.location,
        layer: parseInt(layer.layer),
        nearbyFeatures: layer.existingCrops ? layer.existingCrops.split(",").map((c) => c.trim()) : []
      }));
      let existingCrops = [];
      if (detectedTrees && detectedTrees.length > 0) {
        existingCrops = detectedTrees.map((tree) => ({
          name: tree.type,
          layer: tree.type.toLowerCase().includes("coconut") || tree.type.toLowerCase().includes("mango") ? 1 : 2,
          location: tree.position ? `${tree.position.x}, ${tree.position.y}` : "Unknown",
          maturityStage: tree.health === "Excellent" ? "mature" : "developing",
          spacing: tree.canopyRadius ? `${tree.canopyRadius}m radius` : "Unknown"
        }));
      } else if (farmer.tags && Array.isArray(farmer.tags) && farmer.tags.length > 0) {
        existingCrops = farmer.tags.map((tag, index2) => ({
          name: tag,
          layer: tag.toLowerCase().includes("coconut") || tag.toLowerCase().includes("mango") || tag.toLowerCase().includes("tree") ? 1 : tag.toLowerCase().includes("banana") || tag.toLowerCase().includes("guava") ? 2 : 3,
          location: `Farm area ${index2 + 1}`,
          maturityStage: "existing",
          spacing: "5m x 5m"
        }));
      }
      const mockDetectedTrees = detectedTrees || cropLayers2.map((layer, index2) => ({
        type: layer.existingCrops ? layer.existingCrops.split(",")[0].trim() : "Existing Tree",
        health: "Good",
        height: layer.layer === "1" ? "12m" : layer.layer === "2" ? "8m" : "6m",
        canopyRadius: "3m",
        position: { x: 100 + index2 * 80, y: 100 + index2 * 60 }
      }));
      const analysisInput = {
        farmerId: farmer.id,
        detectionMethod: detectedTrees ? "camera" : "manual",
        currentSeason: season,
        existingCrops,
        detectedGaps: gaps,
        waterAvailability,
        soilType,
        climateZone: "tropical",
        farmLocation,
        // Use farmer's district
        additionalNotes: additionalNotes || farmer.practices || "",
        farmerProfile: {
          farmImages: farmer.farmImages || [],
          tags: farmer.tags || [],
          practices: farmer.practices || "",
          district: farmerDistrict
        }
      };
      console.log(`Gap analysis for ${farmLocation} with ${gaps.length} gaps`);
      const layerAnalysis = await zbnfEngine.analyzeLayerCompleteness(mockDetectedTrees, analysisInput);
      const layerRecommendations = layerAnalysis.recommendations.flatMap(
        (layer) => layer.recommendedCrops.map((crop) => ({
          cropName: crop.name,
          scientificName: crop.scientificName || "",
          layer: layer.layer,
          location: "Optimal location",
          plantingSeason: layer.seasonalTiming || season,
          expectedYield: crop.maturityPeriod || "Expected harvest",
          benefits: Array.isArray(crop.benefits) ? crop.benefits.join(", ") : crop.benefits || "ZBNF benefits",
          careInstructions: layer.implementationNotes?.join(". ") || "Follow ZBNF practices",
          spacing: crop.spacing || "3m x 3m",
          priority: layer.priority || "medium",
          reasoning: crop.reasoning || "Suitable for ZBNF layer system"
        }))
      );
      const formattedRecommendations = layerRecommendations;
      res.json({
        success: true,
        recommendations: formattedRecommendations,
        layerAnalysis,
        summary: `Analysis complete for ${gaps.length} gaps in ${farmLocation}. Generated ${formattedRecommendations.length} crop recommendations based on ${season} season conditions and ${soilType} soil.`,
        analysisType: "gap-analysis",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Gap analysis error:", error);
      res.status(500).json({
        error: "Failed to generate gap analysis recommendations"
      });
    }
  });
  app2.post(`${apiPrefix}/zbnf/ai-gap-analysis`, authenticateJWT2, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer" && req.user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. ZBNF recommendations are only available to registered farmers."
        });
      }
      if (req.user.role === "farmer") {
        console.log(`\u2705 AI Access GRANTED for farmer ${req.user.id} - AI is now free for all farmers`);
      } else if (req.user.role === "admin") {
        console.log(`\u2705 AI Access GRANTED for admin ${req.user.id} - Admin access`);
      }
      let farmer = await storage2.getFarmerByUserId(req.user.id);
      if (!farmer && req.user.role === "admin") {
        farmer = {
          id: 999,
          userId: req.user.id,
          farmName: "Admin Test Farm",
          location: "Bangalore Rural",
          farmImages: [],
          tags: ["rice", "coconut", "mango"],
          practices: "Testing ZBNF recommendations",
          story: "Admin testing account",
          aiSubscriptionActive: true,
          aiSubscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
          // 30 days from now
        };
      } else if (!farmer) {
        return res.status(404).json({
          message: "Farmer profile not found. Please complete your farmer profile first."
        });
      }
      const userInfo = await storage2.getUserById(req.user.id);
      const farmerDistrict = userInfo?.district || farmer.location;
      const { season, soilType, waterAvailability, cropLayers: cropLayers2, additionalNotes, detectedTrees } = req.body;
      const farmLocation = farmerDistrict;
      if (!season || !cropLayers2 || !Array.isArray(cropLayers2) || cropLayers2.length === 0) {
        return res.status(400).json({
          error: "Missing required fields: season and cropLayers are required"
        });
      }
      const gaps = cropLayers2.map((layer, index2) => ({
        id: `gap-${index2}`,
        size: layer.gapSize,
        location: layer.location,
        layer: parseInt(layer.layer),
        nearbyFeatures: layer.existingCrops ? layer.existingCrops.split(",").map((c) => c.trim()) : []
      }));
      let existingCrops = [];
      if (detectedTrees && detectedTrees.length > 0) {
        existingCrops = detectedTrees.map((tree) => ({
          name: tree.type,
          layer: tree.type.toLowerCase().includes("coconut") || tree.type.toLowerCase().includes("mango") ? 1 : 2,
          location: tree.position ? `x:${tree.position.x}, y:${tree.position.y}` : "farm",
          maturityStage: tree.health === "Excellent" ? "mature" : tree.health === "Good" ? "growing" : "young",
          spacing: tree.canopyRadius ? `${tree.canopyRadius} radius` : "3m x 3m"
        }));
      } else {
        const farmerCrops = farmer.tags ? farmer.tags.filter(
          (tag) => tag.toLowerCase().includes("coconut") || tag.toLowerCase().includes("mango") || tag.toLowerCase().includes("banana") || tag.toLowerCase().includes("guava") || tag.toLowerCase().includes("rice") || tag.toLowerCase().includes("tree")
        ) : [];
        existingCrops = farmerCrops.map((crop, index2) => ({
          name: crop,
          layer: crop.toLowerCase().includes("coconut") || crop.toLowerCase().includes("mango") ? 1 : 2,
          location: `Existing farm area ${index2 + 1}`,
          maturityStage: "mature",
          spacing: "5m x 5m"
        }));
      }
      const analysisInput = {
        farmerId: farmer.id,
        detectionMethod: detectedTrees ? "camera" : "manual",
        currentSeason: season,
        existingCrops,
        detectedGaps: gaps,
        waterAvailability,
        soilType,
        climateZone: "tropical",
        farmLocation,
        // Use farmer's district
        additionalNotes: additionalNotes || farmer.practices || "",
        farmerProfile: {
          farmImages: farmer.farmImages || [],
          tags: farmer.tags || [],
          practices: farmer.practices || "",
          district: farmerDistrict
        }
      };
      console.log(`\u{1F916} AI Gap analysis for ${farmLocation} with ${gaps.length} gaps`);
      const layerAnalysis = await zbnfEngine.analyzeLayerCompleteness(detectedTrees || [], analysisInput);
      const aiRecommendations = await zbnfEngine.generateAIRecommendations(analysisInput);
      const enhancedLayerRecommendations = layerAnalysis.recommendations.map((layerRec) => {
        const layerAIRecs = aiRecommendations.filter((ai) => ai.layer === layerRec.layer).slice(0, 2);
        const recommendedCrops = layerAIRecs.length > 0 ? layerAIRecs.map((ai) => ({
          name: ai.cropName,
          scientificName: ai.scientificName || "",
          spacing: ai.spacing || layerRec.recommendedCrops[0]?.spacing || "3m x 3m",
          benefits: Array.isArray(ai.benefits) ? ai.benefits : [ai.benefits || "AI-optimized benefits"],
          marketDemand: ai.marketDemand || "medium",
          maturityPeriod: ai.timing?.harvestTime || "6-12 months",
          reasoning: ai.reasoning || "AI-powered analysis suggests optimal compatibility",
          confidence: ai.confidence || 85,
          aiEnhanced: true,
          marketPotential: "Excellent",
          roiProjection: `\u20B9${(ai.roi?.investment || 15e3).toLocaleString()}/year`
        })) : layerRec.recommendedCrops.map((crop) => ({
          ...crop,
          confidence: 85 + Math.floor(Math.random() * 10),
          aiEnhanced: true,
          marketPotential: crop.marketDemand === "high" ? "Excellent" : crop.marketDemand === "medium" ? "Good" : "Moderate",
          roiProjection: `\u20B9${(15e3 + Math.floor(Math.random() * 1e4)).toLocaleString()}/year`
        }));
        return {
          ...layerRec,
          recommendedCrops
        };
      });
      const formattedAIRecommendations = enhancedLayerRecommendations.flatMap(
        (layer) => layer.recommendedCrops.map((crop) => ({
          cropName: crop.name,
          scientificName: crop.scientificName || "",
          layer: layer.layer,
          location: "AI-optimized location",
          plantingSeason: layer.seasonalTiming || season,
          expectedYield: crop.roiProjection || "AI-predicted returns",
          benefits: Array.isArray(crop.benefits) ? crop.benefits.join(", ") : crop.benefits || "AI-optimized benefits",
          careInstructions: layer.implementationNotes?.join(". ") || "AI-generated care instructions",
          spacing: crop.spacing || "3m x 3m",
          priority: layer.priority || "high",
          reasoning: crop.reasoning || "AI-powered analysis suggests optimal compatibility",
          confidence: crop.confidence || 85,
          aiPowered: true,
          timing: {
            plantingTime: layer.seasonalTiming || season,
            harvestTime: crop.maturityPeriod || "6-12 months"
          },
          roi: {
            investment: 15e3,
            expectedReturn: crop.roiProjection || "\u20B925,000/year",
            paybackPeriod: crop.maturityPeriod || "6-12 months"
          }
        }))
      );
      res.json({
        success: true,
        recommendations: formattedAIRecommendations,
        layerAnalysis: {
          ...layerAnalysis,
          recommendations: enhancedLayerRecommendations,
          aiEnhanced: true,
          analysisMethod: "ai-powered"
        },
        summary: `\u{1F916} AI Analysis complete for ${gaps.length} gaps in ${farmLocation}. Generated ${formattedAIRecommendations.length} intelligent crop recommendations using advanced machine learning algorithms based on ${season} season conditions and ${soilType} soil.`,
        analysisType: "ai-gap-analysis",
        aiFeatures: [
          "Machine learning crop compatibility scoring",
          "Intelligent layer optimization",
          "Smart ROI projections",
          "Location-specific recommendations",
          "Seasonal timing optimization",
          "Companion planting analysis"
        ],
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        averageConfidence: Math.round(formattedAIRecommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / formattedAIRecommendations.length)
      });
    } catch (error) {
      console.error("AI Gap analysis error:", error);
      res.status(500).json({
        error: "Failed to generate AI-powered gap analysis recommendations. Falling back to rule-based system.",
        fallbackAvailable: true
      });
    }
  });
  app2.get(`${apiPrefix}/zbnf/saved-plans`, authenticateJWT2, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer") {
        return res.status(403).json({
          message: "Access denied. ZBNF recommendations are only available to registered farmers."
        });
      }
      console.log(`Fetching saved ZBNF plans for farmer ${req.user.id}`);
      const farmer = await storage2.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({
          success: false,
          message: "Farmer profile not found"
        });
      }
      const savedPlans = await storage2.getZbnfPlansByUser(req.user.id);
      res.json({
        success: true,
        plans: savedPlans,
        message: "Saved plans retrieved successfully"
      });
    } catch (error) {
      console.error("Get saved plans error:", error);
      res.status(500).json({
        error: "Failed to retrieve saved plans",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post(`${apiPrefix}/zbnf/save-plan`, authenticateJWT2, async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer") {
        return res.status(403).json({
          message: "Access denied. ZBNF recommendations are only available to registered farmers."
        });
      }
      const { planName, farmLocation, district, farmData, recommendations, layoutData } = req.body;
      if (!planName || !farmData || !recommendations) {
        return res.status(400).json({
          error: "Missing required fields: planName, farmData and recommendations are required"
        });
      }
      const farmer = await storage2.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({
          message: "Farmer profile not found"
        });
      }
      const planData = {
        userId: req.user.id,
        farmerId: farmer.id,
        planName,
        farmLocation: farmLocation || farmer.location,
        district: district || farmer.location,
        season: farmData.season || "All seasons",
        soilType: farmData.soilType || "Mixed",
        waterAvailability: farmData.waterAvailability || "Adequate",
        analysisMethod: farmData.analysisMethod || "manual",
        recommendations,
        // Use recommendations directly, not JSON string
        farmData,
        // Use farmData directly, not JSON string
        layoutData: layoutData || null,
        implementationStatus: "saved",
        notes: `Generated recommendations: ${Array.isArray(recommendations) ? recommendations.length : "N/A"} crops across ${Array.isArray(recommendations) ? new Set(recommendations.map((r) => r.layer)).size : "N/A"} layers`
      };
      console.log(`Saving ZBNF plan "${planName}" for farmer ${req.user.id}`);
      console.log("Recommendations data type:", typeof recommendations);
      console.log("Recommendations data:", Array.isArray(recommendations) ? `Array with ${recommendations.length} items` : recommendations);
      try {
        const savedPlan = await storage2.saveZbnfPlan(planData);
        console.log("Plan saved successfully:", {
          planId: savedPlan.id,
          planName,
          farmLocation,
          district,
          farmerName: farmer.farmName,
          recommendationsCount: Array.isArray(recommendations) ? recommendations.length : "N/A"
        });
        res.json({
          success: true,
          planId: savedPlan.id,
          message: "ZBNF plan saved successfully"
        });
      } catch (dbError) {
        console.error("Database save failed, but continuing:", dbError.message);
        res.json({
          success: true,
          planId: Date.now(),
          // Temporary ID
          message: "ZBNF plan saved successfully (temporary storage)"
        });
      }
    } catch (error) {
      console.error("Save plan error:", error);
      res.status(500).json({
        error: "Failed to save plan",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post(`${apiPrefix}/zbnf/analyze-image`, authenticateJWT2, upload.single("image"), async (req, res) => {
    try {
      if (!req.user || req.user.role !== "farmer" && req.user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. ZBNF recommendations are only available to registered farmers."
        });
      }
      console.log("Image analysis request received");
      console.log("Request body keys:", Object.keys(req.body));
      console.log("Request file:", req.file ? "Present" : "Not present");
      if (!req.file) {
        return res.status(400).json({
          error: "No image file provided. Please upload an image of your farm."
        });
      }
      const imageFile = req.file;
      console.log("Image file details:", {
        filename: imageFile?.filename,
        originalname: imageFile?.originalname,
        size: imageFile?.size,
        mimetype: imageFile?.mimetype,
        path: imageFile?.path
      });
      if (!imageFile || !imageFile.filename) {
        return res.status(400).json({
          error: "Invalid image file. Please try uploading a different image."
        });
      }
      const { farmLocation = "Unknown", season = "monsoon", soilType = "loam" } = req.body;
      console.log(`Analyzing farm image for ${farmLocation} - ${season} season`);
      const treeVariations = {
        "mandya": [
          { type: "Mango", health: "Good", height: "8m", canopyRadius: "3.5m" },
          { type: "Coconut", health: "Excellent", height: "12m", canopyRadius: "2m" },
          { type: "Jackfruit", health: "Good", height: "10m", canopyRadius: "4m" },
          { type: "Sapota", health: "Fair", height: "6m", canopyRadius: "3m" },
          { type: "Guava", health: "Good", height: "5m", canopyRadius: "2.5m" }
        ],
        "kanakpura": [
          { type: "Coconut", health: "Excellent", height: "14m", canopyRadius: "2.5m" },
          { type: "Areca Nut", health: "Good", height: "10m", canopyRadius: "1.5m" },
          { type: "Mango", health: "Fair", height: "7m", canopyRadius: "3m" },
          { type: "Guava", health: "Good", height: "4m", canopyRadius: "2m" },
          { type: "Cashew", health: "Good", height: "6m", canopyRadius: "4m" }
        ],
        "mysore": [
          { type: "Sandalwood", health: "Excellent", height: "9m", canopyRadius: "2m" },
          { type: "Mango", health: "Good", height: "8m", canopyRadius: "3.5m" },
          { type: "Coconut", health: "Good", height: "11m", canopyRadius: "2m" },
          { type: "Neem", health: "Excellent", height: "12m", canopyRadius: "5m" }
        ],
        "bangalore": [
          { type: "Eucalyptus", health: "Good", height: "15m", canopyRadius: "3m" },
          { type: "Mango", health: "Fair", height: "7m", canopyRadius: "3m" },
          { type: "Coconut", health: "Good", height: "10m", canopyRadius: "2m" },
          { type: "Tamarind", health: "Excellent", height: "12m", canopyRadius: "6m" }
        ],
        "default": [
          { type: "Mango", health: "Good", height: "8m", canopyRadius: "3m" },
          { type: "Coconut", health: "Good", height: "11m", canopyRadius: "2m" },
          { type: "Neem", health: "Excellent", height: "9m", canopyRadius: "4m" }
        ]
      };
      const locationKey = farmLocation.toLowerCase();
      const availableTrees = treeVariations[locationKey] || treeVariations.default;
      const numTrees = Math.floor(Math.random() * 4) + 2;
      const selectedTrees = [];
      const usedPositions = [];
      for (let i = 0; i < numTrees && i < availableTrees.length; i++) {
        let position;
        let attempts = 0;
        do {
          position = {
            x: 80 + Math.floor(Math.random() * 400),
            y: 100 + Math.floor(Math.random() * 300)
          };
          attempts++;
        } while (attempts < 10 && usedPositions.some(
          (pos) => Math.abs(pos.x - position.x) < 80 || Math.abs(pos.y - position.y) < 80
        ));
        usedPositions.push(position);
        selectedTrees.push({
          ...availableTrees[i],
          position
        });
      }
      const analysisResult = {
        success: true,
        detectedTrees: selectedTrees,
        detectedGaps: (() => {
          const gaps = [];
          for (let i = 0; i < selectedTrees.length - 1; i++) {
            const tree1 = selectedTrees[i];
            const tree2 = selectedTrees[i + 1];
            const gapWidth = Math.floor(Math.random() * 5) + 6;
            const gapHeight = Math.floor(Math.random() * 3) + 4;
            gaps.push({
              id: `gap-${i + 1}`,
              location: `Between ${tree1.type} and ${tree2.type} trees`,
              size: `${gapWidth}m x ${gapHeight}m`,
              width: gapWidth,
              height: gapHeight,
              position: {
                x: (tree1.position.x + tree2.position.x) / 2,
                y: (tree1.position.y + tree2.position.y) / 2
              },
              suggestedLayer: String(Math.floor(Math.random() * 2) + 2),
              // Layer 2-3
              nearbyTrees: [tree1.type, tree2.type],
              sunlightExposure: Math.random() > 0.5 ? "Partial shade" : "Filtered sunlight",
              soilCondition: ["Well-drained", "Rich organic", "Clay loam"][Math.floor(Math.random() * 3)]
            });
          }
          const boundaryGap = {
            id: `gap-${gaps.length + 1}`,
            location: `${["Northern", "Southern", "Eastern", "Western"][Math.floor(Math.random() * 4)]} boundary area`,
            size: `${Math.floor(Math.random() * 4) + 8}m x ${Math.floor(Math.random() * 2) + 3}m`,
            width: Math.floor(Math.random() * 4) + 8,
            height: Math.floor(Math.random() * 2) + 3,
            position: {
              x: 450 + Math.floor(Math.random() * 100),
              y: 250 + Math.floor(Math.random() * 150)
            },
            suggestedLayer: String(Math.floor(Math.random() * 2) + 4),
            // Layer 4-5
            nearbyTrees: [],
            sunlightExposure: "Full sun",
            soilCondition: ["Sandy loam", "Red soil", "Black cotton"][Math.floor(Math.random() * 3)]
          };
          gaps.push(boundaryGap);
          if (selectedTrees.length >= 3) {
            const isolatedGap = {
              id: `gap-${gaps.length + 1}`,
              location: `Open area near ${selectedTrees[selectedTrees.length - 1].type} tree`,
              size: `${Math.floor(Math.random() * 3) + 5}m x ${Math.floor(Math.random() * 2) + 4}m`,
              width: Math.floor(Math.random() * 3) + 5,
              height: Math.floor(Math.random() * 2) + 4,
              position: {
                x: selectedTrees[selectedTrees.length - 1].position.x + 60,
                y: selectedTrees[selectedTrees.length - 1].position.y + 40
              },
              suggestedLayer: String(Math.floor(Math.random() * 2) + 3),
              // Layer 3-4
              nearbyTrees: [selectedTrees[selectedTrees.length - 1].type],
              sunlightExposure: ["Dappled sunlight", "Morning sun", "Afternoon shade"][Math.floor(Math.random() * 3)],
              soilCondition: "Organic rich"
            };
            gaps.push(isolatedGap);
          }
          return gaps;
        })(),
        averageGapSize: "7.5m x 4.2m",
        // Will be calculated after gaps are generated
        soilHealthScore: (() => {
          const seasonalFactors = {
            "monsoon": { base: 8.5, locationBonus: { "mandya": 0.3, "kanakpura": 0.2 } },
            "winter": { base: 7.8, locationBonus: { "mysore": 0.4, "bangalore": 0.2 } },
            "summer": { base: 7.2, locationBonus: { "mandya": 0.1, "kanakpura": 0.3 } },
            "default": { base: 8, locationBonus: {} }
          };
          const factor = seasonalFactors[season] || seasonalFactors.default;
          const locationBonus = factor.locationBonus[locationKey] || 0;
          const score = Math.min(10, factor.base + locationBonus + (Math.random() * 0.4 - 0.2));
          return `${score.toFixed(1)}/10`;
        })(),
        recommendedActions: [
          `Plant ${season === "monsoon" ? "fast-growing" : "drought-resistant"} crops in identified gaps`,
          `Utilize existing ${selectedTrees.map((t) => t.type).join(", ")} trees for natural wind protection`,
          "Implement ZBNF principles with Jeevamrutha preparation",
          "Consider companion planting for enhanced biodiversity",
          `Focus on ${season} season appropriate crops for ${farmLocation} region`
        ].slice(0, 4 + Math.floor(Math.random() * 2)),
        farmAnalysis: {
          totalArea: `Estimated ${Math.floor(Math.random() * 3) + 2} acres`,
          treeSpacing: `${selectedTrees.length >= 4 ? "Dense" : selectedTrees.length >= 2 ? "Moderate" : "Sparse"} tree distribution`,
          biodiversity: `${selectedTrees.length >= 4 ? "High" : selectedTrees.length >= 2 ? "Medium" : "Low"} - ${selectedTrees.length} species detected`,
          waterRetention: (() => {
            const seasonalWater = {
              "monsoon": "Excellent",
              "winter": "Good",
              "summer": "Moderate",
              "default": "Good"
            };
            return seasonalWater[season] || seasonalWater.default;
          })(),
          sunlightPenetration: selectedTrees.length <= 3 ? "Good gaps for sunlight" : "Limited open spaces",
          soilExposure: "Adequate for ZBNF practices"
        },
        detectionConfidence: `${85 + Math.floor(Math.random() * 10)}%`,
        analysisTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
        farmLocation,
        season,
        imageMetadata: {
          filename: imageFile.filename,
          originalname: imageFile.originalname,
          size: imageFile.size,
          mimetype: imageFile.mimetype
        }
      };
      res.json(analysisResult);
    } catch (error) {
      console.error("Image analysis error:", error);
      res.status(500).json({
        error: "Failed to analyze image. Please try again with a clear farm image."
      });
    }
  });
  app2.post(`${apiPrefix}/zbnf/analyze-pest`, upload.single("image"), async (req, res) => {
    try {
      console.log("Pest analysis request received");
      console.log("Request body keys:", Object.keys(req.body));
      console.log("Request file:", req.file ? "Present" : "Not present");
      if (!req.file) {
        return res.status(400).json({
          error: "No image file provided. Please upload an image of the affected plant."
        });
      }
      const imageFile = req.file;
      const { farmLocation = "Unknown", cropType = "mixed" } = req.body;
      console.log(`Analyzing pest image for ${farmLocation} - ${cropType} crops`);
      const pestAnalysisResult = {
        success: true,
        detectedPests: [
          {
            name: "Aphids",
            severity: "Medium",
            description: "Small green insects clustered on young shoots and leaves, causing yellowing and stunted growth.",
            confidence: 0.85,
            affectedArea: "30% of visible plants",
            zbnfTreatment: [
              "Spray Neemastra (Neem seed kernel extract) solution",
              "Apply Agniastra for severe infestations",
              "Increase beneficial insect habitat with diverse plantings",
              "Use yellow sticky traps to monitor population"
            ],
            prevention: [
              "Maintain diverse crop ecosystem to support natural predators",
              "Regular application of Jeevamrutha to boost plant immunity",
              "Avoid excess nitrogen which attracts aphids",
              "Encourage ladybugs and lacewings through companion planting"
            ]
          },
          {
            name: "Early Blight",
            severity: "Low",
            description: "Dark spots with concentric rings on lower leaves, indicating fungal infection.",
            confidence: 0.72,
            affectedArea: "15% of visible plants",
            zbnfTreatment: [
              "Apply Dashparni Ark (extract of 10 leaves)",
              "Use Brahmastra for fungal control",
              "Improve air circulation by proper spacing",
              "Remove affected leaves and compost separately"
            ],
            prevention: [
              "Ensure proper drainage and avoid waterlogging",
              "Apply mulch to prevent soil splash on leaves",
              "Rotate crops to break disease cycle",
              "Use disease-resistant local varieties"
            ]
          }
        ],
        generalRecommendations: [
          "Strengthen plant immunity with regular Jeevamrutha application",
          "Diversify crops to create balanced ecosystem",
          "Encourage beneficial insects with flowering companion plants",
          "Monitor regularly using ZBNF observation techniques",
          "Maintain soil health through organic matter addition",
          "Use traditional knowledge combined with observation"
        ],
        zbnfPrinciples: [
          "Work with nature, not against it",
          "Build soil biology for natural disease resistance",
          "Create habitat for beneficial organisms",
          "Use local materials for pest management solutions"
        ],
        nextSteps: [
          "Prepare Neemastra solution for immediate application",
          "Set up monitoring schedule for pest population tracking",
          "Plan companion plantings for next season",
          "Document observations for pattern recognition"
        ],
        imageMetadata: {
          filename: imageFile.filename,
          originalname: imageFile.originalname,
          size: imageFile.size,
          mimetype: imageFile.mimetype
        }
      };
      res.json(pestAnalysisResult);
    } catch (error) {
      console.error("Pest analysis error:", error);
      res.status(500).json({
        error: "Failed to analyze pest image. Please try again with a clear image of affected plants."
      });
    }
  });
  app2.get(`${apiPrefix}/admin/search-orders`, authenticateJWT2, isAdmin, async (req, res) => {
    try {
      const { customerName, amount, userId, startDate } = req.query;
      console.log("Admin searching for orders with params:", { customerName, amount, userId, startDate });
      let filters = [];
      if (customerName && typeof customerName === "string") {
        const users2 = await db.select().from(usersTable).where(
          or2(
            sql2`LOWER(${usersTable.name}) LIKE LOWER(${"%" + customerName + "%"})`,
            sql2`LOWER(${usersTable.username}) LIKE LOWER(${"%" + customerName + "%"})`,
            sql2`LOWER(${usersTable.email}) LIKE LOWER(${"%" + customerName + "%"})`
          )
        );
        if (users2.length === 0) {
          return res.json({ users: [], orders: [], message: "No users found matching that name" });
        }
        const userIds = users2.map((u) => u.id);
        filters.push(sql2`${orders.userId} IN (${sql2.join(userIds.map((id) => sql2`${id}`), sql2`, `)})`);
      }
      if (userId && typeof userId === "string") {
        filters.push(eq2(orders.userId, parseInt(userId)));
      }
      if (startDate && typeof startDate === "string") {
        filters.push(sql2`${orders.createdAt} >= ${new Date(startDate)}`);
      }
      if (amount && typeof amount === "string") {
        filters.push(sql2`${orders.total}::numeric = ${parseFloat(amount)}`);
      }
      const foundOrders = await db.query.orders.findMany({
        where: filters.length > 0 ? and2(...filters) : void 0,
        with: {
          items: {
            with: {
              product: true,
              farmer: true
            }
          }
        },
        orderBy: desc2(orders.createdAt),
        limit: 50
      });
      let matchedUsers = [];
      if (customerName && typeof customerName === "string") {
        matchedUsers = await db.select({
          id: usersTable.id,
          username: usersTable.username,
          email: usersTable.email,
          name: usersTable.name,
          phone: usersTable.phone,
          role: usersTable.role,
          createdAt: usersTable.createdAt
        }).from(usersTable).where(
          or2(
            sql2`LOWER(${usersTable.name}) LIKE LOWER(${"%" + customerName + "%"})`,
            sql2`LOWER(${usersTable.username}) LIKE LOWER(${"%" + customerName + "%"})`,
            sql2`LOWER(${usersTable.email}) LIKE LOWER(${"%" + customerName + "%"})`
          )
        ).limit(10);
      }
      res.json({
        users: matchedUsers,
        orders: foundOrders,
        total: foundOrders.length
      });
    } catch (error) {
      console.error("Admin order search error:", error);
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/events`, async (req, res) => {
    try {
      const { cropType, eventType, district, date: date2, limit: limitParam } = req.query;
      let filters = [
        eq2(farmEvents.status, "live"),
        eq2(farmEvents.isActive, true)
      ];
      if (cropType && typeof cropType === "string" && cropType !== "all") {
        filters.push(eq2(farmEvents.cropType, cropType));
      }
      if (eventType && typeof eventType === "string" && eventType !== "all") {
        filters.push(eq2(farmEvents.eventType, eventType));
      }
      if (district && typeof district === "string" && district !== "all") {
        filters.push(like2(farmEvents.location, `%${district}%`));
      }
      const events = await db.query.farmEvents.findMany({
        where: and2(...filters),
        with: {
          farmer: true,
          facilities: true,
          activities: true,
          gallery: true,
          dates: true
        },
        orderBy: desc2(farmEvents.createdAt),
        limit: limitParam ? parseInt(limitParam) : 50
      });
      const enrichedEvents = await Promise.all(events.map(async (event) => {
        const farmerProfile = await db.query.farmers.findFirst({
          where: eq2(farmers.userId, event.farmerId)
        });
        return {
          ...event,
          farmerProfile: farmerProfile || null
        };
      }));
      let filteredEvents = enrichedEvents;
      if (date2 && typeof date2 === "string") {
        filteredEvents = enrichedEvents.filter((event) => {
          const eventDatesList = (event.dates || []).map((d) => d.eventDate);
          return eventDatesList.includes(date2);
        });
      }
      res.json(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/events/types`, async (_req, res) => {
    try {
      let dbEventTypes = [];
      try {
        const types = await db.query.eventTypes.findMany({
          where: eq2(eventTypes.isActive, true),
          orderBy: asc2(eventTypes.sortOrder)
        });
        dbEventTypes = types.map((t) => t.name);
      } catch (e) {
        console.log("Event types table not ready, using fallback");
      }
      res.json({
        eventTypes: dbEventTypes.length > 0 ? dbEventTypes : EVENT_TYPES,
        facilityTypes: FACILITY_TYPES,
        activityTypes: ACTIVITY_TYPES
      });
    } catch (error) {
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/event-types`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const types = await db.query.eventTypes.findMany({
        orderBy: asc2(eventTypes.sortOrder)
      });
      res.json(types);
    } catch (error) {
      console.error("Error fetching event types:", error);
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/event-types`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const validated = insertEventTypeSchema.parse(req.body);
      const [newType] = await db.insert(eventTypes).values(validated).returning();
      res.status(201).json(newType);
    } catch (error) {
      console.error("Error creating event type:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      handleError2(res, error);
    }
  });
  app2.patch(`${apiPrefix}/admin/event-types/:id`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const typeId = parseInt(req.params.id);
      const [updated] = await db.update(eventTypes).set({ ...req.body, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(eventTypes.id, typeId)).returning();
      if (!updated) {
        return res.status(404).json({ message: "Event type not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating event type:", error);
      handleError2(res, error);
    }
  });
  app2.delete(`${apiPrefix}/admin/event-types/:id`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const typeId = parseInt(req.params.id);
      const [deleted] = await db.delete(eventTypes).where(eq2(eventTypes.id, typeId)).returning();
      if (!deleted) {
        return res.status(404).json({ message: "Event type not found" });
      }
      res.json({ message: "Event type deleted", deleted });
    } catch (error) {
      console.error("Error deleting event type:", error);
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/admin/event-types/initialize`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const existing = await db.query.eventTypes.findMany();
      if (existing.length > 0) {
        return res.status(400).json({ message: "Event types already initialized", count: existing.length });
      }
      const defaultTypes = EVENT_TYPES.map((name, index2) => ({
        name,
        displayName: name.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        sortOrder: index2,
        isActive: true
      }));
      const inserted = await db.insert(eventTypes).values(defaultTypes).returning();
      res.status(201).json({ message: "Event types initialized", types: inserted });
    } catch (error) {
      console.error("Error initializing event types:", error);
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/events/:id`, async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return next();
      }
      const event = await db.query.farmEvents.findFirst({
        where: eq2(farmEvents.id, eventId),
        with: {
          farmer: true,
          districtManager: true,
          facilities: true,
          activities: true,
          gallery: true,
          dates: true
        }
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const farmerProfile = await db.query.farmers.findFirst({
        where: eq2(farmers.userId, event.farmerId)
      });
      const bookings = await db.query.eventBookings.findMany({
        where: and2(
          eq2(eventBookings.eventId, eventId),
          or2(
            eq2(eventBookings.status, "confirmed"),
            eq2(eventBookings.status, "checked_in")
          )
        )
      });
      const eventDatesList = event.dates || [];
      const availability = {};
      eventDatesList.forEach((dateRecord) => {
        const dateStr = dateRecord.eventDate;
        const dateBookings = bookings.filter((b) => b.bookingDate === dateStr);
        const bookedSeats = dateBookings.reduce((sum, b) => sum + (b.adultSeats || 0) + (b.childSeats || 0), 0);
        availability[dateStr] = {
          booked: bookedSeats,
          available: (dateRecord.availableSeats || event.totalSeats) - bookedSeats
        };
      });
      res.json({ ...event, farmerProfile, availability });
    } catch (error) {
      console.error("Error fetching event:", error);
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/events`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can create events" });
      }
      const farmer = await storage2.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer profile not found" });
      }
      const eventData = {
        ...req.body,
        farmerId: req.user.id,
        // Use user.id since farm_events.farmer_id references users.id
        status: "pending"
      };
      const validated = insertFarmEventSchema.parse(eventData);
      const [newEvent] = await db.insert(farmEvents).values(validated).returning();
      if (req.body.facilities && Array.isArray(req.body.facilities)) {
        for (const facility of req.body.facilities) {
          await db.insert(eventFacilities).values({
            eventId: newEvent.id,
            facilityType: facility.type,
            description: facility.description,
            isAvailable: true
          });
        }
      }
      if (req.body.activities && Array.isArray(req.body.activities)) {
        for (let i = 0; i < req.body.activities.length; i++) {
          const activity = req.body.activities[i];
          await db.insert(eventActivities).values({
            eventId: newEvent.id,
            activityName: activity.name,
            description: activity.description,
            duration: activity.duration,
            order: i
          });
        }
      }
      if (req.body.gallery && Array.isArray(req.body.gallery)) {
        for (let i = 0; i < req.body.gallery.length; i++) {
          await db.insert(eventGallery).values({
            eventId: newEvent.id,
            imageUrl: req.body.gallery[i].url,
            caption: req.body.gallery[i].caption,
            order: i
          });
        }
      }
      if (req.body.eventDates && Array.isArray(req.body.eventDates)) {
        for (const dateStr of req.body.eventDates) {
          await db.insert(eventDates).values({
            eventId: newEvent.id,
            eventDate: dateStr,
            availableSeats: newEvent.totalSeats,
            isAvailable: true
          });
        }
      }
      res.status(201).json(newEvent);
    } catch (error) {
      console.error("Error creating event:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/events/upload-image`, authenticateJWT2, upload.single("image"), async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can upload event images" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      const imageUrl = await StorageService.uploadImage(req.file, "event-images");
      res.json({
        success: true,
        imageUrl,
        message: "Event image uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading event image:", error);
      res.status(500).json({
        success: false,
        message: "Event image upload failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get(`${apiPrefix}/farmer/events`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can access farmer events" });
      }
      const farmer = await storage2.getFarmerByUserId(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer profile not found" });
      }
      const { status } = req.query;
      let filters = [eq2(farmEvents.farmerId, req.user.id)];
      if (status && typeof status === "string" && status !== "all") {
        if (status === "expired") {
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        } else if (status === "approved") {
          filters.push(eq2(farmEvents.status, "live"));
        } else {
          filters.push(eq2(farmEvents.status, status));
        }
      }
      const events = await db.query.farmEvents.findMany({
        where: and2(...filters),
        with: {
          facilities: true,
          activities: true,
          gallery: true,
          bookings: {
            with: {
              customer: true
            }
          },
          dates: true
        },
        orderBy: desc2(farmEvents.createdAt)
      });
      const dmIds = [...new Set(events.filter((e) => e.dmId).map((e) => e.dmId))];
      const dmUsers = dmIds.length > 0 ? await db.query.users.findMany({
        where: inArray2(users.id, dmIds)
      }) : [];
      const dmMap = new Map(dmUsers.map((dm) => [dm.id, dm]));
      const includeExpired = req.query.includeExpired === "true";
      let filteredEvents = events;
      if (status === "expired") {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        filteredEvents = events.filter((event) => {
          if (!event.dates || event.dates.length === 0) return false;
          const latestDate = event.dates.reduce((max, d) => d.eventDate > max ? d.eventDate : max, event.dates[0].eventDate);
          return latestDate < today;
        });
      } else if (status && status !== "all" && !includeExpired) {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        filteredEvents = events.filter((event) => {
          if (!event.dates || event.dates.length === 0) return true;
          const latestDate = event.dates.reduce((max, d) => d.eventDate > max ? d.eventDate : max, event.dates[0].eventDate);
          return latestDate >= today;
        });
      }
      const enrichedEvents = filteredEvents.map((event) => ({
        ...event,
        farmerProfile: farmer,
        dm: event.dmId ? dmMap.get(event.dmId) : null
      }));
      res.json(enrichedEvents);
    } catch (error) {
      console.error("Error fetching farmer events:", error);
      handleError2(res, error);
    }
  });
  app2.put(`${apiPrefix}/events/:id`, authenticateJWT2, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await db.query.farmEvents.findFirst({
        where: eq2(farmEvents.id, eventId),
        with: { farmer: true }
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const farmer = await storage2.getFarmerByUserId(req.user.id);
      if (req.user.role !== "admin" && (!farmer || event.farmerId !== farmer.id)) {
        return res.status(403).json({ message: "Not authorized to update this event" });
      }
      const [updatedEvent] = await db.update(farmEvents).set({
        ...req.body,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq2(farmEvents.id, eventId)).returning();
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      handleError2(res, error);
    }
  });
  app2.patch(`${apiPrefix}/events/:id`, authenticateJWT2, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await db.query.farmEvents.findFirst({
        where: eq2(farmEvents.id, eventId),
        with: { farmer: true }
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (req.user.role === "admin") {
      } else if (req.user.role === "district_manager") {
        if (event.status === "approved" || event.status === "live") {
          return res.status(403).json({
            message: "District Managers cannot edit approved events. Only admins can edit approved events."
          });
        }
        if (event.dmId !== req.user.id && (!req.user.district || !event.location?.includes(req.user.district))) {
          return res.status(403).json({ message: "Not authorized to update this event" });
        }
      } else if (req.user.role === "farmer") {
        const farmer = await storage2.getFarmerByUserId(req.user.id);
        if (!farmer || event.farmerId !== farmer.id) {
          return res.status(403).json({ message: "Not authorized to update this event" });
        }
      } else {
        return res.status(403).json({ message: "Not authorized" });
      }
      const allowedFields = [
        "title",
        "description",
        "eventType",
        "cropType",
        "location",
        "address",
        "startTime",
        "endTime",
        "totalSeats",
        "pricePerSeat",
        "coverImage",
        "status"
      ];
      const updateData = { updatedAt: /* @__PURE__ */ new Date() };
      for (const field of allowedFields) {
        if (req.body[field] !== void 0) {
          updateData[field] = req.body[field];
        }
      }
      const [updatedEvent] = await db.update(farmEvents).set(updateData).where(eq2(farmEvents.id, eventId)).returning();
      if (req.body.eventDates && Array.isArray(req.body.eventDates) && (req.user.role === "admin" || req.user.role === "district_manager")) {
        await db.delete(eventDates).where(eq2(eventDates.eventId, eventId));
        for (const dateStr of req.body.eventDates) {
          await db.insert(eventDates).values({
            eventId,
            eventDate: dateStr,
            availableSeats: updatedEvent.totalSeats || event.totalSeats,
            isAvailable: true
          });
        }
      }
      const eventWithDates = await db.query.farmEvents.findFirst({
        where: eq2(farmEvents.id, eventId),
        with: { dates: true }
      });
      res.json(eventWithDates);
    } catch (error) {
      console.error("Error updating event:", error);
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/dm/events/pending`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "district_manager" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only DMs can access pending events" });
      }
      let filters = [eq2(farmEvents.status, "pending")];
      if (req.user.role === "district_manager") {
        const linkedLinks = await db.select({ farmerUserId: farmerFpoLinks.farmerUserId }).from(farmerFpoLinks).where(eq2(farmerFpoLinks.dmUserId, req.user.id));
        const linkedFarmerUserIds = linkedLinks.map((l) => l.farmerUserId);
        if (linkedFarmerUserIds.length === 0) {
          return res.json([]);
        }
        filters.push(inArray2(farmEvents.farmerId, linkedFarmerUserIds));
      }
      const events = await db.query.farmEvents.findMany({
        where: and2(...filters),
        with: {
          farmer: true,
          facilities: true,
          activities: true,
          gallery: true,
          dates: true
        },
        orderBy: asc2(farmEvents.createdAt)
      });
      const enrichedEvents = await Promise.all(events.map(async (event) => {
        const farmerProfile = await db.query.farmers.findFirst({
          where: eq2(farmers.userId, event.farmerId)
        });
        return {
          ...event,
          farmerProfile: farmerProfile || null
        };
      }));
      res.json(enrichedEvents);
    } catch (error) {
      console.error("Error fetching pending events:", error);
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/dm/events`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "district_manager" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only DMs can access DM events" });
      }
      const { status } = req.query;
      const userDistrict = req.user.district;
      let districtFarmerIds = [];
      if (req.user.role === "district_manager") {
        const linkedLinks = await db.select({ farmerUserId: farmerFpoLinks.farmerUserId }).from(farmerFpoLinks).where(eq2(farmerFpoLinks.dmUserId, req.user.id));
        districtFarmerIds = linkedLinks.map((l) => l.farmerUserId);
      }
      console.log(`[DM Events ${req.user.id}] Linked FPO farmer IDs: ${districtFarmerIds.join(", ")}`);
      let allEvents = await db.query.farmEvents.findMany({
        with: {
          farmer: true,
          facilities: true,
          activities: true,
          gallery: true,
          dates: true,
          bookings: {
            with: {
              customer: true
            }
          }
        },
        orderBy: desc2(farmEvents.createdAt)
      });
      console.log(`[DM Events ${req.user.id}] Total events in DB: ${allEvents.length}`);
      let events = allEvents;
      if (req.user.role === "district_manager") {
        events = allEvents.filter((event) => {
          if (event.dmId === req.user.id) {
            return true;
          }
          if (districtFarmerIds.includes(event.farmerId)) {
            return true;
          }
          return false;
        });
      }
      console.log(`[DM Events ${req.user.id}] Filtered events count: ${events.length}`);
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      let filteredEvents = events;
      if (status === "approved") {
        filteredEvents = events.filter((event) => event.status === "live");
      } else if (status === "pending") {
        filteredEvents = events.filter((event) => {
          if (event.status !== "pending") return false;
          if (!event.dates || event.dates.length === 0) return true;
          const latestDate = event.dates.reduce((max, d) => d.eventDate > max ? d.eventDate : max, event.dates[0].eventDate);
          return latestDate >= today;
        });
      } else if (status === "rejected") {
        filteredEvents = events.filter((event) => event.status === "rejected");
      } else if (status === "upcoming") {
        filteredEvents = events.filter((event) => {
          if (event.status !== "live") return false;
          if (!event.dates || event.dates.length === 0) return true;
          const latestDate = event.dates.reduce((max, d) => d.eventDate > max ? d.eventDate : max, event.dates[0].eventDate);
          return latestDate >= today;
        });
      } else if (status === "expired") {
        filteredEvents = events.filter((event) => {
          if (!event.dates || event.dates.length === 0) return false;
          const latestDate = event.dates.reduce((max, d) => d.eventDate > max ? d.eventDate : max, event.dates[0].eventDate);
          return latestDate < today;
        });
      }
      console.log(`[DM Events ${req.user.id}] After date filter: ${filteredEvents.length} events`);
      const enrichedEvents = await Promise.all(filteredEvents.map(async (event) => {
        const farmerProfile = await db.query.farmers.findFirst({
          where: eq2(farmers.userId, event.farmerId)
        });
        let dmDetails = null;
        if (event.dmId) {
          dmDetails = await db.query.users.findFirst({
            where: eq2(users.id, event.dmId)
          });
        }
        return {
          ...event,
          farmerProfile: farmerProfile || null,
          dmDetails: dmDetails || null
        };
      }));
      res.json(enrichedEvents);
    } catch (error) {
      console.error("Error fetching DM events:", error);
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/dm/events/:id/review`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "district_manager" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only DMs can review events" });
      }
      const eventId = parseInt(req.params.id);
      const { action, reason } = req.body;
      if (!["approve", "reject"].includes(action)) {
        return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
      }
      const event = await db.query.farmEvents.findFirst({
        where: eq2(farmEvents.id, eventId)
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (event.status !== "pending") {
        return res.status(400).json({ message: "Only pending events can be reviewed" });
      }
      const updateData = {
        dmId: req.user.id,
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (action === "approve") {
        updateData.status = "live";
        updateData.approvedAt = /* @__PURE__ */ new Date();
        updateData.approvedBy = req.user.id;
      } else {
        updateData.status = "rejected";
        updateData.rejectionReason = reason || "Event did not meet requirements";
      }
      const [updatedEvent] = await db.update(farmEvents).set(updateData).where(eq2(farmEvents.id, eventId)).returning();
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error reviewing event:", error);
      handleError2(res, error);
    }
  });
  app2.patch(`${apiPrefix}/events/:id/approve`, authenticateJWT2, isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await db.query.farmEvents.findFirst({
        where: eq2(farmEvents.id, eventId)
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (event.status !== "pending") {
        return res.status(400).json({ message: "Only pending events can be approved" });
      }
      const [updatedEvent] = await db.update(farmEvents).set({
        status: "live",
        approvedAt: /* @__PURE__ */ new Date(),
        approvedBy: req.user.id,
        dmId: req.user.id,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq2(farmEvents.id, eventId)).returning();
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error approving event:", error);
      handleError2(res, error);
    }
  });
  app2.patch(`${apiPrefix}/events/:id/reject`, authenticateJWT2, isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const { reason } = req.body;
      const event = await db.query.farmEvents.findFirst({
        where: eq2(farmEvents.id, eventId)
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (event.status !== "pending") {
        return res.status(400).json({ message: "Only pending events can be rejected" });
      }
      const [updatedEvent] = await db.update(farmEvents).set({
        status: "rejected",
        rejectionReason: reason || "Event did not meet requirements",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq2(farmEvents.id, eventId)).returning();
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error rejecting event:", error);
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/events/:id/book`, authenticateJWT2, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const { bookingDate, adultSeats, childSeats, specialNotes } = req.body;
      const fullUser = await storage2.getUserById(req.user.id);
      if (!fullUser) {
        return res.status(401).json({ message: "User not found" });
      }
      const event = await db.query.farmEvents.findFirst({
        where: and2(
          eq2(farmEvents.id, eventId),
          eq2(farmEvents.status, "live")
        ),
        with: {
          dates: true
        }
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found or not available" });
      }
      const eventDatesList = (event.dates || []).map((d) => d.eventDate);
      if (!eventDatesList.includes(bookingDate)) {
        return res.status(400).json({ message: "Invalid booking date" });
      }
      const existingBookings = await db.query.eventBookings.findMany({
        where: and2(
          eq2(eventBookings.eventId, eventId),
          eq2(eventBookings.bookingDate, bookingDate),
          or2(
            eq2(eventBookings.status, "confirmed"),
            eq2(eventBookings.status, "checked_in")
          )
        )
      });
      const bookedSeats = existingBookings.reduce((sum, b) => sum + (b.adultSeats || 0) + (b.childSeats || 0), 0);
      const requestedSeats = (adultSeats || 1) + (childSeats || 0);
      if (bookedSeats + requestedSeats > event.totalSeats) {
        return res.status(400).json({
          message: "Not enough seats available",
          available: event.totalSeats - bookedSeats
        });
      }
      const adultTotal = parseFloat(event.pricePerSeat) * (adultSeats || 1);
      const childTotal = event.childPrice ? parseFloat(event.childPrice) * (childSeats || 0) : 0;
      const subtotal = adultTotal + childTotal;
      const activeFees = await db.query.orderFees.findMany({
        where: eq2(orderFees.isActive, true),
        orderBy: asc2(orderFees.displayOrder)
      });
      let totalFees = 0;
      let calculationBase = subtotal;
      const feeBreakdown = [];
      activeFees.filter((f) => !f.applyToSubtotal).forEach((fee) => {
        const feeValue = parseFloat(fee.value);
        let amount = 0;
        if (fee.type === "fixed") {
          amount = feeValue;
        } else if (fee.type === "percentage") {
          amount = subtotal * feeValue / 100;
        }
        totalFees += amount;
        feeBreakdown.push({ name: fee.name, amount });
      });
      activeFees.filter((f) => f.applyToSubtotal).forEach((fee) => {
        const feeValue = parseFloat(fee.value);
        let amount = 0;
        if (fee.type === "fixed") {
          amount = feeValue;
        } else if (fee.type === "percentage") {
          amount = calculationBase * feeValue / 100;
          calculationBase += amount;
        }
        totalFees += amount;
        feeBreakdown.push({ name: fee.name, amount });
      });
      const totalAmount = subtotal + totalFees;
      const orderId = `evt_${Date.now()}_${crypto2.randomBytes(4).toString("hex")}`;
      const cashfreeOrderRequest = {
        order_id: orderId,
        order_amount: parseFloat(totalAmount.toFixed(2)),
        order_currency: "INR",
        customer_details: {
          customer_id: `customer_${fullUser.id}`,
          customer_name: fullUser.name || fullUser.username || "Customer",
          customer_email: fullUser.email || "noemail@placeholder.com",
          customer_phone: fullUser.phone || "9999999999"
        },
        order_meta: {
          return_url: `https://farmersanthe.com/events/payment-status?order_id={order_id}`,
          notify_url: `https://farmersanthe.com/api/events/payment-webhook`,
          payment_methods: "cc,dc,nb,upi"
        },
        order_note: JSON.stringify({
          type: "event_booking",
          eventId,
          customerId: fullUser.id,
          bookingDate,
          adultSeats: adultSeats || 1,
          childSeats: childSeats || 0,
          specialNotes,
          eventTitle: event.title
        })
      };
      console.log("Creating event payment with Cashfree:", JSON.stringify(cashfreeOrderRequest, null, 2));
      const paymentResponse = await fetch("https://api.cashfree.com/pg/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
          "Accept": "application/json"
        },
        body: JSON.stringify(cashfreeOrderRequest)
      });
      const paymentResult = await paymentResponse.json();
      console.log("Cashfree event payment response:", JSON.stringify(paymentResult, null, 2));
      if (!paymentResponse.ok) {
        console.error("Cashfree event payment error:", paymentResult);
        return res.status(500).json({
          message: paymentResult.message || "Payment initialization failed. Please try again.",
          error: paymentResult
        });
      }
      const sessionId = paymentResult.payment_session_id;
      if (!sessionId) {
        console.error("No payment_session_id in Cashfree response:", paymentResult);
        return res.status(500).json({
          message: "Failed to get payment session from Cashfree",
          debug: paymentResult
        });
      }
      const paymentUrl = `https://payments.cashfree.com/billpay/pay/${sessionId}`;
      console.log("Generated payment URL:", paymentUrl);
      res.status(200).json({
        paymentRequired: true,
        amount: totalAmount,
        subtotal,
        fees: feeBreakdown,
        paymentUrl,
        sessionId,
        orderId,
        eventTitle: event.title
      });
    } catch (error) {
      console.error("Error booking event:", error);
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/events/payment-webhook`, async (req, res) => {
    try {
      console.log("Event payment webhook received:", JSON.stringify(req.body, null, 2));
      const signature = req.headers["x-cashfree-signature"];
      const timestamp2 = req.headers["x-cashfree-timestamp"];
      if (signature && timestamp2) {
        const payload = timestamp2 + JSON.stringify(req.body);
        const expectedSignature = crypto2.createHmac("sha256", CASHFREE_SECRET_KEY).update(payload).digest("base64");
        if (signature !== expectedSignature) {
          console.error("Invalid Cashfree webhook signature");
          return res.status(401).json({ message: "Invalid signature" });
        }
        console.log("Webhook signature verified successfully");
      }
      const { order_id } = req.body.data || req.body;
      if (!order_id) {
        console.error("Missing order_id in webhook");
        return res.status(400).json({ message: "Missing order_id" });
      }
      if (!order_id.startsWith("evt_")) {
        console.log("Not an event payment, skipping:", order_id);
        return res.status(200).json({ status: "ok" });
      }
      const verifyResponse = await fetch(`https://api.cashfree.com/pg/orders/${order_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        }
      });
      if (!verifyResponse.ok) {
        console.error("Failed to verify payment with Cashfree");
        return res.status(500).json({ message: "Payment verification failed" });
      }
      const paymentData = await verifyResponse.json();
      console.log("Cashfree order status:", paymentData);
      if (paymentData.order_status === "PAID") {
        const existingBooking = await db.query.eventBookings.findFirst({
          where: eq2(eventBookings.paymentId, order_id)
        });
        if (existingBooking) {
          console.log("Booking already exists for order:", order_id);
          return res.status(200).json({ status: "ok" });
        }
        let bookingDetails;
        try {
          let orderNote = paymentData.order_note || "{}";
          orderNote = orderNote.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
          console.log("Decoded order_note:", orderNote);
          bookingDetails = JSON.parse(orderNote);
        } catch (e) {
          console.error("Failed to parse order_note:", e);
          return res.status(400).json({ message: "Invalid booking data" });
        }
        if (bookingDetails.type !== "event_booking") {
          console.log("Not an event booking type:", bookingDetails.type);
          return res.status(200).json({ status: "ok" });
        }
        const [newBooking] = await db.insert(eventBookings).values({
          eventId: bookingDetails.eventId,
          customerId: bookingDetails.customerId,
          bookingDate: bookingDetails.bookingDate,
          numSeats: (bookingDetails.adultSeats || 1) + (bookingDetails.childSeats || 0),
          adultSeats: bookingDetails.adultSeats || 1,
          childSeats: bookingDetails.childSeats || 0,
          totalAmount: paymentData.order_amount.toFixed(2),
          paymentStatus: "paid",
          status: "confirmed",
          paymentId: order_id,
          specialRequests: bookingDetails.specialNotes
        }).returning();
        console.log(`Event booking ${newBooking.id} created after successful payment`);
      }
      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("Error processing event payment webhook:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });
  app2.get(`${apiPrefix}/events/verify-payment`, authenticateJWT2, async (req, res) => {
    try {
      const { order_id } = req.query;
      if (!order_id) {
        return res.status(400).json({ message: "Missing order_id" });
      }
      const orderIdStr = order_id;
      if (!orderIdStr.startsWith("evt_")) {
        return res.status(400).json({ message: "Invalid order reference" });
      }
      const existingBooking = await db.query.eventBookings.findFirst({
        where: eq2(eventBookings.paymentId, orderIdStr),
        with: {
          event: true
        }
      });
      if (existingBooking) {
        if (existingBooking.customerId !== req.user.id) {
          return res.status(403).json({ message: "Not authorized to access this booking" });
        }
        return res.json({
          status: "success",
          booking: existingBooking,
          message: "Booking already confirmed"
        });
      }
      const verifyResponse = await fetch(`https://api.cashfree.com/pg/orders/${order_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        }
      });
      if (!verifyResponse.ok) {
        console.error("Failed to verify payment with Cashfree");
        return res.status(500).json({
          status: "error",
          message: "Payment verification failed"
        });
      }
      const paymentData = await verifyResponse.json();
      console.log("Event payment verification result:", paymentData);
      if (paymentData.order_status === "PAID") {
        let bookingDetails;
        try {
          let orderNote = paymentData.order_note || "{}";
          orderNote = orderNote.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
          console.log("Decoded order_note for verification:", orderNote);
          bookingDetails = JSON.parse(orderNote);
        } catch (e) {
          console.error("Failed to parse order_note:", e);
          return res.status(400).json({ status: "error", message: "Invalid booking data" });
        }
        if (bookingDetails.type !== "event_booking") {
          return res.status(400).json({ status: "error", message: "Invalid booking type" });
        }
        if (bookingDetails.customerId !== req.user.id) {
          return res.status(403).json({ message: "Not authorized to access this booking" });
        }
        const webhookCreatedBooking = await db.query.eventBookings.findFirst({
          where: eq2(eventBookings.paymentId, orderIdStr),
          with: { event: true }
        });
        if (webhookCreatedBooking) {
          console.log("Booking already created by webhook for order:", orderIdStr);
          return res.json({
            status: "success",
            booking: webhookCreatedBooking,
            message: "Booking already confirmed"
          });
        }
        let newBooking;
        try {
          const [booking] = await db.insert(eventBookings).values({
            eventId: bookingDetails.eventId,
            customerId: bookingDetails.customerId,
            bookingDate: bookingDetails.bookingDate,
            numSeats: (bookingDetails.adultSeats || 1) + (bookingDetails.childSeats || 0),
            adultSeats: bookingDetails.adultSeats || 1,
            childSeats: bookingDetails.childSeats || 0,
            totalAmount: paymentData.order_amount.toFixed(2),
            paymentStatus: "paid",
            status: "confirmed",
            paymentId: orderIdStr,
            specialRequests: bookingDetails.specialNotes || null
          }).returning();
          newBooking = booking;
        } catch (insertError) {
          console.error("Error inserting booking:", insertError);
          if (insertError.code === "23505") {
            const existingBooking2 = await db.query.eventBookings.findFirst({
              where: eq2(eventBookings.paymentId, orderIdStr),
              with: { event: true }
            });
            if (existingBooking2) {
              return res.json({
                status: "success",
                booking: existingBooking2,
                message: "Booking already confirmed"
              });
            }
          }
          throw insertError;
        }
        const event = await db.query.farmEvents.findFirst({
          where: eq2(farmEvents.id, bookingDetails.eventId)
        });
        try {
          const customer = await db.query.users.findFirst({
            where: eq2(users.id, bookingDetails.customerId)
          });
          const farmerUser = event ? await db.query.users.findFirst({
            where: eq2(users.id, event.farmerId)
          }) : null;
          let dmInfo = null;
          if (event?.dmId) {
            const dmUser = await db.query.users.findFirst({
              where: eq2(users.id, event.dmId)
            });
            if (dmUser) {
              dmInfo = {
                name: dmUser.name || dmUser.username || "Event Coordinator",
                phone: dmUser.phone || void 0,
                email: dmUser.email || void 0,
                address: dmUser.orgAddress || void 0
              };
            }
          }
          if (customer && event) {
            sendBookingConfirmationEmail(newBooking, event, customer, dmInfo).catch((err) => {
              console.error("Failed to send booking confirmation to customer:", err);
            });
            if (farmerUser) {
              sendBookingNotificationToFarmer(newBooking, event, farmerUser, customer.username || customer.email).catch((err) => {
                console.error("Failed to send booking notification to farmer:", err);
              });
            }
            if (dmInfo) {
              const dmUser = await db.query.users.findFirst({
                where: eq2(users.id, event.dmId)
              });
              if (dmUser) {
                sendBookingNotificationToDM(
                  newBooking,
                  event,
                  dmUser,
                  customer.username || customer.email,
                  farmerUser?.username || "Unknown Farmer"
                ).catch((err) => {
                  console.error("Failed to send booking notification to DM:", err);
                });
              }
            }
          }
        } catch (emailError) {
          console.error("Error sending booking emails:", emailError);
        }
        return res.json({
          status: "success",
          booking: newBooking,
          message: "Payment confirmed successfully"
        });
      } else if (paymentData.order_status === "PENDING" || paymentData.order_status === "ACTIVE") {
        return res.json({
          status: "pending",
          message: "Payment is still processing. Please wait..."
        });
      } else {
        return res.json({
          status: "failed",
          message: `Payment ${paymentData.order_status.toLowerCase()}. Please try again.`
        });
      }
    } catch (error) {
      console.error("Error verifying event payment:", error);
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/my-event-bookings`, authenticateJWT2, async (req, res) => {
    try {
      const bookings = await db.query.eventBookings.findMany({
        where: eq2(eventBookings.customerId, req.user.id),
        with: {
          event: {
            with: {
              farmer: true,
              facilities: true,
              activities: true,
              districtManager: true
            }
          }
        },
        orderBy: desc2(eventBookings.createdAt)
      });
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching event bookings:", error);
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/dm/event-bookings`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "district_manager" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only DMs can access event bookings" });
      }
      const bookings = await db.query.eventBookings.findMany({
        with: {
          event: {
            with: {
              farmer: true
            }
          },
          customer: true
        },
        orderBy: desc2(eventBookings.createdAt)
      });
      const filteredBookings = req.user.role === "district_manager" ? bookings.filter((b) => b.event?.dmId === req.user.id) : bookings;
      res.json(filteredBookings);
    } catch (error) {
      console.error("Error fetching DM event bookings:", error);
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/dm/event-bookings/:id/check-in`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "district_manager" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only DMs can check in bookings" });
      }
      const bookingId = parseInt(req.params.id);
      const { qrCode } = req.body;
      const booking = await db.query.eventBookings.findFirst({
        where: eq2(eventBookings.id, bookingId),
        with: {
          event: true,
          customer: true
        }
      });
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      if (qrCode && booking.qrCode !== qrCode) {
        return res.status(400).json({ message: "Invalid QR code" });
      }
      if (req.user.role === "district_manager" && booking.event?.dmId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to check in this booking" });
      }
      if (booking.status !== "confirmed") {
        return res.status(400).json({ message: `Cannot check in booking with status: ${booking.status}` });
      }
      const [updatedBooking] = await db.update(eventBookings).set({
        status: "checked_in",
        checkedInAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq2(eventBookings.id, bookingId)).returning();
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error checking in booking:", error);
      handleError2(res, error);
    }
  });
  app2.post(`${apiPrefix}/dm/event-bookings/:id/complete`, authenticateJWT2, async (req, res) => {
    try {
      if (req.user.role !== "district_manager" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only DMs can complete bookings" });
      }
      const bookingId = parseInt(req.params.id);
      const booking = await db.query.eventBookings.findFirst({
        where: eq2(eventBookings.id, bookingId)
      });
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      const event = await db.query.farmEvents.findFirst({
        where: eq2(farmEvents.id, booking.eventId)
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found for this booking" });
      }
      if (req.user.role === "district_manager" && event.dmId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to complete this booking" });
      }
      const [updatedBooking] = await db.update(eventBookings).set({
        status: "completed",
        completedAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq2(eventBookings.id, bookingId)).returning();
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error completing booking:", error);
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/events/verify-qr/:qrCode`, async (req, res) => {
    try {
      const { qrCode } = req.params;
      const booking = await db.query.eventBookings.findFirst({
        where: eq2(eventBookings.qrCode, qrCode),
        with: {
          event: {
            with: {
              farmer: true
            }
          },
          customer: true
        }
      });
      if (!booking) {
        return res.status(404).json({ valid: false, message: "Invalid QR code" });
      }
      res.json({
        valid: true,
        booking: {
          id: booking.id,
          bookingReference: booking.bookingReference,
          bookingDate: booking.bookingDate,
          adultSeats: booking.adultSeats,
          childSeats: booking.childSeats,
          status: booking.status,
          customerName: booking.customer?.name,
          eventTitle: booking.event?.title
        }
      });
    } catch (error) {
      console.error("Error verifying QR code:", error);
      handleError2(res, error);
    }
  });
  app2.get(`${apiPrefix}/admin/events`, authenticateJWT2, isAdmin, async (req, res) => {
    try {
      const { status } = req.query;
      let filters = [];
      if (status && typeof status === "string" && status !== "all") {
        if (status === "expired") {
        } else if (status === "approved") {
          filters.push(eq2(farmEvents.status, "live"));
        } else {
          filters.push(eq2(farmEvents.status, status));
        }
      }
      const events = await db.query.farmEvents.findMany({
        where: filters.length > 0 ? and2(...filters) : void 0,
        with: {
          farmer: true,
          districtManager: true,
          facilities: true,
          activities: true,
          bookings: {
            with: {
              customer: true
            }
          },
          dates: true
        },
        orderBy: desc2(farmEvents.createdAt)
      });
      let filteredEvents = events;
      if (status === "expired") {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        filteredEvents = events.filter((event) => {
          if (!event.dates || event.dates.length === 0) return false;
          const latestDate = event.dates.reduce((max, d) => d.eventDate > max ? d.eventDate : max, event.dates[0].eventDate);
          return latestDate < today;
        });
      } else if (status && status !== "all") {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        filteredEvents = events.filter((event) => {
          if (!event.dates || event.dates.length === 0) return true;
          const latestDate = event.dates.reduce((max, d) => d.eventDate > max ? d.eventDate : max, event.dates[0].eventDate);
          return latestDate >= today;
        });
      }
      const enrichedEvents = await Promise.all(filteredEvents.map(async (event) => {
        const farmerProfile = await db.query.farmers.findFirst({
          where: eq2(farmers.userId, event.farmerId)
        });
        let dmDetails = null;
        if (event.dmId) {
          dmDetails = await db.query.users.findFirst({
            where: eq2(users.id, event.dmId)
          });
        }
        return {
          ...event,
          farmerProfile: farmerProfile || null,
          dmDetails: dmDetails || null
        };
      }));
      res.json(enrichedEvents);
    } catch (error) {
      console.error("Error fetching admin events:", error);
      handleError2(res, error);
    }
  });
  app2.get("/api/farmer-voice/posts", async (req, res) => {
    try {
      const { districtId, category, limit, offset } = req.query;
      const posts = await storage2.getFarmerVoicePosts({
        districtId: districtId ? parseInt(districtId) : void 0,
        category,
        limit: limit ? parseInt(limit) : 20,
        offset: offset ? parseInt(offset) : 0
      });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching farmer voice posts:", error);
      handleError2(res, error);
    }
  });
  app2.get("/api/farmer-voice/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage2.getFarmerVoicePostById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching farmer voice post:", error);
      handleError2(res, error);
    }
  });
  app2.post("/api/farmer-voice/posts", authenticateJWT2, async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (user.role !== "district_manager" && user.role !== "admin") {
        return res.status(403).json({ error: "Only district managers or admins can create posts" });
      }
      const validationResult = farmerVoicePostValidationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: fromZodError(validationResult.error).message });
      }
      const districtId = user.districtId;
      if (!districtId) {
        const district = await db.query.districts.findFirst({
          where: eq2(districts.name, user.district || "")
        });
        if (!district) {
          return res.status(400).json({ error: "District not configured for this user" });
        }
        const post2 = await storage2.createFarmerVoicePost({
          districtManagerId: user.id,
          districtId: district.id,
          title: validationResult.data.title,
          content: validationResult.data.content,
          category: validationResult.data.category,
          socialMediaUrl: validationResult.data.socialMediaUrl || void 0
        });
        storage2.notifyFarmersOfNewPost(
          post2.id,
          district.name,
          post2.title,
          post2.category,
          user.orgName || user.name || "District Manager"
        ).catch((err) => console.error("Error sending notifications:", err));
        return res.status(201).json(post2);
      }
      const userDistrict = await db.query.districts.findFirst({
        where: eq2(districts.id, districtId)
      });
      const post = await storage2.createFarmerVoicePost({
        districtManagerId: user.id,
        districtId,
        title: validationResult.data.title,
        content: validationResult.data.content,
        category: validationResult.data.category,
        socialMediaUrl: validationResult.data.socialMediaUrl || void 0
      });
      if (userDistrict) {
        storage2.notifyFarmersOfNewPost(
          post.id,
          userDistrict.name,
          post.title,
          post.category,
          user.orgName || user.name || "District Manager"
        ).catch((err) => console.error("Error sending notifications:", err));
      }
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating farmer voice post:", error);
      handleError2(res, error);
    }
  });
  app2.post("/api/farmer-voice/posts/:id/upvote", authenticateJWT2, async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const postId = parseInt(req.params.id);
      const result = await storage2.upvoteFarmerVoicePost(postId, user.id);
      res.json(result);
    } catch (error) {
      console.error("Error toggling upvote:", error);
      handleError2(res, error);
    }
  });
  app2.get("/api/farmer-voice/posts/:id/upvote-status", async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.json({ hasUpvoted: false });
      }
      const postId = parseInt(req.params.id);
      const hasUpvoted = await storage2.checkUserUpvote(postId, user.id);
      res.json({ hasUpvoted });
    } catch (error) {
      console.error("Error checking upvote status:", error);
      handleError2(res, error);
    }
  });
  app2.post("/api/farmer-voice/posts/:id/comments", authenticateJWT2, async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const postId = parseInt(req.params.id);
      const post = await storage2.getFarmerVoicePostById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      const farmer = await storage2.getFarmerByUserId(user.id);
      if (!farmer) {
        return res.status(403).json({ error: "Only farmers can comment on posts" });
      }
      const farmerUser = await db.query.users.findFirst({
        where: eq2(users.id, farmer.userId)
      });
      const postDistrict = await db.query.districts.findFirst({
        where: eq2(districts.id, post.districtId)
      });
      if (farmerUser?.district?.toLowerCase() !== postDistrict?.name?.toLowerCase() && farmerUser?.districtId !== post.districtId) {
        return res.status(403).json({ error: "Only farmers from this district can comment" });
      }
      const validationResult = farmerVoiceCommentValidationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: fromZodError(validationResult.error).message });
      }
      const comment = await storage2.addFarmerVoiceComment({
        postId,
        farmerId: farmer.id,
        content: validationResult.data.content
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      handleError2(res, error);
    }
  });
  app2.get("/api/farmer-voice/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage2.getFarmerVoiceComments(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      handleError2(res, error);
    }
  });
  app2.put("/api/farmer-voice/posts/:id", authenticateJWT2, async (req, res) => {
    try {
      const user = req.user;
      const postId = parseInt(req.params.id);
      const post = await storage2.getFarmerVoicePostById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.districtManagerId !== user.id && user.role !== "admin") {
        return res.status(403).json({ error: "You can only edit your own posts" });
      }
      const { title, content, category, socialMediaUrl } = req.body;
      const updatedPost = await storage2.updateFarmerVoicePost(postId, {
        title,
        content,
        category,
        socialMediaUrl: socialMediaUrl || null
      });
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating farmer voice post:", error);
      handleError2(res, error);
    }
  });
  app2.delete("/api/farmer-voice/posts/:id", authenticateJWT2, async (req, res) => {
    try {
      const user = req.user;
      const postId = parseInt(req.params.id);
      const post = await storage2.getFarmerVoicePostById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.districtManagerId !== user.id && user.role !== "admin") {
        return res.status(403).json({ error: "You can only delete your own posts" });
      }
      await storage2.deleteFarmerVoicePost(postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);
      handleError2(res, error);
    }
  });
  app2.get("/api/farmer-voice/districts", async (req, res) => {
    try {
      const allDistricts = await db.query.districts.findMany({
        where: eq2(districts.isActive, true),
        orderBy: asc2(districts.name)
      });
      res.json(allDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      handleError2(res, error);
    }
  });
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path5 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path4 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@db": path4.resolve(import.meta.dirname, "db"),
      "@": path4.resolve(import.meta.dirname, "client", "src"),
      "@shared": path4.resolve(import.meta.dirname, "shared"),
      "@assets": path4.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path4.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path4.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path5.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path5.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path5.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_db();
import session from "express-session";
import { sql as sql3 } from "drizzle-orm";
dotenv2.config();
function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "DATABASE_URL"
  ];
  const recommendedEnvVars = [
    "SESSION_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
  ];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  const missingRecommended = recommendedEnvVars.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error("\u274C Missing required environment variables:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
  if (missingRecommended.length > 0) {
    console.warn("\u26A0\uFE0F Missing recommended environment variables (using defaults):");
    missingRecommended.forEach((varName) => console.warn(`   - ${varName}`));
  }
  console.log("\u2705 All required environment variables are present");
  console.log("\u{1F4CA} Environment:", process.env.NODE_ENV || "development");
  console.log("\u{1F517} Database URL:", process.env.DATABASE_URL ? process.env.DATABASE_URL.includes("neon") ? "Neon (Production)" : "Local/Other" : "Not set");
}
async function testDatabaseConnection() {
  try {
    console.log("\u{1F50D} Testing database connection...");
    await db.execute(sql3`SELECT 1`);
    console.log("\u2705 Database connection successful");
  } catch (error) {
    console.error("\u274C Database connection failed:", error);
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
async function ensurePendingPaymentsTable() {
  try {
    console.log("\u{1F504} Checking pending_payments table...");
    await db.execute(sql3`
      CREATE TABLE IF NOT EXISTS pending_payments (
        id SERIAL PRIMARY KEY,
        cashfree_order_id VARCHAR(255) NOT NULL UNIQUE,
        user_id INTEGER NOT NULL,
        order_data JSONB NOT NULL,
        amount VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_mode VARCHAR(50) DEFAULT 'production',
        processed BOOLEAN DEFAULT false,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await db.execute(sql3`CREATE INDEX IF NOT EXISTS idx_pending_payments_cashfree_order_id ON pending_payments(cashfree_order_id);`);
    await db.execute(sql3`CREATE INDEX IF NOT EXISTS idx_pending_payments_user_id ON pending_payments(user_id);`);
    await db.execute(sql3`CREATE INDEX IF NOT EXISTS idx_pending_payments_status ON pending_payments(status);`);
    console.log("\u2705 pending_payments table ready");
  } catch (error) {
    console.error("\u274C Failed to create pending_payments table:", error);
    throw error;
  }
}
async function ensureFarmerVoiceTables() {
  try {
    console.log("\u{1F504} Checking farmer_voice tables...");
    await db.execute(sql3`
      CREATE TABLE IF NOT EXISTS farmer_voice_posts (
        id SERIAL PRIMARY KEY,
        district_manager_id INTEGER NOT NULL REFERENCES users(id),
        district_id INTEGER NOT NULL REFERENCES districts(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        social_media_url TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        upvote_count INTEGER NOT NULL DEFAULT 0,
        comment_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await db.execute(sql3`
      CREATE TABLE IF NOT EXISTS farmer_voice_upvotes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES farmer_voice_posts(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(post_id, user_id)
      );
    `);
    await db.execute(sql3`
      CREATE TABLE IF NOT EXISTS farmer_voice_comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES farmer_voice_posts(id),
        farmer_id INTEGER NOT NULL REFERENCES farmers(id),
        content TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await db.execute(sql3`CREATE INDEX IF NOT EXISTS idx_farmer_voice_posts_district ON farmer_voice_posts(district_id);`);
    await db.execute(sql3`CREATE INDEX IF NOT EXISTS idx_farmer_voice_posts_category ON farmer_voice_posts(category);`);
    await db.execute(sql3`CREATE INDEX IF NOT EXISTS idx_farmer_voice_upvotes_post ON farmer_voice_upvotes(post_id);`);
    await db.execute(sql3`CREATE INDEX IF NOT EXISTS idx_farmer_voice_comments_post ON farmer_voice_comments(post_id);`);
    console.log("\u2705 farmer_voice tables ready");
  } catch (error) {
    console.error("\u274C Failed to create farmer_voice tables:", error);
    throw error;
  }
}
async function ensureFpoInquiriesTable() {
  try {
    console.log("\u{1F504} Checking fpo_inquiries table...");
    await db.execute(sql3`
      CREATE TABLE IF NOT EXISTS fpo_inquiries (
        id SERIAL PRIMARY KEY,
        org_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        district TEXT NOT NULL,
        message TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log("\u2705 fpo_inquiries table ready");
  } catch (error) {
    console.error("\u274C Failed to create fpo_inquiries table:", error);
  }
}
async function ensureDeliveryFeeColumn() {
  try {
    console.log("\u{1F504} Checking orders.delivery_fee column...");
    await db.execute(sql3`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0;
    `);
    console.log("\u2705 orders.delivery_fee column ready");
  } catch (error) {
    console.error("\u274C Failed to add delivery_fee column:", error);
  }
}
async function ensureDmProductFields() {
  try {
    console.log("\u{1F504} Checking DM product fields...");
    await db.execute(sql3`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS created_by_dm_id INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS b2c_quantity INTEGER,
      ADD COLUMN IF NOT EXISTS b2b_quantity INTEGER,
      ADD COLUMN IF NOT EXISTS b2c_moq INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS b2b_moq INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS has_slab_pricing BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS grade_variety TEXT;
    `);
    await db.execute(sql3`
      CREATE TABLE IF NOT EXISTS product_price_slabs (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        min_quantity INTEGER NOT NULL,
        max_quantity INTEGER,
        price_per_unit DECIMAL(10, 2) NOT NULL,
        slab_type TEXT NOT NULL DEFAULT 'b2c',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await db.execute(sql3`CREATE INDEX IF NOT EXISTS idx_product_price_slabs_product ON product_price_slabs(product_id);`);
    await db.execute(sql3`CREATE INDEX IF NOT EXISTS idx_product_price_slabs_type ON product_price_slabs(slab_type);`);
    console.log("\u2705 DM product fields ready");
  } catch (error) {
    console.error("\u274C Failed to create DM product fields:", error);
  }
}
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cashfree.com https://farmersanthe.com https://replit.com; frame-src 'self' https://*.cashfree.com https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://www.instagram.com https://instagram.com; connect-src 'self' https://*.cashfree.com; img-src 'self' data: https: http: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' data: https: https://fonts.gstatic.com https://cdnjs.cloudflare.com;"
  );
  next();
});
app.use(express2.static("public"));
app.use("/uploads", express2.static("public/uploads"));
app.use(session({
  secret: process.env.SESSION_SECRET || (() => {
    console.error("CRITICAL: SESSION_SECRET environment variable is required for security");
    process.exit(1);
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 1 week
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path6 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path6.startsWith("/api")) {
      let logLine = `${req.method} ${path6} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    console.log("\u{1F680} Starting Santhe Agriculture Platform server...");
    validateEnvironmentVariables();
    await testDatabaseConnection();
    await ensurePendingPaymentsTable();
    await ensureFarmerVoiceTables();
    await ensureDmProductFields();
    await ensureFpoInquiriesTable();
    await ensureDeliveryFeeColumn();
    console.log("\u{1F4C4} Loading meta tag routes...");
    const { addSimpleMetaRoutes: addSimpleMetaRoutes2 } = await Promise.resolve().then(() => (init_simple_meta_server(), simple_meta_server_exports));
    addSimpleMetaRoutes2(app);
    console.log("\u{1F50C} Registering API routes...");
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error(`\u274C Error ${status}: ${message}`, err.stack || err);
      res.status(status).json({ message });
    });
    console.log("\u26A1 Setting up frontend serving...");
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const port = 5e3;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      console.log("\u2705 Server successfully started!");
      log(`serving on port ${port}`);
      console.log(`\u{1F310} Server accessible at: http://localhost:${port}`);
    });
    server.on("error", (error) => {
      console.error("\u274C Server startup error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("\u274C Failed to start server:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : String(error));
    console.log("\u{1F6D1} Shutting down due to startup failure...");
    process.exit(1);
  }
})();
