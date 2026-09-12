import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Package, 
  Building2, 
  Tag, 
  TrendingDown, 
  ShoppingCart,
  Calendar,
  Scale,
  Store,
  Truck,
  CheckCircle2
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface PriceSlab {
  id: number;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: string;
  slabType: string;
}

interface FPOProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  unit: string;
  imageUrl: string | null;
  status: string;
  inventory: number;
  harvestDate: string;
  availableUntil: string;
  gradeVariety: string | null;
  b2cQuantity: number | null;
  b2bQuantity: number | null;
  b2cMoq: number | null;
  b2bMoq: number | null;
  hasSlabPricing: boolean;
  category: { id: number; name: string } | null;
  createdByDm: { id: number; fullName: string; district: string } | null;
  priceSlabs: PriceSlab[];
}

function formatIndianCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function FPOProductDetail() {
  const { t } = useTranslation();
  const [, params] = useRoute("/fpo-products/:id");
  const productId = params?.id;
  const { addToCart, cartItems } = useCart();
  const { toast } = useToast();
  const [buyerType, setBuyerType] = useState<"b2c" | "b2b">("b2c");
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery<FPOProduct>({
    queryKey: [`/api/fpo-products/${productId}`],
    enabled: !!productId,
  });

  const b2cSlabs = useMemo(() => {
    if (!product?.priceSlabs) return [];
    return product.priceSlabs.filter(slab => slab.slabType === 'b2c');
  }, [product?.priceSlabs]);

  const b2bSlabs = useMemo(() => {
    if (!product?.priceSlabs) return [];
    return product.priceSlabs.filter(slab => slab.slabType === 'b2b');
  }, [product?.priceSlabs]);

  const currentSlabs = buyerType === 'b2c' ? b2cSlabs : b2bSlabs;
  const currentStock = buyerType === 'b2c' ? (product?.b2cQuantity || 0) : (product?.b2bQuantity || 0);
  const currentMoq = buyerType === 'b2c' ? (product?.b2cMoq || 1) : (product?.b2bMoq || 1);

  // Calculate cart quantities for this product to show true available stock
  const cartQtyB2C = cartItems
    .filter(item => item.id === product?.id && !item.b2bOrder)
    .reduce((sum, item) => sum + item.quantity, 0);
  const cartQtyB2B = cartItems
    .filter(item => item.id === product?.id && !!item.b2bOrder)
    .reduce((sum, item) => sum + item.quantity, 0);
  const availableB2CStock = Math.max(0, (product?.b2cQuantity || 0) - cartQtyB2C);
  const availableB2BStockFPO = Math.max(0, (product?.b2bQuantity || 0) - cartQtyB2B);
  const availableCurrentStock = buyerType === 'b2c' ? availableB2CStock : availableB2BStockFPO;

  const isOutOfStock = availableCurrentStock <= 0;
  const hasSlabsForCurrentType = currentSlabs.length > 0;

  const findApplicableSlab = (qty: number, slabs: PriceSlab[]): PriceSlab | null => {
    if (!slabs || slabs.length === 0) return null;
    
    const sortedSlabs = [...slabs].sort((a, b) => a.minQuantity - b.minQuantity);
    
    for (const slab of sortedSlabs) {
      const min = slab.minQuantity;
      const max = slab.maxQuantity;
      if (qty >= min && (max === null || qty <= max)) {
        return slab;
      }
    }
    
    const lastSlab = sortedSlabs[sortedSlabs.length - 1];
    if (lastSlab && lastSlab.maxQuantity === null && qty >= lastSlab.minQuantity) {
      return lastSlab;
    }
    
    return null;
  };

  const applicableSlab = findApplicableSlab(quantity, currentSlabs);

  const calculatePrice = (qty: number): { pricePerUnit: number; total: number; slab: PriceSlab | null } => {
    if (!product) return { pricePerUnit: 0, total: 0, slab: null };
    
    const slab = findApplicableSlab(qty, currentSlabs);
    
    if (slab) {
      const pricePerUnit = parseFloat(slab.pricePerUnit);
      return { pricePerUnit, total: pricePerUnit * qty, slab };
    }
    
    const basePrice = parseFloat(product.price);
    return { pricePerUnit: basePrice, total: basePrice * qty, slab: null };
  };

  const priceDetails = calculatePrice(quantity);

  const handleQuantityChange = (value: string) => {
    if (isOutOfStock) return;
    const numValue = parseInt(value) || currentMoq;
    const maxStock = Math.max(availableCurrentStock, currentMoq);
    setQuantity(Math.max(currentMoq, Math.min(numValue, maxStock)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const finalQuantity = Math.max(quantity, currentMoq);
    
    addToCart({
      id: product.id,
      name: product.name,
      price: priceDetails.pricePerUnit,
      unit: product.unit,
      imageUrl: product.imageUrl || '',
      farmerId: 0,
      farmerName: product.createdByDm?.fullName || 'FPO Product',
      inventory: currentStock,
      unitsPerBox: 1
    } as any, finalQuantity);
    
    toast({
      title: t('fpoProductDetail.addedToCart'),
      description: t('fpoProductDetail.addedToCartDesc', { quantity: finalQuantity, unit: product.unit, name: product.name, price: formatIndianCurrency(priceDetails.pricePerUnit) }),
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('fpoProductDetail.productNotFound')}</h2>
        <p className="text-gray-500 mb-4">{t('fpoProductDetail.productNotFoundDesc')}</p>
        <Link href="/fpo-products">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('fpoProductDetail.backToFpoProducts')}
          </Button>
        </Link>
      </div>
    );
  }

  const hasB2C = product.b2cQuantity && product.b2cQuantity > 0;
  const hasB2B = product.b2bQuantity && product.b2bQuantity > 0;
  const hasBothOptions = hasB2C && hasB2B;

  return (
    <>
      <Helmet>
        <title>{t('fpoProductDetail.pageTitleTemplate', { name: product.name })}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Link href="/fpo-products" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('fpoProductDetail.backToFpoProducts')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <Package className="h-24 w-24 text-green-400" />
              </div>
            )}
            
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge className="bg-green-600 text-white">{t('fpoProductDetail.fpoProductBadge')}</Badge>
              {product.category && (
                <Badge variant="secondary">{product.category.name}</Badge>
              )}
              {hasSlabsForCurrentType && (
                <Badge className="bg-purple-600 text-white">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {t('fpoProductDetail.bulkDiscount')}
                </Badge>
              )}
              {isOutOfStock && (
                <Badge className="bg-red-600 text-white">{t('fpoProductDetail.outOfStock')}</Badge>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.gradeVariety && (
                <p className="text-lg text-gray-600">{product.gradeVariety}</p>
              )}
            </div>

            <p className="text-gray-700">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>{t('fpoProductDetail.availableUntil', { date: formatDate(product.availableUntil) })}</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  {t('fpoProductDetail.delivery')} {(() => {
                    const harvestDate = product.harvestDate ? new Date(product.harvestDate) : null;
                    const today = new Date();
                    if (product.status === 'Pre-Order' && harvestDate && harvestDate > today) {
                      const delivery = new Date(harvestDate.getTime() + 86400000);
                      return formatDate(delivery.toISOString());
                    }
                    const tomorrow = new Date(today.getTime() + 86400000);
                    return formatDate(tomorrow.toISOString());
                  })()}
                </span>
              </div>
            </div>

            {product.createdByDm && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Building2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">{t('fpoProductDetail.districtHub', { district: product.createdByDm.district })}</p>
                  <p className="text-sm text-gray-500">{t('fpoProductDetail.managedBy', { name: product.createdByDm.fullName })}</p>
                </div>
              </div>
            )}

            {hasBothOptions ? (
              <Tabs value={buyerType} onValueChange={(v) => { setBuyerType(v as "b2c" | "b2b"); setQuantity(v === "b2c" ? (product.b2cMoq || 1) : (product.b2bMoq || 1)); }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="b2c" className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    {t('fpoProductDetail.retailB2C')}
                  </TabsTrigger>
                  <TabsTrigger value="b2b" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    {t('fpoProductDetail.wholesaleB2B')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="b2c" className="mt-4">
                  <BuyerSection
                    type="b2c"
                    stock={availableB2CStock}
                    moq={product.b2cMoq || 1}
                    unit={product.unit}
                    slabs={b2cSlabs}
                    basePrice={product.price}
                  />
                </TabsContent>

                <TabsContent value="b2b" className="mt-4">
                  <BuyerSection
                    type="b2b"
                    stock={availableB2BStockFPO}
                    moq={product.b2bMoq || 1}
                    unit={product.unit}
                    slabs={b2bSlabs}
                    basePrice={product.price}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <BuyerSection
                type={hasB2B ? "b2b" : "b2c"}
                stock={hasB2B ? availableB2BStockFPO : availableB2CStock}
                moq={hasB2B ? (product.b2bMoq || 1) : (product.b2cMoq || 1)}
                unit={product.unit}
                slabs={hasB2B ? b2bSlabs : b2cSlabs}
                basePrice={product.price}
              />
            )}

            <Card className={`border-2 ${isOutOfStock ? 'border-red-200 bg-red-50' : 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'}`}>
              <CardContent className="p-6">
                {isOutOfStock ? (
                  <div className="text-center py-4">
                    <Package className="h-12 w-12 text-red-300 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-red-600">{t('fpoProductDetail.currentlyOutOfStock')}</p>
                    <p className="text-sm text-red-500 mt-1">
                      {t('fpoProductDetail.stockNotAvailable', { type: buyerType === 'b2c' ? t('fpoProductDetail.retailType') : t('fpoProductDetail.wholesaleType') })}
                    </p>
                    {hasBothOptions && (
                      <p className="text-sm text-gray-500 mt-2">
                        {t('fpoProductDetail.trySwitching', { option: buyerType === 'b2c' ? t('fpoProductDetail.wholesaleB2B') : t('fpoProductDetail.retailB2C') })}
                      </p>
                    )}
                  </div>
                ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {t('fpoProductDetail.enterQuantity', { unit: product.unit })}
                    </label>
                    <span className="text-sm text-gray-500">
                      {t('fpoProductDetail.stock', { quantity: availableCurrentStock, unit: product.unit })}
                    </span>
                  </div>
                  
                  <Input
                    type="number"
                    min={currentMoq}
                    max={availableCurrentStock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="text-lg h-12 font-semibold text-center"
                    placeholder={`Min: ${currentMoq}`}
                  />
                  
                  {currentMoq > 1 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      {t('fpoProductDetail.minimumOrderQuantity', { moq: currentMoq, unit: product.unit })}
                    </p>
                  )}

                  {applicableSlab && (
                    <div className="bg-purple-100 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center gap-2 text-purple-700 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>
                          {t('fpoProductDetail.slabApplied', { range: `${applicableSlab.minQuantity}${applicableSlab.maxQuantity ? `-${applicableSlab.maxQuantity}` : '+'}`, unit: product.unit })}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                      <span>{t('fpoProductDetail.pricePerUnit', { unit: product.unit })}</span>
                      <span className="font-semibold">{formatIndianCurrency(priceDetails.pricePerUnit)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                      <span>{t('fpoProductDetail.quantity')}</span>
                      <span className="font-semibold">{quantity} {product.unit}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">{t('fpoProductDetail.totalAmount')}</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatIndianCurrency(priceDetails.total)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {quantity} {product.unit} × {formatIndianCurrency(priceDetails.pricePerUnit)}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    disabled={quantity < currentMoq || quantity > availableCurrentStock}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {t('fpoProductDetail.addToCartWithPrice', { total: formatIndianCurrency(priceDetails.total) })}
                  </Button>
                </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function BuyerSection({ 
  type, 
  stock, 
  moq, 
  unit, 
  slabs, 
  basePrice 
}: { 
  type: "b2c" | "b2b";
  stock: number;
  moq: number;
  unit: string;
  slabs: PriceSlab[];
  basePrice: string;
}) {
  const { t } = useTranslation();
  const isB2B = type === "b2b";
  const bgClass = isB2B ? "bg-green-50" : "bg-blue-50";
  const textClass = isB2B ? "text-green-700" : "text-blue-700";
  const borderClass = isB2B ? "border-green-200" : "border-blue-200";

  return (
    <div className="space-y-4">
      <Card className={`${bgClass} ${borderClass} border`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className={`font-semibold ${textClass}`}>
                {isB2B ? t('fpoProductDetail.wholesaleStock') : t('fpoProductDetail.retailStock')}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stock} {unit}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{t('fpoProductDetail.minOrder')}</p>
              <p className={`text-lg font-semibold ${textClass}`}>{moq} {unit}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {slabs && slabs.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />
              {isB2B ? t('fpoProductDetail.wholesalePriceTiers') : t('fpoProductDetail.retailPriceTiers')}
            </CardTitle>
            <p className="text-sm text-gray-500">{t('fpoProductDetail.pricePerUnitBasedOnQty', { unit })}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {slabs.map((slab, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-purple-700 font-medium">
                      {slab.minQuantity}{slab.maxQuantity ? ` - ${slab.maxQuantity}` : '+'} {unit}
                    </span>
                  </div>
                  <span className="font-bold text-purple-600">
                    {formatIndianCurrency(slab.pricePerUnit)} / {unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('fpoProductDetail.basePrice')}</span>
              <span className="text-xl font-bold text-green-600">
                {formatIndianCurrency(basePrice)} / {unit}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
