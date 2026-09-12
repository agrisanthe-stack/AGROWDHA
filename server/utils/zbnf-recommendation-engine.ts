import { storage } from "../storage";
import { db } from "../../db";
import { zbnfCrops, cropLayers } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { AICropRecommender, aiRecommender } from "./ai-crop-recommender";

// ZBNF 5-Layer Agroforestry Model
export interface CropLayer {
  id: number;
  layerNumber: number;
  layerName: string;
  description: string;
  heightRange: string;
  characteristics: string[];
}

export interface ZbnfCrop {
  id: number;
  name: string;
  scientificName?: string;
  layerNumber: number;
  category: string;
  spacingRequirement: string;
  soilTypes: string[];
  climateZones: string[];
  seasons: string[];
  companionCrops: string[];
  conflictCrops: string[];
  benefits: string[];
  waterRequirement: string;
  sunRequirement: string;
  maturityPeriod: string;
  yieldPerPlant?: string;
  marketDemand: 'low' | 'medium' | 'high';
  isNative: boolean;
  imageUrl?: string;
}

export interface DetectedGap {
  id: string;
  size: string; // e.g., "6m x 6m", "small", "medium", "large"
  location: string;
  coordinates?: { x: number; y: number };
  nearbyFeatures: string[];
}

export interface ExistingCrop {
  name: string;
  layer: number;
  location: string;
  maturityStage: string;
  spacing: string;
}

export interface FarmAnalysisInput {
  farmerId: number;
  detectionMethod: 'camera' | 'drone' | 'manual';
  farmArea?: number;
  soilType?: string;
  climateZone?: string;
  currentSeason: string;
  existingCrops: ExistingCrop[];
  detectedGaps: DetectedGap[];
  waterAvailability: 'abundant' | 'moderate' | 'scarce';
  slopeGrade: 'flat' | 'gentle' | 'steep';
  analysisNotes?: string;
}

export interface ZbnfRecommendation {
  id: string;
  cropId: number;
  cropName: string;
  targetLayer: number;
  gapId: string;
  gapSize: string;
  placementLocation: string;
  estimatedYield?: string;
  investmentRequired?: number;
  expectedROI?: string;
  priority: 'low' | 'medium' | 'high';
  reasoning: string;
  seasonalTiming: string;
  benefits: string[];
  companionPlants: string[];
  implementationSteps: string[];
}

// New interfaces for dynamic layer analysis
export interface LayerCoverage {
  layer1: { present: boolean; crops: string[]; coverage: number };
  layer2: { present: boolean; crops: string[]; coverage: number };
  layer3: { present: boolean; crops: string[]; coverage: number };
  layer4: { present: boolean; crops: string[]; coverage: number };
  layer5: { present: boolean; crops: string[]; coverage: number };
}

export interface LayerRecommendation {
  layer: number;
  layerName: string;
  status: 'missing' | 'partial' | 'complete';
  priority: 'low' | 'medium' | 'high';
  recommendedCrops: Array<{
    name: string;
    scientificName: string;
    spacing: string;
    benefits: string[];
    marketDemand: string;
    maturityPeriod: string;
    reasoning: string;
  }>;
  implementationNotes: string[];
  seasonalTiming: string;
}

export interface ImplementationStep {
  step: number;
  layer: number;
  action: string;
  timeline: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  requirements: string[];
}

export interface LayerAnalysis {
  currentLayers: LayerCoverage;
  missingLayers: number[];
  completionPercentage: number;
  recommendations: LayerRecommendation[];
  nextSteps: ImplementationStep[];
}

// ZBNF crop database based on Palekar's 5-layer model with exact specifications
const ZBNF_CROP_DATABASE: ZbnfCrop[] = [
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

// ZBNF Recommendation Engine Class
export class ZbnfRecommendationEngine {
  private crops: ZbnfCrop[];
  
  constructor() {
    this.crops = ZBNF_CROP_DATABASE;
  }

  // Get crops from database, fallback to hardcoded data
  private async getCropsFromDatabase(): Promise<ZbnfCrop[]> {
    try {
      const dbCrops = await db.query.zbnfCrops.findMany({
        with: {
          layer: true
        }
      });
      
      if (dbCrops.length > 0) {
        // Convert database crops to interface format
        return dbCrops.map(crop => ({
          id: crop.id,
          name: crop.name,
          scientificName: crop.scientificName || '',
          layerNumber: crop.layer?.layerNumber || 1,
          category: crop.category,
          spacingRequirement: crop.spacingRequirement || '',
          soilTypes: Array.isArray(crop.soilTypes) ? crop.soilTypes : [],
          climateZones: Array.isArray(crop.climateZones) ? crop.climateZones : [],
          seasons: Array.isArray(crop.seasons) ? crop.seasons : [],
          companionCrops: Array.isArray(crop.companionCrops) ? crop.companionCrops : [],
          conflictCrops: Array.isArray(crop.conflictCrops) ? crop.conflictCrops : [],
          benefits: Array.isArray(crop.benefits) ? crop.benefits : [],
          waterRequirement: crop.waterRequirement || 'moderate',
          sunRequirement: crop.sunRequirement || 'full',
          maturityPeriod: crop.maturityPeriod || '',
          yieldPerPlant: crop.yieldPerPlant || '',
          marketDemand: (crop.marketDemand as 'low' | 'medium' | 'high') || 'medium',
          isNative: crop.isNative || false,
          imageUrl: crop.imageUrl || ''
        }));
      }
    } catch (error) {
      console.log('Database not available, using hardcoded crop data');
    }
    
    // Fallback to hardcoded data
    return this.crops;
  }

  // Main recommendation function
  async generateRecommendations(analysis: FarmAnalysisInput): Promise<ZbnfRecommendation[]> {
    const recommendations: ZbnfRecommendation[] = [];
    const seenCrops = new Set<string>(); // Track seen crops to avoid duplicates
    
    for (const gap of analysis.detectedGaps) {
      const gapRecommendations = await this.analyzeGap(gap, analysis);
      
      // Filter out duplicate crops
      const uniqueRecommendations = gapRecommendations.filter(rec => {
        const cropKey = `${rec.cropName}-${rec.targetLayer}`;
        if (seenCrops.has(cropKey)) {
          return false;
        }
        seenCrops.add(cropKey);
        return true;
      });
      
      recommendations.push(...uniqueRecommendations);
    }
    
    // Sort by priority (high -> medium -> low)
    return recommendations.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // NEW: AI-powered recommendation function
  async generateAIRecommendations(analysis: FarmAnalysisInput): Promise<any[]> {
    try {
      // Get crops from database
      const crops = await this.getCropsFromDatabase();
      
      // Initialize AI recommender with current crops
      const aiEngine = new AICropRecommender(crops);
      
      // Convert analysis to AI format
      const farmConditions = {
        location: analysis.climateZone || 'Karnataka',
        soilType: analysis.soilType || 'loam',
        climateZone: analysis.climateZone || 'tropical',
        season: analysis.currentSeason,
        waterAvailability: analysis.waterAvailability,
        existingCrops: analysis.existingCrops,
        detectedGaps: analysis.detectedGaps,
        farmSize: analysis.farmArea || 1
      };

      // Generate AI recommendations
      const aiRecommendations = await aiEngine.generateAIRecommendations(farmConditions, 15);
      
      // Convert AI format to ZBNF format for compatibility
      return aiRecommendations.map((aiRec, index) => ({
        id: `ai-rec-${index}`,
        cropId: 0, // AI recommendations don't have specific crop IDs
        cropName: aiRec.cropName,
        targetLayer: aiRec.layer,
        layer: aiRec.layer, // Add layer field for frontend
        gapId: analysis.detectedGaps[0]?.id || 'gap-1',
        gapSize: analysis.detectedGaps[0]?.size || 'medium',
        placementLocation: analysis.detectedGaps[0]?.location || 'center',
        estimatedYield: aiRec.roi.expectedReturn > 0 ? `₹${aiRec.roi.expectedReturn.toLocaleString()}` : undefined,
        investmentRequired: aiRec.roi.investment,
        expectedROI: aiRec.roi.paybackPeriod,
        priority: aiRec.confidence > 80 ? 'high' : aiRec.confidence > 60 ? 'medium' : 'low',
        reasoning: aiRec.reasoning,
        seasonalTiming: aiRec.timing.plantingTime,
        benefits: aiRec.benefits,
        companionPlants: [],
        implementationSteps: aiRec.implementation,
        confidence: aiRec.confidence,
        aiPowered: true, // Flag to indicate AI recommendation
        timing: aiRec.timing,
        marketDemand: 'medium' // Default value
      }));
    } catch (error) {
      console.error('AI recommendation failed, falling back to rule-based:', error);
      // Fallback to rule-based recommendations
      return this.generateRecommendations(analysis);
    }
  }

  // Analyze individual gap and recommend crops
  private async analyzeGap(gap: DetectedGap, analysis: FarmAnalysisInput): Promise<ZbnfRecommendation[]> {
    const recommendations: ZbnfRecommendation[] = [];
    
    // Determine target layer based on gap size
    const targetLayers = this.determineTargetLayers(gap.size, analysis.existingCrops);
    
    for (const targetLayer of targetLayers) {
      const suitableCrops = await this.findSuitableCrops(targetLayer, analysis);
      
      for (const crop of suitableCrops.slice(0, 2)) { // Top 2 recommendations per layer
        const recommendation = this.createRecommendation(crop, gap, targetLayer, analysis);
        recommendations.push(recommendation);
      }
    }
    
    return recommendations;
  }

  // Determine which layers can fit in the gap
  private determineTargetLayers(gapSize: string, existingCrops: ExistingCrop[]): number[] {
    const layers: number[] = [];
    
    // Parse gap size
    const size = this.parseGapSize(gapSize);
    
    // Determine missing layers from existing crops
    const existingLayers = new Set(existingCrops.map(crop => crop.layer));
    
    // ZBNF Logic: Fill gaps based on size and missing layers
    if (size >= 10) { // Large gap (10m+)
      if (!existingLayers.has(1)) layers.push(1); // Canopy trees
      if (!existingLayers.has(2)) layers.push(2); // Sub-canopy
    }
    
    if (size >= 6) { // Medium gap (6-10m)
      if (!existingLayers.has(2)) layers.push(2); // Sub-canopy trees
      if (!existingLayers.has(3)) layers.push(3); // Shrub layer
    }
    
    if (size >= 3) { // Small-medium gap (3-6m)
      if (!existingLayers.has(3)) layers.push(3); // Shrub layer
      if (!existingLayers.has(4)) layers.push(4); // Herbaceous
    }
    
    if (size >= 1) { // Small gap (1-3m)
      if (!existingLayers.has(4)) layers.push(4); // Herbaceous
      if (!existingLayers.has(5)) layers.push(5); // Ground cover
    }
    
    if (size < 1) { // Very small gap
      layers.push(5); // Ground cover only
    }
    
    return layers.length > 0 ? layers : [5]; // Default to ground cover
  }

  // Parse gap size string to approximate meters
  private parseGapSize(gapSize: string): number {
    const size = gapSize.toLowerCase();
    
    // Extract numeric values
    const matches = size.match(/(\d+(?:\.\d+)?)\s*(?:m|meter)/);
    if (matches) {
      return parseFloat(matches[1]);
    }
    
    // Handle descriptive sizes
    if (size.includes('large')) return 12;
    if (size.includes('medium')) return 6;
    if (size.includes('small')) return 3;
    
    return 6; // Default medium size
  }

  // Find suitable crops for target layer
  private async findSuitableCrops(targetLayer: number, analysis: FarmAnalysisInput): Promise<ZbnfCrop[]> {
    const crops = await this.getCropsFromDatabase();
    console.log(`Finding crops for layer ${targetLayer} from ${crops.length} total crops`);
    
    const layerCrops = crops.filter(crop => crop.layerNumber === targetLayer);
    console.log(`Found ${layerCrops.length} crops for layer ${targetLayer}`);
    
    const suitableCrops = layerCrops.filter(crop => this.isCropSuitable(crop, analysis));
    console.log(`Found ${suitableCrops.length} suitable crops for layer ${targetLayer}`);
    
    return suitableCrops.sort((a, b) => {
      // Sort by market demand and native status
      const demandOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const aScore = demandOrder[a.marketDemand] + (a.isNative ? 1 : 0);
      const bScore = demandOrder[b.marketDemand] + (b.isNative ? 1 : 0);
      return bScore - aScore;
    });
  }

  // Check if crop is suitable for farm conditions
  private isCropSuitable(crop: ZbnfCrop, analysis: FarmAnalysisInput): boolean {
    console.log(`Checking crop ${crop.name} for suitability`);
    
    // Flexible soil compatibility matching standardized soil types from ZBNF system
    if (analysis.soilType && crop.soilTypes.length > 0) {
      const inputSoil = analysis.soilType.toLowerCase();
      const soilCompatible = crop.soilTypes.some(soilType => {
        const cropSoil = soilType.toLowerCase();
        
        // Direct match
        if (cropSoil === inputSoil) return true;
        
        // Map standardized soil types to compatible crop soil types
        if (inputSoil === 'clay' && (
          cropSoil.includes('clay') || cropSoil.includes('loam') || 
          cropSoil === 'black soil' || cropSoil === 'alluvial' || cropSoil === 'all'
        )) return true;
        
        if (inputSoil === 'sandy' && (
          cropSoil.includes('sandy') || cropSoil.includes('loam') || 
          cropSoil === 'red soil' || cropSoil === 'laterite' || cropSoil === 'all'
        )) return true;
        
        if (inputSoil === 'loam' && (
          cropSoil.includes('loam') || cropSoil.includes('clay') || cropSoil.includes('sandy') ||
          cropSoil === 'alluvial' || cropSoil === 'all'
        )) return true;
        
        if (inputSoil === 'red soil' && (
          cropSoil.includes('red') || cropSoil.includes('sandy') || cropSoil.includes('loam') ||
          cropSoil === 'laterite' || cropSoil === 'all'
        )) return true;
        
        if (inputSoil === 'black soil' && (
          cropSoil.includes('black') || cropSoil.includes('clay') || cropSoil.includes('loam') ||
          cropSoil === 'alluvial' || cropSoil === 'all'
        )) return true;
        
        if (inputSoil === 'alluvial' && (
          cropSoil.includes('alluvial') || cropSoil.includes('loam') || cropSoil.includes('fertile') ||
          cropSoil === 'clay' || cropSoil === 'sandy' || cropSoil === 'all'
        )) return true;
        
        if (inputSoil === 'laterite' && (
          cropSoil.includes('laterite') || cropSoil.includes('red') || cropSoil.includes('sandy') ||
          cropSoil.includes('loam') || cropSoil === 'all'
        )) return true;
        
        // ZBNF soil management allows adaptation in most cases
        return cropSoil.includes('loam') || cropSoil === 'all' || cropSoil.includes('well') || cropSoil.includes('fertile');
      });
      
      if (!soilCompatible) {
        console.log(`  - Soil incompatible: ${analysis.soilType} not suitable for [${crop.soilTypes.join(', ')}]`);
        return false;
      }
    }
    
    // Water requirement compatibility - properly enforced
    if (analysis.waterAvailability && crop.waterRequirement) {
      const waterCompatible = this.checkWaterCompatibility(crop.waterRequirement, analysis.waterAvailability);
      if (!waterCompatible) {
        console.log(`  - Water incompatible: crop needs ${crop.waterRequirement}, farm has ${analysis.waterAvailability}`);
        return false;
      }
    }
    
    // Climate zone compatibility with flexibility for Indian conditions
    if (analysis.climateZone && crop.climateZones.length > 0) {
      const climateCompatible = crop.climateZones.includes(analysis.climateZone) || 
                               crop.climateZones.includes('tropical') || 
                               crop.climateZones.includes('subtropical');
      if (!climateCompatible) {
        console.log(`  - Climate incompatible: ${analysis.climateZone} not in [${crop.climateZones.join(', ')}]`);
        return false;
      }
    }
    
    // Season compatibility with flexibility
    if (analysis.currentSeason && crop.seasons.length > 0) {
      const seasonCompatible = crop.seasons.includes(analysis.currentSeason) || 
                              crop.seasons.includes('year_round') ||
                              this.checkSeasonFlexibility(crop.seasons, analysis.currentSeason);
      if (!seasonCompatible) {
        console.log(`  - Season incompatible: ${analysis.currentSeason} not suitable for [${crop.seasons.join(', ')}]`);
        return false;
      }
    }
    
    console.log(`  - Crop ${crop.name} is suitable`);
    return true;
  }

  // Check water requirement compatibility - generous ZBNF approach
  private checkWaterCompatibility(cropWaterReq: string, farmWaterAvail: string): boolean {
    const reqLevel = cropWaterReq.toLowerCase();
    const availLevel = farmWaterAvail.toLowerCase();
    
    // Abundant water can support any crop
    if (availLevel === 'abundant') return true;
    
    // Moderate water can support most crops with ZBNF water conservation techniques
    // Including high water crops through mulching, drip irrigation, and water harvesting
    if (availLevel === 'moderate') {
      return reqLevel.includes('low') || reqLevel.includes('medium') || 
             reqLevel.includes('moderate') || reqLevel.includes('high');
    }
    
    // Scarce water can support low and medium crops with ZBNF water management
    if (availLevel === 'scarce') {
      return reqLevel.includes('low') || reqLevel.includes('medium') || reqLevel.includes('drought');
    }
    
    return true; // Default to compatible - ZBNF principles allow adaptation
  }

  // Check seasonal flexibility for neighboring seasons - generous ZBNF approach
  private checkSeasonFlexibility(cropSeasons: string[], currentSeason: string): boolean {
    const seasonMap: { [key: string]: string[] } = {
      'winter': ['post-harvest', 'pre-summer', 'post-monsoon'],
      'summer': ['pre-monsoon', 'winter', 'post-monsoon'],
      'monsoon': ['summer', 'post-monsoon', 'year-round', 'year_round'],
      'post-monsoon': ['monsoon', 'winter', 'year-round', 'year_round'],
      'pre-monsoon': ['summer', 'monsoon', 'year-round', 'year_round']
    };
    
    const flexibleSeasons = seasonMap[currentSeason.toLowerCase()] || [];
    // Include year-round crops and crops with flexible timing
    return cropSeasons.some(season => 
      flexibleSeasons.includes(season.toLowerCase()) ||
      season.toLowerCase().includes('year') ||
      season.toLowerCase().includes('round')
    );
  }

  // Create detailed recommendation
  private createRecommendation(
    crop: ZbnfCrop, 
    gap: DetectedGap, 
    targetLayer: number, 
    analysis: FarmAnalysisInput
  ): ZbnfRecommendation {
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
  private calculatePriority(crop: ZbnfCrop, gap: DetectedGap, analysis: FarmAnalysisInput): 'low' | 'medium' | 'high' {
    let score = 0;
    
    // Market demand
    if (crop.marketDemand === 'high') score += 3;
    else if (crop.marketDemand === 'medium') score += 2;
    else score += 1;
    
    // Native status
    if (crop.isNative) score += 2;
    
    // Water efficiency
    if (analysis.waterAvailability === 'scarce' && crop.waterRequirement === 'low') score += 2;
    
    // Quick harvest
    if (crop.maturityPeriod.includes('month') && !crop.maturityPeriod.includes('year')) score += 1;
    
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  // Generate reasoning text
  private generateReasoning(crop: ZbnfCrop, gap: DetectedGap, targetLayer: number, analysis: FarmAnalysisInput): string {
    const reasons = [];
    
    reasons.push(`${crop.name} is recommended for Layer ${targetLayer} in your ${gap.size} gap`);
    
    if (crop.marketDemand === 'high') {
      reasons.push("High market demand ensures good returns");
    }
    
    if (crop.isNative) {
      reasons.push("Native variety adapted to local conditions");
    }
    
    if (crop.benefits.includes('nitrogen_fixation')) {
      reasons.push("Improves soil fertility through nitrogen fixation");
    }
    
    if (analysis.waterAvailability === 'scarce' && crop.waterRequirement === 'low') {
      reasons.push("Low water requirement suits your water availability");
    }
    
    return reasons.join('. ') + '.';
  }

  // Get seasonal planting timing
  private getSeasonalTiming(crop: ZbnfCrop, currentSeason: string): string {
    if (crop.seasons.includes('year_round')) {
      return "Can be planted year-round";
    }
    
    if (crop.seasons.includes(currentSeason)) {
      return `Ideal to plant now (${currentSeason} season)`;
    }
    
    return `Best planted during ${crop.seasons.join(' or ')} season`;
  }

  // Generate implementation steps
  private generateImplementationSteps(crop: ZbnfCrop, gap: DetectedGap): string[] {
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
  async analyzeLayerCompleteness(detectedTrees: any[], analysis: FarmAnalysisInput): Promise<LayerAnalysis> {
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

  private calculateLayerCoverage(detectedTrees: any[]): LayerCoverage {
    const coverage: LayerCoverage = {
      layer1: { present: false, crops: [], coverage: 0 },
      layer2: { present: false, crops: [], coverage: 0 },
      layer3: { present: false, crops: [], coverage: 0 },
      layer4: { present: false, crops: [], coverage: 0 },
      layer5: { present: false, crops: [], coverage: 0 }
    };

    // Analyze detected trees and map to layers
    detectedTrees.forEach(tree => {
      const treeType = tree.type.toLowerCase();
      
      // Layer 1: Canopy Trees (12m+ height)
      if (['coconut', 'mango', 'jackfruit', 'jamun'].includes(treeType) || 
          (tree.height && parseInt(tree.height) >= 12)) {
        coverage.layer1.present = true;
        coverage.layer1.crops.push(tree.type);
        coverage.layer1.coverage += 20; // Each canopy tree covers ~20% in 36x36 plot
      }
      
      // Layer 2: Sub-canopy Trees (6-12m height)
      if (['banana', 'papaya', 'drumstick', 'areca nut', 'guava', 'sapota'].includes(treeType) || 
          (tree.height && parseInt(tree.height) >= 6 && parseInt(tree.height) < 12)) {
        coverage.layer2.present = true;
        coverage.layer2.crops.push(tree.type);
        coverage.layer2.coverage += 15; // Each sub-canopy tree covers ~15%
      }
    });

    // Cap coverage at 100%
    Object.keys(coverage).forEach(layer => {
      coverage[layer as keyof LayerCoverage].coverage = Math.min(
        coverage[layer as keyof LayerCoverage].coverage, 100
      );
    });

    return coverage;
  }

  private identifyMissingLayers(coverage: LayerCoverage): number[] {
    const missingLayers = [];
    
    if (!coverage.layer1.present) missingLayers.push(1);
    if (!coverage.layer2.present) missingLayers.push(2);
    if (!coverage.layer3.present) missingLayers.push(3);
    if (!coverage.layer4.present) missingLayers.push(4);
    if (!coverage.layer5.present) missingLayers.push(5);
    
    return missingLayers;
  }

  private async generateLayerSpecificRecommendations(missingLayers: number[], analysis: FarmAnalysisInput): Promise<LayerRecommendation[]> {
    const recommendations: LayerRecommendation[] = [];

    // Generate recommendations for ALL layers (1-5), not just missing ones
    for (let layer = 1; layer <= 5; layer++) {
      const suitableCrops = await this.findSuitableCrops(layer, analysis);
      const topCrops = suitableCrops.slice(0, 2); // Top 2 crops per layer
      
      // Determine layer status
      const status = missingLayers.includes(layer) ? 'missing' : 
                   topCrops.length < 2 ? 'incomplete' : 'optimal';
      
      recommendations.push({
        layer,
        layerName: this.getLayerName(layer),
        status,
        priority: this.getLayerPriority(layer, analysis),
        recommendedCrops: topCrops.map(crop => ({
          name: crop.name,
          scientificName: crop.scientificName || '',
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

  private getLayerName(layer: number): string {
    const names = {
      1: 'Canopy Layer (12m+ trees)',
      2: 'Sub-canopy Layer (6-12m trees)', 
      3: 'Shrub Layer (2-6m plants)',
      4: 'Herbaceous Layer (0.5-2m plants)',
      5: 'Ground Cover (0-0.5m plants)'
    };
    return names[layer as keyof typeof names] || `Layer ${layer}`;
  }

  private getLayerPriority(layer: number, analysis: FarmAnalysisInput): 'low' | 'medium' | 'high' {
    // Layer 1 (Canopy) and Layer 5 (Ground Cover) are highest priority for ZBNF
    if (layer === 1 || layer === 5) return 'high';
    if (layer === 2 || layer === 3) return 'medium';
    return 'low';
  }

  private getLayerSpecificReasoning(crop: ZbnfCrop, layer: number, analysis: FarmAnalysisInput): string {
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
    if (crop.marketDemand === 'high') reasons.push(`High market demand ensures good returns`);
    if (analysis.waterAvailability === 'scarce' && crop.waterRequirement === 'low') {
      reasons.push(`Drought-tolerant, suitable for water-scarce conditions`);
    }

    return reasons.join('. ');
  }

  private getLayerImplementationNotes(layer: number): string[] {
    const notes = {
      1: [
        'Plant canopy trees with 12m x 12m spacing',
        'Allow 3-5 years for establishment',
        'Provides long-term economic stability',
        'Creates shade for lower layers'
      ],
      2: [
        'Plant with 6m x 6m spacing between canopy trees',
        'Expect harvest within 8-18 months',
        'Provides early income while canopy establishes',
        'Maintain pruning for optimal light penetration'
      ],
      3: [
        'Plant with 3m x 3m spacing in available gaps',
        'Focus on native species for ecosystem balance',
        'Ideal for spices, herbs, and medicinal plants',
        'Provides middle-story diversity'
      ],
      4: [
        'Plant in rows or clusters with close spacing',
        'Rotate crops seasonally for continuous harvest',
        'Utilize understory areas with filtered light',
        'Focus on quick-maturing vegetables and greens'
      ],
      5: [
        'Plant as ground cover in all available spaces',
        'Prevents soil erosion and water loss',
        'Includes root vegetables and creeping plants',
        'Completes the 5-layer ZBNF system'
      ]
    };
    
    return notes[layer as keyof typeof notes] || [`Implement Layer ${layer} according to ZBNF principles`];
  }

  private getOptimalPlantingTime(layer: number, currentSeason: string): string {
    if (currentSeason === 'monsoon') {
      return layer <= 2 ? 'Plant immediately during monsoon' : 'Plant in early monsoon for best establishment';
    } else if (currentSeason === 'post_monsoon') {
      return layer <= 2 ? 'Plant immediately with irrigation support' : 'Ideal time for herbs and vegetables';
    } else if (currentSeason === 'winter') {
      return 'Perfect for leafy greens and root vegetables';
    }
    return 'Plant based on seasonal requirements';
  }

  private calculateCompletionPercentage(coverage: LayerCoverage): number {
    const layers = Object.values(coverage);
    const presentLayers = layers.filter(layer => layer.present).length;
    return Math.round((presentLayers / 5) * 100);
  }

  private generateImplementationPlan(missingLayers: number[], analysis: FarmAnalysisInput): ImplementationStep[] {
    const steps: ImplementationStep[] = [];
    
    // Sort missing layers by priority (1, 5, 2, 3, 4)
    const priorityOrder = [1, 5, 2, 3, 4];
    const sortedLayers = missingLayers.sort((a, b) => 
      priorityOrder.indexOf(a) - priorityOrder.indexOf(b)
    );

    sortedLayers.forEach((layer, index) => {
      const timeline = this.getImplementationTimeline(layer, index);
      steps.push({
        step: index + 1,
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

  private getImplementationTimeline(layer: number, stepIndex: number): string {
    const baseMonth = stepIndex * 2; // Stagger implementation
    
    if (layer === 1) return `Month ${baseMonth + 1}-${baseMonth + 2}: Plant canopy trees`;
    if (layer === 2) return `Month ${baseMonth + 1}: Plant sub-canopy trees`;
    if (layer === 3) return `Month ${baseMonth + 3}: Establish shrub layer`;
    if (layer === 4) return `Month ${baseMonth + 4}: Plant herbaceous crops`;
    if (layer === 5) return `Month ${baseMonth + 2}: Establish ground cover`;
    
    return `Month ${baseMonth + 1}: Implement layer`;
  }

  private getImplementationDescription(layer: number): string {
    const descriptions = {
      1: 'Establish the foundational canopy structure that will provide long-term shade and windbreak for the entire ZBNF system',
      2: 'Plant quick-yielding fruit trees that provide early income while the canopy layer establishes',
      3: 'Introduce shrubs for spices, herbs, and medicinal plants that complete the middle story diversity',
      4: 'Add fast-growing vegetables and greens that utilize understory space for continuous harvest',
      5: 'Complete the system with ground cover plants that prevent erosion and maximize space utilization'
    };
    
    return descriptions[layer as keyof typeof descriptions] || `Implement layer ${layer}`;
  }

  private getImplementationRequirements(layer: number): string[] {
    const requirements = {
      1: ['Quality saplings from certified nurseries', 'Deep soil preparation', 'Staking support', 'Long-term planning'],
      2: ['Disease-free saplings', 'Proper spacing calculation', 'Irrigation setup', 'Pruning tools'],
      3: ['Native species preference', 'Organic soil amendments', 'Companion planting consideration', 'Regular maintenance'],
      4: ['Seasonal seed varieties', 'Composted soil', 'Irrigation access', 'Harvest planning'],
      5: ['Ground cover seeds/cuttings', 'Mulching materials', 'Soil preparation', 'Weed management']
    };
    
    return requirements[layer as keyof typeof requirements] || [`Requirements for layer ${layer}`];
  }

  // Get available crops for a specific layer
  async getCropsByLayer(layerNumber: number): Promise<ZbnfCrop[]> {
    const crops = await this.getCropsFromDatabase();
    return crops.filter(crop => crop.layerNumber === layerNumber);
  }

  // Get crop details by ID
  async getCropById(cropId: number): Promise<ZbnfCrop | undefined> {
    const crops = await this.getCropsFromDatabase();
    return crops.find(crop => crop.id === cropId);
  }

  // Validate farm analysis input
  validateAnalysisInput(input: FarmAnalysisInput): { isValid: boolean; errors: string[] } {
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
}

// Export singleton instance
export const zbnfEngine = new ZbnfRecommendationEngine();