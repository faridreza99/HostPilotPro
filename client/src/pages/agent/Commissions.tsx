import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Calendar, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function Commissions() {
  const commissionData = {
    thisMonth: {
      earned: 45000,
      pending: 12000,
      paid: 33000,
      bookings: 8
    },
    lastMonth: {
      earned: 38000,
      pending: 0,
      paid: 38000,
      bookings: 6
    },
    yearToDate: {
      earned: 180000,
      pending: 25000,
      paid: 155000,
      bookings: 32
    }
  };

  const recentCommissions = [
    {
      id: "C001",
      property: "Villa Samui Breeze",
      guest: "John & Sarah Smith",
      checkIn: "2025-01-28",
      nights: 5,
      total: 40000,
      commission: 4000,
      rate: "10%",
      status: "paid",
      paidDate: "2025-01-30"
    },
    {
      id: "C002", 
      property: "Villa Tropical Paradise",
      guest: "Mike Johnson",
      checkIn: "2025-02-05",
      nights: 3,
      total: 36000,
      commission: 3600,
      rate: "10%",
      status: "pending",
      paidDate: null
    },
    {
      id: "C003",
      property: "Villa Ocean View",
      guest: "Lisa & Tom Wilson",
      checkIn: "2025-02-10",
      nights: 4,
      total: 26000,
      commission: 2600,
      rate: "10%",
      status: "processing",
      paidDate: null
    },
    {
      id: "C004",
      property: "Villa Aruna (Demo)",
      guest: "Emma & David Brown",
      checkIn: "2025-02-15",
      nights: 2,
      total: 40000,
      commission: 4000,
      rate: "10%",
      status: "confirmed",
      paidDate: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <AlertCircle className="h-4 w-4" />;
      case "confirmed": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Commission Tracking</h1>
        <p className="text-muted-foreground">Monitor your earnings and commission payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">฿{commissionData.thisMonth.earned.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{commissionData.thisMonth.bookings} bookings</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">฿{commissionData.thisMonth.pending.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid This Month</p>
                <p className="text-2xl font-bold">฿{commissionData.thisMonth.paid.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Already received</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Year to Date</p>
                <p className="text-2xl font-bold">฿{commissionData.yearToDate.earned.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">{commissionData.yearToDate.bookings} total bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Details */}
      <Tabs defaultValue="recent" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="recent">Recent Commissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Commission Transactions</CardTitle>
              <CardDescription>Track your latest bookings and commission payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCommissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{commission.property}</h3>
                        <Badge className={getStatusColor(commission.status)}>
                          {getStatusIcon(commission.status)}
                          <span className="ml-1 capitalize">{commission.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Guest: {commission.guest}</p>
                      <p className="text-sm text-muted-foreground">
                        Check-in: {commission.checkIn} • {commission.nights} nights
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Booking Total</p>
                      <p className="font-medium">฿{commission.total.toLocaleString()}</p>
                    </div>
                    
                    <div className="text-right ml-6">
                      <p className="text-sm text-muted-foreground">Commission ({commission.rate})</p>
                      <p className="text-lg font-bold text-green-600">฿{commission.commission.toLocaleString()}</p>
                      {commission.paidDate && (
                        <p className="text-xs text-muted-foreground">Paid: {commission.paidDate}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Commission earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>January 2025</span>
                    <span className="font-semibold">฿45,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>December 2024</span>
                    <span className="font-semibold">฿38,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>November 2024</span>
                    <span className="font-semibold">฿42,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>October 2024</span>
                    <span className="font-semibold">฿35,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
                <CardDescription>Commission by property type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Villa Aruna (Demo)</span>
                    <span className="font-semibold">฿18,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Villa Tropical Paradise</span>
                    <span className="font-semibold">฿14,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Villa Samui Breeze</span>
                    <span className="font-semibold">฿9,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Villa Ocean View</span>
                    <span className="font-semibold">฿4,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statements">
          <Card>
            <CardHeader>
              <CardTitle>Commission Statements</CardTitle>
              <CardDescription>Download monthly commission statements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["January 2025", "December 2024", "November 2024", "October 2024"].map((month) => (
                  <div key={month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{month} Statement</p>
                        <p className="text-sm text-muted-foreground">Commission summary and transactions</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}