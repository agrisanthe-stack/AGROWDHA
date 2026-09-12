import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

interface District {
  id: number;
  name: string;
  state: string | null;
  isActive: boolean;
}

interface DistrictContextType {
  selectedDistrictId: number | null;
  selectedDistrictName: string | null;
  districts: District[];
  isLoading: boolean;
  showSelector: boolean;
  setShowSelector: (show: boolean) => void;
  selectDistrict: (districtId: number) => void;
  clearDistrict: () => void;
}

const STORAGE_KEY = "santhe_selected_district";

export const DistrictContext = createContext<DistrictContextType | null>(null);

export function useDistrictState() {
  const auth = useAuth();
  const user = auth?.user;

  const { data: districts = [], isLoading } = useQuery<District[]>({
    queryKey: ["/api/districts", { onlyActive: true }],
    staleTime: 300000,
  });

  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved) : null;
  });

  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    if (user?.districtId && !selectedDistrictId) {
      setSelectedDistrictId(user.districtId);
      localStorage.setItem(STORAGE_KEY, String(user.districtId));
    }
  }, [user?.districtId]);

  useEffect(() => {
    if (!isLoading && districts.length > 0 && !selectedDistrictId) {
      setShowSelector(true);
    }
  }, [isLoading, districts.length, selectedDistrictId]);

  const selectDistrict = useCallback((districtId: number) => {
    setSelectedDistrictId(districtId);
    localStorage.setItem(STORAGE_KEY, String(districtId));
    setShowSelector(false);
  }, []);

  const clearDistrict = useCallback(() => {
    setSelectedDistrictId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const selectedDistrictName = districts.find(d => d.id === selectedDistrictId)?.name || null;

  return {
    selectedDistrictId,
    selectedDistrictName,
    districts,
    isLoading,
    showSelector,
    setShowSelector,
    selectDistrict,
    clearDistrict,
  };
}

export function useDistrict() {
  const context = useContext(DistrictContext);
  if (!context) {
    throw new Error("useDistrict must be used within a DistrictProvider");
  }
  return context;
}
