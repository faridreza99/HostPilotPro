import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Search, 
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Waves,
  TreePine,
  Bug,
  Wrench,
  Home,
  StickyNote,
  Filter
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";

interface ScheduledService {
  id: number;
  serviceName: string;
  serviceType: "pool" | "garden" | "pest" | "maintenance" | "cleaning";
  propertyName: string;
  scheduledDate: string;
  scheduledTime: string;
  frequency: "weekly" | "bi-weekly" | "monthly" | "one-time";
  assignedStaff: string;
  status: "scheduled" | "completed" | "skipped" | "cancelled";
  duration: string;
  cost: number;
  description: string;
  notes?: string;
  completedDate?: string;
  nextScheduled?: string;
}

export default function ServiceTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [filterServiceType, setFilterServiceType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedService, setSelectedService] = useState<ScheduledService | null>(null);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Mock scheduled services for assigned properties
  const mockScheduledServices: ScheduledService[] = [
    {
      id: 1,
      serviceName: "Pool Cleaning & Chemical Balance",
      serviceType: "pool",
      propertyName: "Villa Aruna",
      scheduledDate: "2024-01-19",
      scheduledTime: "09:00",
      frequency: "weekly",
      assignedStaff: "Pool Team - Moo",
      status: "scheduled",
      duration: "2 hours",
      cost: 1200,
      description: "Weekly pool cleaning, skimming, and chemical balance check",
      nextScheduled: "2024-01-26"
    },
    {
      id: 2,
      serviceName: "Garden Maintenance",
      serviceType: "garden",
      propertyName: "Villa Aruna",
      scheduledDate: "2024-01-20",
      scheduledTime: "07:00",
      frequency: "bi-weekly",
      assignedStaff: "Garden Team - Kla",
      status: "scheduled",
      duration: "3 hours",
      cost: 1800,
      description: "Lawn cutting, hedge trimming, and flower bed maintenance",
      nextScheduled: "2024-02-03"
    },
    {
      id: 3,
      serviceName: "Pest Control Treatment",
      serviceType: "pest",
      propertyName: "Villa Samui Breeze",
      scheduledDate: "2024-01-18",
      scheduledTime: "06:00",
      frequency: "monthly",
      assignedStaff: "Pest Control - Somchai",
      status: "completed",
      duration: "1.5 hours",
      cost: 2500,
      description: "Monthly pest control treatment for ants and mosquitoes",
      completedDate: "2024-01-18",
      nextScheduled: "2024-02-18",
      notes: "Treatment completed successfully. No active infestations found."
    },
    {
      id: 4,
      serviceName: "AC System Maintenance",
      serviceType: "maintenance",
      propertyName: "Villa Samui Breeze",
      scheduledDate: "2024-01-17",
      scheduledTime: "10:00",
      frequency: "monthly",
      assignedStaff: "AC Technician - Chai",
      status: "skipped",
      duration: "2 hours",
      cost: 3000,
      description: "Monthly AC filter cleaning and system check",
      nextScheduled: "2024-02-17",
      notes: "Villa not accessible - guest extended checkout time. Rescheduled to next week."
    },
    {
      id: 5,
      serviceName: "Deep Cleaning Service",
      serviceType: "cleaning",
      propertyName: "Villa Aruna",
      scheduledDate: "2024-01-21",
      scheduledTime: "11:00",
      frequency: "bi-weekly",
      assignedStaff: "Cleaning Team - Nok",
      status: "scheduled",
      duration: "4 hours",
      cost: 2200,
      description: "Deep cleaning including bathrooms, kitchen, and all surfaces",
      nextScheduled: "2024-02-04"
    }
  ];

  const { data: scheduledServices, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio/services'],
    initialData: mockScheduledServices
  });

  const addNotesMutation = useMutation({
    mutationFn: async ({ serviceId, notes, status }: { serviceId: number; notes: string; status?: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Notes added successfully",
        description: "Service notes have been updated.",
      });
      setNotesDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio/services'] });
    },
    onError: () => {
      toast({
        title: "Failed to add notes",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const properties = ["Villa Aruna", "Villa Samui Breeze"];
  const serviceTypes = ["pool", "garden", "pest", "maintenance", "cleaning"];
  const statuses = ["scheduled", "completed", "skipped", "cancelled"];

  const filteredServices = scheduledServices?.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = !filterProperty || service.propertyName === filterProperty;
    const matchesServiceType = !filterServiceType || service.serviceType === filterServiceType;
    const matchesStatus = !filterStatus || service.status === filterStatus;
    
    return matchesSearch && matchesProperty && matchesServiceType && matchesStatus;
  }) || [];

  const handleAddNotes = (service: ScheduledService) => {
    setSelectedService(service);
    setNotesDialogOpen(true);
  };

  const submitNotes = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedService) return;
    
    const formData = new FormData(event.currentTarget);
    const notes = formData.get('notes') as string;
    const status = formData.get('status') as string;
    
    addNotesMutation.mutate({
      serviceId: selectedService.id,
      notes,
      status: status !== selectedService.status ? status : undefined
    });
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'pool': return <Waves className="h-4 w-4" />;
      case 'garden': return <TreePine className="h-4 w-4" />;
      case 'pest': return <Bug className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'cleaning': return <Home className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'skipped': return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'skipped': return 'bg-orange-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Group services by date for calendar view
  const groupedByDate = filteredServices.reduce((acc, service) => {
    const date = service.scheduledDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(service);
    return acc;
  }, {} as Record<string, ScheduledService[]>);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading scheduled services. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/pm/dashboard">Portfolio Manager</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Service Tracker</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Service Tracker</h1>
          <p className="text-muted-foreground">
            Monitor scheduled services across your assigned properties
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            List View
          </Button>
          <Button 
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
          >
            Calendar View
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{scheduledServices?.filter(s => s.status === 'scheduled').length || 0}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{scheduledServices?.filter(s => s.status === 'completed').length || 0}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{scheduledServices?.filter(s => s.status === 'skipped').length || 0}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Waves className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{scheduledServices?.filter(s => s.serviceType === 'pool').length || 0}</p>
                <p className="text-xs text-muted-foreground">Pool Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TreePine className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{scheduledServices?.filter(s => s.serviceType === 'garden').length || 0}</p>
                <p className="text-xs text-muted-foreground">Garden Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterProperty} onValueChange={setFilterProperty}>
          <SelectTrigger>
            <SelectValue placeholder="All properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All properties</SelectItem>
            {properties.map(property => (
              <SelectItem key={property} value={property}>{property}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterServiceType} onValueChange={setFilterServiceType}>
          <SelectTrigger>
            <SelectValue placeholder="All service types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All service types</SelectItem>
            {serviceTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={() => {
          setSearchTerm("");
          setFilterProperty("");
          setFilterServiceType("");
          setFilterStatus("");
        }}>
          Clear Filters
        </Button>
      </div>

      {/* Services Display */}
      {viewMode === "list" ? (
        // List View
        filteredServices.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No services found</h3>
                <p className="text-muted-foreground">
                  {scheduledServices?.length === 0 
                    ? "No services have been scheduled yet." 
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="border-l-4" style={{
                borderLeftColor: service.serviceType === 'pool' ? '#3b82f6' : 
                                service.serviceType === 'garden' ? '#16a34a' :
                                service.serviceType === 'pest' ? '#dc2626' :
                                service.serviceType === 'maintenance' ? '#f59e0b' : '#8b5cf6'
              }}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {getServiceIcon(service.serviceType)}
                        {service.serviceName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {service.propertyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {service.scheduledDate} at {service.scheduledTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {service.duration}
                        </span>
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(service.status)}>
                        {getStatusIcon(service.status)}
                        {service.status}
                      </Badge>
                      <Badge variant="outline">
                        {service.frequency}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span>{service.assignedStaff}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cost:</span>
                        <span>${service.cost.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {service.nextScheduled && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Next scheduled:</span>
                          <span>{service.nextScheduled}</span>
                        </div>
                      )}
                      {service.completedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Completed:</span>
                          <span>{service.completedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {service.notes && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm"><strong>Notes:</strong> {service.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddNotes(service)}
                    >
                      <StickyNote className="h-4 w-4 mr-2" />
                      Add Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        // Calendar View
        <div className="space-y-4">
          {Object.keys(groupedByDate).length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No services scheduled</h3>
                  <p className="text-muted-foreground">No services found for the selected filters.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedByDate)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, services]) => (
                <Card key={date}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getServiceIcon(service.serviceType)}
                            <div>
                              <p className="font-medium">{service.serviceName}</p>
                              <p className="text-sm text-muted-foreground">
                                {service.propertyName} • {service.scheduledTime} • {service.assignedStaff}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAddNotes(service)}
                            >
                              <StickyNote className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}

      {/* Add Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Service Notes</DialogTitle>
            <DialogDescription>
              Add notes and update status for: {selectedService?.serviceName}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={submitNotes} className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={selectedService?.status} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="skipped">Skipped</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                name="notes" 
                placeholder="Add notes about the service (e.g., reasons for skipping, completion details, issues encountered)..."
                defaultValue={selectedService?.notes}
                rows={4}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNotesDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addNotesMutation.isPending}>
                {addNotesMutation.isPending ? "Saving..." : "Save Notes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}