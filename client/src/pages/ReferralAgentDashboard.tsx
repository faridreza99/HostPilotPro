import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { 
  Home, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Bell, 
  Download, 
  Eye,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Percent,
  BarChart3,
  MessageCircle,
  Building,
  CreditCard,
  Receipt,
  CalendarDays,
  Activity,
  Target,
  Award,
  Briefcase,
  Settings,
  RefreshCw,
  Plus,
  Edit,
  Trash,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Camera,
  FileText,
  Link,
  Share,
  Copy,
  Smartphone,
  Globe,
  MessageSquare,
  UserPlus,
  Calendar,
  Banknote,
  PieChart,
  LineChart,
  Timer,
  Zap,
  Heart,
  Shield,
  Sparkles,
  Lightbulb,
  Coffee
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

// Types for referral agent dashboard
interface AssignedVilla {
  id: number;
  propertyId: number;
  propertyName: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  referralDate: string;
  portfolioManagerId: string;
  portfolioManagerName: string;
  monthlyPerformance: {
    occupancyRate: number;
    averageReviewScore: number;
    totalRevenue: number;
    managementRevenue: number;
    commissionAmount: number;
    bookingCount: number;
  };
  yearlyPerformance: {
    occupancyRate: number;
    averageReviewScore: number;
    totalRevenue: number;
    managementRevenue: number;
    commissionAmount: number;
    bookingCount: number;
  };
  images: string[];
  amenities: string[];
  marketingMaterials: {
    unbrandedPhotos: string[];
    factSheetUrl: string;
    affiliateUrl: string;
    virtualTourUrl?: string;
  };
}

interface CommissionLog {
  id: number;
  commissionPeriod: string;
  commissionYear: number;
  commissionMonth: number;
  propertyId: number;
  propertyName: string;
  managementRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  occupancyRate: number;
  averageReviewScore: number;
  monthlyBookings: number;
  paymentStatus: string;
  paymentRequestedAt?: string;
  paymentConfirmedAt?: string;
  paymentSlipUrl?: string;
}

interface NotificationItem {
  id: number;
  type: 'new_review' | 'new_booking' | 'commission_paid' | 'performance_improvement';
  title: string;
  message: string;
  propertyName: string;
  timestamp: string;
  read: boolean;
  metadata?: {
    reviewRating?: number;
    bookingAmount?: number;
    commissionAmount?: number;
    performanceMetric?: string;
  };
}

interface PerformanceSummary {
  totalProperties: number;
  totalCommissionsEarned: number;
  currentMonthCommissions: number;
  averageOccupancyRate: number;
  averageReviewScore: number;
  totalBookingsReferred: number;
  bestPerformingProperty: {
    name: string;
    occupancyRate: number;
    commissionAmount: number;
  };
  monthlyTrend: Array<{
    month: string;
    commissions: number;
    occupancy: number;
    bookings: number;
  }>;
}

const PERFORMANCE_COLORS = {
  excellent: 'bg-green-100 text-green-800 border-green-200',
  good: 'bg-blue-100 text-blue-800 border-blue-200',
  average: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  poor: 'bg-red-100 text-red-800 border-red-200'
};

const PAYMENT_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  requested: 'bg-blue-100 text-blue-800 border-blue-200',
  paid: 'bg-green-100 text-green-800 border-green-200'
};

const NOTIFICATION_ICONS = {
  new_review: MessageSquare,
  new_booking: Calendar,
  commission_paid: DollarSign,
  performance_improvement: TrendingUp
};

export default function ReferralAgentDashboard() {
  const [activeTab, setActiveTab] = useState("villas");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedVilla, setSelectedVilla] = useState<AssignedVilla | null>(null);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [showMarketingDialog, setShowMarketingDialog] = useState(false);
  const [payoutRequest, setPayoutRequest] = useState({
    commissionIds: [] as number[],
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();

  // Data queries
  const { data: assignedVillas = [] } = useQuery({
    queryKey: ["/api/referral-agent/properties"],
    enabled: !!user && user.role === 'referral-agent',
  });

  const { data: commissionLogs = [] } = useQuery({
    queryKey: ["/api/referral-agent/commissions", selectedPeriod],
    enabled: !!user && user.role === 'referral-agent',
  });

  const { data: performanceSummary } = useQuery({
    queryKey: ["/api/referral-agent/performance"],
    enabled: !!user && user.role === 'referral-agent',
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/referral-agent/notifications"],
    enabled: !!user && user.role === 'referral-agent',
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: marketingMaterials } = useQuery({
    queryKey: ["/api/referral-agent/marketing", selectedVilla?.propertyId],
    enabled: !!selectedVilla,
  });

  // Mutations
  const requestCommissionPayout = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/referral-agent/payout-request", data),
    onSuccess: () => {
      toast({ title: "Commission payout request submitted successfully" });
      setShowPayoutDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/referral-agent/commissions"] });
      setPayoutRequest({ commissionIds: [], notes: "" });
    },
    onError: (error) => {
      toast({ title: "Error submitting payout request", description: error.message, variant: "destructive" });
    },
  });

  const markNotificationRead = useMutation({
    mutationFn: async (notificationId: number) => apiRequest("POST", `/api/referral-agent/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referral-agent/notifications"] });
    },
  });

  const generateAffiliateUrl = useMutation({
    mutationFn: async (propertyId: number) => apiRequest("POST", `/api/referral-agent/affiliate-url`, { propertyId }),
    onSuccess: (data) => {
      navigator.clipboard.writeText(data.affiliateUrl);
      toast({ title: "Affiliate URL copied to clipboard" });
    },
  });

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  const getPerformanceLevel = (occupancy: number, rating: number) => {
    if (occupancy >= 80 && rating >= 4.5) return 'excellent';
    if (occupancy >= 60 && rating >= 4.0) return 'good';
    if (occupancy >= 40 && rating >= 3.5) return 'average';
    return 'poor';
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== 'referral-agent') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold">Referral Agent Access Required</h3>
              <p className="text-gray-600">This dashboard is only available for referral agents.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assigned Villas Component
  const AssignedVillasTab = () => (
    <div className="space-y-6">
      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <h3 className="text-blue-600 font-medium mb-2">Assigned Properties</h3>
              <p className="text-2xl font-bold text-blue-800">
                {performanceSummary?.totalProperties || 0}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <h3 className="text-green-600 font-medium mb-2">Total Commissions</h3>
              <p className="text-2xl font-bold text-green-800">
                {formatCurrency(performanceSummary?.totalCommissionsEarned || 0)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <h3 className="text-purple-600 font-medium mb-2">Avg Occupancy</h3>
              <p className="text-2xl font-bold text-purple-800">
                {formatPercentage(performanceSummary?.averageOccupancyRate || 0)}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
              <h3 className="text-yellow-600 font-medium mb-2">Avg Rating</h3>
              <p className="text-2xl font-bold text-yellow-800">
                {(performanceSummary?.averageReviewScore || 0).toFixed(1)} ⭐
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Villas Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-green-500" />
            Your Referred Properties ({assignedVillas.length})
          </CardTitle>
          <CardDescription>
            Track performance and earnings from properties you've referred to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedVillas.map((villa: AssignedVilla) => {
              const performanceLevel = getPerformanceLevel(
                villa.monthlyPerformance.occupancyRate,
                villa.monthlyPerformance.averageReviewScore
              );
              
              return (
                <Card key={villa.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {villa.images?.[0] && (
                      <img 
                        src={villa.images[0]} 
                        alt={villa.propertyName}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{villa.propertyName}</h3>
                        <Badge className={PERFORMANCE_COLORS[performanceLevel]}>
                          {performanceLevel}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {villa.address}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{villa.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{villa.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{villa.maxGuests}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">This Month Occupancy:</span>
                          <span className="font-medium">
                            {formatPercentage(villa.monthlyPerformance.occupancyRate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Guest Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="font-medium">
                              {villa.monthlyPerformance.averageReviewScore.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Monthly Revenue:</span>
                          <span className="font-medium">
                            {formatCurrency(villa.monthlyPerformance.totalRevenue)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Your 10% Cut:</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(villa.monthlyPerformance.commissionAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedVilla(villa);
                            setShowMarketingDialog(true);
                          }}
                        >
                          <Share className="h-3 w-3 mr-1" />
                          Marketing
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateAffiliateUrl.mutate(villa.propertyId)}
                        >
                          <Link className="h-3 w-3 mr-1" />
                          Copy Link
                        </Button>
                      </div>

                      <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
                        Referred: {format(parseISO(villa.referralDate), 'MMM d, yyyy')}
                        <br />
                        PM: {villa.portfolioManagerName}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {assignedVillas.length === 0 && (
            <div className="text-center py-8">
              <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold">No Assigned Properties</h3>
              <p className="text-gray-600">
                Start referring properties to earn commissions from management fees.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Commission Tracking Component
  const CommissionTrackingTab = () => (
    <div className="space-y-6">
      {/* Commission Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-green-500" />
              Commission Tracking
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowPayoutDialog(true)}>
                <Download className="h-4 w-4 mr-2" />
                Request Payout
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
              <h3 className="text-green-600 font-medium mb-2">Available Balance</h3>
              <p className="text-3xl font-bold text-green-800">
                {formatCurrency(
                  commissionLogs
                    .filter((log: CommissionLog) => log.paymentStatus === 'pending')
                    .reduce((sum: number, log: CommissionLog) => sum + log.commissionAmount, 0)
                )}
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <h3 className="text-blue-600 font-medium mb-2">This Month</h3>
              <p className="text-3xl font-bold text-blue-800">
                {formatCurrency(performanceSummary?.currentMonthCommissions || 0)}
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <h3 className="text-purple-600 font-medium mb-2">Total Earned</h3>
              <p className="text-3xl font-bold text-purple-800">
                {formatCurrency(performanceSummary?.totalCommissionsEarned || 0)}
              </p>
            </div>
          </div>

          {/* Monthly Trend Chart */}
          <div className="space-y-4">
            <h4 className="font-semibold">Commission Trend</h4>
            {performanceSummary?.monthlyTrend?.map((month: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="font-medium">{month.month}</div>
                  <Badge variant="outline">{month.bookings} bookings</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(month.commissions)}</div>
                    <div className="text-sm text-gray-600">{formatPercentage(month.occupancy)} occupancy</div>
                  </div>
                  <Progress value={month.occupancy} className="w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-500" />
            Commission Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commissionLogs.map((log: CommissionLog) => (
              <Card key={log.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{log.propertyName}</h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(log.commissionYear, log.commissionMonth - 1), 'MMMM yyyy')}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-sm">
                          <span className="text-gray-600">Occupancy: </span>
                          <span className="font-medium">{formatPercentage(log.occupancyRate)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Rating: </span>
                          <span className="font-medium">{log.averageReviewScore.toFixed(1)} ⭐</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Bookings: </span>
                          <span className="font-medium">{log.monthlyBookings}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Management Revenue</p>
                      <p className="font-semibold">{formatCurrency(log.managementRevenue)}</p>
                      <p className="text-sm text-green-600 font-medium">
                        Your {log.commissionRate}%: {formatCurrency(log.commissionAmount)}
                      </p>
                      <Badge className={PAYMENT_STATUS_COLORS[log.paymentStatus as keyof typeof PAYMENT_STATUS_COLORS]} >
                        {log.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  {log.paymentSlipUrl && (
                    <div className="mt-3 pt-3 border-t">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Payment Receipt
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {commissionLogs.length === 0 && (
              <div className="text-center py-8">
                <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold">No Commission Records</h3>
                <p className="text-gray-600">
                  Commission logs will appear here as your referred properties generate revenue.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Notifications Component
  const NotificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Recent Notifications ({notifications.filter((n: NotificationItem) => !n.read).length} unread)
          </CardTitle>
          <CardDescription>
            Stay updated on reviews, bookings, payments, and performance improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification: NotificationItem) => {
              const NotificationIcon = NOTIFICATION_ICONS[notification.type];
              
              return (
                <Card key={notification.id} className={`border ${notification.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'new_review' ? 'bg-blue-100' :
                        notification.type === 'new_booking' ? 'bg-green-100' :
                        notification.type === 'commission_paid' ? 'bg-yellow-100' :
                        'bg-purple-100'
                      }`}>
                        <NotificationIcon className={`h-4 w-4 ${
                          notification.type === 'new_review' ? 'text-blue-600' :
                          notification.type === 'new_booking' ? 'text-green-600' :
                          notification.type === 'commission_paid' ? 'text-yellow-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <span className="text-xs text-gray-500">{getTimeAgo(notification.timestamp)}</span>
                        </div>
                        <p className="text-gray-700 mt-1">{notification.message}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Property: {notification.propertyName}
                        </p>
                        
                        {notification.metadata && (
                          <div className="mt-2 flex items-center gap-4">
                            {notification.metadata.reviewRating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{notification.metadata.reviewRating}</span>
                              </div>
                            )}
                            {notification.metadata.bookingAmount && (
                              <div className="text-sm font-medium text-green-600">
                                {formatCurrency(notification.metadata.bookingAmount)}
                              </div>
                            )}
                            {notification.metadata.commissionAmount && (
                              <div className="text-sm font-medium text-blue-600">
                                Commission: {formatCurrency(notification.metadata.commissionAmount)}
                              </div>
                            )}
                            {notification.metadata.performanceMetric && (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                {notification.metadata.performanceMetric}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {!notification.read && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => markNotificationRead.mutate(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {notifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold">No Notifications</h3>
                <p className="text-gray-600">
                  You'll receive notifications about reviews, bookings, and performance updates here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-purple-500" />
            Referral Agent Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track performance, earnings, and notifications for your referred properties
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => queryClient.invalidateQueries()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="villas" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            🏠 Assigned Villas
          </TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            💼 Commission Tracking
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            🔔 Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="villas">
          <AssignedVillasTab />
        </TabsContent>

        <TabsContent value="commissions">
          <CommissionTrackingTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>

      {/* Commission Payout Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Commission Payout</DialogTitle>
            <DialogDescription>
              Request payment for your available commission balance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800">Available for Payout</h4>
              <p className="text-2xl font-bold text-green-800">
                {formatCurrency(
                  commissionLogs
                    .filter((log: CommissionLog) => log.paymentStatus === 'pending')
                    .reduce((sum: number, log: CommissionLog) => sum + log.commissionAmount, 0)
                )}
              </p>
              <p className="text-sm text-green-600">
                From {commissionLogs.filter((log: CommissionLog) => log.paymentStatus === 'pending').length} properties
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payoutNotes">Notes (Optional)</Label>
              <Textarea
                id="payoutNotes"
                value={payoutRequest.notes}
                onChange={(e) => setPayoutRequest({...payoutRequest, notes: e.target.value})}
                placeholder="Add any notes for the payout request..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayoutDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => requestCommissionPayout.mutate({
                commissionIds: commissionLogs
                  .filter((log: CommissionLog) => log.paymentStatus === 'pending')
                  .map((log: CommissionLog) => log.id),
                notes: payoutRequest.notes
              })}
              disabled={requestCommissionPayout.isPending}
            >
              {requestCommissionPayout.isPending ? "Submitting..." : "Request Payout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Marketing Materials Dialog */}
      <Dialog open={showMarketingDialog} onOpenChange={setShowMarketingDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Marketing Materials - {selectedVilla?.propertyName}</DialogTitle>
            <DialogDescription>
              Access unbranded photos, fact sheets, and affiliate links for property promotion
            </DialogDescription>
          </DialogHeader>
          
          {selectedVilla && (
            <div className="space-y-6">
              {/* Affiliate URL */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-blue-500" />
                    Affiliate URL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={selectedVilla.marketingMaterials?.affiliateUrl || "Generating..."}
                      readOnly
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => generateAffiliateUrl.mutate(selectedVilla.propertyId)}
                      disabled={generateAffiliateUrl.isPending}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Unbranded Photos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-green-500" />
                    Unbranded Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedVilla.marketingMaterials?.unbrandedPhotos?.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={photo} 
                          alt={`${selectedVilla.propertyName} - Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fact Sheet & Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Marketing Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" asChild>
                      <a href={selectedVilla.marketingMaterials?.factSheetUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        Download Fact Sheet
                      </a>
                    </Button>
                    {selectedVilla.marketingMaterials?.virtualTourUrl && (
                      <Button variant="outline" asChild>
                        <a href={selectedVilla.marketingMaterials.virtualTourUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Virtual Tour
                        </a>
                      </Button>
                    )}
                    <Button variant="outline">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile Assets
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Performance Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <p className="text-blue-600 text-sm">Occupancy Rate</p>
                      <p className="font-bold text-lg">{formatPercentage(selectedVilla.monthlyPerformance.occupancyRate)}</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <p className="text-yellow-600 text-sm">Guest Rating</p>
                      <p className="font-bold text-lg">{selectedVilla.monthlyPerformance.averageReviewScore.toFixed(1)} ⭐</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <p className="text-green-600 text-sm">Monthly Revenue</p>
                      <p className="font-bold text-lg">{formatCurrency(selectedVilla.monthlyPerformance.totalRevenue)}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <p className="text-purple-600 text-sm">Your Commission</p>
                      <p className="font-bold text-lg">{formatCurrency(selectedVilla.monthlyPerformance.commissionAmount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMarketingDialog(false)}>
              Close
            </Button>
            <Button>
              <Share className="h-4 w-4 mr-2" />
              Share Marketing Pack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}