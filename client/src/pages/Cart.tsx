import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useDistrict } from "@/hooks/use-district";
import { Loader2, Truck, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define OrderFee interface for type safety
interface OrderFee {
  id: number;
  name: string;
  description: string | null;
  type: "fixed" | "percentage";
  value: string;
  isActive: boolean;
  applyToSubtotal: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function Cart() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { selectedDistrictId } = useDistrict();
  const [location, navigate] = useLocation();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  
  // Query to fetch active order fees
  const { data: orderFees, isLoading: orderFeesLoading } = useQuery({
    queryKey: ["/api/order-fees/active"],
    enabled: cartItems.length > 0,
  });

  // Fetch FPO org names to display per-FPO delivery fees
  const { data: orgsData } = useQuery<Array<{ id: number; orgName: string }>>({
    queryKey: ["/api/orgs"],
  });
  const dmIdToOrgName = useMemo(() => {
    const map: Record<number, string> = {};
    (orgsData || []).forEach(org => { map[org.id] = org.orgName || `FPO #${org.id}`; });
    return map;
  }, [orgsData]);

  // Get user's active subscription for fee calculation
  const { data: subData } = useQuery<{ subscription: any }>({
    queryKey: ["/api/my-subscription"],
    enabled: !!user,
  });
  const hasZeroPlatformFee = subData?.subscription?.plan?.zeroPlatformFee || false;

  const checkIsPlatformFee = (fee: any) => {
    const name = (fee.name || '').toLowerCase();
    return fee.type === 'percentage' && (name.includes('tech') || name.includes('support') || name.includes('platform') || name.includes('santhe'));
  };
  
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    // Format as Indian Rupees
    return numPrice.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };
  
  // Calculate total weight of cart items (in kg)
  const totalWeightKg = useMemo(() => {
    return cartItems.reduce((totalWeight, item) => {
      const qty = item.quantity;
      const unit = (item.unit || 'kg').toLowerCase();
      const unitsPerBox = parseFloat(String(item.unitsPerBox || 1));
      // B2B quantities are already in individual units (pieces/kg), not boxes
      const totalUnits = (item as any).b2bOrder ? qty : qty * unitsPerBox;

      if (unit === 'kg') {
        return totalWeight + totalUnits;
      } else if (unit === 'g') {
        return totalWeight + (totalUnits / 1000);
      } else if (unit === 'litres' || unit === 'l') {
        return totalWeight + totalUnits;
      } else if (unit === 'ml') {
        return totalWeight + (totalUnits / 1000);
      } else if (unit === 'pieces') {
        const approxGrams = item.approxWeightPerPieceGrams
          ? parseFloat(String(item.approxWeightPerPieceGrams))
          : 200;
        return totalWeight + (totalUnits * approxGrams / 1000);
      }
      return totalWeight + totalUnits;
    }, 0);
  }, [cartItems]);

  const userDistrictId = selectedDistrictId || user?.districtId;

  // Group cart items by FPO (DM) and calculate weight per FPO
  // Use createdByDmId for FPO-created products, or approvedByUserId for farmer products approved by FPO
  const fpoWeights = useMemo(() => {
    const groups: Record<number, number> = {};
    cartItems.forEach(item => {
      const dmId = item.createdByDmId || (item.approvalType === 'fpo' ? item.approvedByUserId : null);
      if (!dmId) return;
      
      const qty = item.quantity;
      const unit = (item.unit || 'kg').toLowerCase();
      const unitsPerBox = parseFloat(String(item.unitsPerBox || 1));
      // B2B quantities are already in individual units (pieces/kg), not boxes
      const totalUnits = (item as any).b2bOrder ? qty : qty * unitsPerBox;
      let weightKg = 0;

      if (unit === 'kg') weightKg = totalUnits;
      else if (unit === 'g') weightKg = totalUnits / 1000;
      else if (unit === 'litres' || unit === 'l') weightKg = totalUnits;
      else if (unit === 'ml') weightKg = totalUnits / 1000;
      else if (unit === 'pieces') {
        const approxGrams = item.approxWeightPerPieceGrams
          ? parseFloat(String(item.approxWeightPerPieceGrams)) : 200;
        weightKg = totalUnits * approxGrams / 1000;
      } else {
        weightKg = totalUnits;
      }

      groups[dmId] = (groups[dmId] || 0) + weightKg;
    });
    return groups;
  }, [cartItems]);

  const dmUserIds = useMemo(() => Object.keys(fpoWeights).map(Number), [fpoWeights]);

  // Fetch delivery fees for all FPOs in cart
  const { data: deliveryFeeData } = useQuery({
    queryKey: ["/api/delivery/calculate", fpoWeights],
    queryFn: async () => {
      if (dmUserIds.length === 0) return { totalFee: 0, fpoFees: [] };
      
      const fpoFees: Array<{ dmId: number; fee: number; weightKg: number }> = [];
      let totalFee = 0;

      for (const dmId of dmUserIds) {
        const weightKg = fpoWeights[dmId] || 0;
        if (weightKg <= 0) continue;
        
        try {
          const res = await fetch("/api/delivery/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dmUserId: dmId, totalWeightKg: weightKg, districtId: userDistrictId }),
          });
          if (res.ok) {
            const data = await res.json();
            const fee = data.fee || 0;
            fpoFees.push({ dmId, fee, weightKg });
            totalFee += fee;
          }
        } catch {
          // Silently skip failed fee lookups
        }
      }

      return { totalFee, fpoFees };
    },
    enabled: cartItems.length > 0 && dmUserIds.length > 0,
  });

  const deliveryFee = deliveryFeeData?.totalFee || 0;

  // Calculate fees
  const subtotal = getTotalPrice();
  
  // Calculate total with fees
  const calculateOrderTotal = () => {
    if (!orderFees || orderFeesLoading) {
      return subtotal + deliveryFee;
    }
    
    let total = subtotal + deliveryFee;
    let calculationBase = subtotal;
    
    // Sort fees by display order
    const sortedFees = Array.isArray(orderFees) ? [...orderFees].sort((a: any, b: any) => a.displayOrder - b.displayOrder) : [];
    
    sortedFees.forEach((fee: any) => {
      if (fee.isActive && !fee.applyToSubtotal) {
        if (hasZeroPlatformFee && checkIsPlatformFee(fee)) return;
        const feeValue = parseFloat(fee.value);
        if (fee.type === "fixed") {
          total += feeValue;
        } else if (fee.type === "percentage") {
          total += (subtotal * feeValue) / 100;
        }
      }
    });
    
    sortedFees.forEach((fee: any) => {
      if (fee.isActive && fee.applyToSubtotal) {
        if (hasZeroPlatformFee && checkIsPlatformFee(fee)) return;
        const feeValue = parseFloat(fee.value);
        if (fee.type === "fixed") {
          total += feeValue;
        } else if (fee.type === "percentage") {
          total += (calculationBase * feeValue) / 100;
          calculationBase += (calculationBase * feeValue) / 100;
        }
      }
    });
    
    return total;
  };
  
  // Calculate fee amount for display
  const calculateFeeAmount = (fee: OrderFee) => {
    const feeValue = parseFloat(fee.value);
    if (fee.type === "fixed") {
      return feeValue;
    } else {
      // For percentage fees
      const baseAmount = fee.applyToSubtotal ? 
        subtotal + calculatePreviousCompoundFees(fee) : 
        subtotal;
      return (baseAmount * feeValue) / 100;
    }
  };
  
  // Helper to calculate previous compound fees for accurate fee display
  const calculatePreviousCompoundFees = (currentFee: OrderFee) => {
    if (!orderFees) return 0;
    
    const sortedFees = [...orderFees]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .filter(fee => fee.isActive && fee.applyToSubtotal && fee.displayOrder < currentFee.displayOrder);
    
    let additionalBase = 0;
    let runningBase = subtotal;
    
    sortedFees.forEach(fee => {
      const feeValue = parseFloat(fee.value);
      if (fee.type === "percentage") {
        const feeAmount = (runningBase * feeValue) / 100;
        additionalBase += feeAmount;
        runningBase += feeAmount;
      } else {
        additionalBase += feeValue;
      }
    });
    
    return additionalBase;
  };
  
  const total = calculateOrderTotal();
  
  // Group items by farm
  const itemsByFarm = cartItems.reduce((acc, item) => {
    const farmId = item.farm.id;
    if (!acc[farmId]) {
      acc[farmId] = {
        farm: item.farm,
        items: []
      };
    }
    acc[farmId].items.push(item);
    return acc;
  }, {} as Record<string, { farm: any, items: typeof cartItems }>);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8 text-center">{t('cart.title')}</h1>
        
        {cartItems.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>{t('cart.empty')}</CardTitle>
              <CardDescription>
                {t('cart.emptyDesc')}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/products">{t('cart.continueShopping')}</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {Object.values(itemsByFarm).map(({ farm, items }) => (
                <Card key={farm.id} className="mb-6">
                  <CardHeader className="py-4">
                    <div className="flex items-center">
                      <img 
                        src={farm.logoUrl} 
                        alt={farm.name} 
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <CardTitle className="text-lg">{farm.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">{t('cart.product')}</TableHead>
                          <TableHead>{t('cart.description')}</TableHead>
                          <TableHead>{t('cart.price')}</TableHead>
                          <TableHead>{t('cart.quantity')}</TableHead>
                          <TableHead className="text-right">{t('cart.total')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => {
                          const isB2BItem = !!item.b2bOrder;
                          const b2bSlabApplied = item.b2bSlabApplied;
                          const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                          const unitsPerBox = parseFloat(String(item.unitsPerBox || 1));
                          const lineTotal = itemPrice * item.quantity;
                          
                          return (
                            <TableRow key={item.cartItemId}>
                              <TableCell>
                                <div className="h-16 w-16 rounded-md overflow-hidden relative">
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    className="h-full w-full object-cover"
                                  />
                                  {isB2BItem ? (
                                    <div className="absolute top-0 left-0 bg-green-600 text-white text-[10px] px-1 py-0.5 rounded-br font-bold">
                                      Wholesale
                                    </div>
                                  ) : (
                                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] px-1 py-0.5 rounded-br font-bold">
                                      Retail
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  {isB2BItem ? (
                                    <>
                                      <p className="text-xs text-green-700 font-medium bg-green-50 inline-block px-1.5 py-0.5 rounded mt-1">
                                        Wholesale Order
                                      </p>
                                      {b2bSlabApplied && (
                                        <p className="text-xs text-green-600 mt-1">
                                          Slab: {b2bSlabApplied.minQuantity}-{b2bSlabApplied.maxQuantity || '∞'} {(item as any).wholesaleUnit || item.unit} @ ₹{formatPrice(b2bSlabApplied.pricePerUnit)}/{(item as any).wholesaleUnit || item.unit}
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-xs text-blue-700 font-medium bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-1">
                                        Retail
                                      </p>
                                      {unitsPerBox !== 1 && (
                                        <p className="text-xs text-blue-600 mt-1">
                                          {unitsPerBox} {item.unit} per box
                                        </p>
                                      )}
                                    </>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    Available until {formatDate(item.availableUntil)}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  {isB2BItem ? (
                                    <div>₹{formatPrice(itemPrice)}/{(item as any).wholesaleUnit || item.unit}</div>
                                  ) : unitsPerBox !== 1 ? (
                                    <div>₹{formatPrice(itemPrice)}/box</div>
                                  ) : (
                                    <div>₹{formatPrice(itemPrice)}/{item.unit}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {isB2BItem ? (
                                  <div className="text-center font-medium">
                                    {item.quantity} {(item as any).wholesaleUnit || item.unit}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <Select
                                      value={item.quantity.toString()}
                                      onValueChange={(value) => updateQuantity(item.cartItemId, parseInt(value))}
                                    >
                                      <SelectTrigger className="w-20">
                                        <SelectValue placeholder="Qty" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[...Array(10)].map((_, i) => (
                                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            {i + 1}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <span className="text-xs text-gray-500">
                                      {unitsPerBox !== 1 ? 'box' : item.unit}
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end">
                                  <span className="mr-4 font-medium">₹{formatPrice(lineTotal)}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => removeFromCart(item.cartItemId)}
                                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {/* Per-FPO delivery fee row */}
                    {(() => {
                      const dmId = (items[0] as any)?.createdByDmId || ((items[0] as any)?.approvalType === 'fpo' ? (items[0] as any)?.approvedByUserId : null);
                      if (!dmId) return null;
                      const fpoFee = deliveryFeeData?.fpoFees?.find(f => f.dmId === dmId);
                      if (!fpoFee || fpoFee.fee <= 0) return null;
                      return (
                        <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5" />
                            Delivery Fee
                            <span className="text-xs">({fpoFee.weightKg.toFixed(1)} kg)</span>
                          </span>
                          <span className="font-medium text-foreground">₹{formatPrice(fpoFee.fee)}</span>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{t('checkout.orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t('cart.subtotal')}</span>
                      <span>₹{formatPrice(subtotal)}</span>
                    </div>
                    
                    {/* Delivery fee */}
                    {deliveryFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          Delivery Fee
                          {totalWeightKg > 0 && (
                            <span className="text-xs text-gray-400">({totalWeightKg.toFixed(1)} kg)</span>
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[200px] text-xs">
                                Delivery fee is set by the FPO and varies based on your district and order weight.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                        <span>₹{formatPrice(deliveryFee)}</span>
                      </div>
                    )}

                    {/* Display order fees */}
                    {orderFeesLoading ? (
                      <div className="flex justify-center py-1">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : orderFees && orderFees.length > 0 ? (
                      orderFees
                        .filter(fee => fee.isActive)
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map(fee => {
                          const isWaived = hasZeroPlatformFee && checkIsPlatformFee(fee);
                          const feeAmount = isWaived ? 0 : calculateFeeAmount(fee);
                          return (
                            <div key={fee.id} className="flex justify-between text-sm">
                              <span>
                                {fee.name} {isWaived && <span className="text-amber-600 text-xs">(Farm Direct)</span>}
                              </span>
                              <span className={isWaived ? 'text-green-600' : ''}>
                                {isWaived ? '₹0' : `₹${formatPrice(feeAmount)}`}
                              </span>
                            </div>
                          );
                        })
                    ) : null}
                    
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>{t('cart.total')}</span>
                      <span>₹{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      if (!user) {
                        // Redirect to login if user is not authenticated
                        navigate("/login?redirect=/checkout");
                      } else {
                        // Go to checkout if authenticated
                        navigate("/checkout");
                      }
                    }}
                  >
                    {t('cart.checkout')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
