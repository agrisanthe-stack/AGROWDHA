import { ZbnfCrop, FarmAnalysisInput, ZbnfRecommendation, ExistingCrop, DetectedGap } from './zbnf-recommendation-engine';

interface FarmConditions {
  location: string;
  soilType: string;
  climateZone: string;
  season: string;
  waterAvailability: string;
  existingCrops: ExistingCrop[];
  detectedGaps: DetectedGap[];
  farmSize: number;
}

interface AIRecommendation {
  cropName: string;
  layer: number;
  confidence: number;
  reasoning: string;
  benefits: string[];
  implementation: string[];
  roi: {
    investment: number;
    expectedReturn: number;
    paybackPeriod: string;
  };
  timing: {
    plantingTime: string;
    harvestTime: string;
    preparation: string[];
  };
}

export class AICropRecommender {
  private cropDatabase: ZbnfCrop[];
  
  constructor(crops: ZbnfCrop[]) {
    this.cropDatabase = crops;
  }

  /**
   * AI-powered crop recommendation using intelligent analysis
   * This simulates advanced AI reasoning without requiring external APIs
   * Returns exactly 2 best crops per layer for optimal ZBNF implementation
   */
  async generateAIRecommendations(
    farmConditions: FarmConditions,
    maxRecommendations: number = 10
  ): Promise<AIRecommendation[]> {
    
    // Analyze farm context using AI-like reasoning
    const farmContext = this.analyzeFarmContext(farmConditions);
    
    // Generate recommendations using multi-factor AI analysis
    const allRecommendations = await this.performIntelligentSelection(farmContext, farmConditions);
    
    // Group recommendations by layer and select top 2 per layer
    const layerGrouped = this.groupByLayerAndSelectBest(allRecommendations, 2);
    
    // Flatten and return the final list
    const finalRecommendations = this.flattenLayerRecommendations(layerGrouped);
    
    return finalRecommendations.slice(0, maxRecommendations);
  }

  /**
   * Analyze farm context using AI-like reasoning patterns
   */
  private analyzeFarmContext(conditions: FarmConditions) {
    const context = {
      layerGaps: this.identifyMissingLayers(conditions.existingCrops),
      spaceAvailable: conditions.detectedGaps.length,
      seasonalFactors: this.analyzeSeasonalFactors(conditions.season),
      soilSuitability: this.analyzeSoilSuitability(conditions.soilType),
      climateCompatibility: this.analyzeClimateCompatibility(conditions.climateZone),
      waterOptimization: this.analyzeWaterRequirements(conditions.waterAvailability),
      locationFactors: this.analyzeLocationFactors(conditions.location),
      diversityNeeds: this.analyzeDiversityNeeds(conditions.existingCrops)
    };

    return context;
  }

  /**
   * Perform intelligent crop selection using AI-like decision making
   */
  private async performIntelligentSelection(
    context: any,
    conditions: FarmConditions
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // AI-powered layer prioritization
    const layerPriorities = this.calculateLayerPriorities(context.layerGaps);

    for (const [layer, priority] of Object.entries(layerPriorities)) {
      if (priority > 0.2) { // AI threshold for recommendation (lowered from 0.3)
        const layerCrops = this.cropDatabase.filter(crop => crop.layerNumber === parseInt(layer));
        
        for (const crop of layerCrops) {
          const aiScore = this.calculateAICompatibilityScore(crop, conditions, context);
          
          if (aiScore.overall > 0.4) { // AI confidence threshold (lowered from 0.6)
            const recommendation = this.createAIRecommendation(crop, aiScore, conditions, context);
            recommendations.push(recommendation);
          }
        }
      }
    }

    return recommendations;
  }

  /**
   * Calculate AI compatibility score for each crop
   */
  private calculateAICompatibilityScore(
    crop: ZbnfCrop,
    conditions: FarmConditions,
    context: any
  ) {
    const scores = {
      climateMatch: this.scoreClimateCompatibility(crop, conditions.climateZone),
      soilMatch: this.scoreSoilCompatibility(crop, conditions.soilType),
      seasonalMatch: this.scoreSeasonalCompatibility(crop, conditions.season),
      waterMatch: this.scoreWaterCompatibility(crop, conditions.waterAvailability),
      companionMatch: this.scoreCompanionCompatibility(crop, conditions.existingCrops),
      marketViability: this.scoreMarketViability(crop, conditions.location),
      layerOptimization: this.scoreLayerOptimization(crop, context.layerGaps),
      diversityBonus: this.scoreDiversityBonus(crop, conditions.existingCrops)
    };

    const overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

    return { ...scores, overall };
  }

  /**
   * Create detailed AI recommendation with reasoning
   */
  private createAIRecommendation(
    crop: ZbnfCrop,
    aiScore: any,
    conditions: FarmConditions,
    context: any
  ): AIRecommendation {
    
    const reasoning = this.generateAIReasoning(crop, aiScore, conditions, context);
    const benefits = this.generateSmartBenefits(crop, conditions);
    const implementation = this.generateIntelligentImplementation(crop, conditions);
    const roi = this.calculateSmartROI(crop, conditions);
    const timing = this.generateOptimalTiming(crop, conditions.season);

    return {
      cropName: crop.name,
      layer: crop.layerNumber,
      confidence: Math.round(aiScore.overall * 100),
      reasoning,
      benefits,
      implementation,
      roi,
      timing
    };
  }

  /**
   * Generate AI-powered reasoning for recommendations
   */
  private generateAIReasoning(crop: ZbnfCrop, aiScore: any, conditions: FarmConditions, context: any): string {
    const reasons = [];

    if (aiScore.climateMatch > 0.8) {
      reasons.push(`${crop.name} is perfectly suited for ${conditions.climateZone} climate conditions`);
    }

    if (aiScore.layerOptimization > 0.7) {
      reasons.push(`Fills critical gap in Layer ${crop.layerNumber} of your ZBNF system`);
    }

    if (aiScore.companionMatch > 0.7) {
      const companions = crop.companionCrops.filter(comp => 
        conditions.existingCrops.some(existing => existing.name.toLowerCase().includes(comp.toLowerCase()))
      );
      if (companions.length > 0) {
        reasons.push(`Creates beneficial companion planting with your existing ${companions.join(', ')}`);
      }
    }

    if (aiScore.marketViability > 0.8) {
      reasons.push(`High market demand in ${conditions.location} area ensures good returns`);
    }

    if (aiScore.waterMatch > 0.7) {
      reasons.push(`Water requirements match your ${conditions.waterAvailability} water availability`);
    }

    return reasons.join('. ') + '.';
  }

  /**
   * Generate smart benefits based on farm conditions
   */
  private generateSmartBenefits(crop: ZbnfCrop, conditions: FarmConditions): string[] {
    const benefits = [...crop.benefits];

    // Add context-specific benefits
    if (conditions.soilType === 'clay' && crop.name.includes('Legume')) {
      benefits.push('Improves clay soil structure through nitrogen fixation');
    }

    if (conditions.season === 'monsoon' && crop.waterRequirement === 'low') {
      benefits.push('Prevents waterlogging during heavy rains');
    }

    if (conditions.existingCrops.length < 3) {
      benefits.push('Increases farm biodiversity and ecosystem resilience');
    }

    return benefits.slice(0, 4); // Keep top 4 benefits
  }

  /**
   * Generate intelligent implementation steps
   */
  private generateIntelligentImplementation(crop: ZbnfCrop, conditions: FarmConditions): string[] {
    const steps = [];

    // Season-specific preparation
    if (conditions.season === 'pre-monsoon') {
      steps.push('Prepare planting pits before monsoon arrival');
    } else if (conditions.season === 'post-harvest') {
      steps.push('Utilize post-harvest residues for soil preparation');
    }

    steps.push(`Mark planting locations with ${crop.spacingRequirement} spacing`);
    steps.push(`Source quality ${crop.name} planting material from certified suppliers`);
    
    // Soil-specific preparation
    if (conditions.soilType === 'sandy') {
      steps.push('Add organic matter to improve water retention');
    } else if (conditions.soilType === 'clay') {
      steps.push('Improve drainage with organic compost');
    }

    steps.push('Apply ZBNF Jeevamrutha for soil enrichment');
    steps.push(`Plant according to ${crop.maturityPeriod} growth timeline`);
    steps.push('Establish natural pest management with Neemastra');

    return steps;
  }

  /**
   * Calculate smart ROI projections
   */
  private calculateSmartROI(crop: ZbnfCrop, conditions: FarmConditions) {
    // Base investment calculations
    const baseInvestment = this.calculateBaseInvestment(crop);
    const locationMultiplier = this.getLocationPriceMultiplier(conditions.location);
    const marketDemandMultiplier = crop.marketDemand === 'high' ? 1.5 : crop.marketDemand === 'medium' ? 1.2 : 1.0;

    const investment = Math.round(baseInvestment * locationMultiplier);
    const expectedReturn = Math.round(investment * marketDemandMultiplier * 1.8);
    const paybackPeriod = this.calculatePaybackPeriod(crop.maturityPeriod, marketDemandMultiplier);

    return {
      investment,
      expectedReturn,
      paybackPeriod
    };
  }

  /**
   * Generate optimal timing recommendations
   */
  private generateOptimalTiming(crop: ZbnfCrop, currentSeason: string) {
    const seasonMap = {
      'pre-monsoon': 'Early June',
      'monsoon': 'July-August',
      'post-monsoon': 'September-October',
      'winter': 'November-December',
      'summer': 'March-April'
    };

    const plantingTime = crop.seasons.includes(currentSeason) 
      ? `Optimal: ${seasonMap[currentSeason as keyof typeof seasonMap] || 'Current season'}`
      : `Wait for: ${crop.seasons[0]} season`;

    const maturityMonths = parseInt(crop.maturityPeriod.match(/\d+/)?.[0] || '6');
    const harvestTime = `${maturityMonths} months after planting`;

    const preparation = [
      'Soil testing and amendment',
      'Site preparation and marking',
      'Procurement of planting material',
      'ZBNF input preparation'
    ];

    return {
      plantingTime,
      harvestTime,
      preparation
    };
  }

  // Helper methods for scoring
  private identifyMissingLayers(existingCrops: ExistingCrop[]) {
    const presentLayers = new Set(existingCrops.map(crop => crop.layer));
    const missingLayers = [];
    for (let i = 1; i <= 5; i++) {
      if (!presentLayers.has(i)) {
        missingLayers.push(i);
      }
    }
    return missingLayers;
  }

  private calculateLayerPriorities(missingLayers: number[]) {
    const priorities: Record<string, number> = {};
    missingLayers.forEach(layer => {
      priorities[layer.toString()] = layer === 1 ? 1.0 : layer === 2 ? 0.9 : 0.7;
    });
    return priorities;
  }

  private scoreClimateCompatibility(crop: ZbnfCrop, climate: string): number {
    return crop.climateZones.some(zone => zone.toLowerCase().includes(climate.toLowerCase())) ? 0.9 : 0.7;
  }

  private scoreSoilCompatibility(crop: ZbnfCrop, soil: string): number {
    if (!soil || !crop.soilTypes.length) return 0.8;
    
    const inputSoil = soil.toLowerCase();
    const compatible = crop.soilTypes.some(soilType => {
      const cropSoil = soilType.toLowerCase();
      
      // Direct match
      if (cropSoil === inputSoil) return true;
      
      // Map standardized soil types to compatible crop soil types (same as main engine)
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
      
      // Allow general compatibility
      return cropSoil.includes('loam') || cropSoil === 'all';
    });
    
    if (compatible) return 0.95;
    
    // ZBNF management allows adaptation - be generous
    const adaptable = crop.soilTypes.some(type => {
      const cropSoil = type.toLowerCase();
      return cropSoil.includes('loam') || cropSoil.includes('well') || cropSoil.includes('fertile') || cropSoil === 'all';
    });
    
    if (adaptable) return 0.8; // ZBNF soil management helps adaptation
    
    return 0.6; // Default moderate compatibility with ZBNF management
  }

  private scoreSeasonalCompatibility(crop: ZbnfCrop, season: string): number {
    // Be more generous with seasonal matching
    if (crop.seasons.includes('year_round')) return 1.0;
    if (crop.seasons.some(s => s.toLowerCase().includes(season.toLowerCase()))) return 1.0;
    // Even if not perfect season, tropical crops can often be grown with care
    return 0.6;
  }

  private scoreWaterCompatibility(crop: ZbnfCrop, availability: string): number {
    if (!availability || !crop.waterRequirement) return 0.8;
    
    const reqLevel = crop.waterRequirement.toLowerCase();
    const availLevel = availability.toLowerCase();
    
    // Perfect matches
    if (availLevel === 'abundant') return 1.0; // Abundant water supports any crop
    if (availLevel === 'moderate' && (reqLevel.includes('low') || reqLevel.includes('medium') || reqLevel.includes('moderate'))) return 1.0;
    if (availLevel === 'scarce' && (reqLevel.includes('low') || reqLevel.includes('drought'))) return 1.0;
    
    // Incompatible combinations get low scores
    if (availLevel === 'scarce' && reqLevel.includes('high')) return 0.1;
    if (availLevel === 'moderate' && reqLevel.includes('high')) return 0.6;
    
    return 0.7; // Default moderate compatibility
  }

  private scoreCompanionCompatibility(crop: ZbnfCrop, existingCrops: ExistingCrop[]): number {
    if (existingCrops.length === 0) return 0.8; // New farms get good base score
    
    const existingNames = existingCrops.map(c => c.name.toLowerCase());
    const companions = crop.companionCrops.filter(comp => 
      existingNames.some(name => name.includes(comp.toLowerCase()))
    );
    
    // Check for conflicts
    const conflicts = crop.conflictCrops?.filter(conflict => 
      existingNames.some(name => name.includes(conflict.toLowerCase()))
    ) || [];
    
    if (conflicts.length > 0) return 0.4; // Penalize conflicts
    if (companions.length > 0) return 0.9; // Reward companions
    return 0.8; // Neutral compatibility
  }

  private scoreMarketViability(crop: ZbnfCrop, location: string): number {
    const demandScore = crop.marketDemand === 'high' ? 1.0 : crop.marketDemand === 'medium' ? 0.8 : 0.6;
    const locationBonus = location.toLowerCase().includes('bangalore') ? 0.1 : 0;
    return Math.min(1.0, demandScore + locationBonus);
  }

  private scoreLayerOptimization(crop: ZbnfCrop, missingLayers: number[]): number {
    return missingLayers.includes(crop.layerNumber) ? 1.0 : 0.5;
  }

  private scoreDiversityBonus(crop: ZbnfCrop, existingCrops: ExistingCrop[]): number {
    const existingCategories = existingCrops.map(c => c.name.toLowerCase());
    const isUnique = !existingCategories.some(name => 
      name.includes(crop.category.toLowerCase()) || 
      crop.name.toLowerCase().includes(name)
    );
    return isUnique ? 0.9 : 0.6;
  }

  private analyzeSeasonalFactors(season: string) {
    return { currentSeason: season, optimal: season === 'monsoon' };
  }

  private analyzeSoilSuitability(soilType: string) {
    return { type: soilType, suitability: 0.8 };
  }

  private analyzeClimateCompatibility(climate: string) {
    return { zone: climate, favorability: 0.9 };
  }

  private analyzeWaterRequirements(availability: string) {
    return { level: availability, optimization: 0.8 };
  }

  private analyzeLocationFactors(location: string) {
    return { region: location, marketAccess: 0.8 };
  }

  private analyzeDiversityNeeds(existingCrops: ExistingCrop[]) {
    return { currentDiversity: existingCrops.length, needsIncrease: existingCrops.length < 5 };
  }

  private rankByAIScoring(recommendations: AIRecommendation[], conditions: FarmConditions): AIRecommendation[] {
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  private calculateBaseInvestment(crop: ZbnfCrop): number {
    const baseRates = {
      1: 5000, // Canopy trees
      2: 3000, // Sub-canopy
      3: 1500, // Shrubs
      4: 800,  // Herbaceous
      5: 400   // Ground cover
    };
    return baseRates[crop.layerNumber as keyof typeof baseRates] || 1000;
  }

  private getLocationPriceMultiplier(location: string): number {
    if (location.toLowerCase().includes('bangalore')) return 1.2;
    if (location.toLowerCase().includes('mysore')) return 1.0;
    return 0.9;
  }

  private calculatePaybackPeriod(maturityPeriod: string, demandMultiplier: number): string {
    const months = parseInt(maturityPeriod.match(/\d+/)?.[0] || '12');
    const adjustedMonths = Math.round(months / demandMultiplier);
    return adjustedMonths < 12 ? `${adjustedMonths} months` : `${Math.round(adjustedMonths/12)} years`;
  }

  /**
   * Group recommendations by layer and select the best crops for each layer
   */
  private groupByLayerAndSelectBest(recommendations: AIRecommendation[], cropsPerLayer: number = 2): Record<number, AIRecommendation[]> {
    const layerGroups: Record<number, AIRecommendation[]> = {};
    
    // Group by layer
    recommendations.forEach(rec => {
      if (!layerGroups[rec.layer]) {
        layerGroups[rec.layer] = [];
      }
      layerGroups[rec.layer].push(rec);
    });
    
    // Sort each layer by confidence and select top crops
    Object.keys(layerGroups).forEach(layerKey => {
      const layer = parseInt(layerKey);
      layerGroups[layer] = layerGroups[layer]
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, cropsPerLayer);
    });
    
    return layerGroups;
  }

  /**
   * Flatten layer recommendations back to a single array
   */
  private flattenLayerRecommendations(layerGroups: Record<number, AIRecommendation[]>): AIRecommendation[] {
    const flattened: AIRecommendation[] = [];
    
    // Process layers in order (1, 2, 3, 4, 5)
    for (let layer = 1; layer <= 5; layer++) {
      if (layerGroups[layer]) {
        flattened.push(...layerGroups[layer]);
      }
    }
    
    return flattened;
  }
}

export const aiRecommender = new AICropRecommender([]);