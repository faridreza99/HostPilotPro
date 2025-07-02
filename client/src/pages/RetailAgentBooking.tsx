import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays } from "date-fns";
import { 
  Search, 
  Calendar, 
  Bed, 
  MapPin, 
  DollarSign, 
  Users, 
  Star,
  Wifi,
  Car,
  Waves,
  ChefHat,
  FilterX,
  ImageIcon,
  Phone,
  Mail,
  CalendarDays
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

// Booking form schema
const bookingSchema = z.object({
  propertyId: z.number(),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().min(1, "Phone number is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  totalGuests: z.number().min(1, "At least 1 guest required"),
  specialRequests: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface PropertyFilters {
  checkIn: string;
  checkOut: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  amenities: string[];
}

export default function RetailAgentBooking() {
  const [filters, setFilters] = useState<PropertyFilters>({
    checkIn: "",
    checkOut: "",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
    amenities: [],
  });
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available properties from Hostaway API
  const { data: availableProperties, isLoading } = useQuery({
    queryKey: ["/api/retail-agent/available-properties", filters],
    enabled: Boolean(filters.checkIn && filters.checkOut),
  });

  // Fetch agent commission rate
  const { data: agentProfile } = useQuery({
    queryKey: ["/api/retail-agent/profile"],
  });

  const bookingForm = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      totalGuests: 1,
    },
  });

  // Submit booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingForm) => {
      return await apiRequest("/api/retail-agent/create-booking", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/retail-agent/bookings"] });
      setShowBookingForm(false);
      setSelectedProperty(null);
      bookingForm.reset();
      toast({ title: "Booking created successfully! Commission will be tracked." });
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
      toast({ title: "Failed to create booking", variant: "destructive" });
    },
  });

  // Filter properties based on criteria
  const filteredProperties = useMemo(() => {
    if (!availableProperties) return [];
    
    return availableProperties.filter((property: any) => {
      const matchesBedrooms = !filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms);
      const matchesPrice = (!filters.minPrice || property.pricePerNight >= parseFloat(filters.minPrice)) &&
                          (!filters.maxPrice || property.pricePerNight <= parseFloat(filters.maxPrice));
      const matchesAmenities = filters.amenities.length === 0 || 
                              filters.amenities.every(amenity => property.amenities?.includes(amenity));
      
      return matchesBedrooms && matchesPrice && matchesAmenities;
    });
  }, [availableProperties, filters]);

  // Calculate commission for selected booking
  const calculateCommission = (totalAmount: number) => {
    const commissionRate = agentProfile?.commissionRate || 10;
    return {
      rate: commissionRate,
      amount: (totalAmount * commissionRate) / 100,
    };
  };

  const calculateStayDetails = () => {
    if (!filters.checkIn || !filters.checkOut || !selectedProperty) return null;
    
    const nights = differenceInDays(new Date(filters.checkOut), new Date(filters.checkIn));
    const totalAmount = nights * selectedProperty.pricePerNight;
    const commission = calculateCommission(totalAmount);
    
    return { nights, totalAmount, commission };
  };

  const clearFilters = () => {
    setFilters({
      checkIn: "",
      checkOut: "",
      bedrooms: "",
      minPrice: "",
      maxPrice: "",
      amenities: [],
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Retail Agent Booking Engine</h1>
        <p className="text-muted-foreground">
          Search available properties and create bookings with commission tracking
        </p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Property Search & Filters
              </CardTitle>
              <CardDescription>
                Filter properties by dates, bedrooms, price, and amenities
              </CardDescription>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              <FilterX className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="checkIn">Check-in Date</Label>
              <Input
                id="checkIn"
                type="date"
                value={filters.checkIn}
                onChange={(e) => setFilters(prev => ({ ...prev, checkIn: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Input
                id="checkOut"
                type="date"
                value={filters.checkOut}
                onChange={(e) => setFilters(prev => ({ ...prev, checkOut: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="bedrooms">Min Bedrooms</Label>
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Amenities Filter */}
          <div className="mt-4">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['wifi', 'pool', 'parking', 'kitchen', 'gym', 'beach_access'].map((amenity) => (
                <Button
                  key={amenity}
                  variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      amenities: prev.amenities.includes(amenity)
                        ? prev.amenities.filter(a => a !== amenity)
                        : [...prev.amenities, amenity]
                    }));
                  }}
                >
                  {amenity === 'wifi' && <Wifi className="h-4 w-4 mr-1" />}
                  {amenity === 'pool' && <Waves className="h-4 w-4 mr-1" />}
                  {amenity === 'parking' && <Car className="h-4 w-4 mr-1" />}
                  {amenity === 'kitchen' && <ChefHat className="h-4 w-4 mr-1" />}
                  {amenity.charAt(0).toUpperCase() + amenity.slice(1).replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Properties */}
      {filters.checkIn && filters.checkOut && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Available Properties ({filteredProperties?.length || 0})
            </h2>
            {isLoading && <Badge variant="outline">Loading...</Badge>}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties?.map((property: any) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{property.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.address}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedrooms} bed
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {property.maxGuests} guests
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">{property.rating || "4.5"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <div className="text-lg font-bold">${property.pricePerNight}/night</div>
                        <div className="text-sm text-green-600">
                          Your commission: {agentProfile?.commissionRate || 10}% 
                          (${((property.pricePerNight * (agentProfile?.commissionRate || 10)) / 100).toFixed(2)}/night)
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowBookingForm(true);
                          bookingForm.setValue('propertyId', property.id);
                          bookingForm.setValue('checkIn', filters.checkIn);
                          bookingForm.setValue('checkOut', filters.checkOut);
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedProperty && (
        <Card className="fixed inset-0 z-50 m-8 overflow-auto bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create Booking - {selectedProperty.name}</CardTitle>
                <CardDescription>
                  Complete the booking details and commission summary
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Booking Form */}
              <div>
                <h3 className="text-lg font-medium mb-4">Guest Information</h3>
                <Form {...bookingForm}>
                  <form onSubmit={bookingForm.handleSubmit((data) => createBookingMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={bookingForm.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guest Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bookingForm.control}
                      name="guestEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bookingForm.control}
                      name="guestPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 8900" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bookingForm.control}
                      name="totalGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Guests</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max={selectedProperty.maxGuests}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bookingForm.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requests (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Any special requirements..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={createBookingMutation.isPending}>
                      {createBookingMutation.isPending ? "Creating Booking..." : "Confirm Booking"}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Booking Summary */}
              <div>
                <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{selectedProperty.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {selectedProperty.address}
                        </div>
                        <div className="flex items-center mt-1">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          {format(new Date(filters.checkIn), "MMM dd")} - {format(new Date(filters.checkOut), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>

                    {calculateStayDetails() && (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between">
                          <span>Nights:</span>
                          <span>{calculateStayDetails()?.nights}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rate per night:</span>
                          <span>${selectedProperty.pricePerNight}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total Amount:</span>
                          <span>${calculateStayDetails()?.totalAmount}</span>
                        </div>
                        
                        <div className="pt-2 border-t bg-green-50 p-3 rounded">
                          <h5 className="font-medium text-green-800 mb-2">Your Commission</h5>
                          <div className="flex justify-between text-sm">
                            <span>Commission Rate:</span>
                            <span>{calculateStayDetails()?.commission.rate}%</span>
                          </div>
                          <div className="flex justify-between font-bold text-green-700">
                            <span>Commission Amount:</span>
                            <span>${calculateStayDetails()?.commission.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}