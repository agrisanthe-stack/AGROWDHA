import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Crown, ShoppingBag, Building2, Loader2 } from "lucide-react";
import type { CustomerSubscriptionPlan } from "@shared/schema";

function formatIndianCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
}

function getBillingLabel(period: string) {
  if (period === 'monthly') return 'Monthly';
  if (period === '6months') return '6 Months';
  if (period === 'yearly') return 'Yearly';
  return period;
}

function getTierColor(tier: string) {
  if (tier.startsWith('family')) return 'bg-green-100 text-green-800 border-green-200';
  if (tier.startsWith('business')) return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-gray-100 text-gray-800';
}

function getTierIcon(tier: string) {
  if (tier.startsWith('family')) return <ShoppingBag className="h-4 w-4" />;
  if (tier.startsWith('business')) return <Building2 className="h-4 w-4" />;
  return <Crown className="h-4 w-4" />;
}

function getTierDisplayName(tier: string) {
  const names: Record<string, string> = {
    family_basic: 'FAMILY – BASIC',
    family_farm_direct: 'FAMILY – FARM DIRECT',
    business_basic: 'BUSINESS – BASIC',
    business_farm_direct_pro: 'BUSINESS – FARM DIRECT PRO',
  };
  return names[tier] || tier;
}


export default function AdminSubscriptionPlans() {
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<CustomerSubscriptionPlan | null>(null);
  const [editForm, setEditForm] = useState({ price: '', description: '', name: '', isActive: true });
  const { data: plans = [], isLoading } = useQuery<CustomerSubscriptionPlan[]>({
    queryKey: ["/api/admin/subscription-plans"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; price: string; description: string; name: string; isActive: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/subscription-plans/${data.id}`, {
        price: data.price,
        description: data.description,
        name: data.name,
        isActive: data.isActive,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Plan Updated", description: "Subscription plan updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscription-plans"] });
      setEditingPlan(null);
    },
    onError: () => {
      toast({ title: "Update Failed", description: "Failed to update plan.", variant: "destructive" });
    },
  });

  const handleEdit = (plan: CustomerSubscriptionPlan) => {
    setEditingPlan(plan);
    setEditForm({
      price: String(plan.price),
      description: plan.description,
      name: plan.name,
      isActive: plan.isActive,
    });
  };

  const handleSave = () => {
    if (!editingPlan) return;
    updateMutation.mutate({
      id: editingPlan.id,
      price: editForm.price,
      description: editForm.description,
      name: editForm.name,
      isActive: editForm.isActive,
    });
  };

  const tiers = ['family_basic', 'family_farm_direct', 'business_basic', 'business_farm_direct_pro'];
  const groupedPlans = tiers.map(tier => ({
    tier,
    displayName: getTierDisplayName(tier),
    plans: plans.filter(p => p.tier === tier),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Customer Subscription Plans
          </CardTitle>
          <CardDescription>
            Manage subscription plans and pricing for customers. Plans control access to pre-harvest ordering, wholesale, and platform fees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {groupedPlans.map(({ tier, displayName, plans: tierPlans }) => (
              <div key={tier}>
                <div className="flex items-center gap-2 mb-3">
                  {getTierIcon(tier)}
                  <h3 className="text-lg font-semibold">{displayName}</h3>
                  {tierPlans[0] && (
                    <div className="flex gap-2 ml-4">
                      {tierPlans[0].preorderRetail && (
                        <Badge variant="outline" className="text-xs">Pre-harvest Retail</Badge>
                      )}
                      {tierPlans[0].preorderWholesale && (
                        <Badge variant="outline" className="text-xs">Pre-harvest Wholesale</Badge>
                      )}
                      {tierPlans[0].zeroPlatformFee && (
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">0% Platform Fee</Badge>
                      )}
                    </div>
                  )}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Billing Period</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tierPlans.map(plan => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <Badge className={getTierColor(plan.tier)}>
                            {getBillingLabel(plan.billingPeriod)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-lg">
                          {formatIndianCurrency(parseFloat(String(plan.price)))}
                        </TableCell>
                        <TableCell>{plan.durationDays} days</TableCell>
                        <TableCell>
                          <Badge variant={plan.isActive ? "default" : "secondary"}>
                            {plan.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tierPlans.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                          No plans configured for this tier
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Plan Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editForm.isActive}
                onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}