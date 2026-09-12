import { useQuery } from "@tanstack/react-query";
import { useDistrict } from "./use-district";
import { Product } from "@/lib/types";

interface DeliveryTier {
  minWeightKg: string;
  maxWeightKg: string | null;
  priceRs: string;
  sortOrder: number;
}

interface DeliveryPricingResponse {
  deliverable: boolean;
  hasFpo: boolean;
  tiers: DeliveryTier[];
}

function calcWeightKg(product: Product, qty: number, isB2B: boolean): number {
  const unit = (product.unit || "kg").toLowerCase();
  const unitsPerBox = parseFloat(String((product as any).unitsPerBox || 1));
  const totalUnits = isB2B ? qty : qty * unitsPerBox;

  if (unit === "kg") return totalUnits;
  if (unit === "g") return totalUnits / 1000;
  if (unit === "litres" || unit === "l") return totalUnits;
  if (unit === "ml") return totalUnits / 1000;
  if (unit === "pieces") {
    const approxGrams = (product as any).approxWeightPerPieceGrams
      ? parseFloat(String((product as any).approxWeightPerPieceGrams))
      : 200;
    return (totalUnits * approxGrams) / 1000;
  }
  return totalUnits;
}

function calcFeeFromTiers(tiers: DeliveryTier[], weightKg: number): number {
  const sorted = [...tiers].sort((a, b) => parseFloat(a.minWeightKg) - parseFloat(b.minWeightKg));
  for (const tier of sorted) {
    const min = parseFloat(tier.minWeightKg);
    const max = tier.maxWeightKg ? parseFloat(tier.maxWeightKg) : Infinity;
    if (weightKg >= min && weightKg <= max) {
      return parseFloat(tier.priceRs);
    }
  }
  // Weight exceeds all tiers — apply the last (highest) tier
  if (sorted.length > 0) {
    return parseFloat(sorted[sorted.length - 1].priceRs);
  }
  return 0;
}

const NO_DISTRICT = { fee: null as null, isLoading: false, deliverable: true, hasFpo: false, districtName: null as string | null };

export function useDeliveryPrice(product: Product | undefined | null, qty: number, isB2B = false) {
  const { selectedDistrictId, selectedDistrictName } = useDistrict();

  const { data, isLoading } = useQuery<DeliveryPricingResponse>({
    queryKey: [`/api/products/${product?.id}/delivery-pricing`, { districtId: selectedDistrictId }],
    queryFn: async () => {
      const url = `/api/products/${product!.id}/delivery-pricing?districtId=${selectedDistrictId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch delivery pricing");
      return res.json();
    },
    enabled: !!product?.id && !!selectedDistrictId,
    staleTime: 300000,
  });

  // No district selected — hide delivery info entirely
  if (!selectedDistrictId) return NO_DISTRICT;

  if (!data || !product) {
    return { fee: null, isLoading, deliverable: true, hasFpo: false, districtName: selectedDistrictName };
  }

  if (!data.hasFpo) {
    return { fee: null, isLoading: false, deliverable: true, hasFpo: false, districtName: selectedDistrictName };
  }

  if (!data.deliverable) {
    return { fee: null, isLoading: false, deliverable: false, hasFpo: true, districtName: selectedDistrictName };
  }

  if (data.tiers.length === 0) {
    return { fee: 0, isLoading: false, deliverable: true, hasFpo: true, districtName: selectedDistrictName };
  }

  const weightKg = calcWeightKg(product, qty, isB2B);
  const fee = calcFeeFromTiers(data.tiers, weightKg);

  return { fee, isLoading: false, deliverable: true, hasFpo: true, districtName: selectedDistrictName };
}
