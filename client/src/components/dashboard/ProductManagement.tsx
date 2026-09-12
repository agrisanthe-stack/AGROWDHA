import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "@/lib/types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatIndianCurrency } from "@/lib/utils";
import { Edit, Eye, FileText, MoreVertical, Trash2, Phone, Mail, User, BarChart2, AlertCircle } from "lucide-react";

// Extended Product type to include sales history
interface ProductWithSalesHistory extends Product {
  isExpired: boolean;
  approvalStatus: string;
  rejectionReason?: string;
  salesHistory?: {
    totalSales: number;
    totalEarnings: number;
    orderItems: {
      orderId: number;
      quantity: number;
      price: string | number;
      total: number;
      date: string | null;
    }[];
  };
}

export default function ProductManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("active");
  const [productToDelete, setProductToDelete] = useState<ProductWithSalesHistory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithSalesHistory | null>(null);
  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  
  // State for sales modal (similar to AdminDashboard)
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [selectedProductForSales, setSelectedProductForSales] = useState<ProductWithSalesHistory | null>(null);
  
  const { data: fpoLinkData } = useQuery<{ linked: any[]; available: any[]; maxLinks: number; currentCount: number }>({
    queryKey: ["/api/farmer/fpos"],
    enabled: user?.role === "farmer",
  });
  const hasLinkedFpo = fpoLinkData?.linked && fpoLinkData.linked.length > 0;

  // Use a custom query function to ensure auth token is included
  const { data: products, isLoading, error } = useQuery<ProductWithSalesHistory[]>({
    queryKey: ["/api/products/farmer/list"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/products/farmer/list");
        return await response.json();
      } catch (error) {
        console.error("Error fetching farmer products:", error);
        throw error;
      }
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Fetch district manager information to show contact details for pending/rejected products
  const { data: districtManager } = useQuery({
    queryKey: ["/api/farmers/me/district-manager"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/farmers/me/district-manager");
        return await response.json();
      } catch (error) {
        console.error("Error fetching district manager:", error);
        return null;
      }
    },
    enabled: !!products && Array.isArray(products) && products.length > 0,
  });

  // Fetch product sales data for farmer
  const {
    data: productSalesData,
    isLoading: salesDataLoading,
    refetch: refetchSalesData
  } = useQuery({
    queryKey: ["/api/products/farmer/sales", selectedProductForSales?.id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/products/farmer/${selectedProductForSales.id}/sales`);
      return await response.json();
    },
    enabled: selectedProductForSales !== null,
  });

  // Handle viewing product sales
  const handleViewSales = (product: ProductWithSalesHistory) => {
    setSelectedProductForSales(product);
    setShowSalesModal(true);
  };

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("DELETE", `/api/products/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products/farmer/list"] });
      setProductToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id);
    }
  };

  // First filter by search term
  const searchFilteredProducts = Array.isArray(products) 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  // Get current date for comparison
  const currentDate = new Date();
  
  // Split products by status and date
  const activeProducts = searchFilteredProducts.filter(product => {
    const availableUntilDate = new Date(product.availableUntil);
    return availableUntilDate >= currentDate && product.approvalStatus === "approved";
  });
  
  const pendingProducts = searchFilteredProducts.filter(product => 
    product.approvalStatus === "pending"
  );
  
  const rejectedProducts = searchFilteredProducts.filter(product => 
    product.approvalStatus === "rejected"
  );
  
  const expiredProducts = searchFilteredProducts.filter(product => {
    const availableUntilDate = new Date(product.availableUntil);
    return availableUntilDate < currentDate && product.approvalStatus === "approved";
  });
  
  // Choose which list to display based on the active tab
  const filteredProducts = 
    activeTab === "active" ? activeProducts :
    activeTab === "pending" ? pendingProducts :
    activeTab === "rejected" ? rejectedProducts :
    expiredProducts;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Available Until</TableHead>
                <TableHead>Stock Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded mr-2" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-red-500">Error loading products</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/products/farmer/list"] })}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          {hasLinkedFpo ? (
            <Button asChild>
              <Link href="/dashboard/products/new">
                <i className="fas fa-plus mr-2"></i> Add Product
              </Link>
            </Button>
          ) : fpoLinkData ? (
            <Button asChild variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
              <Link href="/dashboard/my-fpos">
                <AlertCircle className="h-4 w-4 mr-2" /> Link FPO First
              </Link>
            </Button>
          ) : null}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-4">
            <TabsTrigger value="active" className="relative">
              Active Products
              {activeProducts && activeProducts.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeProducts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending Approval
              {pendingProducts && pendingProducts.length > 0 && (
                <span className="absolute top-1 right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingProducts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="rejected" className="relative">
              Rejected
              {rejectedProducts && rejectedProducts.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {rejectedProducts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="expired" className="relative">
              Expired Products
              {expiredProducts && expiredProducts.length > 0 && (
                <span className="absolute top-1 right-1 bg-gray-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {expiredProducts.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "No products match your search" 
                : activeTab === "active" 
                  ? "No active products found" 
                  : activeTab === "pending"
                    ? "No products pending approval"
                    : activeTab === "rejected"
                      ? "No rejected products"
                      : "No expired products found"}
            </p>
            {searchTerm ? (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            ) : activeTab === "active" ? (
              hasLinkedFpo ? (
                <Button asChild>
                  <Link href="/dashboard/products/new">Add Your First Product</Link>
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-orange-700">You need to link with an FPO before adding products.</p>
                  <Button asChild variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                    <Link href="/dashboard/my-fpos">
                      <AlertCircle className="h-4 w-4 mr-2" /> Go to FPO Tab
                    </Link>
                  </Button>
                </div>
              )
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  {activeTab === "active" ? (
                    <>
                      <TableHead>Available Until</TableHead>
                      <TableHead>Stock Available</TableHead>
                    </>
                  ) : activeTab === "pending" ? (
                    <>
                      <TableHead>Stock Available</TableHead>
                      <TableHead>Submitted On</TableHead>
                      <TableHead>Harvest Date</TableHead>
                    </>
                  ) : activeTab === "rejected" ? (
                    <>
                      <TableHead>Stock Available</TableHead>
                      <TableHead>Rejection Reason</TableHead>
                      <TableHead>Rejected On</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Stock Available</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Total Earnings</TableHead>
                    </>
                  )}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className={activeTab === "expired" ? "bg-gray-50" : ""}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded overflow-hidden mr-3">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.unit}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatIndianCurrency(product.price)}/box
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={
                              product.approvalStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : product.approvalStatus === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : activeTab === "expired"
                                    ? "bg-gray-100 text-gray-800"
                                    : product.status === "Available Now" 
                                      ? "bg-accent-100 text-accent-800" 
                                      : product.status === "Pre-Order" 
                                        ? "bg-secondary-100 text-secondary-800" 
                                        : "bg-primary-100 text-primary-800"
                            }
                          >
                            {product.approvalStatus === "pending" 
                              ? "Pending Approval"
                              : product.approvalStatus === "rejected"
                                ? "Rejected"
                                : activeTab === "expired" 
                                  ? `Expired on ${formatDate(product.availableUntil)}` 
                                  : product.status}
                          </Badge>
                        </div>
                        {product.approvalStatus === 'pending' && user?.district && (
                          <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Awaiting {user.district} District Hub approval
                          </div>
                        )}
                        {product.approvalStatus === 'approved' && product.approvalType && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              product.approvalType === 'fpo' 
                                ? 'bg-blue-100 text-blue-800 border-blue-300' 
                                : 'bg-purple-100 text-purple-800 border-purple-300'
                            }`}
                          >
                            {product.approvalType === 'fpo' ? '✓ FA-Approved' : '✓ Admin approved'}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    {activeTab === "active" ? (
                      <>
                        <TableCell>
                          <div className="space-y-2">
                            <span>{formatDate(product.availableUntil)}</span>
                            {product.approverDetails && (
                              <div className="bg-green-50 p-3 rounded-md border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <User className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-900">
                                    {product.approverDetails.approvalType === 'fpo' ? 'Approved by Farmers Association' : 'Approved by Admin'}
                                  </span>
                                </div>
                                <div className="space-y-1 text-xs text-green-800">
                                  <div className="flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    <span className="font-medium">{product.approverDetails.name}</span>
                                  </div>
                                  {product.approverDetails.orgName && (
                                    <div className="font-medium text-green-900">{product.approverDetails.orgName}</div>
                                  )}
                                  {product.approverDetails.orgAddress && (
                                    <div className="text-xs text-green-700">
                                      <span className="font-medium">Address:</span> {product.approverDetails.orgAddress}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    <span>{product.approverDetails.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    <span>{product.approverDetails.email}</span>
                                  </div>
                                  {product.approverDetails.district && (
                                    <div className="text-xs text-green-700 font-medium mt-1">
                                      District: {product.approverDetails.district}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{product.inventory ?? 0} {product.unit}</span>
                        </TableCell>
                      </>
                    ) : activeTab === "pending" ? (
                      <>
                        <TableCell>
                          <span className="text-sm font-medium">{product.inventory ?? 0} {product.unit}</span>
                        </TableCell>
                        <TableCell>
                          <span>{formatDate(product.createdAt)}</span>
                        </TableCell>
                        <TableCell>{formatDate(product.harvestDate)}</TableCell>
                      </>
                    ) : activeTab === "rejected" ? (
                      <>
                        <TableCell>
                          <span className="text-sm font-medium">{product.inventory ?? 0} {product.unit}</span>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs space-y-2">
                            <p className="text-sm text-red-600">
                              {product.rejectionReason || "No reason provided"}
                            </p>
                            {districtManager && (
                              <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <User className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-900">District Manager (FPO)</span>
                                </div>
                                <div className="space-y-1 text-xs text-blue-800">
                                  <div className="flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    <span>{districtManager.name}</span>
                                  </div>
                                  {districtManager.orgName && (
                                    <div className="font-medium">{districtManager.orgName}</div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    <span>{districtManager.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    <span>{districtManager.email}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(product.updatedAt)}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          <span className="text-sm font-medium">{product.inventory ?? 0} {product.unit}</span>
                        </TableCell>
                        <TableCell>
                          {product.salesHistory?.totalSales ?? 0} boxes
                          <div className="text-xs text-gray-500">
                            ({((product.unitsPerBox || 1) * (product.salesHistory?.totalSales ?? 0)).toFixed(0)} {product.unit}s total)
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatIndianCurrency(product.salesHistory?.totalEarnings ?? 0)}
                        </TableCell>
                      </>
                    )}
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(activeTab === "pending" || activeTab === "active" || activeTab === "expired") && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/products/${product.id}`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          
                          {activeTab === "rejected" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/products/${product.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </Link>
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem onClick={() => handleViewSales(product)}>
                            <FileText className="mr-2 h-4 w-4" /> Sales Details
                          </DropdownMenuItem>
                          
                          {(activeTab === "active" || activeTab === "expired") && (
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View Public Page
                              </Link>
                            </DropdownMenuItem>
                          )}
                          
                          {activeTab === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => setProductToDelete(product)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {productToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={salesDialogOpen} onOpenChange={setSalesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sales Details: {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Complete sales history and order details for this product
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && selectedProduct.salesHistory && (
            <div className="mt-4">
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Sales Summary</CardTitle>
                  <CardDescription>Overview of all sales for this product</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg bg-secondary/10">
                    <h3 className="text-lg font-semibold text-secondary-800">Total Sales</h3>
                    <p className="text-3xl font-bold">
                      {selectedProduct.salesHistory.totalSales} boxes
                    </p>
                    <p className="text-sm text-gray-600">
                      ({((selectedProduct.unitsPerBox || 1) * selectedProduct.salesHistory.totalSales).toFixed(0)} {selectedProduct.unit}s total)
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-primary/10">
                    <h3 className="text-lg font-semibold text-primary-800">Total Earnings</h3>
                    <p className="text-3xl font-bold">
                      {formatIndianCurrency(selectedProduct.salesHistory.totalEarnings)}
                    </p>
                    <p className="text-sm text-gray-600">
                      From {selectedProduct.salesHistory.orderItems.length} orders
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <h3 className="text-lg font-semibold mb-3">Order History</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProduct.salesHistory.orderItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No orders found for this product
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedProduct.salesHistory.orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">#{item.orderId}</TableCell>
                          <TableCell>{formatDate(item.date || new Date().toISOString())}</TableCell>
                          <TableCell>
                            {item.quantity} boxes
                            <div className="text-xs text-gray-500">
                              ({(item.quantity * (selectedProduct.unitsPerBox || 1)).toFixed(0)} {selectedProduct.unit}s)
                            </div>
                          </TableCell>
                          <TableCell>{formatIndianCurrency(item.price)}/box</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatIndianCurrency(item.total)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setSalesDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Sales Modal (Admin-style) */}
      <Dialog open={showSalesModal} onOpenChange={setShowSalesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Sales Details: {selectedProductForSales?.name}
            </DialogTitle>
            <DialogDescription>
              View comprehensive sales data and order history for this product.
            </DialogDescription>
          </DialogHeader>

          {salesDataLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-16 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sales Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {productSalesData?.totalOrders || 0}
                      </p>
                      <p className="text-xs text-gray-500">Orders placed</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Units Sold</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {productSalesData?.totalQuantitySold || 0}
                      </p>
                      <p className="text-xs text-gray-500">Total quantity</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatIndianCurrency(productSalesData?.totalRevenue || 0)}
                      </p>
                      <p className="text-xs text-gray-500">Gross earnings</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Avg Order Size</h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatIndianCurrency(
                          productSalesData?.totalOrders > 0 
                            ? (productSalesData?.totalRevenue || 0) / productSalesData.totalOrders 
                            : 0
                        )}
                      </p>
                      <p className="text-xs text-gray-500">Per order</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sales History Table */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sales History</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!productSalesData?.salesHistory || productSalesData.salesHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No sales data available for this product
                          </TableCell>
                        </TableRow>
                      ) : (
                        productSalesData.salesHistory.map((sale: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">#{sale.orderId}</TableCell>
                            <TableCell>{sale.customerName}</TableCell>
                            <TableCell>{sale.quantity}</TableCell>
                            <TableCell>{formatIndianCurrency(sale.price)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatIndianCurrency(sale.quantity * sale.price)}
                            </TableCell>
                            <TableCell>{formatDate(sale.orderDate)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={sale.orderStatus === 'delivered' ? 'default' : 'secondary'}
                                className={
                                  sale.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                  sale.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  sale.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {sale.orderStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowSalesModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
