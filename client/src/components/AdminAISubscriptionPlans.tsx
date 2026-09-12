import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Brain, Sparkles } from "lucide-react";

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  durationType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlanFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  durationType: string;
}

export default function AdminAISubscriptionPlans() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    description: '',
    price: '',
    duration: '',
    durationType: 'monthly'
  });

  // Fetch subscription plans
  const { data: subscriptionPlans, isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['/api/admin/ai-subscription-plans'],
  });

  // Create plan mutation
  const createPlanMutation = useMutation({
    mutationFn: async (planData: PlanFormData) => {
      const response = await apiRequest("POST", "/api/admin/ai-subscription-plans", planData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Plan Created",
        description: "AI subscription plan created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-subscription-plans'] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "Failed to create subscription plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update plan mutation
  const updatePlanMutation = useMutation({
    mutationFn: async (planData: PlanFormData & { id: number }) => {
      const response = await apiRequest("PUT", `/api/admin/ai-subscription-plans/${planData.id}`, planData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Plan Updated",
        description: "AI subscription plan updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-subscription-plans'] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update subscription plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete plan mutation
  const deletePlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/ai-subscription-plans/${planId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Plan Deleted",
        description: "AI subscription plan deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-subscription-plans'] });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete subscription plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      durationType: 'monthly'
    });
    setEditingPlan(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      updatePlanMutation.mutate({ ...formData, id: editingPlan.id });
    } else {
      createPlanMutation.mutate(formData);
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      durationType: plan.durationType
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (planId: number) => {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      deletePlanMutation.mutate(planId);
    }
  };

  const formatDuration = (duration: number, durationType: string) => {
    if (durationType === 'monthly') return `${duration} month${duration > 1 ? 's' : ''}`;
    if (durationType === 'yearly') return `${duration} year${duration > 1 ? 's' : ''}`;
    return `${duration} ${durationType}`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Subscription Plans
          </h2>
          <p className="text-gray-600">Manage AI-powered NF subscription plans</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., AI Pro Monthly"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the plan benefits"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="durationType">Duration Type</Label>
                <Select value={formData.durationType} onValueChange={(value) => setFormData({ ...formData, durationType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createPlanMutation.isPending || updatePlanMutation.isPending} className="flex-1">
                  {(createPlanMutation.isPending || updatePlanMutation.isPending) ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      {editingPlan ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingPlan ? 'Update Plan' : 'Create Plan'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptionPlans?.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <Badge variant={plan.isActive ? "default" : "secondary"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Price:</span>
                  <span className="text-lg font-bold">₹{plan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm">{formatDuration(plan.duration, plan.durationType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm">{new Date(plan.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(plan)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(plan.id)}
                  disabled={deletePlanMutation.isPending}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {subscriptionPlans?.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No subscription plans yet</h3>
          <p className="text-gray-500 mb-4">Create your first AI subscription plan to get started</p>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Plan
          </Button>
        </div>
      )}
    </div>
  );
}