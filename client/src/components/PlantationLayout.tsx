import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlantationLayoutProps {
  detectedTrees: any[];
  recommendations: any[];
  farmSize?: { width: number; height: number };
}

const PlantationLayout: React.FC<PlantationLayoutProps> = ({ 
  detectedTrees, 
  recommendations, 
  farmSize = { width: 36, height: 36 } 
}) => {
  // Scale factor for display (actual farm is 36x36 feet, display is 600x600 pixels)
  const scaleX = 600 / farmSize.width;
  const scaleY = 600 / farmSize.height;

  // Layer colors and symbols
  const layerConfig = {
    1: { color: '#065f46', symbol: '🌳', name: 'Canopy' },
    2: { color: '#047857', symbol: '🌲', name: 'Sub-canopy' },
    3: { color: '#059669', symbol: '🌿', name: 'Shrub' },
    4: { color: '#10b981', symbol: '🌱', name: 'Herbaceous' },
    5: { color: '#34d399', symbol: '🟢', name: 'Ground Cover' }
  };

  // Get layer spacing requirements
  const getLayerSpacing = (layer: number): number => {
    const spacingMap = {
      1: 12, // 12m spacing for canopy
      2: 6,  // 6m spacing for sub-canopy
      3: 3,  // 3m spacing for shrub
      4: 1.5, // 1.5m spacing for herbaceous
      5: 0.5  // 0.5m spacing for ground cover
    };
    return spacingMap[layer as keyof typeof spacingMap] || 3;
  };

  // Calculate grid positions for each layer
  const calculateGridPositions = (layer: number, farmSize: { width: number; height: number }) => {
    const spacing = getLayerSpacing(layer);
    const positions = [];
    
    // Convert spacing from meters to feet (1 meter = 3.28 feet)
    const spacingInFeet = spacing * 3.28;
    
    for (let x = spacingInFeet; x < farmSize.width; x += spacingInFeet) {
      for (let y = spacingInFeet; y < farmSize.height; y += spacingInFeet) {
        positions.push({ x, y });
      }
    }
    
    return positions;
  };

  // Generate recommended positions for missing layers
  const generateRecommendedPositions = () => {
    const positions: any[] = [];
    
    recommendations.forEach(rec => {
      const gridPositions = calculateGridPositions(rec.layer, farmSize);
      
      // Filter out positions too close to existing trees
      const availablePositions = gridPositions.filter(pos => {
        return !detectedTrees.some(tree => {
          const distance = Math.sqrt(
            Math.pow(pos.x - (tree.position?.x || 0), 2) + 
            Math.pow(pos.y - (tree.position?.y || 0), 2)
          );
          return distance < getLayerSpacing(rec.layer) * 3.28; // Min distance in feet
        });
      });

      // Take first 2 positions for each layer (as requested - 2 crops per layer)
      availablePositions.slice(0, 2).forEach((pos, index) => {
        positions.push({
          ...pos,
          layer: rec.layer,
          cropName: rec.cropName,
          spacing: rec.spacing || `${getLayerSpacing(rec.layer)}m x ${getLayerSpacing(rec.layer)}m`,
          isRecommended: true
        });
      });
    });

    return positions;
  };

  const recommendedPositions = generateRecommendedPositions();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🗺️</span>
          Customized Farm Layout with Exact Spacing
        </CardTitle>
        <CardDescription>
          36ft × 36ft plantation plan with scientifically accurate spacing for NF 5-layer system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Farm Layout Digital Image */}
          <div className="relative">
            <div
              className="relative border border-gray-300 rounded-lg bg-green-50 overflow-hidden"
              style={{ 
                width: '600px', 
                height: '600px',
                maxWidth: '100%',
                backgroundImage: `
                  linear-gradient(90deg, rgba(229,231,235,0.5) 1px, transparent 1px),
                  linear-gradient(0deg, rgba(229,231,235,0.5) 1px, transparent 1px)
                `,
                backgroundSize: `${scaleX * 3}px ${scaleY * 3}px`
              }}
            >
              {/* Farm boundary indicator */}
              <div className="absolute top-2 left-2 bg-gray-700 text-white px-2 py-1 rounded text-sm font-bold">
                36ft × 36ft Farm Layout
              </div>
              
              {/* Existing trees */}
              {detectedTrees.map((tree, index) => (
                <div
                  key={`existing-${index}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{
                    left: `${((tree.position?.x * scaleX || 50) / 600) * 100}%`,
                    top: `${((tree.position?.y * scaleY || 50) / 600) * 100}%`,
                  }}
                >
                  <div className="w-10 h-10 bg-green-600 border-2 border-green-800 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                    🌳
                  </div>
                  <span className="text-xs font-bold text-green-800 mt-1 bg-white/80 px-2 py-1 rounded shadow">
                    {tree.type}
                  </span>
                </div>
              ))}

              {/* Recommended crop positions */}
              {recommendedPositions.map((pos, index) => {
                const config = layerConfig[pos.layer as keyof typeof layerConfig];
                return (
                  <div
                    key={`recommended-${index}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{
                      left: `${((pos.x * scaleX) / 600) * 100}%`,
                      top: `${((pos.y * scaleY) / 600) * 100}%`,
                    }}
                  >
                    {/* Spacing circle indicator */}
                    <div
                      className="absolute rounded-full border border-dashed opacity-30"
                      style={{
                        width: `${getLayerSpacing(pos.layer) * scaleX}px`,
                        height: `${getLayerSpacing(pos.layer) * scaleX}px`,
                        borderColor: config.color,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    ></div>
                    
                    {/* Crop marker */}
                    <div
                      className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center text-white text-sm shadow-lg"
                      style={{
                        backgroundColor: config.color,
                      }}
                    >
                      {config.symbol}
                    </div>
                    
                    {/* Crop name */}
                    <span className="text-xs font-bold text-gray-700 mt-1 bg-white/80 px-1 py-0.5 rounded shadow">
                      {pos.cropName}
                    </span>
                    
                    {/* Spacing indicator */}
                    <span className="text-xs text-gray-500 mt-0.5">
                      {pos.spacing}
                    </span>
                  </div>
                );
              })}

              {/* Scale indicator */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-20 h-0.5 bg-gray-700"></div>
                <span className="text-xs font-bold text-gray-700">10 feet</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Existing Trees</h4>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                <span className="text-sm">Current plantation</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Recommended Crops</h4>
              {Object.entries(layerConfig).map(([layer, config]) => {
                const hasRecommendations = recommendedPositions.some(pos => pos.layer === parseInt(layer));
                if (!hasRecommendations) return null;
                
                return (
                  <div key={layer} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: config.color }}
                    ></div>
                    <span className="text-sm">
                      Layer {layer}: {config.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Spacing Guide</h4>
              <div className="text-xs text-gray-600">
                <div>Layer 1: 12m spacing (40ft)</div>
                <div>Layer 2: 6m spacing (20ft)</div>
                <div>Layer 3: 3m spacing (10ft)</div>
                <div>Layer 4: 1.5m spacing (5ft)</div>
                <div>Layer 5: 0.5m spacing (2ft)</div>
              </div>
            </div>
          </div>

          {/* Implementation Plan */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Implementation Plan</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <span className="text-blue-500">1.</span>
                <span>Mark recommended positions using the exact coordinates shown above</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">2.</span>
                <span>Maintain scientifically accurate spacing between crops and existing trees</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">3.</span>
                <span>Plant in order of priority: Layer 1 (canopy) first, then Layer 2, 3, 4, and 5</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">4.</span>
                <span>Allow adequate spacing for future growth and canopy spread</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantationLayout;