import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  FileText, MessageCircle, Download, Copy, Check, QrCode,
  Loader2, Share2, ExternalLink, Sparkles, Store,
} from "lucide-react";

type MvData = {
  fpo: {
    orgName: string;
    orgLogoUrl?: string | null;
    orgPhone?: string | null;
    district?: string | null;
    deliveryDistricts?: string[];
    orgSlug?: string | null;
    storeUrl?: string | null;
    qrCodeUrl?: string | null;
  };
  farmers: Array<{ id: number; farmName: string; location?: string | null; imageUrl?: string | null }>;
  products: Array<{
    id: number;
    name: string;
    imageUrl?: string | null;
    price: string;
    unit: string;
    farmerId?: number | null;
    isQuoteMode?: boolean;
    priceSlabs?: Array<{ minQuantity: number; maxQuantity?: number | null; pricePerUnit: string; slabType: string }>;
  }>;
};

function formatINR(val: string | number) {
  const n = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(n) ? "—" : `₹${n.toFixed(0)}`;
}

function getRetailPrice(p: MvData["products"][0]): string {
  if (p.isQuoteMode) return "On Request";
  const b2cSlab = (p.priceSlabs || []).find(s => s.slabType === "b2c");
  if (b2cSlab) return `${formatINR(b2cSlab.pricePerUnit)}/${p.unit}`;
  return `${formatINR(p.price)}/${p.unit}`;
}

function getWholesalePrice(p: MvData["products"][0]): string | null {
  const b2bSlabs = (p.priceSlabs || []).filter(s => s.slabType === "b2b").sort((a, b) => a.minQuantity - b.minQuantity);
  if (!b2bSlabs.length) return null;
  const first = b2bSlabs[0];
  return `${formatINR(first.pricePerUnit)}/${p.unit} (min ${first.minQuantity} ${p.unit})`;
}

export default function MarketingToolsPanel() {
  const [copyDone, setCopyDone] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const { data, isLoading } = useQuery<MvData>({
    queryKey: ["/api/dm/marketing-video/data"],
  });

  const fpo = data?.fpo;
  const farmers = data?.farmers || [];
  const products = data?.products || [];

  function farmerName(farmerId: number | null | undefined): string {
    if (!farmerId) return fpo?.orgName || "FPO";
    return farmers.find(f => f.id === farmerId)?.farmName || "—";
  }

  function buildWhatsAppText(): string {
    const lines: string[] = [];
    lines.push(`🌾 *${fpo?.orgName || "Our FPO"}* — Fresh Farm Products 🌿`);
    lines.push("");
    lines.push("📦 *Products available now:*");
    lines.push("");
    products.forEach((p, i) => {
      const retail = getRetailPrice(p);
      const wholesale = getWholesalePrice(p);
      const fn = farmerName(p.farmerId);
      lines.push(`${i + 1}. 🥬 *${p.name}*`);
      lines.push(`   👨‍🌾 Farmer: ${fn}`);
      lines.push(`   Retail: ${retail}`);
      if (wholesale) lines.push(`   Wholesale: ${wholesale}`);
    });
    lines.push("");
    if (fpo?.deliveryDistricts?.length) lines.push(`🚚 *Delivering to:* ${fpo.deliveryDistricts.join(", ")}`);
    if (fpo?.storeUrl) lines.push(`🛒 *Order online:* ${fpo.storeUrl}`);
    lines.push("");
    lines.push("_Powered by FarmerSanthe — Fresh from the farm, direct to you_ 🍃");
    return lines.join("\n");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildWhatsAppText());
    setCopyDone(true);
    toast({ title: "Copied!", description: "Message copied — paste it in WhatsApp." });
    setTimeout(() => setCopyDone(false), 3000);
  }

  function handleWhatsAppShare() {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildWhatsAppText())}`, "_blank");
  }

  function getAuthToken(): string | null {
    try { return JSON.parse(localStorage.getItem("harvest_direct_auth") || "").token || null; }
    catch { return null; }
  }

  async function handleDownloadPdf() {
    setPdfLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("/api/dm/marketing/catalog-pdf", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || "Failed"); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${(fpo?.orgName || "catalog").replace(/\s+/g, "_")}_catalog.pdf`; a.click();
      URL.revokeObjectURL(url);
      toast({ title: "PDF downloaded!", description: "Your product catalog is ready." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setPdfLoading(false); }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <Store className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No approved products yet</p>
        <p className="text-sm mt-1">Approve products first to use the marketing tools.</p>
      </div>
    );
  }

  const whatsappText = buildWhatsAppText();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Marketing Tools</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Catalog PDF and WhatsApp broadcast for <span className="font-semibold text-gray-700">{fpo?.orgName}</span>
          </p>
        </div>
      </div>

      {/* ── Product Catalog PDF ─────────────────────────────────────── */}
      <Card className="border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <FileText className="h-5 w-5" />
            Product Catalog PDF
          </CardTitle>
          <p className="text-sm text-indigo-600">
            Printable PDF with FPO branding, product table (retail &amp; wholesale prices), farmer photos, and store QR code.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-indigo-100 bg-white overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="text-left px-4 py-2 font-semibold">Product</th>
                  <th className="text-left px-4 py-2 font-semibold">Farmer</th>
                  <th className="text-left px-4 py-2 font-semibold">Retail</th>
                  <th className="text-left px-4 py-2 font-semibold">Wholesale</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => {
                  const ws = getWholesalePrice(p);
                  const farmer = farmers.find(f => f.id === p.farmerId);
                  return (
                    <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-indigo-50/50"}>
                      <td className="px-4 py-2 font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          {p.imageUrl && (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-8 h-8 rounded-md object-cover border border-indigo-200"
                              onError={(event) => { event.currentTarget.style.display = "none"; }}
                            />
                          )}
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {farmer?.imageUrl && (
                            <img
                              src={farmer.imageUrl}
                              alt={farmer.farmName}
                              className="w-6 h-6 rounded-full object-cover border border-indigo-200"
                              onError={(event) => { event.currentTarget.style.display = "none"; }}
                            />
                          )}
                          <span className="text-gray-600">{farmerName(p.farmerId)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-green-700 font-semibold">{getRetailPrice(p)}</td>
                      <td className="px-4 py-2 text-blue-700">{ws || <span className="text-gray-400 text-xs">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleDownloadPdf} disabled={pdfLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {pdfLoading ? "Generating…" : "Download Catalog PDF"}
            </Button>
            <p className="text-xs text-gray-400">Includes farmer photos &amp; QR code</p>
          </div>
        </CardContent>
      </Card>

      {/* ── WhatsApp Broadcast Builder ──────────────────────────────── */}
      <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <MessageCircle className="h-5 w-5" />
            WhatsApp Broadcast Builder
          </CardTitle>
          <p className="text-sm text-green-700">
            Ready-to-paste message with all products, retail &amp; wholesale prices, farmer names, and your store link.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-green-200 bg-white p-4 mb-5 font-mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
            {whatsappText}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopy} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              {copyDone ? <Check className="mr-2 h-4 w-4 text-green-600" /> : <Copy className="mr-2 h-4 w-4" />}
              {copyDone ? "Copied!" : "Copy Message"}
            </Button>
            <Button onClick={handleWhatsAppShare} className="bg-green-600 hover:bg-green-700 text-white">
              <Share2 className="mr-2 h-4 w-4" />
              Open in WhatsApp
            </Button>
            {fpo?.storeUrl && (
              <a href={fpo.storeUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview Store
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store QR hint */}
      {fpo?.storeUrl && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <QrCode className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Your Store QR Code</p>
            <p className="text-amber-700 text-sm mt-0.5">
              The catalog PDF includes a QR code linking to <span className="font-mono font-semibold">{fpo.storeUrl}</span>. Print it on bags, boxes, and stall banners.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
