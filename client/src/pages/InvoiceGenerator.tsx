import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Download, Eye, Calendar, DollarSign, User, Building } from "lucide-react";

export default function InvoiceGenerator() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const invoices = [
    {
      id: "INV-2025-001",
      clientName: "John Smith",
      clientType: "Owner",
      property: "Villa Samui Breeze",
      issueDate: "2025-01-15",
      dueDate: "2025-02-14",
      amount: 2450.00,
      status: "paid",
      description: "December 2024 Revenue Share",
      items: [
        { description: "Booking Revenue (70% share)", amount: 2100.00 },
        { description: "Management Fee", amount: -150.00 },
        { description: "Cleaning Services", amount: -75.00 },
        { description: "Utility Charges", amount: -125.00 },
        { description: "Platform Fees", amount: 600.00 }
      ]
    },
    {
      id: "INV-2025-002",
      clientName: "Sarah Wilson",
      clientType: "Portfolio Manager",
      property: "Multiple Properties",
      issueDate: "2025-01-18",
      dueDate: "2025-02-17",
      amount: 3200.00,
      status: "pending",
      description: "January 2025 Commission Payment",
      items: [
        { description: "Management Commission (15%)", amount: 2800.00 },
        { description: "Performance Bonus", amount: 400.00 }
      ]
    },
    {
      id: "INV-2025-003",
      clientName: "Mike Chen",
      clientType: "Retail Agent",
      property: "Villa Aruna",
      issueDate: "2025-01-20",
      dueDate: "2025-02-19",
      amount: 850.00,
      status: "overdue",
      description: "December 2024 Booking Commission",
      items: [
        { description: "Booking Commission (10%)", amount: 750.00 },
        { description: "Referral Bonus", amount: 100.00 }
      ]
    },
    {
      id: "INV-2025-004",
      clientName: "HostPilotPro Management",
      clientType: "Internal",
      property: "Villa Paradise",
      issueDate: "2025-01-21",
      dueDate: "2025-02-20",
      amount: 1200.00,
      status: "draft",
      description: "January 2025 Operating Expenses",
      items: [
        { description: "Staff Salaries", amount: 800.00 },
        { description: "Maintenance Costs", amount: 250.00 },
        { description: "Marketing Expenses", amount: 150.00 }
      ]
    }
  ];

  const invoiceTemplates = [
    {
      id: 1,
      name: "Owner Revenue Share",
      description: "Monthly revenue distribution to property owners",
      defaultItems: ["Booking Revenue Share", "Management Fee", "Maintenance Deduction", "Utility Charges"]
    },
    {
      id: 2,
      name: "Portfolio Manager Commission",
      description: "Commission payments to portfolio managers",
      defaultItems: ["Management Commission", "Performance Bonus", "Override Commission"]
    },
    {
      id: 3,
      name: "Agent Commission",
      description: "Commission payments to retail and referral agents",
      defaultItems: ["Booking Commission", "Referral Bonus", "Performance Incentive"]
    },
    {
      id: 4,
      name: "Service Provider Payment",
      description: "Payments to external service providers",
      defaultItems: ["Service Fee", "Materials Cost", "Labor Charges"]
    },
    {
      id: 5,
      name: "Expense Reimbursement",
      description: "Reimbursement for business expenses",
      defaultItems: ["Travel Expenses", "Material Purchases", "Service Payments"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getClientIcon = (clientType: string) => {
    switch (clientType) {
      case "Owner": return <User className="w-4 h-4" />;
      case "Portfolio Manager": return <Building className="w-4 h-4" />;
      case "Retail Agent": return <User className="w-4 h-4" />;
      case "Internal": return <Building className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const summaryStats = {
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidInvoices: invoices.filter(inv => inv.status === "paid").length,
    overdueInvoices: invoices.filter(inv => inv.status === "overdue").length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Invoice Generator
          </h1>
          <p className="text-gray-600">Create, manage, and track invoices for owners, agents, and service providers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">All Invoices</TabsTrigger>
          <TabsTrigger value="create">Create Invoice</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Invoices</p>
                    <p className="text-2xl font-bold">{summaryStats.totalInvoices}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalAmount)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Paid Invoices</p>
                    <p className="text-2xl font-bold text-green-600">{summaryStats.paidInvoices}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Paid</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{summaryStats.overdueInvoices}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="Owner">Owners</SelectItem>
                    <SelectItem value="Portfolio Manager">Portfolio Managers</SelectItem>
                    <SelectItem value="Retail Agent">Retail Agents</SelectItem>
                    <SelectItem value="Internal">Internal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="This Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>

                <Button>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoice List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          {getClientIcon(invoice.clientType)}
                          <div>
                            <h4 className="font-medium">{invoice.id}</h4>
                            <p className="text-sm text-gray-600">{invoice.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                        <span className="font-bold text-green-600">{formatCurrency(invoice.amount)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Client</p>
                        <p className="font-medium">{invoice.clientName}</p>
                        <p className="text-xs text-gray-500">{invoice.clientType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Property</p>
                        <p className="font-medium">{invoice.property}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Issue Date</p>
                        <p className="font-medium">{invoice.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p className="font-medium">{invoice.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Line Items</p>
                        <p className="font-medium">{invoice.items.length} items</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created: {invoice.issueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                        {invoice.status === "draft" && (
                          <Button size="sm">Send Invoice</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Invoice Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Invoice Number</label>
                      <Input placeholder="INV-2025-005" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Client Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Property Owner</SelectItem>
                          <SelectItem value="pm">Portfolio Manager</SelectItem>
                          <SelectItem value="agent">Retail Agent</SelectItem>
                          <SelectItem value="referral">Referral Agent</SelectItem>
                          <SelectItem value="vendor">Service Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Client Name</label>
                      <Input placeholder="Enter client name" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Property</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="villa-samui">Villa Samui Breeze</SelectItem>
                          <SelectItem value="villa-aruna">Villa Aruna</SelectItem>
                          <SelectItem value="villa-paradise">Villa Paradise</SelectItem>
                          <SelectItem value="multiple">Multiple Properties</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Invoice Template</h4>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoiceTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.name}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Issue Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Due Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Description</label>
                      <Input placeholder="Invoice description" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Line Items</h4>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <Input placeholder="Description" />
                    <Input type="number" placeholder="Amount" />
                    <Button variant="outline">Add Item</Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Demo items will be populated based on template selection
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-bold">
                  Total: <span className="text-green-600">$0.00</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Generate Invoice</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invoiceTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{template.name}</span>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-2">Default Line Items:</p>
                    <ul className="space-y-1">
                      {template.defaultItems.map((item, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <FileText className="w-3 h-3 text-gray-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Paid</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: "25%"}}></div>
                      </div>
                      <span className="text-sm">1 (25%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: "25%"}}></div>
                      </div>
                      <span className="text-sm">1 (25%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Overdue</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: "25%"}}></div>
                      </div>
                      <span className="text-sm">1 (25%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Draft</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-500 h-2 rounded-full" style={{width: "25%"}}></div>
                      </div>
                      <span className="text-sm">1 (25%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Invoice Totals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(summaryStats.totalAmount)}</p>
                  <p className="text-gray-600">January 2025 Total</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Owners</span>
                    <span className="font-semibold">$2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Portfolio Managers</span>
                    <span className="font-semibold">$3,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Agents</span>
                    <span className="font-semibold">$850</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Internal</span>
                    <span className="font-semibold">$1,200</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}