import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Settings, 
  FileText, 
  Bell, 
  Download, 
  Upload, 
  X,
  Home,
  Users,
  Star,
  MapPin,
  ChevronDown,
  Eye,
  Filter,
  PlusCircle,
  Camera,
  Brain,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  CreditCard,
  Receipt,
  BarChart3,
  Activity,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

// Enhanced types for owner dashboard
interface DashboardStats {
  currentBalance: number;
  averageNightlyRate: number;
  totalEarnings: {
    thisMonth: number;
    thisYear: number;
    customPeriod?: number;
  };
  upcomingBookings: number;
  bookingSources: {
    airbnb: number;
    vrbo: number;
    bookingcom: number;
    direct: number;
    marriott: number;
  };
  properties: Property[];
}

interface Property {
  id: number;
  name: string;
  address: string;
  status: string;
  currentOccupancy?: {
    guestName: string;
    checkIn: string;
    checkOut: string;
  };
}

interface ActivityItem {
  id: number;
  type: 'booking' | 'task' | 'maintenance' | 'ai_suggestion';
  title: string;
  description: string;
  timestamp: string;
  propertyId?: number;
  propertyName?: string;
  metadata?: {
    photos?: string[];
    guestName?: string;
    taskType?: string;
    priority?: string;
    estimatedCost?: number;
    requiresApproval?: boolean;
    reviewData?: any;
  };
}

interface AISuggestion {
  id: number;
  type: 'improvement' | 'maintenance' | 'amenity';
  title: string;
  description: string;
  reasoning: string;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high';
  basedOnReviews: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  propertyId: number;
}

interface FinancialBreakdown {
  rentalIncome: number;
  managementCommission: number;
  expenses: {
    maintenance: number;
    addons: number;
    utilities: number;
    welcomePacks: number;
    other: number;
  };
  netBalance: number;
  transactions: FinancialTransaction[];
}

interface FinancialTransaction {
  id: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  propertyName?: string;
  source?: string;
}

const payoutRequestSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  accountDetails: z.string().min(1, "Account details required"),
  notes: z.string().optional(),
});

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [activityFilter, setActivityFilter] = useState('all');
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);

  // Form for payout requests
  const payoutForm = useForm({
    resolver: zodResolver(payoutRequestSchema),
    defaultValues: {
      amount: 0,
      accountDetails: '',
      notes: '',
    },
  });

  // Main dashboard data query
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/owner/dashboard/stats", selectedPeriod, customDateRange],
    enabled: !!user,
  });

  // Recent activity timeline
  const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ["/api/owner/activity", selectedProperty, activityFilter],
    enabled: !!user,
  });

  // AI suggestions
  const { data: aiSuggestions = [], isLoading: suggestionsLoading } = useQuery({
    queryKey: ["/api/owner/ai-suggestions"],
    enabled: !!user,
  });

  // Financial breakdown
  const { data: financialData, isLoading: financialLoading } = useQuery({
    queryKey: ["/api/owner/financial-breakdown", selectedPeriod, customDateRange],
    enabled: !!user,
  });

  // Payout request mutation
  const payoutMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/owner/payout-request", data);
    },
    onSuccess: () => {
      toast({
        title: "Payout Requested",
        description: "Your payout request has been submitted for approval.",
      });
      setShowPayoutDialog(false);
      payoutForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/owner/dashboard/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit payout request",
        variant: "destructive",
      });
    },
  });

  // AI suggestion approval mutation
  const suggestionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: 'approve' | 'reject' }) => {
      return apiRequest("POST", `/api/owner/ai-suggestions/${id}/${action}`);
    },
    onSuccess: () => {
      toast({
        title: "Suggestion Updated",
        description: "AI suggestion status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/owner/ai-suggestions"] });
    },
  });

  // Loading state
  if (statsLoading || activityLoading || financialLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'task': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'ai_suggestion': return <Brain className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your properties and track performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="custom">Custom Period</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <CreditCard className="mr-2 h-4 w-4" />
                Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
                <DialogDescription>
                  Request a payout from your available balance of {formatCurrency(dashboardStats?.currentBalance || 0)}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...payoutForm}>
                <form onSubmit={payoutForm.handleSubmit((data) => payoutMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={payoutForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payout Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={payoutForm.control}
                    name="accountDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Account Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your bank account details"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={payoutForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional notes"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowPayoutDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={payoutMutation.isPending}>
                      {payoutMutation.isPending ? "Submitting..." : "Request Payout"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Custom Date Range */}
      {selectedPeriod === 'custom' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(dashboardStats?.currentBalance || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Nightly Rate</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(dashboardStats?.averageNightlyRate || 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {selectedPeriod === 'thisMonth' ? 'This Month' : 
                   selectedPeriod === 'thisYear' ? 'This Year' : 'Custom Period'}
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    selectedPeriod === 'thisMonth' ? dashboardStats?.totalEarnings.thisMonth || 0 :
                    selectedPeriod === 'thisYear' ? dashboardStats?.totalEarnings.thisYear || 0 :
                    dashboardStats?.totalEarnings.customPeriod || 0
                  )}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Bookings</p>
                <p className="text-2xl font-bold">{dashboardStats?.upcomingBookings || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Sources Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Sources</CardTitle>
          <CardDescription>Revenue distribution by booking platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(dashboardStats?.bookingSources || {}).map(([source, count]) => (
              <div key={source} className="text-center">
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-2xl font-bold">{count as number}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {source === 'bookingcom' ? 'Booking.com' : source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="logbook">Villa Logbook</TabsTrigger>
        </TabsList>

        {/* Recent Activity Timeline */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Activity Timeline</CardTitle>
                  <CardDescription>Latest bookings, tasks, and maintenance updates</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={activityFilter} onValueChange={setActivityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activity</SelectItem>
                      <SelectItem value="booking">Bookings</SelectItem>
                      <SelectItem value="task">Tasks</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedProperty?.toString() || 'all'} onValueChange={(value) => 
                    setSelectedProperty(value === 'all' ? null : parseInt(value))}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Properties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      {dashboardStats?.properties?.map((property) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity found</p>
                  </div>
                ) : (
                  recentActivity.map((activity: ActivityItem) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        {activity.propertyName && (
                          <Badge variant="secondary" className="mt-2">
                            <Home className="mr-1 h-3 w-3" />
                            {activity.propertyName}
                          </Badge>
                        )}
                        
                        {/* Special handling for maintenance requests */}
                        {activity.type === 'maintenance' && activity.metadata?.requiresApproval && (
                          <div className="mt-3 flex items-center gap-2">
                            <Button size="sm" variant="outline" className="text-green-600">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Approve ({formatCurrency(activity.metadata.estimatedCost || 0)})
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              View Details
                            </Button>
                          </div>
                        )}
                        
                        {/* Photo attachments */}
                        {activity.metadata?.photos && activity.metadata.photos.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <Camera className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {activity.metadata.photos.length} photo(s) attached
                            </span>
                            <Button size="sm" variant="ghost" className="h-auto p-0 text-xs">
                              View Photos
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Suggestions Tab */}
        <TabsContent value="ai-suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI-Powered Improvement Suggestions
              </CardTitle>
              <CardDescription>
                Smart recommendations based on guest reviews and property data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiSuggestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No AI suggestions available at this time</p>
                  </div>
                ) : (
                  aiSuggestions.map((suggestion: AISuggestion) => (
                    <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{suggestion.title}</h3>
                            <Badge className={getPriorityBadge(suggestion.priority)}>
                              {suggestion.priority} priority
                            </Badge>
                            <Badge variant="outline">
                              {formatCurrency(suggestion.estimatedCost)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                          <p className="text-xs text-gray-600">
                            <strong>Based on:</strong> {suggestion.reasoning}
                          </p>
                        </div>
                      </div>
                      
                      {/* Review snippets */}
                      {suggestion.basedOnReviews.length > 0 && (
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">Recent Guest Feedback:</p>
                          {suggestion.basedOnReviews.slice(0, 2).map((review, index) => (
                            <p key={index} className="text-xs text-gray-600 italic mb-1">
                              "{review}"
                            </p>
                          ))}
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      {suggestion.status === 'pending' && (
                        <div className="flex items-center gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => suggestionMutation.mutate({ id: suggestion.id, action: 'approve' })}
                            disabled={suggestionMutation.isPending}
                          >
                            <ThumbsUp className="mr-1 h-3 w-3" />
                            Approve & Get Quote
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => suggestionMutation.mutate({ id: suggestion.id, action: 'reject' })}
                            disabled={suggestionMutation.isPending}
                          >
                            <ThumbsDown className="mr-1 h-3 w-3" />
                            Not Interested
                          </Button>
                        </div>
                      )}
                      
                      {suggestion.status !== 'pending' && (
                        <Badge variant={suggestion.status === 'approved' ? 'default' : 'secondary'}>
                          {suggestion.status === 'approved' ? 'Approved - Quote Requested' : 'Declined'}
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finances Tab */}
        <TabsContent value="finances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Financial Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Breakdown</CardTitle>
                <CardDescription>Income and expense summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-green-600">Rental Income</span>
                    <span className="font-medium text-green-600">
                      +{formatCurrency(financialData?.rentalIncome || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Management Commission</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(financialData?.managementCommission || 0)}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Expenses:</p>
                    {Object.entries(financialData?.expenses || {}).map(([category, amount]) => (
                      <div key={category} className="flex justify-between text-sm">
                        <span className="capitalize text-red-600">{category}</span>
                        <span className="text-red-600">-{formatCurrency(amount as number)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Net Balance</span>
                    <span className={financialData?.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(financialData?.netBalance || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialData?.transactions?.slice(0, 8).map((transaction: FinancialTransaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), 'MMM d')} • {transaction.category}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-muted-foreground">
                      <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No transactions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Villa Logbook Tab */}
        <TabsContent value="logbook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Villa Logbook
              </CardTitle>
              <CardDescription>
                Comprehensive property activity log and maintenance history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Villa Logbook feature coming soon</p>
                <p className="text-sm">This will include detailed property logs, maintenance schedules, and guest interaction history.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}