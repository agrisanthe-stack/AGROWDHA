import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Leaf, Save, X } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface ZBNFCrop {
  id: number;
  name: string;
  scientificName?: string;
  layerId: number;
  category?: string;
  spacingRequirement?: string;
  soilTypes: string[];
  climateZones: string[];
  seasons: string[];
  companionCrops: string[];
  conflictCrops?: string[];
  benefits: string[];
  waterRequirement?: string;
  sunRequirement?: string;
  maturityPeriod?: string;
  yieldPerPlant?: string;
  marketDemand?: string;
  isNative?: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const LAYER_OPTIONS = [
  { id: 1, name: "Layer 1: Trees (Canopy)", description: "Large trees 15-50ft" },
  { id: 2, name: "Layer 2: Sub-canopy", description: "Medium trees 8-15ft" },
  { id: 3, name: "Layer 3: Shrubs", description: "Bushes and shrubs 3-8ft" },
  { id: 4, name: "Layer 4: Herbaceous", description: "Non-woody plants" },
  { id: 5, name: "Layer 5: Ground Cover", description: "Low-growing plants" }
];

const SOIL_TYPES = ["Clay", "Sandy", "Loam", "Red Soil", "Black Soil", "Alluvial", "Laterite"];
const CLIMATE_ZONES = ["Tropical", "Subtropical", "Temperate", "Arid", "Semi-arid", "Coastal", "Highland"];
const SEASONS = ["Kharif", "Rabi", "Summer", "Year-round"];

export default function CropManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<ZBNFCrop | null>(null);
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string[] }>({
    soilTypes: [],
    climateZones: [],
    seasons: [],
    companionCrops: [],
    benefits: []
  });
  
  const [cropForm, setCropForm] = useState({
    name: "",
    scientificName: "",
    layerId: 1,
    category: "",
    spacingRequirement: "",
    waterRequirement: "",
    sunRequirement: "",
    maturityPeriod: "",
    yieldPerPlant: "",
    marketDemand: "",
    isNative: true
  });

  // Fetch all ZBNF crops
  const { 
    data: crops, 
    isLoading: cropsLoading,
    refetch: refetchCrops 
  } = useQuery({
    queryKey: ["/api/admin/zbnf-crops"],
  });

  // Create crop mutation
  const createCropMutation = useMutation({
    mutationFn: async (cropData: any) => {
      return await apiRequest("POST", "/api/admin/zbnf-crops", cropData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/zbnf-crops"] });
      refetchCrops();
      toast({
        title: "Success",
        description: "Crop created successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create crop",
        variant: "destructive"
      });
    }
  });

  // Update crop mutation
  const updateCropMutation = useMutation({
    mutationFn: async ({ id, ...cropData }: any) => {
      return await apiRequest("PUT", `/api/admin/zbnf-crops/${id}`, cropData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/zbnf-crops"] });
      refetchCrops();
      toast({
        title: "Success",
        description: "Crop updated successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update crop",
        variant: "destructive"
      });
    }
  });

  // Delete crop mutation
  const deleteCropMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/zbnf-crops/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/zbnf-crops"] });
      refetchCrops();
      toast({
        title: "Success",
        description: "Crop deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete crop",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setCropForm({
      name: "",
      scientificName: "",
      layerId: 1,
      category: "",
      spacingRequirement: "",
      waterRequirement: "",
      sunRequirement: "",
      maturityPeriod: "",
      yieldPerPlant: "",
      marketDemand: "",
      isNative: true
    });
    setSelectedTags({
      soilTypes: [],
      climateZones: [],
      seasons: [],
      companionCrops: [],
      benefits: []
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  const handleEditCrop = (crop: ZBNFCrop) => {
    setEditingCrop(crop);
    setCropForm({
      name: crop.name,
      scientificName: crop.scientificName || "",
      layerId: crop.layerId,
      category: crop.category || "",
      spacingRequirement: crop.spacingRequirement || "",
      waterRequirement: crop.waterRequirement || "",
      sunRequirement: crop.sunRequirement || "",
      maturityPeriod: crop.maturityPeriod || "",
      yieldPerPlant: crop.yieldPerPlant || "",
      marketDemand: crop.marketDemand || "",
      isNative: crop.isNative !== undefined ? crop.isNative : true
    });
    setSelectedTags({
      soilTypes: crop.soilTypes || [],
      climateZones: crop.climateZones || [],
      seasons: crop.seasons || [],
      companionCrops: crop.companionCrops || [],
      benefits: crop.benefits || []
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!cropForm.name.trim()) {
      toast({
        title: "Error",
        description: "Crop name is required",
        variant: "destructive"
      });
      return;
    }

    const cropData = {
      ...cropForm,
      ...selectedTags
    };

    if (editingCrop) {
      updateCropMutation.mutate({ id: editingCrop.id, ...cropData });
    } else {
      createCropMutation.mutate(cropData);
    }
  };

  const handleDeleteCrop = (id: number) => {
    if (confirm("Are you sure you want to delete this crop? This action cannot be undone.")) {
      deleteCropMutation.mutate(id);
    }
  };

  const addTag = (category: string, value: string) => {
    if (value && !selectedTags[category].includes(value)) {
      setSelectedTags({
        ...selectedTags,
        [category]: [...selectedTags[category], value]
      });
    }
  };

  const removeTag = (category: string, value: string) => {
    setSelectedTags({
      ...selectedTags,
      [category]: selectedTags[category].filter(tag => tag !== value)
    });
  };

  const TagInput = ({ 
    category, 
    options, 
    placeholder 
  }: { 
    category: string; 
    options?: string[]; 
    placeholder: string;
  }) => {
    const [inputValue, setInputValue] = useState("");

    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          {options ? (
            <Select onValueChange={(value) => {
              if (value) {
                addTag(category, value);
              }
            }}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <>
              <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag(category, inputValue.trim());
                    setInputValue("");
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addTag(category, inputValue.trim());
                  setInputValue("");
                }}
              >
                Add
              </Button>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {selectedTags[category].map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(category, tag)}
              />
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  if (cropsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Natural Farming Crop Management</h2>
          <p className="text-muted-foreground">
            Manage crop recommendations for the 5-layer NF system
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Crop
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {LAYER_OPTIONS.map((layer) => {
          const layerCrops = crops?.filter((crop: ZBNFCrop) => crop.layerId === layer.id) || [];
          return (
            <Card key={layer.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{layer.name}</CardTitle>
                <CardDescription className="text-xs">{layer.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{layerCrops.length}</div>
                <p className="text-xs text-muted-foreground">crops available</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Crops Table */}
      <Card>
        <CardHeader>
          <CardTitle>All NF Crops</CardTitle>
          <CardDescription>
            Manage crop recommendations across all 5 layers of the NF system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Layer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Soil Types</TableHead>
                <TableHead>Climate</TableHead>
                <TableHead>Seasons</TableHead>
                <TableHead>Market Demand</TableHead>
                <TableHead>Native</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crops?.map((crop: ZBNFCrop) => (
                <TableRow key={crop.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{crop.name}</div>
                      {crop.scientificName && (
                        <div className="text-sm text-muted-foreground italic">
                          {crop.scientificName}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      Layer {crop.layerId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {crop.category && (
                      <Badge variant="secondary" className="text-xs">
                        {crop.category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {crop.soilTypes?.slice(0, 2).map((soil) => (
                        <Badge key={soil} variant="secondary" className="text-xs">
                          {soil}
                        </Badge>
                      ))}
                      {crop.soilTypes?.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{crop.soilTypes.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {crop.climateZones?.slice(0, 2).map((climate) => (
                        <Badge key={climate} variant="secondary" className="text-xs">
                          {climate}
                        </Badge>
                      ))}
                      {crop.climateZones?.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{crop.climateZones.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {crop.seasons?.map((season) => (
                        <Badge key={season} variant="outline" className="text-xs">
                          {season}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {crop.marketDemand && (
                      <Badge variant={
                        crop.marketDemand === 'high' ? 'default' : 
                        crop.marketDemand === 'medium' ? 'secondary' : 'outline'
                      }>
                        {crop.marketDemand}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {crop.isNative !== undefined && (
                      <Badge variant={crop.isNative ? "default" : "outline"}>
                        {crop.isNative ? "Native" : "Exotic"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCrop(crop)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCrop(crop.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Crop Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCrop ? "Edit Crop" : "Add New Crop"}
            </DialogTitle>
            <DialogDescription>
              {editingCrop ? "Update crop information" : "Add a new crop to the NF recommendation system"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Crop Name *</Label>
                <Input
                  id="name"
                  value={cropForm.name}
                  onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                  placeholder="e.g., Coconut"
                />
              </div>
              <div>
                <Label htmlFor="scientificName">Scientific Name</Label>
                <Input
                  id="scientificName"
                  value={cropForm.scientificName}
                  onChange={(e) => setCropForm({ ...cropForm, scientificName: e.target.value })}
                  placeholder="e.g., Cocos nucifera"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="layerId">NF Layer *</Label>
              <Select 
                value={cropForm.layerId.toString()} 
                onValueChange={(value) => setCropForm({ ...cropForm, layerId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layer" />
                </SelectTrigger>
                <SelectContent>
                  {LAYER_OPTIONS.map((layer) => (
                    <SelectItem key={layer.id} value={layer.id.toString()}>
                      {layer.name} - {layer.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={cropForm.category}
                  onChange={(e) => setCropForm({ ...cropForm, category: e.target.value })}
                  placeholder="e.g., Fruit Tree"
                />
              </div>
              <div>
                <Label htmlFor="spacingRequirement">Spacing Requirement</Label>
                <Input
                  id="spacingRequirement"
                  value={cropForm.spacingRequirement}
                  onChange={(e) => setCropForm({ ...cropForm, spacingRequirement: e.target.value })}
                  placeholder="e.g., 8m x 8m"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="waterRequirement">Water Requirement</Label>
                <Select 
                  value={cropForm.waterRequirement} 
                  onValueChange={(value) => setCropForm({ ...cropForm, waterRequirement: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select water need" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sunRequirement">Sun Requirement</Label>
                <Select 
                  value={cropForm.sunRequirement} 
                  onValueChange={(value) => setCropForm({ ...cropForm, sunRequirement: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sun need" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Sun</SelectItem>
                    <SelectItem value="partial">Partial Sun</SelectItem>
                    <SelectItem value="shade">Shade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="marketDemand">Market Demand</Label>
                <Select 
                  value={cropForm.marketDemand} 
                  onValueChange={(value) => setCropForm({ ...cropForm, marketDemand: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select demand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maturityPeriod">Maturity Period</Label>
                <Input
                  id="maturityPeriod"
                  value={cropForm.maturityPeriod}
                  onChange={(e) => setCropForm({ ...cropForm, maturityPeriod: e.target.value })}
                  placeholder="e.g., 8-10 months"
                />
              </div>
              <div>
                <Label htmlFor="yieldPerPlant">Yield per Plant</Label>
                <Input
                  id="yieldPerPlant"
                  value={cropForm.yieldPerPlant}
                  onChange={(e) => setCropForm({ ...cropForm, yieldPerPlant: e.target.value })}
                  placeholder="e.g., 50-80 coconuts/year"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="isNative">Native Status</Label>
              <Select 
                value={cropForm.isNative.toString()} 
                onValueChange={(value) => setCropForm({ ...cropForm, isNative: value === 'true' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select native status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Native</SelectItem>
                  <SelectItem value="false">Exotic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Soil Types</Label>
              <TagInput
                category="soilTypes"
                options={SOIL_TYPES}
                placeholder="Select soil types"
              />
            </div>

            <div>
              <Label>Climate Zones</Label>
              <TagInput
                category="climateZones"
                options={CLIMATE_ZONES}
                placeholder="Select climate zones"
              />
            </div>

            <div>
              <Label>Growing Seasons</Label>
              <TagInput
                category="seasons"
                options={SEASONS}
                placeholder="Select growing seasons"
              />
            </div>

            <div>
              <Label>Companion Crops</Label>
              <TagInput
                category="companionCrops"
                placeholder="Enter companion crop (press Enter to add)"
              />
            </div>

            <div>
              <Label>Benefits</Label>
              <TagInput
                category="benefits"
                placeholder="Enter benefit (press Enter to add)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="harvestTime">Harvest Time</Label>
                <Input
                  id="harvestTime"
                  value={cropForm.harvestTime}
                  onChange={(e) => setCropForm({ ...cropForm, harvestTime: e.target.value })}
                  placeholder="e.g., 8-12 months"
                />
              </div>
              <div>
                <Label htmlFor="marketDemand">Market Demand</Label>
                <Select 
                  value={cropForm.marketDemand} 
                  onValueChange={(value) => setCropForm({ ...cropForm, marketDemand: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select market demand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="plantingGuide">Planting Guide</Label>
              <Textarea
                id="plantingGuide"
                value={cropForm.plantingGuide}
                onChange={(e) => setCropForm({ ...cropForm, plantingGuide: e.target.value })}
                placeholder="Brief planting and care instructions"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createCropMutation.isPending || updateCropMutation.isPending}
            >
              {(createCropMutation.isPending || updateCropMutation.isPending) ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {editingCrop ? "Update" : "Create"} Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}