import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, Filter } from "lucide-react";

export default function Payouts() {
  const { data: finances = [] } = useQuery({
    queryKey: ["/api/finances"],
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties"],
  });

  // Calculate payout summary
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = finances
    .filter((f: any) => f.type === 'income' && 
      new Date(f.date).getMonth() === currentMonth && 
      new Date(f.date).getFullYear() === currentYear)
    .reduce((sum: number, f: any) => sum + parseFloat(f.amount || '0'), 0);

  const monthlyExpenses = finances
    .filter((f: any) => f.type === 'expense' && 
      new Date(f.date).getMonth() === currentMonth && 
      new Date(f.date).getFullYear() === currentYear)
    .reduce((sum: number, f: any) => sum + parseFloat(f.amount || '0'), 0);

  const monthlyCommissions = finances
    .filter((f: any) => f.type === 'commission' && 
      new Date(f.date).getMonth() === currentMonth && 
      new Date(f.date).getFullYear() === currentYear)
    .reduce((sum: number, f: any) => sum + parseFloat(f.amount || '0'), 0);

  const netPayout = monthlyIncome - monthlyExpenses - monthlyCommissions;

  const payoutHistory = [
    // Mock data for demonstration - in real app this would come from API
    { month: 'December 2024', amount: 4250, status: 'paid', date: '2024-12-31' },
    { month: 'November 2024', amount: 3890, status: 'paid', date: '2024-11-30' },
    { month: 'October 2024', amount: 4100, status: 'paid', date: '2024-10-31' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <TopBar 
          title="Owner Payouts" 
          action={
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Process Payout
              </Button>
            </div>
          }
        />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-green-600">${monthlyIncome.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 text-green-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                    <p className="text-2xl font-bold text-red-600">${monthlyExpenses.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-100 text-red-600">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commissions</p>
                    <p className="text-2xl font-bold text-orange-600">${monthlyCommissions.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Payout</p>
                    <p className={`text-2xl font-bold ${netPayout >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${netPayout.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${netPayout >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Current Month Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Current Month Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Booking Revenue</span>
                    <span className="font-semibold text-green-600">+${monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Cleaning & Maintenance</span>
                    <span className="font-semibold text-red-600">-${(monthlyExpenses * 0.4).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Utilities</span>
                    <span className="font-semibold text-red-600">-${(monthlyExpenses * 0.3).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Management Commission</span>
                    <span className="font-semibold text-red-600">-${monthlyCommissions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Other Expenses</span>
                    <span className="font-semibold text-red-600">-${(monthlyExpenses * 0.3).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 pt-4 border-t-2 border-gray-200">
                    <span className="font-semibold text-gray-900">Net Payout</span>
                    <span className={`font-bold text-lg ${netPayout >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${netPayout.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.slice(0, 5).map((property: any) => {
                    const propertyRevenue = Math.floor(Math.random() * 2000) + 1000; // Mock data
                    const occupancyRate = Math.floor(Math.random() * 30) + 70; // Mock data
                    
                    return (
                      <div key={property.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{property.name}</p>
                          <p className="text-sm text-gray-500">{occupancyRate}% occupancy</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${propertyRevenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">This month</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Properties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      {properties.map((property: any) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-month">Current Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Payout Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payout History */}
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Gross Revenue</TableHead>
                      <TableHead>Total Expenses</TableHead>
                      <TableHead>Commissions</TableHead>
                      <TableHead>Net Payout</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Paid</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payoutHistory.map((payout, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{payout.month}</TableCell>
                        <TableCell>${(payout.amount * 1.4).toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">-${(payout.amount * 0.25).toLocaleString()}</TableCell>
                        <TableCell className="text-orange-600">-${(payout.amount * 0.15).toLocaleString()}</TableCell>
                        <TableCell className="font-semibold text-green-600">${payout.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={payout.status === 'paid' ? 'outline' : 'default'}>
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}