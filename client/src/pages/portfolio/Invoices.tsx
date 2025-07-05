import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Download, 
  Search, 
  Calendar,
  Building,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Flag,
  Eye,
  Filter
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Invoice {
  id: number;
  invoiceNumber: string;
  propertyName: string;
  billingPeriod: string;
  issuedDate: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "cancelled";
  totalRentCollected: number;
  ownerPayout: number;
  companyCommission: number;
  servicesSold: number;
  totalAmount: number;
  currency: string;
  description: string;
  downloadUrl: string;
  canRequestEdit: boolean;
}

export default function Invoices() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editRequestDialogOpen, setEditRequestDialogOpen] = useState(false);

  // Mock invoice data for assigned properties
  const mockInvoices: Invoice[] = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      propertyName: "Villa Aruna",
      billingPeriod: "January 2024",
      issuedDate: "2024-02-01",
      dueDate: "2024-02-15",
      status: "paid",
      totalRentCollected: 45000,
      ownerPayout: 31500,
      companyCommission: 13500,
      servicesSold: 3200,
      totalAmount: 48200,
      currency: "THB",
      description: "Monthly revenue summary for Villa Aruna - January 2024",
      downloadUrl: "#",
      canRequestEdit: false
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      propertyName: "Villa Samui Breeze",
      billingPeriod: "January 2024",
      issuedDate: "2024-02-01",
      dueDate: "2024-02-15",
      status: "pending",
      totalRentCollected: 38000,
      ownerPayout: 26600,
      companyCommission: 11400,
      servicesSold: 1800,
      totalAmount: 39800,
      currency: "THB",
      description: "Monthly revenue summary for Villa Samui Breeze - January 2024",
      downloadUrl: "#",
      canRequestEdit: true
    },
    {
      id: 3,
      invoiceNumber: "INV-2023-012",
      propertyName: "Villa Aruna",
      billingPeriod: "December 2023",
      issuedDate: "2024-01-01",
      dueDate: "2024-01-15",
      status: "paid",
      totalRentCollected: 52000,
      ownerPayout: 36400,
      companyCommission: 15600,
      servicesSold: 4100,
      totalAmount: 56100,
      currency: "THB",
      description: "Monthly revenue summary for Villa Aruna - December 2023",
      downloadUrl: "#",
      canRequestEdit: false
    },
    {
      id: 4,
      invoiceNumber: "INV-2023-011",
      propertyName: "Villa Samui Breeze",
      billingPeriod: "December 2023",
      issuedDate: "2024-01-01",
      dueDate: "2024-01-15",
      status: "overdue",
      totalRentCollected: 42000,
      ownerPayout: 29400,
      companyCommission: 12600,
      servicesSold: 2200,
      totalAmount: 44200,
      currency: "THB",
      description: "Monthly revenue summary for Villa Samui Breeze - December 2023",
      downloadUrl: "#",
      canRequestEdit: true
    }
  ];

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio/invoices'],
    initialData: mockInvoices
  });

  const requestEditMutation = useMutation({
    mutationFn: async ({ invoiceId, reason }: { invoiceId: number; reason: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Edit request submitted",
        description: "Your request has been sent to the finance team for review.",
      });
      setEditRequestDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio/invoices'] });
    },
    onError: () => {
      toast({
        title: "Request failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const properties = ["Villa Aruna", "Villa Samui Breeze"];
  const statuses = ["paid", "pending", "overdue", "cancelled"];
  const periods = ["January 2024", "December 2023", "November 2023", "October 2023"];

  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = !filterProperty || invoice.propertyName === filterProperty;
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    const matchesPeriod = !filterPeriod || invoice.billingPeriod === filterPeriod;
    
    return matchesSearch && matchesProperty && matchesStatus && matchesPeriod;
  }) || [];

  const handleRequestEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setEditRequestDialogOpen(true);
  };

  const submitEditRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedInvoice) return;
    
    const formData = new FormData(event.currentTarget);
    const reason = formData.get('reason') as string;
    
    requestEditMutation.mutate({
      invoiceId: selectedInvoice.id,
      reason
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-black';
      case 'overdue': return 'bg-red-500 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'THB') {
      return `฿${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Calculate totals
  const totalRentCollected = filteredInvoices.reduce((sum, inv) => sum + inv.totalRentCollected, 0);
  const totalOwnerPayouts = filteredInvoices.reduce((sum, inv) => sum + inv.ownerPayout, 0);
  const totalCommissions = filteredInvoices.reduce((sum, inv) => sum + inv.companyCommission, 0);
  const totalServices = filteredInvoices.reduce((sum, inv) => sum + inv.servicesSold, 0);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading invoices. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/pm/dashboard">Portfolio Manager</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Invoices</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Invoice Management</h1>
        <p className="text-muted-foreground">
          View and manage invoices for your assigned properties
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">฿{totalRentCollected.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Rent Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">฿{totalOwnerPayouts.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Owner Payouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">฿{totalCommissions.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Commission</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">฿{totalServices.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Services Sold</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterProperty} onValueChange={setFilterProperty}>
          <SelectTrigger>
            <SelectValue placeholder="All properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All properties</SelectItem>
            {properties.map(property => (
              <SelectItem key={property} value={property}>{property}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger>
            <SelectValue placeholder="All periods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All periods</SelectItem>
            {periods.map(period => (
              <SelectItem key={period} value={period}>{period}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={() => {
          setSearchTerm("");
          setFilterProperty("");
          setFilterStatus("");
          setFilterPeriod("");
        }}>
          Clear Filters
        </Button>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
              <p className="text-muted-foreground">
                {invoices?.length === 0 
                  ? "No invoices have been generated yet." 
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="border-l-4" style={{
              borderLeftColor: invoice.status === 'paid' ? '#22c55e' : 
                              invoice.status === 'pending' ? '#eab308' :
                              invoice.status === 'overdue' ? '#ef4444' : '#6b7280'
            }}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {invoice.invoiceNumber}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {invoice.propertyName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {invoice.billingPeriod}
                      </span>
                      <span>Due: {invoice.dueDate}</span>
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </Badge>
                    <Badge variant="outline">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{invoice.description}</p>
                
                {/* Financial Breakdown */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Rent Collected</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(invoice.totalRentCollected, invoice.currency)}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Owner Payout</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(invoice.ownerPayout, invoice.currency)}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Commission</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      {formatCurrency(invoice.companyCommission, invoice.currency)}
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Services</p>
                    <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                      {formatCurrency(invoice.servicesSold, invoice.currency)}
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-muted-foreground">
                    Issued: {invoice.issuedDate}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    
                    {invoice.canRequestEdit && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRequestEdit(invoice)}
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Request Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Request Edit Dialog */}
      <Dialog open={editRequestDialogOpen} onOpenChange={setEditRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Invoice Edit</DialogTitle>
            <DialogDescription>
              Request an edit for invoice: {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={submitEditRequest} className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for Edit Request</Label>
              <Textarea 
                name="reason" 
                placeholder="Please describe what needs to be changed and why..."
                required
                rows={4}
              />
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Edit requests will be reviewed by the finance team. You will be notified once the request is processed.
              </p>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditRequestDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={requestEditMutation.isPending}>
                {requestEditMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}