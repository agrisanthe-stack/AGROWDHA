import { useState } from "react";
import { useDistrict } from "@/hooks/use-district";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

export default function DistrictSelector() {
  const { districts, showSelector, setShowSelector, selectDistrict, isLoading } = useDistrict();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDistricts = districts.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.state && d.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedByState = filteredDistricts.reduce<Record<string, typeof filteredDistricts>>((acc, d) => {
    const state = d.state || "Other";
    if (!acc[state]) acc[state] = [];
    acc[state].push(d);
    return acc;
  }, {});

  if (isLoading || districts.length === 0) return null;

  return (
    <Dialog open={showSelector} onOpenChange={setShowSelector}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-green-600" />
            Select Your District
          </DialogTitle>
          <DialogDescription>
            Choose your district so we can show you products available for delivery in your area.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="overflow-y-auto flex-1 mt-3 -mx-2 px-2 max-h-[50vh]">
          {Object.entries(groupedByState).sort(([a], [b]) => a.localeCompare(b)).map(([state, stateDistricts]) => (
            <div key={state} className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">{state}</p>
              <div className="grid grid-cols-2 gap-2">
                {stateDistricts.sort((a, b) => a.name.localeCompare(b.name)).map(district => (
                  <Button
                    key={district.id}
                    variant="outline"
                    className="justify-start h-auto py-2.5 px-3 text-sm font-medium hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                    onClick={() => selectDistrict(district.id)}
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-green-500 flex-shrink-0" />
                    {district.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          {filteredDistricts.length === 0 && (
            <p className="text-center text-gray-500 py-8">No districts found matching "{searchTerm}"</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
