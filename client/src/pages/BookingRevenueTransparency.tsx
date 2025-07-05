import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Download,
  Edit,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Eye,
  Filter,
  Calendar,
  Building,
  Users,
  CreditCard,
  Percent,
  CheckCircle,
  XCircle,
  Search,
  Info,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Form schema for manual revenue override
const revenueOverrideSchema = z.object({
  guestTotalPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be a valid positive number",
  }),
  otaCommissionPercentage: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Must be between 0 and 100",
  }),
  stripeFees: z.string().optional(),
  overrideReason: z.string().min(10, "Please explain why manual entry is needed"),
});

type RevenueOverrideForm = z.infer<typeof revenueOverrideSchema>;

interface BookingRevenueData {
  id: number;
  bookingReference: string;
  hostawayId?: string;
  guestName: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  bookingPlatform: string;
  status: string;
  guestTotalPrice?: number;
  otaCommissionAmount?: number;
  otaCommissionPercentage?: number;
  platformPayout?: number;
  stripeFees?: number;
  netHostPayout?: number;
  manualOverride: boolean;
  overrideReason?: string;
  revenueVerified: boolean;
  currency: string;
  createdAt: string;
}

interface RevenueAnalytics {
  totalBookings: number;
  totalGuestPayments: number;
  totalOtaCommissions: number;
  totalNetPayouts: number;
  averageOtaCommission: number;
  platformBreakdown: {
    platform: string;
    bookings: number;
    guestTotal: number;
    netPayout: number;
    commissionRate: number;
  }[];
  monthlyTrend: {
    month: string;
    bookings: number;
    netRevenue: number;
  }[];
}

export default function BookingRevenueTransparency() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBooking, setEditingBooking] = useState<BookingRevenueData | null>(null);

  // Fetch booking revenue data
  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["/api/revenue/bookings", selectedPlatform, selectedStatus, dateRange, searchTerm],
  });

  // Fetch analytics data
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["/api/revenue/analytics", selectedPlatform, dateRange],
  });

  // Update booking revenue mutation
  const updateRevenueMutation = useMutation({
    mutationFn: async (data: { bookingId: number } & RevenueOverrideForm) => {
      await apiRequest("POST", `/api/revenue/bookings/${data.bookingId}/override`, data);
    },
    onSuccess: () => {
      toast({
        title: "Revenue Updated",
        description: "Booking revenue has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/revenue/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/revenue/analytics"] });
      setEditingBooking(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update revenue",
        variant: "destructive",
      });
    },
  });

  // Export CSV mutation
  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/revenue/export", {}, {
        platform: selectedPlatform,
        status: selectedStatus,
        dateRange,
        search: searchTerm,
      });
      return response;
    },
    onSuccess: (data: any) => {
      // Create and download CSV file
      const blob = new Blob([data.csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `booking-revenue-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Revenue data has been exported to CSV.",
      });
    },
  });

  // Form for revenue override
  const form = useForm<RevenueOverrideForm>({
    resolver: zodResolver(revenueOverrideSchema),
    defaultValues: {
      guestTotalPrice: "",
      otaCommissionPercentage: "",
      stripeFees: "",
      overrideReason: "",
    },
  });

  // Filter bookings based on selected filters
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking: BookingRevenueData) => {
      const matchesPlatform = selectedPlatform === "all" || booking.bookingPlatform === selectedPlatform;
      const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus;
      const matchesSearch = !searchTerm || 
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.hostawayId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesPlatform && matchesStatus && matchesSearch;
    });
  }, [bookings, selectedPlatform, selectedStatus, searchTerm]);

  const handleRevenueOverride = (data: RevenueOverrideForm) => {
    if (!editingBooking) return;
    
    updateRevenueMutation.mutate({
      bookingId: editingBooking.id,
      ...data,
    });
  };

  const formatCurrency = (amount: number | undefined, currency: string = "AUD") => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const getPlatformBadge = (platform: string) => {
    const variants: Record<string, string> = {
      airbnb: "bg-red-100 text-red-800",
      vrbo: "bg-blue-100 text-blue-800",
      booking_com: "bg-purple-100 text-purple-800",
      direct: "bg-green-100 text-green-800",
    };
    
    return (
      <Badge className={variants[platform] || "bg-gray-100 text-gray-800"}>
        {platform.replace("_", ".").toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      confirmed: "bg-blue-100 text-blue-800",
      "checked-in": "bg-yellow-100 text-yellow-800",
      "checked-out": "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    
    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Revenue Calculation Notice:</strong> All internal calculations (fees, commissions, splits) are based on <strong>net received payout</strong> only. 
          OTA commissions are not part of your earnings and are shown for transparency only.
        </AlertDescription>
      </Alert>

      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Booking Revenue Transparency</h1>
          <p className="text-gray-600 mt-1">
            Complete breakdown of guest payments vs actual payouts received
          </p>
        </div>
        <Button 
          onClick={() => exportMutation.mutate()}
          disabled={exportMutation.isPending}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Booking Details
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Platform Analytics
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Revenue Verification
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground">All platforms</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guest Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics?.totalGuestPayments)}
                </div>
                <p className="text-xs text-muted-foreground">Total paid by guests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">OTA Commissions</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  -{formatCurrency(analytics?.totalOtaCommissions)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg {analytics?.averageOtaCommission?.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Payouts</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(analytics?.totalNetPayouts)}
                </div>
                <p className="text-xs text-muted-foreground">Actual revenue received</p>
              </CardContent>
            </Card>
          </div>

          {/* Platform Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Revenue Breakdown</CardTitle>
              <CardDescription>
                Compare gross guest payments vs net payouts by platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Bookings</TableHead>
                    <TableHead className="text-right">Guest Total</TableHead>
                    <TableHead className="text-right">Commission Rate</TableHead>
                    <TableHead className="text-right">Net Payout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.platformBreakdown?.map((platform) => (
                    <TableRow key={platform.platform}>
                      <TableCell>{getPlatformBadge(platform.platform)}</TableCell>
                      <TableCell className="text-right">{platform.bookings}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(platform.guestTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {platform.commissionRate?.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(platform.netPayout)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Details Tab */}
        <TabsContent value="bookings" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Guest name, booking ref..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="vrbo">VRBO</SelectItem>
                      <SelectItem value="booking_com">Booking.com</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="checked-in">Checked In</SelectItem>
                      <SelectItem value="checked-out">Checked Out</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="this_month">This Month</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="this_quarter">This Quarter</SelectItem>
                      <SelectItem value="this_year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown by Booking</CardTitle>
              <CardDescription>
                Detailed view of guest payments, OTA commissions, and net payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest / Booking</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Guest Paid</TableHead>
                    <TableHead className="text-right">OTA Commission</TableHead>
                    <TableHead className="text-right">Net Payout</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingBookings ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading bookings...
                      </TableCell>
                    </TableRow>
                  ) : filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No bookings found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking: BookingRevenueData) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.guestName}</div>
                            <div className="text-sm text-gray-500">
                              {booking.bookingReference}
                              {booking.hostawayId && (
                                <span className="ml-2 text-xs bg-gray-100 px-1 rounded">
                                  {booking.hostawayId}
                                </span>
                              )}
                            </div>
                            {booking.manualOverride && (
                              <div className="flex items-center gap-1 mt-1">
                                <Edit className="h-3 w-3 text-orange-500" />
                                <span className="text-xs text-orange-600">Manual Override</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getPlatformBadge(booking.bookingPlatform)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(new Date(booking.checkIn), "MMM dd")}</div>
                            <div className="text-gray-500">
                              {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm">
                            {formatCurrency(booking.guestTotalPrice, booking.currency)}
                            {!booking.guestTotalPrice && (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm text-red-600">
                            -{formatCurrency(booking.otaCommissionAmount, booking.currency)}
                            {booking.otaCommissionPercentage && (
                              <div className="text-xs text-gray-500">
                                ({booking.otaCommissionPercentage}%)
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <div className="text-sm text-green-600">
                            {formatCurrency(booking.netHostPayout || booking.platformPayout, booking.currency)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            {booking.revenueVerified ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            {(user?.role === "admin" || user?.role === "portfolio-manager") && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingBooking(booking);
                                      form.reset({
                                        guestTotalPrice: booking.guestTotalPrice?.toString() || "",
                                        otaCommissionPercentage: booking.otaCommissionPercentage?.toString() || "",
                                        stripeFees: booking.stripeFees?.toString() || "",
                                        overrideReason: booking.overrideReason || "",
                                      });
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Update Revenue Data</DialogTitle>
                                    <DialogDescription>
                                      Manually enter revenue information for {booking.guestName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleRevenueOverride)} className="space-y-4">
                                      <FormField
                                        control={form.control}
                                        name="guestTotalPrice"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Guest Total Price ({booking.currency})</FormLabel>
                                            <FormControl>
                                              <Input placeholder="1000.00" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                              Total amount guest paid to the platform
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control}
                                        name="otaCommissionPercentage"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>OTA Commission Rate (%)</FormLabel>
                                            <FormControl>
                                              <Input placeholder="15.0" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                              Commission percentage charged by the platform
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control}
                                        name="stripeFees"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Payment Processing Fees (Optional)</FormLabel>
                                            <FormControl>
                                              <Input placeholder="25.00" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                              Stripe or other payment processing fees
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control}
                                        name="overrideReason"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Reason for Manual Entry</FormLabel>
                                            <FormControl>
                                              <Textarea 
                                                placeholder="Explain why manual entry is needed..."
                                                {...field} 
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <DialogFooter>
                                        <Button
                                          type="submit"
                                          disabled={updateRevenueMutation.isPending}
                                        >
                                          Update Revenue
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  </Form>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Net payout trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAnalytics ? (
                  <div className="h-64 flex items-center justify-center">
                    Loading analytics...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics?.monthlyTrend?.map((month) => (
                      <div key={month.month} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{month.month}</div>
                          <div className="text-sm text-gray-500">{month.bookings} bookings</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(month.netRevenue)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Insights</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                    <Info className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Commission Impact</div>
                      <div className="text-sm text-blue-700">
                        OTA commissions reduce gross revenue by{" "}
                        {analytics?.averageOtaCommission?.toFixed(1)}% on average
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Net Revenue</div>
                      <div className="text-sm text-green-700">
                        {formatCurrency(analytics?.totalNetPayouts)} received from{" "}
                        {formatCurrency(analytics?.totalGuestPayments)} guest payments
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-orange-900">Remember</div>
                      <div className="text-sm text-orange-700">
                        All internal calculations use net payout amounts only
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Verification Status</CardTitle>
              <CardDescription>
                Track which bookings have been verified against bank statements or payment processors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {bookings.filter((b: BookingRevenueData) => b.revenueVerified).length}
                    </div>
                    <div className="text-sm text-gray-600">Verified</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-orange-600">
                      {bookings.filter((b: BookingRevenueData) => !b.revenueVerified).length}
                    </div>
                    <div className="text-sm text-gray-600">Pending Verification</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {bookings.filter((b: BookingRevenueData) => b.manualOverride).length}
                    </div>
                    <div className="text-sm text-gray-600">Manual Override</div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Revenue verification helps ensure accuracy of financial reports. 
                    Mark bookings as verified after confirming against bank statements or payment processor data.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}