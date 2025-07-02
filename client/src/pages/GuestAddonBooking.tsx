import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, DollarSign, Star, Users, MapPin } from "lucide-react";
import type { GuestAddonService, Property } from "@shared/schema";

export default function GuestAddonBooking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedService, setSelectedService] = useState<GuestAddonService | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<Date>();
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    quantity: 1
  });
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch available services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/guest-addon-services", { category: categoryFilter !== "all" ? categoryFilter : undefined, isActive: true }],
  });

  // Fetch properties for selection
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return apiRequest("POST", "/api/guest-addon-bookings", bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Submitted",
        description: "Your add-on service request has been submitted and is pending approval.",
      });
      setSelectedService(null);
      setGuestDetails({
        name: "",
        email: "",
        phone: "",
        specialRequests: "",
        quantity: 1
      });
      setServiceDate(undefined);
      queryClient.invalidateQueries({ queryKey: ["/api/guest-addon-bookings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBookService = async () => {
    if (!selectedService || !serviceDate || !selectedProperty || !guestDetails.name || !guestDetails.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = parseFloat(selectedService.basePrice) * guestDetails.quantity;

    const bookingData = {
      serviceId: selectedService.id,
      propertyId: parseInt(selectedProperty),
      guestName: guestDetails.name,
      guestEmail: guestDetails.email,
      guestPhone: guestDetails.phone,
      bookingDate: new Date().toISOString(),
      serviceDate: serviceDate.toISOString(),
      totalAmount: totalAmount.toFixed(2),
      currency: selectedService.currency,
      billingRoute: "guest_billable", // Default for guest bookings
      specialRequests: guestDetails.specialRequests,
      bookedBy: user?.id,
    };

    createBookingMutation.mutate(bookingData);
  };

  const categories = [
    { value: "all", label: "All Services" },
    { value: "wellness", label: "Wellness & Spa" },
    { value: "transport", label: "Transportation" },
    { value: "cleaning", label: "Cleaning Services" },
    { value: "catering", label: "Catering & Food" },
    { value: "entertainment", label: "Entertainment" },
    { value: "concierge", label: "Concierge Services" },
  ];

  if (servicesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Add-On Services</h1>
          <p className="text-muted-foreground">Book additional services for your stay</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-4 items-center">
        <Label htmlFor="category">Filter by Category:</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service: GuestAddonService) => (
          <Card key={service.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedService(service)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {service.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${service.basePrice}</div>
                  <div className="text-sm text-muted-foreground">{service.currency}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {service.description}
              </CardDescription>
              <div className="space-y-2 text-sm">
                {service.requiresTimeSlot && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Time slot required</span>
                  </div>
                )}
                {service.cancellationPolicyHours && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Cancel up to {service.cancellationPolicyHours}h before</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Services Available</h3>
          <p className="text-muted-foreground">No add-on services are currently available for booking.</p>
        </div>
      )}

      {/* Booking Form Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Book {selectedService.serviceName}</CardTitle>
              <CardDescription>
                ${selectedService.basePrice} {selectedService.currency}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="property">Property</Label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="serviceDate">Service Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {serviceDate ? format(serviceDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={serviceDate}
                      onSelect={setServiceDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="guestName">Guest Name</Label>
                <Input
                  id="guestName"
                  value={guestDetails.name}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                />
              </div>

              <div>
                <Label htmlFor="guestEmail">Email</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="guestPhone">Phone (Optional)</Label>
                <Input
                  id="guestPhone"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={guestDetails.quantity}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={guestDetails.specialRequests}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>${(parseFloat(selectedService.basePrice) * guestDetails.quantity).toFixed(2)} {selectedService.currency}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedService(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBookService}
                  disabled={createBookingMutation.isPending}
                  className="flex-1"
                >
                  {createBookingMutation.isPending ? "Booking..." : "Request Booking"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}