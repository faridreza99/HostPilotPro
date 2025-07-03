import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  FileText, 
  Plus, 
  Send, 
  Download, 
  Eye, 
  Trash2, 
  Clock, 
  CheckCircle, 
  DollarSign,
  User,
  Building,
  Mail,
  Calendar,
  AlertCircle,
  Copy,
  FileSpreadsheet,
  Settings
} from "lucide-react";

// Invoice form schema
const invoiceFormSchema = z.object({
  invoiceType: z.string().min(1, "Invoice type is required"),
  fromRole: z.string().min(1, "From role is required"),
  fromName: z.string().min(1, "From name is required"),
  fromAddress: z.string().optional(),
  toRole: z.string().min(1, "To role is required"),
  toName: z.string().min(1, "To name is required"),
  toAddress: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  subtotal: z.string().min(1, "Subtotal is required"),
  taxRate: z.string().default("0"),
  currency: z.string().default("USD"),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  lineItems: z.array(z.object({
    description: z.string().min(1, "Item description is required"),
    quantity: z.string().default("1"),
    unitPrice: z.string().min(1, "Unit price is required"),
  })).min(1, "At least one line item is required"),
});

// Line item form schema
const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.string().default("1"),
  unitPrice: z.string().min(1, "Unit price is required"),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
type LineItemData = z.infer<typeof lineItemSchema>;

export default function InvoiceGenerator() {
  const [selectedTab, setSelectedTab] = useState("create");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [lineItems, setLineItems] = useState<LineItemData[]>([
    { description: "", quantity: "1", unitPrice: "" }
  ]);
  const { toast } = useToast();

  // Fetch invoices
  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["/api/invoices"],
  });

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/invoice-templates"],
  });

  // Fetch delivery logs
  const { data: deliveryLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["/api/invoice-delivery-logs"],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/invoice-analytics"],
  });

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: async (data: InvoiceFormData & { lineItems: LineItemData[] }) => {
      return apiRequest("POST", "/api/invoices", data);
    },
    onSuccess: () => {
      toast({
        title: "Invoice Created",
        description: "Invoice has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      setIsCreateDialogOpen(false);
      form.reset();
      setLineItems([{ description: "", quantity: "1", unitPrice: "" }]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  // Send invoice mutation
  const sendInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: number) => {
      return apiRequest("POST", `/api/invoices/${invoiceId}/send`);
    },
    onSuccess: () => {
      toast({
        title: "Invoice Sent",
        description: "Invoice has been sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/invoice-delivery-logs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invoice",
        variant: "destructive",
      });
    },
  });

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: number) => {
      return apiRequest("DELETE", `/api/invoices/${invoiceId}`);
    },
    onSuccess: () => {
      toast({
        title: "Invoice Deleted",
        description: "Invoice has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceType: "",
      fromRole: "",
      fromName: "",
      fromAddress: "",
      toRole: "",
      toName: "",
      toAddress: "",
      description: "",
      subtotal: "0",
      taxRate: "0",
      currency: "USD",
      dueDate: "",
      notes: "",
      lineItems: [{ description: "", quantity: "1", unitPrice: "" }],
    },
  });

  const onSubmit = (data: InvoiceFormData) => {
    const formData = {
      ...data,
      lineItems: lineItems.filter(item => item.description && item.unitPrice),
    };
    
    if (formData.lineItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one line item",
        variant: "destructive",
      });
      return;
    }

    createInvoiceMutation.mutate(formData);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: "1", unitPrice: "" }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof LineItemData, value: string) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateTotal = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || "0") * parseFloat(item.unitPrice || "0"));
    }, 0);
    const taxRate = parseFloat(form.watch("taxRate") || "0") / 100;
    const taxAmount = subtotal * taxRate;
    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: (subtotal + taxAmount).toFixed(2),
    };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-500", label: "Draft" },
      sent: { color: "bg-blue-500", label: "Sent" },
      paid: { color: "bg-green-500", label: "Paid" },
      overdue: { color: "bg-red-500", label: "Overdue" },
      cancelled: { color: "bg-gray-400", label: "Cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
  };

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Invoice Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and track invoices for all business relationships
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Invoice
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Manage Invoices
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Delivery Tracking
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Create Invoice Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Invoice
                </CardTitle>
                <CardDescription>
                  Generate invoices for commission payments, service charges, and business transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Invoice Type and Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="invoiceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Invoice Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rental_commission">Rental Commission</SelectItem>
                                <SelectItem value="service_fee">Service Fee</SelectItem>
                                <SelectItem value="maintenance_charge">Maintenance Charge</SelectItem>
                                <SelectItem value="payout_request">Payout Request</SelectItem>
                                <SelectItem value="expense_reimbursement">Expense Reimbursement</SelectItem>
                                <SelectItem value="portfolio_commission">Portfolio Commission</SelectItem>
                                <SelectItem value="booking_commission">Booking Commission</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="THB">THB</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* From and To Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* From Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <User className="h-4 w-4" />
                          From
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fromRole"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>From Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="company">Company</SelectItem>
                                    <SelectItem value="owner">Property Owner</SelectItem>
                                    <SelectItem value="portfolio-manager">Portfolio Manager</SelectItem>
                                    <SelectItem value="retail-agent">Retail Agent</SelectItem>
                                    <SelectItem value="referral-agent">Referral Agent</SelectItem>
                                    <SelectItem value="staff">Staff Member</SelectItem>
                                    <SelectItem value="external">External Party</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="fromName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>From Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Name/Company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="fromAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Address</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Address (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* To Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          To
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="toRole"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>To Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="company">Company</SelectItem>
                                    <SelectItem value="owner">Property Owner</SelectItem>
                                    <SelectItem value="portfolio-manager">Portfolio Manager</SelectItem>
                                    <SelectItem value="retail-agent">Retail Agent</SelectItem>
                                    <SelectItem value="referral-agent">Referral Agent</SelectItem>
                                    <SelectItem value="staff">Staff Member</SelectItem>
                                    <SelectItem value="external">External Party</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="toName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>To Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Name/Company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="toAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>To Address</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Address (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of what this invoice is for..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Line Items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Line Items</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addLineItem}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {lineItems.map((item, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                            <div className="md:col-span-2">
                              <Input
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => updateLineItem(index, "description", e.target.value)}
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Unit Price"
                                value={item.unitPrice}
                                onChange={(e) => updateLineItem(index, "unitPrice", e.target.value)}
                              />
                              {lineItems.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeLineItem(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tax and Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="taxRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tax Rate (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes (optional)"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 className="font-semibold">Invoice Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{form.watch("currency")} {totals.subtotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax ({form.watch("taxRate") || 0}%):</span>
                            <span>{form.watch("currency")} {totals.taxAmount}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span>{form.watch("currency")} {totals.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Reset Form
                      </Button>
                      <Button
                        type="submit"
                        disabled={createInvoiceMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        {createInvoiceMutation.isPending ? (
                          <>
                            <Clock className="h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" />
                            Create Invoice
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Invoices Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Management
                </CardTitle>
                <CardDescription>
                  View, edit, and manage all created invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invoicesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Clock className="h-6 w-6 animate-spin mr-2" />
                    Loading invoices...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices && invoices.length > 0 ? (
                      invoices.map((invoice: any) => (
                        <div key={invoice.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold">#{invoice.invoiceNumber}</h3>
                                {getStatusBadge(invoice.status)}
                                <Badge variant="outline">{invoice.invoiceType}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {invoice.fromName} → {invoice.toName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {invoice.description}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-lg font-semibold">
                                {invoice.currency} {invoice.totalAmount}
                              </div>
                              <p className="text-sm text-gray-500">
                                Due: {invoice.dueDate || "No due date"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setIsViewDialogOpen(true);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            
                            {invoice.status !== "sent" && invoice.status !== "paid" && (
                              <Button
                                size="sm"
                                onClick={() => sendInvoiceMutation.mutate(invoice.id)}
                                disabled={sendInvoiceMutation.isPending}
                                className="flex items-center gap-1"
                              >
                                <Send className="h-4 w-4" />
                                Send
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              PDF
                            </Button>
                            
                            {invoice.status === "draft" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
                                disabled={deleteInvoiceMutation.isPending}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No invoices created yet. Create your first invoice to get started.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Delivery Tracking
                </CardTitle>
                <CardDescription>
                  Track email delivery status and recipient interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Clock className="h-6 w-6 animate-spin mr-2" />
                    Loading delivery logs...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliveryLogs && deliveryLogs.length > 0 ? (
                      deliveryLogs.map((log: any) => (
                        <div key={log.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">#{log.invoiceNumber}</h3>
                              {log.deliveryStatus === "delivered" && (
                                <Badge className="bg-green-500 text-white">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Delivered
                                </Badge>
                              )}
                              {log.deliveryStatus === "failed" && (
                                <Badge className="bg-red-500 text-white">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Failed
                                </Badge>
                              )}
                              {log.deliveryStatus === "pending" && (
                                <Badge className="bg-yellow-500 text-white">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(log.sentAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>To: {log.recipientEmail}</p>
                            <p>Provider: {log.deliveryProvider}</p>
                            {log.openedAt && (
                              <p className="text-green-600">
                                Opened: {new Date(log.openedAt).toLocaleString()}
                              </p>
                            )}
                            {log.downloadedAt && (
                              <p className="text-blue-600">
                                Downloaded: {new Date(log.downloadedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No delivery logs available yet.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Invoice Analytics
                </CardTitle>
                <CardDescription>
                  Financial insights and invoice performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Clock className="h-6 w-6 animate-spin mr-2" />
                    Loading analytics...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">Total Invoices</span>
                      </div>
                      <div className="text-2xl font-bold">{analytics?.totalInvoices || 0}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        All time
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">Total Amount</span>
                      </div>
                      <div className="text-2xl font-bold">
                        ${analytics?.totalAmount || "0.00"}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        All invoices
                      </p>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold">Pending Amount</span>
                      </div>
                      <div className="text-2xl font-bold">
                        ${analytics?.pendingAmount || "0.00"}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Unpaid invoices
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Invoice Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice #{selectedInvoice?.invoiceNumber}</DialogTitle>
              <DialogDescription>
                Invoice details and line items
              </DialogDescription>
            </DialogHeader>
            
            {selectedInvoice && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">From:</h4>
                    <p>{selectedInvoice.fromName}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.fromRole}</p>
                    {selectedInvoice.fromAddress && (
                      <p className="text-sm text-gray-500">{selectedInvoice.fromAddress}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">To:</h4>
                    <p>{selectedInvoice.toName}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.toRole}</p>
                    {selectedInvoice.toAddress && (
                      <p className="text-sm text-gray-500">{selectedInvoice.toAddress}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Description:</h4>
                  <p>{selectedInvoice.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Status & Dates:</h4>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(selectedInvoice.status)}
                    <span className="text-sm">
                      Due: {selectedInvoice.dueDate || "No due date"}
                    </span>
                    <span className="text-sm">
                      Created: {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Amount:</h4>
                  <div className="text-2xl font-bold">
                    {selectedInvoice.currency} {selectedInvoice.totalAmount}
                  </div>
                  <p className="text-sm text-gray-600">
                    Subtotal: {selectedInvoice.currency} {selectedInvoice.subtotal} | 
                    Tax: {selectedInvoice.currency} {selectedInvoice.taxAmount}
                  </p>
                </div>
                
                {selectedInvoice.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Notes:</h4>
                    <p className="text-sm text-gray-600">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}