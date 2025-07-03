import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Utensils,
  Car,
  Waves,
  Shirt,
  Gift,
  Settings
} from "lucide-react";

interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

interface AddonService {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName?: string;
  defaultPrice: number;
  pricingType: string;
  currency: string;
  estimatedDuration: number;
  isActive: boolean;
  requiresQuote: boolean;
  canCreateTask: boolean;
  taskDepartment: string;
  availabilityNotes: string;
}

interface ServiceBooking {
  id: number;
  propertyId: number;
  propertyName?: string;
  serviceId: number;
  serviceName?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  bookingDate: string;
  bookingTime: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  paymentRoute: string;
  complimentaryType?: string;
  status: string;
  specialRequests: string;
  createdByType: string;
  assignedTaskId?: number;
  createdAt: string;
}

const categoryIcons: Record<string, any> = {
  'Cleaning': Sparkles,
  'Massage': User,
  'Chef': Utensils,
  'Transport': Car,
  'Pool': Waves,
  'Laundry': Shirt,
  'Tours': MapPin,
  'Baby Setup': Gift,
  'Default': Settings
};

const paymentRouteOptions = [
  { value: 'guest_paid', label: 'Guest Paid', color: 'bg-blue-100 text-blue-800' },
  { value: 'owner_paid', label: 'Owner Paid', color: 'bg-green-100 text-green-800' },
  { value: 'company_paid', label: 'Company Paid', color: 'bg-purple-100 text-purple-800' },
  { value: 'complimentary', label: 'Complimentary', color: 'bg-orange-100 text-orange-800' }
];

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
];

export default function AddonServicesBooking() {
  const [activeTab, setActiveTab] = useState("guest-booking");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<AddonService | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<AddonService | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentRoute, setFilterPaymentRoute] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch service categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/addon-services/categories"]
  });

  // Fetch properties for selection
  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties"]
  });

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ["/api/addon-services"]
  });

  // Fetch bookings
  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/addon-services/bookings"]
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return apiRequest("POST", "/api/addon-services/bookings", bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addon-services/bookings"] });
      toast({
        title: "Booking Created",
        description: "Service booking has been created successfully.",
      });
      setIsBookingDialogOpen(false);
      setSelectedService(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create/update service mutation
  const saveServiceMutation = useMutation({
    mutationFn: async (serviceData: any) => {
      if (editingService?.id) {
        return apiRequest("PUT", `/api/addon-services/${editingService.id}`, serviceData);
      } else {
        return apiRequest("POST", "/api/addon-services", serviceData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addon-services"] });
      toast({
        title: editingService ? "Service Updated" : "Service Created",
        description: `Service has been ${editingService ? 'updated' : 'created'} successfully.`,
      });
      setIsServiceDialogOpen(false);
      setEditingService(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${editingService ? 'update' : 'create'} service. Please try again.`,
        variant: "destructive",
      });
    },
  });

  // Update booking status mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return apiRequest("PUT", `/api/addon-services/bookings/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addon-services/bookings"] });
      toast({
        title: "Booking Updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter services by category
  const filteredServices = selectedCategory 
    ? services.filter((service: AddonService) => service.categoryId === selectedCategory)
    : services;

  // Filter bookings
  const filteredBookings = bookings.filter((booking: ServiceBooking) => {
    const matchesSearch = searchQuery === "" || 
      booking.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesPaymentRoute = filterPaymentRoute === "all" || booking.paymentRoute === filterPaymentRoute;
    
    return matchesSearch && matchesStatus && matchesPaymentRoute;
  });

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedService || !selectedProperty) return;

    const formData = new FormData(e.currentTarget);
    const bookingData = {
      propertyId: selectedProperty,
      serviceId: selectedService.id,
      guestName: formData.get('guestName'),
      guestEmail: formData.get('guestEmail'),
      guestPhone: formData.get('guestPhone'),
      bookingDate: formData.get('bookingDate'),
      bookingTime: formData.get('bookingTime'),
      quantity: parseInt(formData.get('quantity') as string) || 1,
      totalPrice: parseFloat(formData.get('totalPrice') as string) || selectedService.defaultPrice,
      currency: selectedService.currency,
      paymentRoute: formData.get('paymentRoute'),
      complimentaryType: formData.get('paymentRoute') === 'complimentary' ? formData.get('complimentaryType') : null,
      specialRequests: formData.get('specialRequests'),
      createdByType: 'staff'
    };

    createBookingMutation.mutate(bookingData);
  };

  const handleServiceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const serviceData = {
      name: formData.get('name'),
      description: formData.get('description'),
      categoryId: parseInt(formData.get('categoryId') as string),
      defaultPrice: parseFloat(formData.get('defaultPrice') as string),
      pricingType: formData.get('pricingType'),
      currency: formData.get('currency') || 'AUD',
      estimatedDuration: parseInt(formData.get('estimatedDuration') as string),
      requiresQuote: formData.get('requiresQuote') === 'true',
      canCreateTask: formData.get('canCreateTask') === 'true',
      taskDepartment: formData.get('taskDepartment'),
      availabilityNotes: formData.get('availabilityNotes'),
      isActive: true
    };

    saveServiceMutation.mutate(serviceData);
  };

  const getPaymentRouteColor = (route: string) => {
    return paymentRouteOptions.find(option => option.value === route)?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(option => option.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName] || categoryIcons['Default'];
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Add-On Services Booking</h1>
          <p className="text-muted-foreground">
            Manage guest service bookings and routing system
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guest-booking" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Guest Booking
          </TabsTrigger>
          <TabsTrigger value="booking-management" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Booking Management
          </TabsTrigger>
          <TabsTrigger value="service-management" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Service Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Financial Tracking
          </TabsTrigger>
        </TabsList>

        {/* Guest Booking Tab */}
        <TabsContent value="guest-booking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Service Categories */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Service Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Services
                </Button>
                {categories.map((category: ServiceCategory) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {getCategoryIcon(category.name)}
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Available Services */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
                <div className="flex gap-4">
                  <Select value={selectedProperty?.toString() || ""} onValueChange={(value) => setSelectedProperty(parseInt(value))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property: any) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service: AddonService) => (
                    <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          {service.requiresQuote ? (
                            <Badge variant="outline">Quote Required</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">
                              ${service.defaultPrice} {service.currency}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {service.estimatedDuration}min
                          </span>
                          <span>{service.taskDepartment}</span>
                        </div>
                        {service.availabilityNotes && (
                          <p className="text-xs text-blue-600 mb-3">{service.availabilityNotes}</p>
                        )}
                        <Button
                          className="w-full"
                          onClick={() => {
                            if (!selectedProperty) {
                              toast({
                                title: "Select Property",
                                description: "Please select a property first.",
                                variant: "destructive",
                              });
                              return;
                            }
                            setSelectedService(service);
                            setIsBookingDialogOpen(true);
                          }}
                          disabled={!selectedProperty}
                        >
                          {service.requiresQuote ? "Request Quote" : "Book Now"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Booking Management Tab */}
        <TabsContent value="booking-management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <div className="flex gap-4 flex-wrap">
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterPaymentRoute} onValueChange={setFilterPaymentRoute}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Routes</SelectItem>
                    {paymentRouteOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBookings.map((booking: ServiceBooking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{booking.serviceName}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <Badge className={getPaymentRouteColor(booking.paymentRoute)}>
                              {paymentRouteOptions.find(opt => opt.value === booking.paymentRoute)?.label}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {booking.guestName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {booking.propertyName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {booking.bookingDate} {booking.bookingTime}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            ${booking.totalPrice} {booking.currency}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Select 
                              value={booking.status} 
                              onValueChange={(newStatus) => {
                                updateBookingMutation.mutate({
                                  id: booking.id,
                                  updates: { status: newStatus }
                                });
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      {booking.specialRequests && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Special Requests:</strong> {booking.specialRequests}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Management Tab */}
        <TabsContent value="service-management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Service Management
                <Button onClick={() => setIsServiceDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service: AddonService) => (
                  <Card key={service.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingService(service);
                              setIsServiceDialogOpen(true);
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span>${service.defaultPrice} {service.currency}</span>
                        <span>{service.pricingType}</span>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {service.taskDepartment}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue This Month</p>
                    <p className="text-2xl font-bold">
                      ${bookings.reduce((sum: number, booking: ServiceBooking) => sum + booking.totalPrice, 0).toFixed(2)}
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
                    <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                    <p className="text-2xl font-bold">{services.filter((s: AddonService) => s.isActive).length}</p>
                  </div>
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Route Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentRouteOptions.map(route => {
                  const routeBookings = bookings.filter((b: ServiceBooking) => b.paymentRoute === route.value);
                  const routeTotal = routeBookings.reduce((sum: number, booking: ServiceBooking) => sum + booking.totalPrice, 0);
                  
                  return (
                    <div key={route.value} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={route.color}>{route.label}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {routeBookings.length} bookings
                        </span>
                      </div>
                      <div className="font-semibold">
                        ${routeTotal.toFixed(2)} AUD
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Service: {selectedService?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestName">Guest Name</Label>
                <Input id="guestName" name="guestName" required />
              </div>
              <div>
                <Label htmlFor="guestEmail">Email</Label>
                <Input id="guestEmail" name="guestEmail" type="email" required />
              </div>
            </div>
            
            <div>
              <Label htmlFor="guestPhone">Phone</Label>
              <Input id="guestPhone" name="guestPhone" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bookingDate">Date</Label>
                <Input id="bookingDate" name="bookingDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="bookingTime">Time</Label>
                <Input id="bookingTime" name="bookingTime" type="time" required />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" />
              </div>
              <div>
                <Label htmlFor="totalPrice">Total Price</Label>
                <Input id="totalPrice" name="totalPrice" type="number" step="0.01" defaultValue={selectedService?.defaultPrice} />
              </div>
            </div>
            
            <div>
              <Label htmlFor="paymentRoute">Payment Route</Label>
              <Select name="paymentRoute" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment route" />
                </SelectTrigger>
                <SelectContent>
                  {paymentRouteOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea id="specialRequests" name="specialRequests" />
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createBookingMutation.isPending}>
                {createBookingMutation.isPending ? "Creating..." : "Create Booking"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={editingService?.name || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select name="categoryId" defaultValue={editingService?.categoryId?.toString() || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: ServiceCategory) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={editingService?.description || ""} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="defaultPrice">Default Price</Label>
                <Input 
                  id="defaultPrice" 
                  name="defaultPrice" 
                  type="number" 
                  step="0.01" 
                  defaultValue={editingService?.defaultPrice || ""} 
                />
              </div>
              <div>
                <Label htmlFor="pricingType">Pricing Type</Label>
                <Select name="pricingType" defaultValue={editingService?.pricingType || "fixed"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                    <SelectItem value="per_person">Per Person</SelectItem>
                    <SelectItem value="quote_required">Quote Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estimatedDuration">Duration (min)</Label>
                <Input 
                  id="estimatedDuration" 
                  name="estimatedDuration" 
                  type="number" 
                  defaultValue={editingService?.estimatedDuration || ""} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taskDepartment">Task Department</Label>
                <Select name="taskDepartment" defaultValue={editingService?.taskDepartment || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="pool">Pool</SelectItem>
                    <SelectItem value="garden">Garden</SelectItem>
                    <SelectItem value="front-desk">Front Desk</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select name="currency" defaultValue={editingService?.currency || "AUD"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUD">AUD</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="THB">THB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="availabilityNotes">Availability Notes</Label>
              <Textarea 
                id="availabilityNotes" 
                name="availabilityNotes" 
                defaultValue={editingService?.availabilityNotes || ""} 
                placeholder="e.g., Available 9 AM - 6 PM, Book 24h in advance"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="requiresQuote" 
                  value="true"
                  defaultChecked={editingService?.requiresQuote || false}
                />
                <span className="text-sm">Requires Quote</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="canCreateTask" 
                  value="true"
                  defaultChecked={editingService?.canCreateTask !== false}
                />
                <span className="text-sm">Auto-create Task</span>
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsServiceDialogOpen(false);
                  setEditingService(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveServiceMutation.isPending}>
                {saveServiceMutation.isPending ? "Saving..." : (editingService ? "Update" : "Create")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}