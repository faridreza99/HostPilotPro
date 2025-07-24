import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Eye, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  Search,
  Calendar,
  User,
  DollarSign
} from "lucide-react";

export default function Proposals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const proposals = [
    {
      id: "PROP-001",
      client: "John & Sarah Smith",
      property: "Villa Samui Breeze",
      checkIn: "2025-03-15",
      checkOut: "2025-03-20",
      guests: 4,
      total: 40000,
      commission: 4000,
      status: "pending",
      sentDate: "2025-01-24",
      expiryDate: "2025-02-24",
      notes: "Corporate retreat, needs early check-in"
    },
    {
      id: "PROP-002",
      client: "Mike Johnson",
      property: "Villa Tropical Paradise",
      checkIn: "2025-04-10",
      checkOut: "2025-04-15",
      guests: 6,
      total: 60000,
      commission: 6000,
      status: "accepted",
      sentDate: "2025-01-20",
      acceptedDate: "2025-01-22",
      notes: "Family vacation, requested pool safety measures"
    },
    {
      id: "PROP-003",
      client: "Lisa & Tom Wilson",
      property: "Villa Ocean View",
      checkIn: "2025-02-28",
      checkOut: "2025-03-05",
      guests: 2,
      total: 39000,
      commission: 3900,
      status: "declined",
      sentDate: "2025-01-18",
      declinedDate: "2025-01-25",
      notes: "Anniversary trip, declined due to budget constraints"
    },
    {
      id: "PROP-004",
      client: "Emma & David Brown",
      property: "Villa Aruna (Demo)",
      checkIn: "2025-05-01",
      checkOut: "2025-05-08",
      guests: 4,
      total: 140000,
      commission: 14000,
      status: "draft",
      notes: "Luxury honeymoon package, premium services requested"
    },
    {
      id: "PROP-005",
      client: "Robert Chen",
      property: "Villa Tropical Paradise",
      checkIn: "2025-03-22",
      checkOut: "2025-03-29",
      guests: 8,
      total: 84000,
      commission: 8400,
      status: "follow_up",
      sentDate: "2025-01-15",
      lastContact: "2025-01-22",
      notes: "Business conference, needs multiple bedrooms"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "declined": return "bg-red-100 text-red-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "follow_up": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "declined": return <XCircle className="h-4 w-4" />;
      case "draft": return <FileText className="h-4 w-4" />;
      case "follow_up": return <Send className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const proposalStats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === "pending").length,
    accepted: proposals.filter(p => p.status === "accepted").length,
    declined: proposals.filter(p => p.status === "declined").length,
    draft: proposals.filter(p => p.status === "draft").length,
    totalValue: proposals.reduce((sum, p) => sum + p.total, 0),
    totalCommission: proposals.reduce((sum, p) => sum + p.commission, 0)
  };

  const conversionRate = proposalStats.total > 0 ? (proposalStats.accepted / (proposalStats.total - proposalStats.draft)) * 100 : 0;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Proposals & Quotes</h1>
            <p className="text-muted-foreground">Manage your client proposals and track conversions</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Proposals</p>
                <p className="text-2xl font-bold">{proposalStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Progress value={(proposalStats.accepted / proposalStats.total) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{conversionRate.toFixed(1)}% conversion rate</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{proposalStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Awaiting client response</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{proposalStats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Converted to bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">฿{proposalStats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">฿{proposalStats.totalCommission.toLocaleString()} commission</p>
          </CardContent>
        </Card>
      </div>

      {/* Proposals Management */}
      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="active">Active Proposals</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="follow_up">Follow Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Proposals</CardTitle>
              <CardDescription>Manage and track your client proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProposals.map((proposal) => (
                  <div key={proposal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{proposal.id}</h3>
                          <Badge className={getStatusColor(proposal.status)}>
                            {getStatusIcon(proposal.status)}
                            <span className="ml-1 capitalize">{proposal.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <User className="h-4 w-4" />
                              Client
                            </div>
                            <p className="font-medium">{proposal.client}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <FileText className="h-4 w-4" />
                              Property
                            </div>
                            <p className="font-medium">{proposal.property}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Calendar className="h-4 w-4" />
                              Stay Dates
                            </div>
                            <p className="font-medium">{proposal.checkIn} to {proposal.checkOut}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <DollarSign className="h-4 w-4" />
                              Value
                            </div>
                            <p className="font-medium">฿{proposal.total.toLocaleString()}</p>
                            <p className="text-xs text-green-600">฿{proposal.commission.toLocaleString()} commission</p>
                          </div>
                        </div>
                        
                        {proposal.notes && (
                          <div className="mt-3 p-2 bg-muted rounded text-sm">
                            <span className="font-medium">Notes: </span>
                            {proposal.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {proposal.status === "draft" && (
                          <Button size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        )}
                        {proposal.status === "pending" && (
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Follow Up
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Templates</CardTitle>
              <CardDescription>Pre-built templates to speed up proposal creation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Luxury Villa Package",
                    description: "High-end villa with premium services",
                    properties: ["Villa Aruna (Demo)"],
                    baseCommission: "12%"
                  },
                  {
                    name: "Family Vacation",
                    description: "Family-friendly properties with activities",
                    properties: ["Villa Tropical Paradise", "Villa Samui Breeze"],
                    baseCommission: "10%"
                  },
                  {
                    name: "Romantic Getaway",
                    description: "Intimate properties for couples",
                    properties: ["Villa Ocean View"],
                    baseCommission: "10%"
                  },
                  {
                    name: "Corporate Retreat",
                    description: "Business-focused accommodation",
                    properties: ["Villa Tropical Paradise"],
                    baseCommission: "8%"
                  }
                ].map((template) => (
                  <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium">Properties:</span>
                          <p className="text-xs text-muted-foreground">{template.properties.join(", ")}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium">Base Commission:</span>
                          <span className="text-xs text-green-600 ml-1">{template.baseCommission}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Analytics</CardTitle>
                <CardDescription>Proposal performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>January 2025</span>
                    <div className="text-right">
                      <span className="font-semibold">75% conversion</span>
                      <p className="text-xs text-muted-foreground">3 of 4 proposals accepted</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>December 2024</span>
                    <div className="text-right">
                      <span className="font-semibold">60% conversion</span>
                      <p className="text-xs text-muted-foreground">3 of 5 proposals accepted</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>November 2024</span>
                    <div className="text-right">
                      <span className="font-semibold">80% conversion</span>
                      <p className="text-xs text-muted-foreground">4 of 5 proposals accepted</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
                <CardDescription>Most popular properties in proposals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Villa Tropical Paradise</span>
                    <div className="text-right">
                      <span className="font-semibold">40%</span>
                      <p className="text-xs text-muted-foreground">2 proposals</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Villa Aruna (Demo)</span>
                    <div className="text-right">
                      <span className="font-semibold">20%</span>
                      <p className="text-xs text-muted-foreground">1 proposal</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Villa Samui Breeze</span>
                    <div className="text-right">
                      <span className="font-semibold">20%</span>
                      <p className="text-xs text-muted-foreground">1 proposal</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Villa Ocean View</span>
                    <div className="text-right">
                      <span className="font-semibold">20%</span>
                      <p className="text-xs text-muted-foreground">1 proposal</p>
                    </div>
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