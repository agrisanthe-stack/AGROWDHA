import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import { db } from "@db";
import { sql, lte, eq, and } from "drizzle-orm";
import { products } from "@shared/schema";

// Environment variable validation
function validateEnvironmentVariables(): void {
  const requiredEnvVars = [
    'DATABASE_URL'
  ];
  
  // Optional but recommended environment variables — storage-backend-aware
  const storageType = (() => {
    if (process.env.OPENINARY_URL && process.env.OPENINARY_API_KEY) return 'openinary';
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) return 'cloudinary';
    return 'local';
  })();

  const storageRecommended =
    storageType === 'openinary'
      ? ['OPENINARY_URL', 'OPENINARY_API_KEY']
      : storageType === 'cloudinary'
      ? ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
      : [];

  const recommendedEnvVars = ['SESSION_SECRET', ...storageRecommended];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  const missingRecommended = recommendedEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  if (missingRecommended.length > 0) {
    console.warn('⚠️ Missing recommended environment variables (using defaults):');
    missingRecommended.forEach(varName => console.warn(`   - ${varName}`));
  }
  
  console.log('✅ All required environment variables are present');
  console.log('📊 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔗 Database URL:', process.env.DATABASE_URL ? (process.env.DATABASE_URL.includes('neon') ? 'Neon (Production)' : 'Local/Other') : 'Not set');
}

// Database connection test
async function testDatabaseConnection(): Promise<void> {
  try {
    console.log('🔍 Testing database connection...');
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Auto-migration for pending_payments table
async function ensurePendingPaymentsTable(): Promise<void> {
  try {
    console.log('🔄 Checking pending_payments table...');
    await db.execute(sql`
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
    
    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pending_payments_cashfree_order_id ON pending_payments(cashfree_order_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pending_payments_user_id ON pending_payments(user_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pending_payments_status ON pending_payments(status);`);
    
    console.log('✅ pending_payments table ready');
  } catch (error) {
    console.error('❌ Failed to create pending_payments table:', error);
    throw error;
  }
}

// Auto-migration for farmer_voice tables
async function ensureFarmerVoiceTables(): Promise<void> {
  try {
    console.log('🔄 Checking farmer_voice tables...');
    
    // Create farmer_voice_posts table
    await db.execute(sql`
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
    
    // Create farmer_voice_upvotes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS farmer_voice_upvotes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES farmer_voice_posts(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(post_id, user_id)
      );
    `);
    
    // Create farmer_voice_comments table
    await db.execute(sql`
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
    
    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_farmer_voice_posts_district ON farmer_voice_posts(district_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_farmer_voice_posts_category ON farmer_voice_posts(category);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_farmer_voice_upvotes_post ON farmer_voice_upvotes(post_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_farmer_voice_comments_post ON farmer_voice_comments(post_id);`);
    
    console.log('✅ farmer_voice tables ready');
  } catch (error) {
    console.error('❌ Failed to create farmer_voice tables:', error);
    throw error;
  }
}

// Auto-migration for fpo_inquiries table
async function ensureFpoInquiriesTable(): Promise<void> {
  try {
    console.log('🔄 Checking fpo_inquiries table...');
    await db.execute(sql`
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
    console.log('✅ fpo_inquiries table ready');
  } catch (error) {
    console.error('❌ Failed to create fpo_inquiries table:', error);
  }
}

// Auto-migration: add delivery_fee column to orders table
async function ensureDeliveryFeeColumn(): Promise<void> {
  try {
    console.log('🔄 Checking orders.delivery_fee column...');
    await db.execute(sql`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0;
    `);
    console.log('✅ orders.delivery_fee column ready');
  } catch (error) {
    console.error('❌ Failed to add delivery_fee column:', error);
  }
}

async function ensureEstimatedDeliveryDateColumn(): Promise<void> {
  try {
    console.log('🔄 Checking orders.estimated_delivery_date column...');
    await db.execute(sql`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery_date TIMESTAMP;
    `);
    console.log('✅ orders.estimated_delivery_date column ready');
  } catch (error) {
    console.error('❌ Failed to add estimated_delivery_date column:', error);
  }
}

// Auto-migration for DM product fields and price slabs
async function ensureDmProductFields(): Promise<void> {
  try {
    console.log('🔄 Checking DM product fields...');
    
    // Add new columns to products table
    await db.execute(sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS created_by_dm_id INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS b2c_quantity INTEGER,
      ADD COLUMN IF NOT EXISTS b2b_quantity INTEGER,
      ADD COLUMN IF NOT EXISTS b2c_moq INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS b2b_moq INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS has_slab_pricing BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS grade_variety TEXT;
    `);
    
    // Create product_price_slabs table
    await db.execute(sql`
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
    
    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_product_price_slabs_product ON product_price_slabs(product_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_product_price_slabs_type ON product_price_slabs(slab_type);`);
    
    console.log('✅ DM product fields ready');
  } catch (error) {
    console.error('❌ Failed to create DM product fields:', error);
    // Don't throw - these are optional enhancements
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS headers and CSP for external images and payment gateway
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Allow search engines to index all public HTML pages
  if (!req.path.startsWith('/api')) {
    res.header('X-Robots-Tag', 'index, follow');
  }
  
  // Content Security Policy configured for farmersanthe.com with Cashfree payment gateway, social media embeds, and blob URLs for image uploads
  res.header('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cashfree.com https://farmersanthe.com https://replit.com; " +
    "frame-src 'self' https://*.cashfree.com https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://www.instagram.com https://instagram.com; " +
    "connect-src 'self' https://*.cashfree.com; " +
    "img-src 'self' data: https: http: blob:; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "font-src 'self' data: https: https://fonts.gstatic.com https://cdnjs.cloudflare.com;"
  );
  
  next();
});

// Serve static files from the public directory
app.use(express.static('public'));

// Ensure uploads are served in production
app.use('/uploads', express.static('public/uploads'));

// Setup session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || (() => {
    console.error("CRITICAL: SESSION_SECRET environment variable is required for security");
    process.exit(1);
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log('🚀 Starting Santhe Agriculture Platform server...');
    
    // Step 1: Validate environment variables
    validateEnvironmentVariables();
    
    // Step 2: Test database connection
    await testDatabaseConnection();
    
    // Step 2.5: Ensure pending_payments table exists (auto-migration)
    await ensurePendingPaymentsTable();
    
    // Step 2.6: Ensure farmer_voice tables exist (auto-migration)
    await ensureFarmerVoiceTables();
    
    // Step 2.7: Ensure DM product fields and price slabs table exist
    await ensureDmProductFields();
    
    // Step 2.8: Ensure fpo_inquiries table exists
    await ensureFpoInquiriesTable();

    // Step 2.9: Ensure orders.delivery_fee column exists
    await ensureDeliveryFeeColumn();

    // Step 2.10: Ensure orders.estimated_delivery_date column exists
    await ensureEstimatedDeliveryDateColumn();
    
    // Step 3: Add social media meta tag routes BEFORE everything else
    console.log('📄 Loading meta tag routes...');
    const { addSimpleMetaRoutes } = await import("./utils/simple-meta-server");
    addSimpleMetaRoutes(app);
    
    // Step 4: Register API routes
    console.log('🔌 Registering API routes...');
    const server = await registerRoutes(app);
    
    // Step 5: Setup error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      console.error(`❌ Error ${status}: ${message}`, err.stack || err);
      res.status(status).json({ message });
    });
    
    // Step 6: Setup Vite for development or static serving for production
    console.log('⚡ Setting up frontend serving...');
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    
    // Step 7: Start the server
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      console.log('✅ Server successfully started!');
      log(`serving on port ${port}`);
      console.log(`🌐 Server accessible at: http://localhost:${port}`);

      // Step 8: Start the pre-order auto-activation job
      const activatePreOrders = async () => {
        try {
          const now = new Date();
          const result = await db
            .update(products)
            .set({ status: 'Available Now', updatedAt: now })
            .where(
              and(
                eq(products.status, 'Pre-Order'),
                eq(products.approvalStatus, 'approved'),
                lte(products.harvestDate, now)
              )
            )
            .returning({ id: products.id, name: products.name });

          if (result.length > 0) {
            console.log(`🌾 Pre-order activation: ${result.length} product(s) moved to "Available Now":`, result.map(p => `#${p.id} ${p.name}`).join(', '));
          }
        } catch (err) {
          console.error('❌ Pre-order activation job error:', err);
        }
      };

      // Run immediately on startup, then every hour
      activatePreOrders();
      setInterval(activatePreOrders, 60 * 60 * 1000);
      console.log('⏰ Pre-order auto-activation job scheduled (runs every hour)');
    });
    
    // Handle server startup errors
    server.on('error', (error: any) => {
      console.error('❌ Server startup error:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : String(error));
    
    // Graceful shutdown
    console.log('🛑 Shutting down due to startup failure...');
    process.exit(1);
  }
})();
