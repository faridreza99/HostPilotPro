import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Wrench, Calendar, AlertTriangle, DollarSign, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/currency";

// Form schemas
const applianceSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  applianceType: z.string().min(1, "Appliance type is required"),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  installDate: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  notes: z.string().optional(),
});

const repairSchema = z.object({
  applianceId: z.string().min(1, "Appliance is required"),
  issueReported: z.string().min(1, "Issue description is required"),
  fixDescription: z.string().optional(),
  technicianName: z.string().optional(),
  repairCost: z.string().optional(),
  receiptUrl: z.string().optional(),
  repairedAt: z.string().optional(),
});

const applianceTypes = [
  "Refrigerator", "Washing Machine", "Air Conditioner", "Dishwasher", 
  "Microwave", "Oven", "Water Heater", "TV", "Pool Pump", "Generator",
  "Coffee Machine", "Dryer", "Freezer", "Electric Stove", "WiFi Router"
];

export default function PropertyAppliancesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [applianceDialogOpen, setApplianceDialogOpen] = useState(false);
  const [repairDialogOpen, setRepairDialogOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: appliances = [] } = useQuery({
    queryKey: ["/api/appliances"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: repairs = [] } = useQuery({
    queryKey: ["/api/appliance-repairs"],
    staleTime: 5 * 60 * 1000,
  });

  // Forms
  const applianceForm = useForm({
    resolver: zodResolver(applianceSchema),
    defaultValues: {
      propertyId: "",
      applianceType: "",
      brand: "",
      model: "",
      serialNumber: "",
      installDate: "",
      warrantyExpiry: "",
      notes: "",
    },
  });

  const repairForm = useForm({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      applianceId: "",
      issueReported: "",
      fixDescription: "",
      technicianName: "",
      repairCost: "",
      receiptUrl: "",
      repairedAt: "",
    },
  });

  // Mutations
  const createApplianceMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/appliances", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appliances"] });
      toast({ title: "Appliance added successfully" });
      setApplianceDialogOpen(false);
      applianceForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add appliance", variant: "destructive" });
    },
  });

  const createRepairMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/appliance-repairs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appliance-repairs"] });
      toast({ title: "Repair record added successfully" });
      setRepairDialogOpen(false);
      repairForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add repair record", variant: "destructive" });
    },
  });

  // Filter appliances
  const filteredAppliances = appliances.filter((appliance: any) => {
    const matchesSearch = appliance.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appliance.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appliance.applianceType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = selectedProperty === "all" || appliance.propertyId?.toString() === selectedProperty;
    const matchesType = selectedType === "all" || appliance.applianceType === selectedType;
    
    return matchesSearch && matchesProperty && matchesType;
  });

  // Get property name
  const getPropertyName = (propertyId: number) => {
    const property = properties.find((p: any) => p.id === propertyId);
    return property?.name || "Unknown Property";
  };

  // Get appliance name
  const getApplianceName = (applianceId: number) => {
    const appliance = appliances.find((a: any) => a.id === applianceId);
    return appliance ? `${appliance.applianceType} - ${appliance.brand || "Unknown Brand"}` : "Unknown Appliance";
  };

  // Check warranty status
  const getWarrantyStatus = (warrantyExpiry: string) => {
    if (!warrantyExpiry) return null;
    const now = new Date();
    const expiry = new Date(warrantyExpiry);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: "expired", days: Math.abs(diffDays) };
    if (diffDays <= 30) return { status: "expiring", days: diffDays };
    return { status: "active", days: diffDays };
  };

  const onCreateAppliance = (data: any) => {
    createApplianceMutation.mutate({
      ...data,
      propertyId: parseInt(data.propertyId),
      installDate: data.installDate || null,
      warrantyExpiry: data.warrantyExpiry || null,
    });
  };

  const onCreateRepair = (data: any) => {
    createRepairMutation.mutate({
      ...data,
      applianceId: parseInt(data.applianceId),
      repairCost: data.repairCost ? parseFloat(data.repairCost) : null,
      repairedAt: data.repairedAt || null,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Property Appliances Management</h1>
          <p className="text-muted-foreground">
            Track appliances and maintenance records across all properties
          </p>
        </div>
      </div>

      <Tabs defaultValue="appliances" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appliances">Appliances Registry</TabsTrigger>
          <TabsTrigger value="repairs">Repair History</TabsTrigger>
          <TabsTrigger value="analytics">Warranty Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="appliances" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appliances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by property" />
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
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {applianceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={applianceDialogOpen} onOpenChange={setApplianceDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Appliance
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Appliance</DialogTitle>
                </DialogHeader>
                <Form {...applianceForm}>
                  <form onSubmit={applianceForm.handleSubmit(onCreateAppliance)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={applianceForm.control}
                        name="propertyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {properties.map((property: any) => (
                                  <SelectItem key={property.id} value={property.id.toString()}>
                                    {property.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={applianceForm.control}
                        name="applianceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Appliance Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {applianceTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={applianceForm.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Samsung, LG" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={applianceForm.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input placeholder="Model number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={applianceForm.control}
                        name="serialNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Serial Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Serial number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={applianceForm.control}
                        name="installDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Install Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={applianceForm.control}
                      name="warrantyExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty Expiry</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={applianceForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional notes about the appliance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setApplianceDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createApplianceMutation.isPending}>
                        {createApplianceMutation.isPending ? "Adding..." : "Add Appliance"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredAppliances.map((appliance: any) => {
              const warrantyStatus = getWarrantyStatus(appliance.warrantyExpiry);
              return (
                <Card key={appliance.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {appliance.applianceType}
                          {warrantyStatus?.status === "expired" && (
                            <Badge variant="destructive">Warranty Expired</Badge>
                          )}
                          {warrantyStatus?.status === "expiring" && (
                            <Badge variant="secondary">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Expires in {warrantyStatus.days} days
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {getPropertyName(appliance.propertyId)} • {appliance.brand} {appliance.model}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedAppliance(appliance);
                          repairForm.setValue("applianceId", appliance.id.toString());
                          setRepairDialogOpen(true);
                        }}
                      >
                        <Wrench className="h-4 w-4 mr-2" />
                        Add Repair
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Serial Number</p>
                        <p className="text-muted-foreground">{appliance.serialNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Install Date</p>
                        <p className="text-muted-foreground">
                          {appliance.installDate ? new Date(appliance.installDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Warranty Expiry</p>
                        <p className="text-muted-foreground">
                          {appliance.warrantyExpiry ? new Date(appliance.warrantyExpiry).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Repairs</p>
                        <p className="text-muted-foreground">
                          {repairs.filter((r: any) => r.applianceId === appliance.id).length} recorded
                        </p>
                      </div>
                    </div>
                    {appliance.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm">{appliance.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="repairs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Repair History</CardTitle>
              <CardDescription>All appliance repairs across properties</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Appliance</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repairs.map((repair: any) => (
                    <TableRow key={repair.id}>
                      <TableCell>
                        {repair.repairedAt ? new Date(repair.repairedAt).toLocaleDateString() : "Pending"}
                      </TableCell>
                      <TableCell>{getApplianceName(repair.applianceId)}</TableCell>
                      <TableCell className="max-w-md truncate">{repair.issueReported}</TableCell>
                      <TableCell>{repair.technicianName || "N/A"}</TableCell>
                      <TableCell>
                        {repair.repairCost ? formatCurrency(repair.repairCost) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={repair.repairedAt ? "default" : "secondary"}>
                          {repair.repairedAt ? "Completed" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appliances</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appliances.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across {properties.length} properties
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Warranties Expiring</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appliances.filter((a: any) => {
                    const status = getWarrantyStatus(a.warrantyExpiry);
                    return status?.status === "expiring";
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Within 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Repair Costs</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    repairs.reduce((sum: number, repair: any) => 
                      sum + (repair.repairCost ? parseFloat(repair.repairCost) : 0), 0
                    )
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {repairs.length} repairs recorded
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Repair Dialog */}
      <Dialog open={repairDialogOpen} onOpenChange={setRepairDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Repair Record</DialogTitle>
          </DialogHeader>
          <Form {...repairForm}>
            <form onSubmit={repairForm.handleSubmit(onCreateRepair)} className="space-y-4">
              <FormField
                control={repairForm.control}
                name="issueReported"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the issue that was reported" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={repairForm.control}
                name="fixDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fix Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe what was done to fix the issue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={repairForm.control}
                  name="technicianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technician Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Who performed the repair" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={repairForm.control}
                  name="repairCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repair Cost (฿)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={repairForm.control}
                  name="receiptUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receipt URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Link to receipt or invoice" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={repairForm.control}
                  name="repairedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repair Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setRepairDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createRepairMutation.isPending}>
                  {createRepairMutation.isPending ? "Adding..." : "Add Repair"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}