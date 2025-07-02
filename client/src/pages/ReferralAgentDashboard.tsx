import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { 
  Building2, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Star,
  Users,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ReferralAgentDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch referral agent data
  const { data: referralProperties } = useQuery({
    queryKey: ["/api/referral-agent/properties"],
  });

  const { data: monthlyEarnings } = useQuery({
    queryKey: ["/api/referral-agent/earnings", selectedMonth],
  });

  const { data: earningsHistory } = useQuery({
    queryKey: ["/api/referral-agent/earnings-history"],
  });

  const { data: payoutRequests } = useQuery({
    queryKey: ["/api/referral-agent/payouts"],
  });

  // Request payout mutation
  const requestPayoutMutation = useMutation({
    mutationFn: async (data: { month: string; amount: number }) => {
      return await apiRequest("/api/referral-agent/request-payout", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referral-agent/payouts"] });
      toast({ title: "Payout request submitted successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Failed to submit payout request", variant: "destructive" });
    },
  });

  // Calculate totals
  const totalMonthlyEarnings = monthlyEarnings?.reduce((sum: number, earning: any) => 
    sum + parseFloat(earning.commissionAmount), 0) || 0;
  
  const totalAssignedProperties = referralProperties?.length || 0;
  const averageOccupancyRate = referralProperties?.reduce((sum: number, prop: any) => 
    sum + (prop.occupancyRate || 0), 0) / totalAssignedProperties || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referral Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Track your property referrals and commission earnings
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignedProperties}</div>
            <p className="text-xs text-muted-foreground">
              Active referral properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedMonth} commission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOccupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Review Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(referralProperties?.reduce((sum: number, prop: any) => 
                sum + (prop.averageReviewScore || 0), 0) / totalAssignedProperties || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5.0 stars
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="earnings">Monthly Earnings</TabsTrigger>
          <TabsTrigger value="history">Earnings History</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Properties</CardTitle>
              <CardDescription>
                Properties you've referred and their performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Referral Date</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Occupancy Rate</TableHead>
                    <TableHead>Avg Review</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralProperties?.map((property: any) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.propertyName}</TableCell>
                      <TableCell>
                        {format(new Date(property.referralDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{property.commissionRate}%</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={property.occupancyRate || 0} className="w-16" />
                          <span className="text-sm">{property.occupancyRate || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{property.averageReviewScore || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={property.isActive ? "default" : "secondary"}>
                          {property.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Earnings Tab */}
        <TabsContent value="earnings" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Monthly Earnings Breakdown</h3>
              <p className="text-sm text-muted-foreground">
                Commission from management fees for {selectedMonth}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1 border rounded"
              />
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Management Fee</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Commission Amount</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyEarnings?.map((earning: any) => (
                    <TableRow key={earning.id}>
                      <TableCell className="font-medium">{earning.propertyName}</TableCell>
                      <TableCell>${earning.managementFee}</TableCell>
                      <TableCell>{earning.commissionRate}%</TableCell>
                      <TableCell className="font-bold">${earning.commissionAmount}</TableCell>
                      <TableCell>{earning.totalBookings}</TableCell>
                      <TableCell>
                        <Badge variant={earning.isConfirmed ? "default" : "secondary"}>
                          {earning.isConfirmed ? "Confirmed" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-lg font-medium">Total Monthly Commission:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${totalMonthlyEarnings.toFixed(2)}
                </span>
              </div>

              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => requestPayoutMutation.mutate({ 
                    month: selectedMonth, 
                    amount: totalMonthlyEarnings 
                  })}
                  disabled={requestPayoutMutation.isPending || totalMonthlyEarnings === 0}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earnings History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
              <CardDescription>
                Complete history of your referral commissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Total Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earningsHistory?.map((month: any) => (
                    <TableRow key={month.month}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell>{month.propertyCount}</TableCell>
                      <TableCell className="font-bold">${month.totalCommission}</TableCell>
                      <TableCell>
                        <Badge variant={month.isPaid ? "default" : "secondary"}>
                          {month.isPaid ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Statement
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout Requests</CardTitle>
              <CardDescription>
                Track your commission payout requests and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests?.map((payout: any) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.payoutMonth}</TableCell>
                      <TableCell className="font-bold">${payout.payoutAmount}</TableCell>
                      <TableCell>
                        {format(new Date(payout.requestedAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          payout.payoutStatus === "completed" ? "default" :
                          payout.payoutStatus === "approved" ? "secondary" :
                          payout.payoutStatus === "pending" ? "outline" : "destructive"
                        }>
                          <div className="flex items-center space-x-1">
                            {payout.payoutStatus === "completed" && <CheckCircle className="h-3 w-3" />}
                            {payout.payoutStatus === "pending" && <Clock className="h-3 w-3" />}
                            {payout.payoutStatus === "rejected" && <AlertCircle className="h-3 w-3" />}
                            <span>{payout.payoutStatus}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{payout.payoutMethod || "N/A"}</TableCell>
                      <TableCell>{payout.paymentReference || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}