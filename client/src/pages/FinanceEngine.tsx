import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Receipt,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Zap,
  Wrench,
  Calendar,
  CreditCard,
  Building,
  Users,
  Calculator
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Form schemas
const payoutRequestSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  requestNotes: z.string().optional(),
  transferMethod: z.string().min(1, "Transfer method is required"),
});

const chargeRequestSchema = z.object({
  ownerId: z.string().min(1, "Owner is required"),
  amount: z.string().min(1, "Amount is required"),
  reason: z.string().min(1, "Reason is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

const utilityAccountSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  utilityType: z.string().min(1, "Utility type is required"),
  providerName: z.string().min(1, "Provider is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  expectedBillDate: z.string().min(1, "Expected bill date is required"),
  averageMonthlyAmount: z.string().optional(),
});

const recurringServiceSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  serviceName: z.string().min(1, "Service name is required"),
  serviceCategory: z.string().min(1, "Category is required"),
  monthlyRate: z.string().min(1, "Monthly rate is required"),
  chargeAssignment: z.string().min(1, "Charge assignment is required"),
  startDate: z.string().min(1, "Start date is required"),
});

interface OwnerBalance {
  id: number;
  ownerId: string;
  ownerName: string;
  currentBalance: number;
  totalEarnings: number;
  totalExpenses: number;
  thisMonthEarnings: number;
  thisMonthExpenses: number;
  thisMonthNet: number;
  lastCalculated: string;
}

interface PayoutRequest {
  id: number;
  ownerId: string;
  ownerName: string;
  amount: number;
  currency: string;
  status: string;
  requestNotes?: string;
  adminNotes?: string;
  transferMethod?: string;
  transferReference?: string;
  transferReceiptUrl?: string;
  ownerConfirmed: boolean;
  requestedAt: string;
  approvedAt?: string;
  transferredAt?: string;
  completedAt?: string;
}

interface ChargeRequest {
  id: number;
  ownerId: string;
  ownerName: string;
  chargedBy: string;
  amount: number;
  currency: string;
  reason: string;
  description?: string;
  status: string;
  paymentMethod?: string;
  paymentReference?: string;
  chargedAt: string;
  paidAt?: string;
}

interface UtilityAccount {
  id: number;
  propertyId: number;
  propertyName: string;
  utilityType: string;
  providerName: string;
  accountNumber: string;
  expectedBillDate: number;
  averageMonthlyAmount?: number;
  autoRemindersEnabled: boolean;
  isActive: boolean;
}

interface RecurringService {
  id: number;
  propertyId: number;
  propertyName: string;
  serviceName: string;
  serviceCategory: string;
  monthlyRate: number;
  chargeAssignment: string;
  serviceFrequency: string;
  isActive: boolean;
  startDate: string;
  nextChargeDate?: string;
}

export default function FinanceEngine() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("owner-balances");
  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [chargeDialogOpen, setChargeDialogOpen] = useState(false);
  const [utilityDialogOpen, setUtilityDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  const canManageFinances = isAdmin || user?.role === 'portfolio-manager';

  // Form setup
  const payoutForm = useForm<z.infer<typeof payoutRequestSchema>>({
    resolver: zodResolver(payoutRequestSchema),
    defaultValues: {
      transferMethod: "bank",
    },
  });

  const chargeForm = useForm<z.infer<typeof chargeRequestSchema>>({
    resolver: zodResolver(chargeRequestSchema),
  });

  const utilityForm = useForm<z.infer<typeof utilityAccountSchema>>({
    resolver: zodResolver(utilityAccountSchema),
  });

  const serviceForm = useForm<z.infer<typeof recurringServiceSchema>>({
    resolver: zodResolver(recurringServiceSchema),
    defaultValues: {
      serviceCategory: "maintenance",
      chargeAssignment: "owner",
    },
  });

  // Fetch data
  const { data: ownerBalances = [], isLoading: balancesLoading } = useQuery<OwnerBalance[]>({
    queryKey: ["/api/finance/owner-balances"],
    enabled: canManageFinances || isOwner,
  });

  const { data: payoutRequests = [], isLoading: payoutsLoading } = useQuery<PayoutRequest[]>({
    queryKey: ["/api/finance/payout-requests"],
    enabled: canManageFinances || isOwner,
  });

  const { data: chargeRequests = [], isLoading: chargesLoading } = useQuery<ChargeRequest[]>({
    queryKey: ["/api/finance/charge-requests"],
    enabled: canManageFinances,
  });

  const { data: utilityAccounts = [], isLoading: utilitiesLoading } = useQuery<UtilityAccount[]>({
    queryKey: ["/api/finance/utility-accounts"],
    enabled: canManageFinances,
  });

  const { data: recurringServices = [], isLoading: servicesLoading } = useQuery<RecurringService[]>({
    queryKey: ["/api/finance/recurring-services"],
    enabled: canManageFinances,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties"],
    enabled: canManageFinances,
  });

  const { data: owners = [] } = useQuery({
    queryKey: ["/api/users", "owner"],
    enabled: canManageFinances,
  });

  // Mutations
  const requestPayoutMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/finance/request-payout", data),
    onSuccess: () => {
      toast({ title: "Payout Requested", description: "Your payout request has been submitted." });
      setPayoutDialogOpen(false);
      payoutForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/finance/payout-requests"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createChargeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/finance/create-charge", data),
    onSuccess: () => {
      toast({ title: "Charge Created", description: "Charge request has been created." });
      setChargeDialogOpen(false);
      chargeForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/finance/charge-requests"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createUtilityAccountMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/finance/utility-accounts", data),
    onSuccess: () => {
      toast({ title: "Utility Account Added", description: "Utility account has been configured." });
      setUtilityDialogOpen(false);
      utilityForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/finance/utility-accounts"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createRecurringServiceMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/finance/recurring-services", data),
    onSuccess: () => {
      toast({ title: "Service Added", description: "Recurring service has been configured." });
      setServiceDialogOpen(false);
      serviceForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/finance/recurring-services"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const approvePayoutMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: string }) => 
      apiRequest("POST", `/api/finance/payout-requests/${id}/approve`, { action }),
    onSuccess: () => {
      toast({ title: "Payout Updated", description: "Payout status has been updated." });
      queryClient.invalidateQueries({ queryKey: ["/api/finance/payout-requests"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Filter owner balances if user is owner
  const filteredBalances = isOwner 
    ? ownerBalances.filter(balance => balance.ownerId === user.id)
    : ownerBalances;

  const filteredPayouts = isOwner 
    ? payoutRequests.filter(payout => payout.ownerId === user.id)
    : payoutRequests;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'transferred': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance Engine</h1>
          <p className="text-gray-600">
            Complete financial management with owner balances, payouts, utility tracking, and recurring services
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="owner-balances" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Owner Balances
            </TabsTrigger>
            <TabsTrigger value="payout-requests" className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Payout Requests
            </TabsTrigger>
            <TabsTrigger value="charge-requests" className="flex items-center gap-2" disabled={!canManageFinances}>
              <ArrowDownCircle className="h-4 w-4" />
              Charge Requests
            </TabsTrigger>
            <TabsTrigger value="utility-tracking" className="flex items-center gap-2" disabled={!canManageFinances}>
              <Zap className="h-4 w-4" />
              Utility Tracking
            </TabsTrigger>
            <TabsTrigger value="recurring-services" className="flex items-center gap-2" disabled={!canManageFinances}>
              <Wrench className="h-4 w-4" />
              Recurring Services
            </TabsTrigger>
          </TabsList>

          {/* Owner Balances Tab */}
          <TabsContent value="owner-balances" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Owner Financial Balances</h2>
              {isOwner && (
                <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <ArrowUpCircle className="h-4 w-4" />
                      Request Payout
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Balance Payout</DialogTitle>
                    </DialogHeader>
                    <Form {...payoutForm}>
                      <form onSubmit={payoutForm.handleSubmit((data) => requestPayoutMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={payoutForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payout Amount (AUD)</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={payoutForm.control}
                          name="transferMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transfer Method</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select transfer method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="bank">Bank Transfer</SelectItem>
                                  <SelectItem value="paypal">PayPal</SelectItem>
                                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                                  <SelectItem value="cash">Cash Pickup</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={payoutForm.control}
                          name="requestNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any special instructions..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={requestPayoutMutation.isPending}>
                          {requestPayoutMutation.isPending ? "Submitting..." : "Submit Payout Request"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBalances.map((balance) => (
                <Card key={balance.id} className="relative">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {balance.ownerName}
                      <Badge variant={balance.currentBalance >= 0 ? "default" : "destructive"}>
                        ${Math.abs(balance.currentBalance).toLocaleString()}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Last updated: {format(new Date(balance.lastCalculated), "MMM dd, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-gray-600">This Month Earnings</p>
                          <p className="font-medium text-green-600">
                            ${balance.thisMonthEarnings.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="text-gray-600">This Month Expenses</p>
                          <p className="font-medium text-red-600">
                            ${balance.thisMonthExpenses.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Net This Month:</span>
                        <span className={`font-medium ${balance.thisMonthNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(balance.thisMonthNet).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span>Total Earnings: </span>
                        <span className="font-medium">${balance.totalEarnings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Total Expenses: </span>
                        <span className="font-medium">${balance.totalExpenses.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payout Requests Tab */}
          <TabsContent value="payout-requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Payout Requests</h2>
            </div>

            <div className="space-y-4">
              {filteredPayouts.map((payout) => (
                <Card key={payout.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">${payout.amount.toLocaleString()} AUD</CardTitle>
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Requested by {payout.ownerName} on {format(new Date(payout.requestedAt), "MMM dd, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Transfer Method</p>
                        <p className="font-medium">{payout.transferMethod || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reference</p>
                        <p className="font-medium">{payout.transferReference || 'Pending'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Owner Confirmed</p>
                        <p className="font-medium flex items-center gap-1">
                          {payout.ownerConfirmed ? (
                            <><CheckCircle className="h-4 w-4 text-green-600" /> Yes</>
                          ) : (
                            <><Clock className="h-4 w-4 text-yellow-600" /> Pending</>
                          )}
                        </p>
                      </div>
                    </div>

                    {payout.requestNotes && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Request Notes:</p>
                        <p className="text-sm bg-gray-50 p-2 rounded">{payout.requestNotes}</p>
                      </div>
                    )}

                    {canManageFinances && payout.status === 'pending' && (
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approvePayoutMutation.mutate({ id: payout.id, action: 'approve' })}
                          disabled={approvePayoutMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approvePayoutMutation.mutate({ id: payout.id, action: 'reject' })}
                          disabled={approvePayoutMutation.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Charge Requests Tab */}
          <TabsContent value="charge-requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Owner Charge Requests</h2>
              <Dialog open={chargeDialogOpen} onOpenChange={setChargeDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4" />
                    Create Charge
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Owner Charge</DialogTitle>
                  </DialogHeader>
                  <Form {...chargeForm}>
                    <form onSubmit={chargeForm.handleSubmit((data) => createChargeMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={chargeForm.control}
                        name="ownerId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Owner</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select owner" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {owners.map((owner: any) => (
                                  <SelectItem key={owner.id} value={owner.id}>
                                    {owner.firstName} {owner.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={chargeForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (AUD)</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={chargeForm.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Property maintenance, utility bills..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={chargeForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Additional details..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={createChargeMutation.isPending}>
                        {createChargeMutation.isPending ? "Creating..." : "Create Charge"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {chargeRequests.map((charge) => (
                <Card key={charge.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">${charge.amount.toLocaleString()} AUD</CardTitle>
                      <Badge className={getStatusColor(charge.status)}>
                        {charge.status.charAt(0).toUpperCase() + charge.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Charged to {charge.ownerName} on {format(new Date(charge.chargedAt), "MMM dd, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Reason:</p>
                        <p className="font-medium">{charge.reason}</p>
                      </div>
                      {charge.description && (
                        <div>
                          <p className="text-sm text-gray-600">Description:</p>
                          <p className="text-sm bg-gray-50 p-2 rounded">{charge.description}</p>
                        </div>
                      )}
                      {charge.paymentMethod && (
                        <div>
                          <p className="text-sm text-gray-600">Payment Method:</p>
                          <p className="font-medium">{charge.paymentMethod}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Utility Tracking Tab */}
          <TabsContent value="utility-tracking" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Utility Account Tracking</h2>
              <Dialog open={utilityDialogOpen} onOpenChange={setUtilityDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Add Utility Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Utility Account</DialogTitle>
                  </DialogHeader>
                  <Form {...utilityForm}>
                    <form onSubmit={utilityForm.handleSubmit((data) => createUtilityAccountMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={utilityForm.control}
                        name="propertyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {properties.map((property: any) => (
                                  <SelectItem key={property.id} value={property.id.toString()}>
                                    {property.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={utilityForm.control}
                        name="utilityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Utility Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select utility type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="electricity">Electricity</SelectItem>
                                <SelectItem value="water">Water</SelectItem>
                                <SelectItem value="internet">Internet</SelectItem>
                                <SelectItem value="gas">Gas</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={utilityForm.control}
                        name="providerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provider</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PEA">PEA (Provincial Electricity Authority)</SelectItem>
                                <SelectItem value="3BB">3BB</SelectItem>
                                <SelectItem value="CAT">CAT Telecom</SelectItem>
                                <SelectItem value="AIS">AIS</SelectItem>
                                <SelectItem value="True">True Corporation</SelectItem>
                                <SelectItem value="NT">NT (National Telecom)</SelectItem>
                                <SelectItem value="Deepwell">Deepwell</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={utilityForm.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter account number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={utilityForm.control}
                        name="expectedBillDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Bill Date (Day of Month)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                  <SelectItem key={day} value={day.toString()}>
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={utilityForm.control}
                        name="averageMonthlyAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Average Monthly Amount (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={createUtilityAccountMutation.isPending}>
                        {createUtilityAccountMutation.isPending ? "Adding..." : "Add Utility Account"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {utilityAccounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {account.utilityType.charAt(0).toUpperCase() + account.utilityType.slice(1)}
                      <Badge variant={account.isActive ? "default" : "secondary"}>
                        {account.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{account.propertyName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <p className="text-gray-600">Provider:</p>
                      <p className="font-medium">{account.providerName}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Account Number:</p>
                      <p className="font-medium">{account.accountNumber}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Expected Bill Date:</p>
                      <p className="font-medium">{account.expectedBillDate}{account.expectedBillDate === 1 ? 'st' : account.expectedBillDate === 2 ? 'nd' : account.expectedBillDate === 3 ? 'rd' : 'th'} of each month</p>
                    </div>
                    {account.averageMonthlyAmount && (
                      <div className="text-sm">
                        <p className="text-gray-600">Avg. Monthly:</p>
                        <p className="font-medium">₿{account.averageMonthlyAmount.toLocaleString()}</p>
                      </div>
                    )}
                    <div className="pt-2">
                      <Badge variant={account.autoRemindersEnabled ? "default" : "secondary"} className="text-xs">
                        {account.autoRemindersEnabled ? "Auto Reminders On" : "Auto Reminders Off"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recurring Services Tab */}
          <TabsContent value="recurring-services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Recurring Service Charges</h2>
              <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Add Recurring Service
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Recurring Service</DialogTitle>
                  </DialogHeader>
                  <Form {...serviceForm}>
                    <form onSubmit={serviceForm.handleSubmit((data) => createRecurringServiceMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={serviceForm.control}
                        name="propertyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {properties.map((property: any) => (
                                  <SelectItem key={property.id} value={property.id.toString()}>
                                    {property.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceForm.control}
                        name="serviceName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Pool Cleaning, Garden Maintenance..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceForm.control}
                        name="serviceCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="cleaning">Cleaning</SelectItem>
                                <SelectItem value="security">Security</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                                <SelectItem value="landscaping">Landscaping</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceForm.control}
                        name="monthlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Rate (THB)</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceForm.control}
                        name="chargeAssignment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Charge Assignment</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Who pays for this service?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="owner">Owner Pays</SelectItem>
                                <SelectItem value="company">Company Pays</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={createRecurringServiceMutation.isPending}>
                        {createRecurringServiceMutation.isPending ? "Adding..." : "Add Recurring Service"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recurringServices.map((service) => (
                <Card key={service.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {service.serviceName}
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{service.propertyName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <p className="text-gray-600">Category:</p>
                      <p className="font-medium">{service.serviceCategory.charAt(0).toUpperCase() + service.serviceCategory.slice(1)}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Monthly Rate:</p>
                      <p className="font-medium">₿{service.monthlyRate.toLocaleString()}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Charged To:</p>
                      <p className="font-medium">{service.chargeAssignment.charAt(0).toUpperCase() + service.chargeAssignment.slice(1)}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Frequency:</p>
                      <p className="font-medium">{service.serviceFrequency.charAt(0).toUpperCase() + service.serviceFrequency.slice(1)}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Start Date:</p>
                      <p className="font-medium">{format(new Date(service.startDate), "MMM dd, yyyy")}</p>
                    </div>
                    {service.nextChargeDate && (
                      <div className="text-sm">
                        <p className="text-gray-600">Next Charge:</p>
                        <p className="font-medium">{format(new Date(service.nextChargeDate), "MMM dd, yyyy")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}