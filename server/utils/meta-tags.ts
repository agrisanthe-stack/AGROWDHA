import { storage } from "../storage";

interface MetaTagData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  siteName: string;
}

export function generateMetaTags(data: MetaTagData): string {
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

export async function getProductMetaTags(identifier: string): Promise<MetaTagData | null> {
  try {
    let id: number;
    
    // Check if identifier is a number (old ID format) or extract ID from slug
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      // Extract ID from slug (format: name-category-id)
      const match = identifier.match(/-(\d+)$/);
      if (!match) return null;
      id = parseInt(match[1]);
    }
    
    const product = await storage.getProductById(id);
    if (!product) return null;
    
    // Fetch farmer for farm name and avatar
    const farmer = product.farmerId ? await storage.getFarmerById(product.farmerId) : null;
    const farmName = farmer?.farmName || 'Local Farm';
    
    console.log('Meta tags - Product data:', {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      unitsPerBox: (product as any).unitsPerBox,
      category: (product as any).category,
      farmName: farmName
    });
    
    const categoryName = (product as any).category?.name || 'Produce';
    const cleanDescription = product.description.replace(/["\n\r]/g, ' ').trim();
    
    // Format pricing to show box-based pricing with quantity information
    const formatProductPrice = (price: string | number, unitsPerBox?: number, unit?: string) => {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      const formattedPrice = `₹${numPrice.toFixed(2)}/box`;
      
      console.log('Formatting price:', { price, unitsPerBox, unit, formattedPrice });
      
      if (unitsPerBox && unit) {
        const result = `${formattedPrice} (${unitsPerBox} ${unit} per box)`;
        console.log('Price with units:', result);
        return result;
      }
      console.log('Price without units:', formattedPrice);
      return formattedPrice;
    };
    
    const priceDisplay = formatProductPrice(product.price, (product as any).unitsPerBox, product.unit);
    console.log('Final price display:', priceDisplay);
    
    // Create enhanced description with prominent pricing and quantity info for social media
    const unitsPerBox = (product as any).unitsPerBox || 1;
    const unit = product.unit || 'kg';
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    
    // Title includes pricing (appears in BOLD on social media)
    const title = `${product.name} - ₹${price.toFixed(2)}/box (${unitsPerBox} ${unit}) | ${farmName}`;
    
    const description = `Fresh ${product.name} from ${farmName}. ${cleanDescription.slice(0, 100)}... ${product.status === 'Pre-Order' ? 'Pre-order now' : 'Available now'} on FarmerSanthe marketplace.`;
    
    // Ensure absolute URL for image - prioritize product images, then farmer avatar, then default
    const getAbsoluteImageUrl = async (product: any, farmer: any) => {
      let imageUrl = '';
      
      try {
        // Try to get the first product image from the database
        const productImages = await storage.getProductImages(product.id);
        if (productImages && productImages.length > 0) {
          imageUrl = productImages[0].imageUrl || '';
        } else if (product.imageUrl) {
          imageUrl = product.imageUrl;
        }
        
        // If no product image, fall back to farmer's avatar (from user) or logoUrl
        if (!imageUrl && farmer) {
          imageUrl = farmer.user?.avatar || farmer.logoUrl || '';
        }
        
        if (!imageUrl) {
          return farmer?.user?.avatar || farmer?.logoUrl || 'https://farmersanthe.com/logo-santhe.png';
        }
        
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          // If it's a Cloudinary URL, add transformations for better WhatsApp compatibility
          if (imageUrl.includes('cloudinary.com')) {
            // Add transformations for optimal social media preview: 1200x630 (16:9 ratio), high quality, auto format
            const transformedUrl = imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/');
            console.log('Cloudinary transformation applied:', { original: imageUrl, transformed: transformedUrl });
            return transformedUrl;
          }
          return imageUrl;
        }
        return `https://farmersanthe.com${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
      } catch (error) {
        console.error('Error getting product image:', error);
        if (product.imageUrl) {
          const fallbackUrl = product.imageUrl;
          if (fallbackUrl.startsWith('http://') || fallbackUrl.startsWith('https://')) {
            return fallbackUrl;
          }
          return `https://farmersanthe.com${fallbackUrl.startsWith('/') ? fallbackUrl : '/' + fallbackUrl}`;
        }
        // Try farmer avatar as fallback
        return farmer?.user?.avatar || farmer?.logoUrl || 'https://farmersanthe.com/logo-santhe.png';
      }
    };
    
    // Generate proper slug format for product URL
    const generateProductSlug = (productName: string, categoryName: string, productId: number): string => {
      const cleanName = productName
        .trim() // Trim first to handle leading/trailing spaces
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
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
      const slug = parts.join('-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      console.log('Product slug generation:', { productName, categoryName, productId, cleanName, cleanCategory, parts, slug });
      return slug;
    };
    
    const productSlug = generateProductSlug(product.name, categoryName, product.id);
    
    return {
      title,
      description,
      image: await getAbsoluteImageUrl(product, farmer),
      url: `https://farmersanthe.com/products/${productSlug}`,
      type: 'product',
      siteName: 'FarmerSanthe'
    };
  } catch (error) {
    console.error('Error generating product meta tags:', error);
    return null;
  }
}

export async function getFarmerMetaTags(identifier: string): Promise<MetaTagData | null> {
  try {
    let id: number;
    
    // Check if identifier is a number (old ID format) or extract ID from slug
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      // Extract ID from slug (format: farmname-location-id)
      const match = identifier.match(/-(\d+)$/);
      if (!match) return null;
      id = parseInt(match[1]);
    }
    
    const farmer = await storage.getFarmerById(id);
    if (!farmer) return null;
    
    const title = `${farmer.farmName} - Organic Farm in ${farmer.location} | FarmerSanthe.com`;
    const cleanFarmerDescription = farmer.description?.replace(/["\n\r]/g, ' ').trim() || 'Premium quality farm-fresh products direct from the farmer.';
    const description = `Discover fresh produce from ${farmer.farmName} in ${farmer.location}. ${cleanFarmerDescription.slice(0, 120)} Rating: ${farmer.rating}/5`;
    
    // Ensure absolute URL for image - prefer logoUrl or farmImages over default imageUrl
    const getAbsoluteImageUrl = (farmer: any) => {
      let imageUrl = '';
      
      // Priority: user avatar > logoUrl > first farmImage > imageUrl > default logo
      if (farmer.user?.avatar) {
        imageUrl = farmer.user.avatar;
      } else if (farmer.logoUrl) {
        imageUrl = farmer.logoUrl;
      } else if (farmer.farmImages && Array.isArray(farmer.farmImages) && farmer.farmImages.length > 0) {
        imageUrl = farmer.farmImages[0];
      } else if (farmer.imageUrl) {
        imageUrl = farmer.imageUrl;
      } else {
        return 'https://farmersanthe.com/logo-santhe.png';
      }
      
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        // If it's a Cloudinary URL, add transformations for better WhatsApp compatibility
        if (imageUrl.includes('cloudinary.com')) {
          // Add transformations for optimal social media preview: 1200x630 (16:9 ratio), high quality, auto format
          const transformedUrl = imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill,f_auto,q_auto:good/');
          console.log('Farmer Cloudinary transformation applied:', { original: imageUrl, transformed: transformedUrl });
          return transformedUrl;
        }
        // If it's an Unsplash URL, update the size parameters for social media
        if (imageUrl.includes('unsplash.com')) {
          // Replace small dimensions with social media optimal size
          let transformedUrl = imageUrl
            .replace(/w=\d+/g, 'w=1200')
            .replace(/h=\d+/g, 'h=630');
          // Add crop parameters if not present
          if (!transformedUrl.includes('fit=')) {
            transformedUrl += '&fit=crop';
          }
          console.log('Unsplash transformation applied:', { original: imageUrl, transformed: transformedUrl });
          return transformedUrl;
        }
        return imageUrl;
      }
      return `https://farmersanthe.com${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    };
    
    // Generate proper slug format for farmer URL
    const generateFarmerSlug = (farmName: string, location: string, farmerId: number): string => {
      const cleanFarmName = farmName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const cleanLocation = location
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      return `${cleanFarmName}-${cleanLocation}-${farmerId}`;
    };
    
    const farmerSlug = generateFarmerSlug(farmer.farmName, farmer.location, farmer.id);
    
    return {
      title,
      description,
      image: getAbsoluteImageUrl(farmer),
      url: `https://farmersanthe.com/farmers/${farmerSlug}`,
      type: 'business.business',
      siteName: 'FarmerSanthe'
    };
  } catch (error) {
    console.error('Error generating farmer meta tags:', error);
    return null;
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function getDefaultMetaTags(): MetaTagData {
  return {
    title: 'FarmerSanthe - Fresh Produce Direct from Farmers',
    description: 'Buy fresh, organic produce directly from local farmers. Support sustainable agriculture and get the best quality fruits and vegetables delivered to your door.',
    image: 'https://farmersanthe.com/logo-santhe.png',
    url: 'https://farmersanthe.com',
    type: 'website',
    siteName: 'FarmerSanthe'
  };
}