import type { Express } from "express";
import { getProductMetaTags, getFarmerMetaTags } from "./meta-tags";
import { storage } from "../storage";
import { db } from "../../db";
import { users } from "@shared/schema";
import { eq, and } from "drizzle-orm";

console.log('📄 simple-meta-server.ts loaded at:', new Date().toISOString());

// Function to generate SEO-friendly product slug
function generateProductSlug(productName: string, categoryName: string, productId: number): string {
  const cleanName = productName
    .trim() // Trim first to handle leading/trailing spaces
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  
  const cleanCategory = categoryName
    .trim() // Trim first to handle leading/trailing spaces
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  
  // Combine parts and clean up any empty segments or multiple dashes
  const parts = [cleanCategory, cleanName, productId.toString()].filter(part => part && part.length > 0);
  return parts.join('-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

// Custom function to format product pricing with box-based format
async function getProductMetaTagsWithBoxPricing(identifier: string) {
  try {
    console.log('🔍 getProductMetaTagsWithBoxPricing called with:', identifier);
    let id: number;
    
    // Check if identifier is numeric (ID) or contains a slug
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      // Extract ID from slug format (name-id)
      const match = identifier.match(/-(\d+)$/);
      if (!match) return null;
      id = parseInt(match[1]);
    }
    
    const product = await storage.getProductById(id);
    if (!product) return null;
    
    const farmer = product.farmerId ? await storage.getFarmerById(product.farmerId) : null;
    const farmName = farmer?.farmName || 'Local Farm';
    
    const categoryName = (product as any).category?.name || 'Produce';
    const cleanDescription = product.description.replace(/["\n\r]/g, ' ').trim();
    
    // Create enhanced description with prominent pricing and quantity info
    const unitsPerBox = (product as any).unitsPerBox || 1;
    const unit = product.unit || 'kg';
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    
    // Title includes pricing (appears in BOLD on social media)
    const title = `${product.name} - ₹${price.toFixed(2)}/box (${unitsPerBox} ${unit}) | ${farmName}`;
    
    const description = `Fresh ${product.name} from ${farmName}. ${cleanDescription.slice(0, 100)}... ${product.status === 'Pre-Order' ? 'Pre-order now' : 'Available now'} on FarmerSanthe marketplace.`;
    
    // Get product image with farmer avatar fallback
    let imageUrl = '';
    try {
      const productImages = await storage.getProductImages(product.id);
      if (productImages && productImages.length > 0) {
        imageUrl = productImages[0].imageUrl || '';
      } else if (product.imageUrl) {
        imageUrl = product.imageUrl;
      }
      
      // If no product image, fall back to farmer's avatar (from user) or logoUrl
      if (!imageUrl && farmer) {
        imageUrl = (farmer as any).user?.avatar || farmer.logoUrl || '';
      }
    } catch (error) {
      console.error('Error getting product images:', error);
      // Try farmer avatar as fallback
      imageUrl = product.imageUrl || (farmer as any)?.user?.avatar || farmer?.logoUrl || 'https://farmersanthe.com/logo-santhe.png';
    }
    
    // Ensure absolute URL and apply Cloudinary transformations for better WhatsApp compatibility
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https://farmersanthe.com${imageUrl}`;
    }
    
    if (!imageUrl || imageUrl === 'https://farmersanthe.com') {
      imageUrl = (farmer as any)?.user?.avatar || farmer?.logoUrl || 'https://farmersanthe.com/logo-santhe.png';
    }
    
    // Apply Cloudinary transformations for better social media preview
    console.log('🔍 Image URL before transformation:', imageUrl);
    if (imageUrl.includes('cloudinary.com')) {
      const originalUrl = imageUrl;
      imageUrl = imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/');
      console.log('✅ Product Cloudinary transformation applied:', { original: originalUrl, transformed: imageUrl });
    } else if (imageUrl.includes('unsplash.com')) {
      // Handle Unsplash images - resize for social media
      const originalUrl = imageUrl;
      imageUrl = imageUrl
        .replace(/w=\d+/g, 'w=1200')
        .replace(/h=\d+/g, 'h=630');
      if (!imageUrl.includes('fit=')) {
        imageUrl += '&fit=crop';
      }
      console.log('✅ Unsplash transformation applied:', { original: originalUrl, transformed: imageUrl });
    } else {
      console.log('❌ Not a Cloudinary/Unsplash URL, no transformation applied');
    }
    
    // Generate SEO-friendly product URL
    const productSlug = generateProductSlug(product.name, categoryName, id);
    const productUrl = `https://farmersanthe.com/products/${productSlug}`;
    
    return {
      title,
      description,
      image: imageUrl,
      url: productUrl,
      type: 'product',
      siteName: 'FarmerSanthe',
      // Additional product-specific data for enhanced social media display
      price: `₹${price.toFixed(2)}`,
      currency: 'INR',
      availability: product.status === 'Pre-Order' ? 'PreOrder' : 'InStock',
      quantity: `${unitsPerBox} ${unit} per box`,
      category: categoryName
    };
  } catch (error) {
    console.error('Error generating product meta tags:', error);
    return null;
  }
}

// Specialized function for BIB (Buy in Bulk) products
async function getBIBProductMetaTags(identifier: string) {
  try {
    console.log('🔍 getBIBProductMetaTags called with:', identifier);
    let id: number;
    
    // Check if identifier is numeric (ID) or contains a slug
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      // Extract ID from slug format (name-id)
      const match = identifier.match(/-(\d+)$/);
      if (!match) return null;
      id = parseInt(match[1]);
    }
    
    const product = await storage.getProductById(id);
    if (!product) return null;
    
    // Check if it's actually a BIB product
    const isBIB = (product as any).bulkInBulk === true;
    if (!isBIB) {
      // Fall back to regular product meta tags
      return getProductMetaTagsWithBoxPricing(identifier);
    }
    
    // Fetch farmer for avatar fallback
    const farmer = product.farmerId ? await storage.getFarmerById(product.farmerId) : null;
    const farmName = farmer?.farmName || (product as any).farm?.name || 'Local Farm';
    
    const categoryName = (product as any).category?.name || 'Produce';
    const cleanDescription = product.description.replace(/["\n\r]/g, ' ').trim();
    
    const priceRangeMin = (product as any).priceRangeMin || 0;
    const priceRangeMax = (product as any).priceRangeMax || 0;
    const totalAvailable = (product as any).totalAvailableQuantity || 0;
    const unit = product.unit || 'kg';
    const isSold = (product as any).isSold || false;
    
    // Title includes pricing (appears in BOLD on social media)
    const status = isSold ? 'SOLD OUT' : 'OPEN FOR QUOTES';
    const title = `${product.name} - ₹${priceRangeMin.toLocaleString('en-IN')} to ₹${priceRangeMax.toLocaleString('en-IN')} | ${totalAvailable} ${unit} | ${farmName}`;
    
    // Format BIB-specific description
    const description = `${status} | Fresh ${product.name} wholesale lot from ${farmName}. ${cleanDescription.slice(0, 100)}... Submit your competitive quote now on FarmerSanthe BIB marketplace!`;
    
    // Get product image with farmer avatar fallback
    let imageUrl = '';
    try {
      const productImages = await storage.getProductImages(product.id);
      if (productImages && productImages.length > 0) {
        imageUrl = productImages[0].imageUrl || '';
      } else if (product.imageUrl) {
        imageUrl = product.imageUrl;
      }
      
      // If no product image, fall back to farmer's avatar (from user) or logoUrl
      if (!imageUrl && farmer) {
        imageUrl = (farmer as any).user?.avatar || farmer.logoUrl || '';
      }
    } catch (error) {
      console.error('Error getting BIB product images:', error);
      imageUrl = product.imageUrl || (farmer as any)?.user?.avatar || farmer?.logoUrl || 'https://farmersanthe.com/logo-santhe.png';
    }
    
    // Ensure absolute URL
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https://farmersanthe.com${imageUrl}`;
    }
    
    if (!imageUrl || imageUrl === 'https://farmersanthe.com') {
      imageUrl = (farmer as any)?.user?.avatar || farmer?.logoUrl || 'https://farmersanthe.com/logo-santhe.png';
    }
    
    // Apply Cloudinary transformations
    if (imageUrl.includes('cloudinary.com')) {
      const originalUrl = imageUrl;
      imageUrl = imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/');
      console.log('✅ BIB Product Cloudinary transformation applied:', { original: originalUrl, transformed: imageUrl });
    } else if (imageUrl.includes('unsplash.com')) {
      // Handle Unsplash images - resize for social media
      const originalUrl = imageUrl;
      imageUrl = imageUrl
        .replace(/w=\d+/g, 'w=1200')
        .replace(/h=\d+/g, 'h=630');
      if (!imageUrl.includes('fit=')) {
        imageUrl += '&fit=crop';
      }
      console.log('✅ BIB Unsplash transformation applied:', { original: originalUrl, transformed: imageUrl });
    }
    
    // Generate BIB product URL
    const productUrl = `https://farmersanthe.com/bib/${id}`;
    
    return {
      title,
      description,
      image: imageUrl,
      url: productUrl,
      type: 'product',
      siteName: 'FarmerSanthe BIB',
      // BIB-specific data
      priceRange: `₹${priceRangeMin.toLocaleString('en-IN')} - ₹${priceRangeMax.toLocaleString('en-IN')}`,
      currency: 'INR',
      availability: isSold ? 'SoldOut' : 'QuoteAvailable',
      quantity: `${totalAvailable} ${unit} wholesale lot`,
      category: categoryName,
      farmName: farmName
    };
  } catch (error) {
    console.error('Error generating BIB product meta tags:', error);
    return null;
  }
}

export function addSimpleMetaRoutes(app: Express) {
  console.log('🚀 addSimpleMetaRoutes function called at:', new Date().toISOString());
  // Direct API endpoints that social media platforms can use to get meta data
  app.get('/meta/product/:identifier', async (req, res) => {
    try {
      console.log('🎯 /meta/product route called with identifier:', req.params.identifier);
      const metaData = await getProductMetaTagsWithBoxPricing(req.params.identifier);
      if (!metaData) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Return structured data that can be easily consumed
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
  <meta name="description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
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
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get('/meta/farmer/:identifier', async (req, res) => {
    try {
      const metaData = await getFarmerMetaTags(req.params.identifier);
      if (!metaData) {
        return res.status(404).json({ error: 'Farmer not found' });
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
  <meta name="description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
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
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // HTML endpoints for direct sharing
  app.get('/share/product/:identifier', async (req, res) => {
    try {
      // First, check if this is a BIB product
      let id: number;
      if (/^\d+$/.test(req.params.identifier)) {
        id = parseInt(req.params.identifier);
      } else {
        const match = req.params.identifier.match(/-(\d+)$/);
        if (!match) return res.status(404).send('Product not found');
        id = parseInt(match[1]);
      }
      
      const product = await storage.getProductById(id);
      const isBIB = product && (product as any).bulkInBulk === true;
      
      // Use appropriate meta tag generator based on product type
      const metaData = isBIB 
        ? await getBIBProductMetaTags(req.params.identifier)
        : await getProductMetaTagsWithBoxPricing(req.params.identifier);
      
      if (!metaData) {
        return res.status(404).send('Product not found');
      }
      
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
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
      
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      res.status(500).send('Error loading product');
    }
  });

  app.get('/share/farmer/:identifier', async (req, res) => {
    try {
      const metaData = await getFarmerMetaTags(req.params.identifier);
      if (!metaData) {
        return res.status(404).send('Farmer not found');
      }
      
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
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
      
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      res.status(500).send('Error loading farmer');
    }
  });

  // Event sharing route
  app.get('/share/event/:id', async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(404).send('Event not found');
      }

      // Get event data from database
      const { db } = await import("../../db");
      const { farmEvents } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");

      const event = await db.query.farmEvents.findFirst({
        where: eq(farmEvents.id, eventId),
        with: {
          farmer: true
        }
      });

      if (!event) {
        return res.status(404).send('Event not found');
      }

      // Get farmer profile to access farmName, logoUrl, etc.
      const { farmers } = await import("@shared/schema");
      const farmerProfile = await db.query.farmers.findFirst({
        where: eq(farmers.userId, event.farmerId),
        with: {
          user: true
        }
      });

    const farmName = farmerProfile?.farmName || 'Local Farm';
    
    // Ensure absolute URL and apply Cloudinary transformations
    // Priority: event cover > farmer avatar > farmer logo > platform logo
    let imageUrl = event.coverImage || farmerProfile?.user?.avatar || farmerProfile?.logoUrl || 'https://farmersanthe.com/logo-santhe.png';
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https://farmersanthe.com${imageUrl}`;
    }
    if (imageUrl.includes('cloudinary.com')) {
      imageUrl = imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/');
    }
    // Handle Unsplash images - resize for social media
    if (imageUrl.includes('unsplash.com')) {
      imageUrl = imageUrl
        .replace(/w=\d+/g, 'w=1200')
        .replace(/h=\d+/g, 'h=630');
      if (!imageUrl.includes('fit=')) {
        imageUrl += '&fit=crop';
      }
    }

    const cleanDescription = (event.description || '').replace(/["\n\r]/g, ' ').trim();
    const pricePerSeat = typeof event.pricePerSeat === 'string' 
      ? parseFloat(event.pricePerSeat) 
      : event.pricePerSeat;
    
    // Title includes pricing (appears in BOLD on social media)
    const title = `${event.title} - ₹${pricePerSeat}/person | ${event.location} | ${farmName}`;
    
    const description = `${cleanDescription.slice(0, 120)}... Book your farm experience at ${farmName} on FarmerSanthe!`;
    
    const eventUrl = `https://farmersanthe.com/events/${eventId}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
  
  <!-- Open Graph Tags -->
  ${process.env.FACEBOOK_APP_ID ? `<meta property="fb:app_id" content="${process.env.FACEBOOK_APP_ID}" />` : ''}
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:url" content="https://farmersanthe.com/share/event/${eventId}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
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
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(html);
    } catch (error) {
      console.error('Error loading event for sharing:', error);
      res.status(500).send('Error loading event');
    }
  });

  // Handle org store URLs for social media sharing
  app.get('/org/:slug', async (req, res, next) => {
    try {
      const userAgent = req.get('User-Agent') || '';
      const isBot = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|telegram/i.test(userAgent);
      
      if (isBot) {
        const slug = req.params.slug;
        
        const dmUser = await db.query.users.findFirst({
          where: and(
            eq(users.orgSlug, slug),
            eq(users.role, 'district_manager')
          )
        });
        
        if (!dmUser) {
          return res.status(404).send('Organization not found');
        }
        
        const safeOrgName = (dmUser.orgName || 'Store').replace(/"/g, '&quot;');
        const title = `${safeOrgName} - Official Store | Santhe Farmers Market`;
        const description = `Shop fresh produce directly from ${safeOrgName}, ${dmUser.district || ''} district. Farm-fresh products from local farmers on FarmerSanthe marketplace.`;
        let imageUrl = dmUser.orgLogoUrl || 'https://farmersanthe.com/logo-santhe.png';
        const orgUrl = `https://${slug}.farmersanthe.com`;
        
        if (imageUrl && imageUrl.includes('cloudinary.com')) {
          imageUrl = imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_pad,b_white,f_auto,q_auto:good/');
        }
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
  
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${orgUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
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
        
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
      } else {
        return next();
      }
    } catch (error) {
      console.error('Error serving org meta tags:', error);
      return next();
    }
  });

  // Add routes for SEO-friendly URLs that serve dynamic meta tags
  // Handle farmer slug URLs like /farmers/harish-farm-bangalore-rural-4
  app.get('/farmers/:slug([a-z0-9-]+-\\d+)', async (req, res) => {
    try {
      console.log('🔍 SEO farmer route hit:', req.path, 'User-Agent:', req.get('User-Agent'));
      
      // Check if this is a bot/crawler by looking at User-Agent
      const userAgent = req.get('User-Agent') || '';
      const isBot = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|telegram/i.test(userAgent);
      
      if (isBot) {
        // Serve meta tags for social media crawlers
        const metaData = await getFarmerMetaTags(req.params.slug);
        if (!metaData) {
          return res.status(404).send('Farmer not found');
        }
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
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
        
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
      } else {
        // For regular browsers, redirect to home page with the intended route as a parameter
        // The React app will handle the routing from there
        return res.redirect(`/?redirect=${encodeURIComponent(req.path)}`);
      }
    } catch (error) {
      console.error('Error serving farmer meta tags:', error);
      res.status(500).send('Error loading farmer');
    }
  });

  // Handle product slug URLs like /products/grains-rice-8
  app.get('/products/:slug([a-z0-9-]+-\\d+)', async (req, res) => {
    try {
      console.log('🔍 SEO product route hit:', req.path, 'User-Agent:', req.get('User-Agent'));
      
      // Check if this is a bot/crawler by looking at User-Agent
      const userAgent = req.get('User-Agent') || '';
      const isBot = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|telegram/i.test(userAgent);
      
      if (isBot) {
        // Detect if BIB product
        let id: number;
        const match = req.params.slug.match(/-(\d+)$/);
        if (!match) return res.status(404).send('Product not found');
        id = parseInt(match[1]);
        
        const product = await storage.getProductById(id);
        const isBIB = product && (product as any).bulkInBulk === true;
        
        // Serve meta tags for social media crawlers
        const metaData = isBIB
          ? await getBIBProductMetaTags(req.params.slug)
          : await getProductMetaTagsWithBoxPricing(req.params.slug);
        
        if (!metaData) {
          return res.status(404).send('Product not found');
        }
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaData.title}</title>
  <meta name="description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="${metaData.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${metaData.url}" />
  <meta property="og:type" content="${metaData.type}" />
  <meta property="og:site_name" content="FarmerSanthe" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${metaData.title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${metaData.description.replace(/"/g, '&quot;')}" />
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
        
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
      } else {
        // For regular browsers, redirect to home page with the intended route as a parameter
        // Use req.url (not req.path) to preserve query params like ?mode=b2b
        return res.redirect(`/?redirect=${encodeURIComponent(req.url)}`);
      }
    } catch (error) {
      console.error('Error serving product meta tags:', error);
      res.status(500).send('Error loading product');
    }
  });
}