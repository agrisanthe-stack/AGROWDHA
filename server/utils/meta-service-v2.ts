import { storage } from "../storage";

interface MetaTagData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  siteName: string;
}

export async function generateProductMetaTags(identifier: string): Promise<MetaTagData | null> {
  try {
    console.log('🔥 META-V2: generateProductMetaTags called with identifier:', identifier);
    
    // Parse identifier to get product ID
    let id: number;
    if (/^\d+$/.test(identifier)) {
      id = parseInt(identifier);
    } else {
      const match = identifier.match(/-(\d+)$/);
      if (!match) {
        console.log('🔥 META-V2: No ID found in identifier:', identifier);
        return null;
      }
      id = parseInt(match[1]);
    }
    
    const product = await storage.getProductById(id);
    if (!product) {
      console.log('🔥 META-V2: Product not found:', id);
      return null;
    }
    
    console.log('🔥 META-V2: Product data:', {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      unitsPerBox: (product as any).unitsPerBox,
      category: (product as any).category
    });
    
    const categoryName = (product as any).category?.name || 'Produce';
    const title = `${product.name} - Fresh ${categoryName} | FarmerSanthe.com`;
    
    const cleanDescription = product.description.replace(/["\n\r]/g, ' ').trim();
    
    // Format pricing with box-based pricing
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const unitsPerBox = (product as any).unitsPerBox;
    const unit = product.unit;
    
    let priceDisplay = `₹${price.toFixed(2)}/box`;
    if (unitsPerBox && unit) {
      priceDisplay += ` (${unitsPerBox} ${unit} per box)`;
    }
    
    console.log('🔥 META-V2: Final price display:', priceDisplay);
    
    const description = `Buy fresh ${product.name} directly from local farmers. ${cleanDescription.slice(0, 80)}... Available ${product.status === 'Pre-Order' ? 'for pre-order' : 'now'} at ${priceDisplay} on FarmerSanthe marketplace.`;
    
    // Get product image URL
    let imageUrl = 'https://farmersanthe.com/logo-santhe.png'; // Default fallback
    
    try {
      const images = await storage.getProductImages(product.id);
      if (images && images.length > 0) {
        imageUrl = images[0].imageUrl;
        if (!imageUrl.startsWith('http')) {
          imageUrl = `https://farmersanthe.com${imageUrl}`;
        }
      }
    } catch (error) {
      console.log('🔥 META-V2: Error fetching product images:', error);
    }
    
    const productUrl = `https://farmersanthe.com/products/${id}`;
    
    const result: MetaTagData = {
      title: title,
      description: description,
      image: imageUrl,
      url: productUrl,
      type: 'product',
      siteName: 'FarmerSanthe'
    };
    
    console.log('🔥 META-V2: Generated meta tags:', result);
    return result;
    
  } catch (error) {
    console.error('🔥 META-V2: Error generating product meta tags:', error);
    return null;
  }
}

export function generateHtmlWithMetaTags(metaData: MetaTagData): string {
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(metaData.title)}</title>
  <meta name="description" content="${escapeHtml(metaData.description)}" />
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${escapeHtml(metaData.title)}" />
  <meta property="og:description" content="${escapeHtml(metaData.description)}" />
  <meta property="og:image" content="${escapeHtml(metaData.image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml(metaData.url)}" />
  <meta property="og:type" content="${escapeHtml(metaData.type)}" />
  <meta property="og:site_name" content="${escapeHtml(metaData.siteName)}" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(metaData.title)}" />
  <meta name="twitter:description" content="${escapeHtml(metaData.description)}" />
  <meta name="twitter:image" content="${escapeHtml(metaData.image)}" />
  
  <link rel="icon" href="https://farmersanthe.com/logo-santhe.png" type="image/png">
  
  <script>
    // Redirect to actual page after a brief delay for social media crawlers
    setTimeout(() => {
      window.location.href = '${escapeHtml(metaData.url)}';
    }, 1000);
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <img src="${escapeHtml(metaData.image)}" alt="${escapeHtml(metaData.title)}" style="max-width: 300px; margin-bottom: 20px;" />
    <h1>${escapeHtml(metaData.title)}</h1>
    <p>${escapeHtml(metaData.description)}</p>
    <p>Redirecting to <a href="${escapeHtml(metaData.url)}">FarmerSanthe.com</a>...</p>
  </div>
</body>
</html>`;
}