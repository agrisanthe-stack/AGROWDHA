import { useAuth } from "@/hooks/use-auth";
import { Store, Tractor } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type UserRoleToggleProps = {
  onToggle?: (role: "customer" | "farmer") => void;
};

export default function UserRoleToggle({ onToggle }: UserRoleToggleProps) {
  const { user, toggleRole, viewingAs } = useAuth();

  // For debugging
  console.log("UserRoleToggle - user:", user);
  console.log("UserRoleToggle - viewingAs:", viewingAs);
  
  // If no user is logged in, don't show the toggle
  if (!user) return null;
  
  // Hide the toggle if the user doesn't have the farmer role (only customers won't see it)
  if (user.role !== "farmer") return null;

  const handleToggle = (role: "customer" | "farmer") => {
    console.log("Toggle role to:", role);
    toggleRole(role);
    if (onToggle) onToggle(role);
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center py-3">
          <div className="flex flex-col items-center">
            <div className="mb-2 text-sm font-medium text-amber-800 flex items-center">
              <span className="inline-block mr-2 bg-amber-100 text-amber-800 px-2 py-1 rounded-md">Account Mode</span>
              You're a farmer, choose how you want to use Santhe:
            </div>
            
            <TooltipProvider>
              <ToggleGroup type="single" value={viewingAs} className="bg-white border border-amber-200 rounded-lg p-1 shadow-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem 
                      value="customer" 
                      onClick={() => handleToggle("customer")}
                      className={`px-4 py-2 gap-2 min-w-[140px] ${
                        viewingAs === "customer" 
                          ? "bg-green-100 border border-green-300 text-green-800" 
                          : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                      }`}
                    >
                      <Store className="h-4 w-4" />
                      Buy Products
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Browse and buy products from other farmers</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem 
                      value="farmer" 
                      onClick={() => handleToggle("farmer")}
                      className={`px-4 py-2 gap-2 min-w-[140px] ${
                        viewingAs === "farmer" 
                          ? "bg-amber-100 border border-amber-300 text-amber-800" 
                          : "text-gray-600 hover:text-amber-700 hover:bg-amber-50"
                      }`}
                    >
                      <Tractor className="h-4 w-4" />
                      Sell Products
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manage your farm and sell your products</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
