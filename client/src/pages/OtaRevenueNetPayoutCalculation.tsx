import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  DollarSign, 
  AlertCircle, 
  Calculator, 
  Info, 
  TrendingUp, 
  PieChart,
  Building,
  Calendar,
  Users,
  CreditCard,
  Eye,
  EyeOff,
  Percent,
  FileText,
  CheckCircle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest } from "@/lib/queryClient";

// Schema for OTA booking revenue form
const otaBookingSchema = z.object({
  reservationCode: z.string().min(1, "Reservation code is required"),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email().optional(),
  propertyId: z.number().min(1, "Property selection is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  otaName: z.string().min(1, "OTA platform is required"),
  guestBookingPrice: z.string().min(1, "Guest booking price is required"),
  otaPlatformFee: z.string().min(1, "OTA platform fee is required"),
  notes: z.string().optional(),
});

interface OtaBookingRevenue {
  id: number;
  propertyId: number;
  propertyName: string;
  reservationCode: string;
  guestName: string;
  guestEmail?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  otaName: string;
  bookingType: string;
  guestBookingPrice: string;
  otaPlatformFee: string;
  finalPayoutAmount: string;
  currency: string;
  paymentStatus: string;
  isVerified: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OtaRevenueAnalytics {
  totalBookings: number;
  totalGuestPayments: number;
  totalOtaCommissions: number;
  totalNetPayouts: number;
  averageOtaCommissionRate: number;
  platformBreakdown: Array<{
    platform: string;
    bookingCount: number;
    totalGuestPayments: number;
    totalNetPayouts: number;
    averageCommissionRate: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    guestPayments: number;
    netPayouts: number;
    otaCommissions: number;
  }>;
}

interface DualOtaPricingProps {
  guestTotal: number;
  platformPayout: number;
  otaCommission: number;
  currency: string;
  size?: "default" | "compact";
  showTooltip?: boolean;
}

// Component to display dual OTA pricing with transparency
function DualOtaPricing({ guestTotal, platformPayout, otaCommission, currency, size = "default", showTooltip = true }: DualOtaPricingProps) {
  const commissionRate = guestTotal > 0 ? ((otaCommission / guestTotal) * 100) : 0;
  
  const content = size === "compact" ? (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold text-green-600">
        {currency} {platformPayout.toLocaleString()}
      </span>
      <Badge variant="outline" className="text-xs">
        Net Payout
      </Badge>
    </div>
  ) : (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Guest Total Payment:</span>
        <span className="font-medium">{currency} {guestTotal.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between text-red-600">
        <span className="text-sm">OTA Commission ({commissionRate.toFixed(1)}%):</span>
        <span className="font-medium">-{currency} {otaCommission.toLocaleString()}</span>
      </div>
      <div className="border-t pt-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-green-600">Net Payout Received:</span>
          <span className="text-lg font-bold text-green-600">{currency} {platformPayout.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  if (!showTooltip) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            <p className="font-semibold">OTA Commission Breakdown</p>
            <p className="text-sm">Guest paid {currency} {guestTotal.toLocaleString()} total to the OTA platform.</p>
            <p className="text-sm">After {commissionRate.toFixed(1)}% commission ({currency} {otaCommission.toLocaleString()}), you receive {currency} {platformPayout.toLocaleString()}.</p>
            <p className="text-xs text-yellow-600 mt-2">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              All internal calculations use the net payout amount only.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function OtaRevenueNetPayoutCalculation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  const [selectedOtaPlatform, setSelectedOtaPlatform] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30");
  const [showGuestTotals, setShowGuestTotals] = useState(false);
  
  const form = useForm<z.infer<typeof otaBookingSchema>>({
    resolver: zodResolver(otaBookingSchema),
    defaultValues: {
      reservationCode: "",
      guestName: "",
      guestEmail: "",
      propertyId: 0,
      checkInDate: "",
      checkOutDate: "",
      otaName: "",
      guestBookingPrice: "",
      otaPlatformFee: "",
      notes: "",
    },
  });

  // Queries
  const { data: bookingRevenues, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/booking-revenue", { propertyId: selectedPropertyId, otaName: selectedOtaPlatform }],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/booking-revenue/analytics", { dateRange, propertyId: selectedPropertyId }],
  });

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  // Mutations
  const createBookingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof otaBookingSchema>) => {
      // Calculate final payout amount
      const guestTotal = parseFloat(data.guestBookingPrice);
      const otaFee = parseFloat(data.otaPlatformFee);
      const finalPayout = guestTotal - otaFee;
      
      return apiRequest("POST", "/api/booking-revenue", {
        ...data,
        finalPayoutAmount: finalPayout.toString(),
        bookingType: "OTA",
        numberOfNights: 1, // Calculate from dates
        numberOfGuests: 2, // Default, can be enhanced
        currency: "THB",
        paymentStatus: "completed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/booking-revenue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/booking-revenue/analytics"] });
      form.reset();
    },
  });

  const verifyBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      return apiRequest("POST", `/api/booking-revenue/${bookingId}/verify`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/booking-revenue"] });
    },
  });

  const onSubmit = (data: z.infer<typeof otaBookingSchema>) => {
    createBookingMutation.mutate(data);
  };

  const calculateNetPayout = (guestTotal: string, otaFee: string): number => {
    const total = parseFloat(guestTotal) || 0;
    const fee = parseFloat(otaFee) || 0;
    return Math.max(0, total - fee);
  };

  const otaPlatforms = [
    "Airbnb", "Booking.com", "VRBO", "Expedia", "Agoda", "Hotels.com", "Direct"
  ];

  // Role-based visibility control
  const canViewGuestTotals = user?.role === 'admin' || user?.role === 'portfolio-manager';
  const canViewFullBreakdown = user?.role === 'admin' || user?.role === 'portfolio-manager';

  return (
    <div className="space-y-6">
      {/* Header with Warning Banner */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">OTA Revenue & Net Payout Calculation</h1>
            <p className="text-muted-foreground">
              Transparent tracking of OTA commissions and actual payouts received
            </p>
          </div>
          {canViewGuestTotals && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGuestTotals(!showGuestTotals)}
              className="flex items-center gap-2"
            >
              {showGuestTotals ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showGuestTotals ? "Hide" : "Show"} Guest Totals
            </Button>
          )}
        </div>

        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Important:</strong> All internal calculations (management fees, commissions, owner payouts, profit/loss) 
            are based on net received payout amounts only. OTA commissions are not part of your earnings.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Booking Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="add-booking">Add Booking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
            
            {canViewGuestTotals && showGuestTotals && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Guest Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    THB {analytics?.totalGuestPayments?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total paid by guests
                  </p>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Payouts</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  THB {analytics?.totalNetPayouts?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Actual received amount
                </p>
              </CardContent>
            </Card>
            
            {canViewGuestTotals && showGuestTotals && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">OTA Commissions</CardTitle>
                  <Percent className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    THB {analytics?.totalOtaCommissions?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Avg {analytics?.averageOtaCommissionRate?.toFixed(1) || 0}% commission
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Revenue Transparency Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Revenue Calculation Transparency
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800">
              <div className="space-y-2">
                <p>• <strong>Guest Total:</strong> Amount paid by guest to OTA platform</p>
                <p>• <strong>OTA Commission:</strong> Platform fee deducted by OTA (varies by platform)</p>
                <p>• <strong>Net Payout:</strong> Actual amount received in your account</p>
                <p>• <strong>Internal Calculations:</strong> All fees, commissions, and profit/loss use Net Payout only</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Property</Label>
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties?.map((property: any) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>OTA Platform</Label>
              <Select value={selectedOtaPlatform} onValueChange={setSelectedOtaPlatform}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {otaPlatforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Booking Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Records</CardTitle>
              <CardDescription>
                OTA booking revenue with transparent commission breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reservation</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Platform</TableHead>
                    {(canViewGuestTotals && showGuestTotals) && <TableHead>Guest Total</TableHead>}
                    <TableHead>Net Payout</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingRevenues?.map((booking: OtaBookingRevenue) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.reservationCode}</TableCell>
                      <TableCell>{booking.propertyName}</TableCell>
                      <TableCell>{booking.guestName}</TableCell>
                      <TableCell className="text-sm">
                        {booking.checkInDate} to {booking.checkOutDate}
                        <br />
                        <span className="text-muted-foreground">{booking.numberOfNights} nights</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{booking.otaName}</Badge>
                      </TableCell>
                      {(canViewGuestTotals && showGuestTotals) && (
                        <TableCell>
                          <DualOtaPricing
                            guestTotal={parseFloat(booking.guestBookingPrice)}
                            platformPayout={parseFloat(booking.finalPayoutAmount)}
                            otaCommission={parseFloat(booking.otaPlatformFee)}
                            currency={booking.currency}
                            size="compact"
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="font-semibold text-green-600">
                          {booking.currency} {parseFloat(booking.finalPayoutAmount).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Net received</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                            {booking.paymentStatus}
                          </Badge>
                          {booking.isVerified && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {!booking.isVerified && canViewFullBreakdown && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyBookingMutation.mutate(booking.id)}
                            disabled={verifyBookingMutation.isPending}
                          >
                            Verify
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Platform Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.platformBreakdown?.map((platform) => (
                    <div key={platform.platform} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{platform.platform}</span>
                        <Badge variant="outline">{platform.bookingCount} bookings</Badge>
                      </div>
                      <div className="space-y-1">
                        {canViewGuestTotals && showGuestTotals && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Guest Payments:</span>
                            <span>THB {platform.totalGuestPayments.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Net Payouts:</span>
                          <span className="font-semibold text-green-600">
                            THB {platform.totalNetPayouts.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avg Commission:</span>
                          <span className="text-red-600">{platform.averageCommissionRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.monthlyTrends?.map((month) => (
                    <div key={month.month} className="space-y-2">
                      <div className="font-medium">{month.month}</div>
                      <div className="space-y-1">
                        {canViewGuestTotals && showGuestTotals && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Guest Payments:</span>
                            <span>THB {month.guestPayments.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Net Payouts:</span>
                          <span className="font-semibold text-green-600">
                            THB {month.netPayouts.toLocaleString()}
                          </span>
                        </div>
                        {canViewGuestTotals && showGuestTotals && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">OTA Commissions:</span>
                            <span className="text-red-600">THB {month.otaCommissions.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="add-booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add OTA Booking Revenue</CardTitle>
              <CardDescription>
                Record new OTA booking with transparent commission tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="reservationCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reservation Code</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guest Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property</FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property" />
                              </SelectTrigger>
                              <SelectContent>
                                {properties?.map((property: any) => (
                                  <SelectItem key={property.id} value={property.id.toString()}>
                                    {property.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="otaName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OTA Platform</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                {otaPlatforms.map((platform) => (
                                  <SelectItem key={platform} value={platform}>
                                    {platform}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-in Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-out Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Financial Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Financial Details</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="guestBookingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guest Total Payment (THB)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="12000.00" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="otaPlatformFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>OTA Commission (THB)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="1800.00" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Net Payout Preview */}
                    {form.watch("guestBookingPrice") && form.watch("otaPlatformFee") && (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                          <DualOtaPricing
                            guestTotal={parseFloat(form.watch("guestBookingPrice")) || 0}
                            platformPayout={calculateNetPayout(
                              form.watch("guestBookingPrice"),
                              form.watch("otaPlatformFee")
                            )}
                            otaCommission={parseFloat(form.watch("otaPlatformFee")) || 0}
                            currency="THB"
                            showTooltip={false}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about this booking..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={createBookingMutation.isPending}
                    className="w-full"
                  >
                    {createBookingMutation.isPending ? "Adding Booking..." : "Add Booking Revenue"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}