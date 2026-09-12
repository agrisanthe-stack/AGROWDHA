import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatIndianCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RotateCcw, CheckCircle, XCircle, Clock, Eye, ImageIcon, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";

const RETURN_REASON_LABELS: Record<string, string> = {
  damaged: "Product was damaged",
  wrong_product: "Wrong product delivered",
  quality_issue: "Quality not as expected",
  missing_items: "Items were missing",
  quantity_mismatch: "Quantity was incorrect",
  other: "Other reason",
};

function ReturnStatusBadge({ status }: { status: string }) {
  if (status === "pending") return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  if (status === "fpo_accepted") return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs"><CheckCircle className="h-3 w-3 mr-1" />FPO Accepted</Badge>;
  if (status === "fpo_rejected") return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs"><XCircle className="h-3 w-3 mr-1" />FPO Rejected</Badge>;
  return <Badge variant="outline" className="text-xs">{status}</Badge>;
}

function AdminStatusBadge({ status }: { status: string }) {
  if (status === "pending") return <Badge variant="outline" className="text-xs text-gray-600">Pending</Badge>;
  if (status === "approved") return <Badge className="bg-blue-100 text-blue-800 text-xs">Approved</Badge>;
  if (status === "rejected") return <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>;
  if (status === "processed") return <Badge className="bg-purple-100 text-purple-800 text-xs">Processed</Badge>;
  return <Badge variant="outline" className="text-xs">{status}</Badge>;
}

function PhotoLightbox({ photos, initialIndex, onClose }: { photos: string[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const prev = () => setIndex(i => (i === 0 ? photos.length - 1 : i - 1));
  const next = () => setIndex(i => (i === photos.length - 1 ? 0 : i + 1));
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 bg-black/95 border-0 flex items-center justify-center">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors">
          <X className="h-6 w-6 text-white" />
        </button>
        {photos.length > 1 && (
          <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {index + 1} / {photos.length}
          </div>
        )}
        {photos.length > 1 && (
          <button onClick={prev} className="absolute left-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors">
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
        )}
        <img src={photos[index]} alt={`Photo ${index + 1}`} className="max-h-full max-w-full object-contain rounded" />
        {photos.length > 1 && (
          <button onClick={next} className="absolute right-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors">
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── FPO / DM Panel ──────────────────────────────────────────────────────────
export function FpoReturnRequestsPanel() {
  const { toast } = useToast();
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; returnId: number | null; action: "accept" | "reject" | null }>({ open: false, returnId: null, action: null });
  const [refundAmount, setRefundAmount] = useState("");
  const [fpoNote, setFpoNote] = useState("");
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null);

  const { data: returnRequests = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ["/api/dm/return-requests"],
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action, refundAmount, fpoNote }: { id: number; action: string; refundAmount?: string; fpoNote?: string }) => {
      const res = await apiRequest("PUT", `/api/dm/return-requests/${id}`, { action, refundAmount, fpoNote });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Action failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Return request updated", description: "The customer will be notified of your decision." });
      queryClient.invalidateQueries({ queryKey: ["/api/dm/return-requests"] });
      refetch();
      setActionDialog({ open: false, returnId: null, action: null });
      setRefundAmount("");
      setFpoNote("");
    },
    onError: (error: any) => {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    },
  });

  const handleAction = () => {
    if (!actionDialog.returnId || !actionDialog.action) return;
    actionMutation.mutate({
      id: actionDialog.returnId,
      action: actionDialog.action,
      refundAmount: actionDialog.action === "accept" ? refundAmount : undefined,
      fpoNote: fpoNote || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-orange-500" />
            Return & Refund Requests
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review return requests from customers for products you've approved.
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
          {returnRequests.length} request{returnRequests.length !== 1 ? "s" : ""}
        </div>
      </div>

      {returnRequests.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <RotateCcw className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No return requests yet</p>
          <p className="text-gray-400 text-sm mt-1">When customers raise return requests for your approved products, they will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead className="font-semibold text-orange-800">Order #</TableHead>
                <TableHead className="font-semibold text-orange-800">Customer</TableHead>
                <TableHead className="font-semibold text-orange-800">Reason</TableHead>
                <TableHead className="font-semibold text-orange-800">Order Total</TableHead>
                <TableHead className="font-semibold text-orange-800">Refund Amount</TableHead>
                <TableHead className="font-semibold text-orange-800">Status</TableHead>
                <TableHead className="font-semibold text-orange-800">Date</TableHead>
                <TableHead className="font-semibold text-orange-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returnRequests.map((req: any) => (
                <TableRow key={req.id} className="hover:bg-orange-50/30">
                  <TableCell className="font-medium">#{req.orderId}</TableCell>
                  <TableCell>{req.customerName}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">{RETURN_REASON_LABELS[req.reason] || req.reason}</span>
                  </TableCell>
                  <TableCell>{req.order ? formatIndianCurrency(req.order.total) : "-"}</TableCell>
                  <TableCell>
                    {req.refundAmount ? (
                      <span className="font-medium text-green-700">{formatIndianCurrency(req.refundAmount)}</span>
                    ) : "-"}
                  </TableCell>
                  <TableCell><ReturnStatusBadge status={req.status} /></TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(req.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2"
                        onClick={() => setSelectedReturn(req)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {req.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="text-xs h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              setActionDialog({ open: true, returnId: req.id, action: "accept" });
                              setRefundAmount(req.order ? String(req.order.total) : "");
                              setFpoNote("");
                            }}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2 border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setActionDialog({ open: true, returnId: req.id, action: "reject" });
                              setRefundAmount("");
                              setFpoNote("");
                            }}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={!!selectedReturn} onOpenChange={(open) => { if (!open) setSelectedReturn(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Return Request — Order #{selectedReturn?.orderId}</DialogTitle>
            <DialogDescription>Submitted by {selectedReturn?.customerName} on {selectedReturn ? formatDate(selectedReturn.createdAt) : ""}</DialogDescription>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><ReturnStatusBadge status={selectedReturn.status} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Reason</span><span className="font-medium">{RETURN_REASON_LABELS[selectedReturn.reason] || selectedReturn.reason}</span></div>
              <div>
                <span className="text-muted-foreground">Customer Description</span>
                <p className="mt-1 p-2 bg-gray-50 rounded text-gray-700">{selectedReturn.description}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-2">Photos</span>
                {selectedReturn.photos && selectedReturn.photos.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {selectedReturn.photos.map((url: string, i: number) => (
                      <button key={i} type="button" onClick={() => setLightbox({ photos: selectedReturn.photos, index: i })}>
                        <img src={url} alt={`Return photo ${i + 1}`} className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200 hover:border-orange-400 hover:scale-105 cursor-zoom-in transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic bg-gray-50 rounded px-3 py-2">No photos uploaded by customer</p>
                )}
              </div>
              {selectedReturn.refundAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved Refund</span>
                  <span className="font-semibold text-green-700">{formatIndianCurrency(selectedReturn.refundAmount)}</span>
                </div>
              )}
              {selectedReturn.fpoNote && (
                <div>
                  <span className="text-muted-foreground">Your Note</span>
                  <p className="mt-1 p-2 bg-gray-50 rounded text-gray-700">{selectedReturn.fpoNote}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReturn(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Lightbox */}
      {lightbox && <PhotoLightbox photos={lightbox.photos} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />}

      {/* Accept / Reject Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => { if (!open) setActionDialog({ open: false, returnId: null, action: null }); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={actionDialog.action === "accept" ? "text-green-700" : "text-red-700"}>
              {actionDialog.action === "accept" ? "Accept Return & Set Refund Amount" : "Reject Return Request"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === "accept"
                ? "Please specify how much you are able to refund the customer."
                : "Please provide a reason for rejecting this return request."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {actionDialog.action === "accept" && (
              <div>
                <Label htmlFor="refund-amount">Refund Amount (₹) *</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1"
                  placeholder="Enter refund amount..."
                  value={refundAmount}
                  onChange={e => setRefundAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">This will be visible to the customer and the admin.</p>
              </div>
            )}
            <div>
              <Label htmlFor="fpo-note">{actionDialog.action === "accept" ? "Note to Customer (optional)" : "Reason for Rejection *"}</Label>
              <Textarea
                id="fpo-note"
                className="mt-1"
                rows={3}
                placeholder={actionDialog.action === "accept" ? "Add any instructions or comments..." : "Explain why the return is being rejected..."}
                value={fpoNote}
                onChange={e => setFpoNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, returnId: null, action: null })}>Cancel</Button>
            <Button
              onClick={handleAction}
              disabled={
                actionMutation.isPending ||
                (actionDialog.action === "accept" && (!refundAmount || parseFloat(refundAmount) <= 0)) ||
                (actionDialog.action === "reject" && fpoNote.length < 3)
              }
              className={actionDialog.action === "accept" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
            >
              {actionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {actionDialog.action === "accept" ? "Confirm Acceptance" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Admin Panel ─────────────────────────────────────────────────────────────
export function AdminReturnRequestsPanel() {
  const { toast } = useToast();
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [adminStatusInput, setAdminStatusInput] = useState("");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [editingReturn, setEditingReturn] = useState<any>(null);
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null);

  const { data: returnRequests = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ["/api/admin/return-requests"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, adminStatus, adminNote }: { id: number; adminStatus: string; adminNote?: string }) => {
      const res = await apiRequest("PUT", `/api/admin/return-requests/${id}`, { adminStatus, adminNote });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Return request updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/return-requests"] });
      refetch();
      setActionDialogOpen(false);
      setEditingReturn(null);
    },
    onError: (error: any) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const filteredRequests = statusFilter === "all"
    ? returnRequests
    : returnRequests.filter((r: any) => r.status === statusFilter || r.adminStatus === statusFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-orange-500" />
            Returns & Refunds — Admin View
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Full visibility into all return requests across the platform. You can add notes and update the admin status.
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending FPO Review</SelectItem>
            <SelectItem value="fpo_accepted">FPO Accepted</SelectItem>
            <SelectItem value="fpo_rejected">FPO Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: returnRequests.length, color: "blue" },
          { label: "Pending Review", value: returnRequests.filter((r: any) => r.status === "pending").length, color: "yellow" },
          { label: "FPO Accepted", value: returnRequests.filter((r: any) => r.status === "fpo_accepted").length, color: "green" },
          { label: "FPO Rejected", value: returnRequests.filter((r: any) => r.status === "fpo_rejected").length, color: "red" },
        ].map(card => (
          <Card key={card.label} className={`border-${card.color}-100`}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <RotateCcw className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No return requests found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="font-semibold text-blue-800">Order #</TableHead>
                <TableHead className="font-semibold text-blue-800">Customer</TableHead>
                <TableHead className="font-semibold text-blue-800">FPO</TableHead>
                <TableHead className="font-semibold text-blue-800">Reason</TableHead>
                <TableHead className="font-semibold text-blue-800">Refund Amt</TableHead>
                <TableHead className="font-semibold text-blue-800">FPO Status</TableHead>
                <TableHead className="font-semibold text-blue-800">Admin Status</TableHead>
                <TableHead className="font-semibold text-blue-800">Date</TableHead>
                <TableHead className="font-semibold text-blue-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req: any) => (
                <TableRow key={req.id} className="hover:bg-blue-50/30">
                  <TableCell className="font-medium">#{req.orderId}</TableCell>
                  <TableCell>{req.customerName}</TableCell>
                  <TableCell className="text-sm text-gray-600">{req.fpoName}</TableCell>
                  <TableCell className="text-sm">{RETURN_REASON_LABELS[req.reason] || req.reason}</TableCell>
                  <TableCell>
                    {req.refundAmount ? (
                      <span className="font-medium text-green-700">{formatIndianCurrency(req.refundAmount)}</span>
                    ) : <span className="text-gray-400">-</span>}
                  </TableCell>
                  <TableCell><ReturnStatusBadge status={req.status} /></TableCell>
                  <TableCell><AdminStatusBadge status={req.adminStatus} /></TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(req.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2"
                        onClick={() => setSelectedReturn(req)}
                      >
                        <Eye className="h-3 w-3 mr-1" />View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2"
                        onClick={() => {
                          setEditingReturn(req);
                          setAdminStatusInput(req.adminStatus || "pending");
                          setAdminNoteInput(req.adminNote || "");
                          setActionDialogOpen(true);
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={!!selectedReturn} onOpenChange={(open) => { if (!open) setSelectedReturn(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Return Request — Order #{selectedReturn?.orderId}</DialogTitle>
            <DialogDescription>
              Customer: {selectedReturn?.customerName} | FPO: {selectedReturn?.fpoName}
            </DialogDescription>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">FPO Status</span><ReturnStatusBadge status={selectedReturn.status} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Admin Status</span><AdminStatusBadge status={selectedReturn.adminStatus} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Reason</span><span className="font-medium">{RETURN_REASON_LABELS[selectedReturn.reason] || selectedReturn.reason}</span></div>
              <div>
                <span className="text-muted-foreground">Customer Description</span>
                <p className="mt-1 p-2 bg-gray-50 rounded text-gray-700">{selectedReturn.description}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-2">Photos</span>
                {selectedReturn.photos && selectedReturn.photos.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {selectedReturn.photos.map((url: string, i: number) => (
                      <button key={i} type="button" onClick={() => setLightbox({ photos: selectedReturn.photos, index: i })}>
                        <img src={url} alt={`Photo ${i + 1}`} className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200 hover:border-orange-400 hover:scale-105 cursor-zoom-in transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic bg-gray-50 rounded px-3 py-2">No photos uploaded by customer</p>
                )}
              </div>
              {selectedReturn.refundAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">FPO Refund Amount</span>
                  <span className="font-semibold text-green-700">{formatIndianCurrency(selectedReturn.refundAmount)}</span>
                </div>
              )}
              {selectedReturn.fpoNote && (
                <div>
                  <span className="text-muted-foreground">FPO Note</span>
                  <p className="mt-1 p-2 bg-gray-50 rounded">{selectedReturn.fpoNote}</p>
                </div>
              )}
              {selectedReturn.adminNote && (
                <div>
                  <span className="text-muted-foreground">Admin Note</span>
                  <p className="mt-1 p-2 bg-blue-50 rounded text-blue-700">{selectedReturn.adminNote}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReturn(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Lightbox */}
      {lightbox && <PhotoLightbox photos={lightbox.photos} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />}

      {/* Admin Update Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={(open) => { if (!open) { setActionDialogOpen(false); setEditingReturn(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Admin Status — Order #{editingReturn?.orderId}</DialogTitle>
            <DialogDescription>You can update the admin status and add an internal note.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Admin Status</Label>
              <Select value={adminStatusInput} onValueChange={setAdminStatusInput}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Admin Note (optional)</Label>
              <Textarea
                className="mt-1"
                rows={3}
                placeholder="Add internal notes..."
                value={adminNoteInput}
                onChange={e => setAdminNoteInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setActionDialogOpen(false); setEditingReturn(null); }}>Cancel</Button>
            <Button
              onClick={() => updateMutation.mutate({ id: editingReturn.id, adminStatus: adminStatusInput, adminNote: adminNoteInput })}
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
