import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  BarChart2, Download, Loader2, TrendingUp, Users, ShoppingBag, PackageCheck, Truck,
} from "lucide-react";

type AnalyticsData = {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalDeliveryFees: number;
    deliveredOrders: number;
    uniqueCustomers: number;
  };
  products: Array<{ name: string; farmerName: string; orders: number; totalQty: number; revenue: number; unit: string }>;
  farmers: Array<{ name: string; products: number; orders: number; revenue: number }>;
};

function isoDate(d: Date) { return d.toISOString().split("T")[0]; }

function periodDates(period: string): { start: string; end: string } {
  const today = new Date();
  if (period === "week") {
    const mon = new Date(today);
    mon.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    return { start: isoDate(mon), end: isoDate(today) };
  }
  if (period === "month") {
    return { start: isoDate(new Date(today.getFullYear(), today.getMonth(), 1)), end: isoDate(today) };
  }
  if (period === "year") {
    return { start: isoDate(new Date(today.getFullYear(), 0, 1)), end: isoDate(today) };
  }
  return { start: isoDate(today), end: isoDate(today) };
}

export default function AnalyticsReportSection({ orgName }: { orgName?: string }) {
  const [period, setPeriod] = useState<"week" | "month" | "year" | "custom">("month");
  const [customStart, setCustomStart] = useState(isoDate(new Date(Date.now() - 30 * 86400000)));
  const [customEnd, setCustomEnd] = useState(isoDate(new Date()));
  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const { start: periodStart, end: periodEnd } =
    period !== "custom" ? periodDates(period) : { start: customStart, end: customEnd };

  function getAuthToken(): string | null {
    try { return JSON.parse(localStorage.getItem("harvest_direct_auth") || "").token || null; }
    catch { return null; }
  }

  const { data: analyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/dm/analytics/report-data", periodStart, periodEnd],
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch(`/api/dm/analytics/report-data?startDate=${periodStart}&endDate=${periodEnd}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load analytics");
      return res.json();
    },
    enabled: !!periodStart && !!periodEnd,
  });

  async function handleDownloadPdf() {
    setPdfLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/dm/analytics/report-pdf?startDate=${periodStart}&endDate=${periodEnd}&period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || "Failed"); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(orgName || "analytics").replace(/\s+/g, "_")}_${period}_report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Report downloaded!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setPdfLoading(false); }
  }

  async function handleDownloadCsv() {
    setCsvLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/dm/analytics/report-csv?startDate=${periodStart}&endDate=${periodEnd}&period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || "Failed"); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(orgName || "analytics").replace(/\s+/g, "_")}_${period}_report.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "CSV downloaded!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setCsvLoading(false); }
  }

  return (
    <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <BarChart2 className="h-5 w-5" />
          Performance Analytics Report
        </CardTitle>
        <p className="text-sm text-purple-700">
          Order analytics by product and farmer — select a period to preview, then download as PDF or CSV.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Period presets */}
        <div>
          <Label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Report Period</Label>
          <div className="flex flex-wrap gap-2">
            {(["week", "month", "year", "custom"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-purple-200 text-purple-700 hover:bg-purple-50"
                }`}
              >
                {p === "week" ? "This Week" : p === "month" ? "This Month" : p === "year" ? "This Year" : "Custom Range"}
              </button>
            ))}
          </div>
        </div>

        {period === "custom" && (
          <div className="flex flex-wrap gap-4">
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">From</Label>
              <Input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="w-44" />
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">To</Label>
              <Input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="w-44" />
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 font-mono">Period: {periodStart} → {periodEnd}</div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-purple-600 py-4">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading analytics…
          </div>
        ) : analyticsData ? (
          <>
            {/* Summary stat boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { icon: <ShoppingBag className="h-5 w-5" />, label: "Total Orders", value: analyticsData.summary.totalOrders, color: "purple" },
                { icon: <TrendingUp className="h-5 w-5" />, label: "Total Revenue", value: `₹${analyticsData.summary.totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, color: "green" },
                { icon: <Truck className="h-5 w-5" />, label: "Delivery Fees", value: `₹${(analyticsData.summary.totalDeliveryFees ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, color: "violet" },
                { icon: <PackageCheck className="h-5 w-5" />, label: "Delivered", value: analyticsData.summary.deliveredOrders, color: "blue" },
                { icon: <Users className="h-5 w-5" />, label: "Customers", value: analyticsData.summary.uniqueCustomers, color: "amber" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-3 border ${
                  s.color === "purple" ? "bg-purple-50 border-purple-200" :
                  s.color === "green" ? "bg-green-50 border-green-200" :
                  s.color === "violet" ? "bg-violet-50 border-violet-200" :
                  s.color === "blue" ? "bg-blue-50 border-blue-200" :
                  "bg-amber-50 border-amber-200"
                }`}>
                  <div className={`mb-1 ${s.color === "purple" ? "text-purple-600" : s.color === "green" ? "text-green-600" : s.color === "violet" ? "text-violet-600" : s.color === "blue" ? "text-blue-600" : "text-amber-600"}`}>{s.icon}</div>
                  <div className="text-2xl font-bold text-gray-800">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Products table */}
            {analyticsData.products.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 text-sm mb-2">Product Performance</p>
                <div className="rounded-xl border border-purple-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-purple-600 text-white">
                        <th className="text-left px-3 py-2 font-semibold">#</th>
                        <th className="text-left px-3 py-2 font-semibold">Product</th>
                        <th className="text-left px-3 py-2 font-semibold">Farmer</th>
                        <th className="text-right px-3 py-2 font-semibold">Orders</th>
                        <th className="text-right px-3 py-2 font-semibold">Qty Sold</th>
                        <th className="text-right px-3 py-2 font-semibold">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.products.map((p, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-purple-50/40"}>
                          <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                          <td className="px-3 py-2 font-medium text-gray-800">{p.name}</td>
                          <td className="px-3 py-2 text-gray-500">{p.farmerName}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{p.orders}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{p.totalQty} {p.unit}</td>
                          <td className="px-3 py-2 text-right font-semibold text-green-700">₹{p.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Farmers table */}
            {analyticsData.farmers.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 text-sm mb-2">Farmer Performance</p>
                <div className="rounded-xl border border-indigo-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="text-left px-3 py-2 font-semibold">#</th>
                        <th className="text-left px-3 py-2 font-semibold">Farmer</th>
                        <th className="text-right px-3 py-2 font-semibold">Products</th>
                        <th className="text-right px-3 py-2 font-semibold">Orders</th>
                        <th className="text-right px-3 py-2 font-semibold">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.farmers.map((f, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"}>
                          <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                          <td className="px-3 py-2 font-medium text-gray-800">{f.name}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{f.products}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{f.orders}</td>
                          <td className="px-3 py-2 text-right font-semibold text-green-700">₹{f.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {analyticsData.summary.totalOrders === 0 && (
              <p className="text-center text-gray-400 py-4 text-sm">No orders found in this period.</p>
            )}
          </>
        ) : null}

        {/* Download buttons */}
        <div className="flex flex-wrap gap-3 pt-1">
          <Button onClick={handleDownloadPdf} disabled={pdfLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
            {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {pdfLoading ? "Generating…" : "Download PDF Report"}
          </Button>
          <Button onClick={handleDownloadCsv} disabled={csvLoading} variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
            {csvLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {csvLoading ? "Generating…" : "Download CSV"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
