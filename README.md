<<<<<<< HEAD
# AGROWDHA
Farmersanthe
=======
# Harvest Direct - Agricultural Marketplace

An advanced agricultural marketplace connecting farmers directly with consumers through a comprehensive digital platform.

## Architecture

This application uses a simplified, unified configuration approach:
- **Database**: Local PostgreSQL for all environments
- **Storage**: Local file system (`./public/uploads/`)
- **Configuration**: Environment-based settings with fallback to development defaults

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### Production Deployment
```bash
# Use the deployment script
./deploy.sh

# Or manually:
export NODE_ENV=production
npm run db:push
npm run db:seed
npm start
```

## Key Features

### Comprehensive Agricultural Platform
- **Farmer Management**: Complete farmer profiles with location-based discovery
- **Product Catalog**: Advanced product management with seasonal availability
- **Order Management**: Comprehensive order processing with delivery date handling
- **Admin Dashboard**: Complete administrative interface for platform management
- **Authentication**: Secure JWT-based authentication system

### Storage System
- **Local File Storage**: All uploads stored in `./public/uploads/`
- **Image Management**: Complete image upload and management system
- **Production Ready**: Optimized for deployment environments

### Database Architecture
- **Drizzle ORM**: Type-safe database operations
- **Schema Management**: Automatic schema synchronization
- **Connection Pooling**: Optimized for production workloads

### Production Benefits
- **Scalable Storage**: Cloudinary CDN for global image delivery
- **High Availability**: Neon PostgreSQL with automatic scaling
- **Performance**: Optimized queries and connection pooling
- **Security**: Secure credential management

## Deployment Process

1. **Database Setup**: Production database schema is automatically synchronized
2. **Image Migration**: Existing local images can be migrated to Cloudinary
3. **Environment Variables**: Set production credentials
4. **Deploy**: Application automatically detects environment and configures accordingly

## Architecture

### Backend
- Express.js server with TypeScript
- JWT authentication with session support
- File upload handling (multer → local/Cloudinary)
- RESTful API design

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Wouter for routing
- Shadcn/ui components

### Database Schema
- Users, Farmers, Customers
- Products, Categories, Images
- Orders, Order Items
- Reviews, Calendar Entries
- Newsletter Subscriptions

The application is ready for production deployment with automatic environment-based configuration switching.
>>>>>>> ac0ea32 (added the files)
