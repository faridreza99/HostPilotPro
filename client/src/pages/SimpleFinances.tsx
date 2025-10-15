import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface Property {
  id: number;
  name: string;
}

interface Finance {
  id: number;
  propertyId: number;
  type: 'income' | 'expense';
  category: string;
  amount: string;
  date: string;
  description?: string;
}

export default function SimpleFinances() {
  const [selectedProperty, setSelectedProperty] = useState<string>('all');

  // Fetch properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Fetch finances
  const { data: finances = [] } = useQuery<Finance[]>({
    queryKey: ["/api/finance"],
  });

  // Filter finances by selected property
  const filteredFinances = selectedProperty === 'all' 
    ? finances 
    : finances.filter(f => f.propertyId.toString() === selectedProperty);

  // Calculate totals
  const totalRevenue = filteredFinances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + parseFloat(f.amount || '0'), 0);

  const totalExpenses = filteredFinances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + parseFloat(f.amount || '0'), 0);

  const netProfit = totalRevenue - totalExpenses;

  // Get recent transactions (last 10)
  const recentTransactions = [...filteredFinances]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Get revenue by property (only if showing all properties)
  const revenueByProperty = selectedProperty === 'all' 
    ? properties.map(prop => {
        const propRevenue = finances
          .filter(f => f.propertyId === prop.id && f.type === 'income')
          .reduce((sum, f) => sum + parseFloat(f.amount || '0'), 0);
        const percentage = totalRevenue > 0 ? (propRevenue / totalRevenue * 100).toFixed(0) : 0;
        return { name: prop.name, revenue: propRevenue, percentage };
      }).filter(p => p.revenue > 0)
    : [];

  const selectedPropertyName = selectedProperty === 'all' 
    ? 'All Properties' 
    : properties.find(p => p.id.toString() === selectedProperty)?.name || 'Unknown';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        
        {/* Property Filter */}
        <div className="w-64">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger data-testid="select-property-filter">
              <SelectValue placeholder="Filter by Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id.toString()}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected Property Badge */}
      {selectedProperty !== 'all' && (
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
            <DollarSign className="w-4 h-4" />
            <span>Showing finances for: <strong>{selectedPropertyName}</strong></span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-total-revenue">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredFinances.filter(f => f.type === 'income').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="text-total-expenses">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredFinances.filter(f => f.type === 'expense').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`} data-testid="text-net-profit">
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Profit margin: {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedProperty === 'all' ? properties.length : 1}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedProperty === 'all' ? 'All properties' : selectedPropertyName}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No transactions found</p>
              ) : (
                recentTransactions.map((transaction) => {
                  const property = properties.find(p => p.id === transaction.propertyId);
                  return (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {property?.name || 'Unknown Property'} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount))}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedProperty === 'all' ? 'Revenue by Property' : 'Revenue Breakdown'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProperty === 'all' ? (
              <div className="space-y-3">
                {revenueByProperty.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No revenue data available</p>
                ) : (
                  revenueByProperty.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatCurrency(item.revenue)}</span>
                        <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Income</span>
                  <span className="font-medium text-green-600">{formatCurrency(totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Expenses</span>
                  <span className="font-medium text-red-600">{formatCurrency(totalExpenses)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-sm font-medium">Net Profit</span>
                  <span className={`font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(netProfit)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{filteredFinances.length}</p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {totalRevenue > 0 && totalExpenses > 0 
                  ? ((netProfit / totalRevenue) * 100).toFixed(1) 
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {filteredFinances.length > 0 
                  ? formatCurrency(totalRevenue / filteredFinances.filter(f => f.type === 'income').length || 0)
                  : formatCurrency(0)}
              </p>
              <p className="text-sm text-muted-foreground">Avg. Transaction Value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
