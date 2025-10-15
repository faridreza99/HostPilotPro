import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Bed, User, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface Property {
  id: number;
  name: string;
  bedrooms?: number;
  location?: string;
}

interface Booking {
  id: number;
  propertyId: number;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

export default function MultiPropertyCalendar() {
  const [search, setSearch] = useState('');
  const [filterProperty, setFilterProperty] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Fetch bookings
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Generate dates for horizontal scroll (30 days from today)
  const dates = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));
  }, []);

  // Filter properties
  const filteredProperties = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterProperty === 'all' || p.id.toString() === filterProperty)
  );

  // Get bookings for a property on a specific date
  const getBookingForDate = (propertyId: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.find((b) => {
      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      const currentDate = new Date(dateStr);
      return b.propertyId === propertyId && currentDate >= checkIn && currentDate < checkOut;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-500';
      case 'pending':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Multi-Property Calendar</h1>
            <Badge variant="outline" className="text-blue-600">
              Horizontal Timeline View
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Property</label>
                <Input
                  type="text"
                  placeholder="Search property name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-search-property"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Property</label>
                <Select value={filterProperty} onValueChange={setFilterProperty}>
                  <SelectTrigger data-testid="select-filter-property">
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horizontal Timeline Calendar */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Date Header */}
                <div className="flex border-b sticky top-0 bg-white dark:bg-gray-900 z-10">
                  <div className="w-64 flex-shrink-0 border-r p-4 font-semibold bg-gray-50 dark:bg-gray-800">
                    Property
                  </div>
                  {dates.map((date, i) => (
                    <div
                      key={i}
                      className="w-32 flex-shrink-0 border-r p-2 text-center text-sm"
                    >
                      <div className="font-semibold">{format(date, 'EEE')}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(date, 'MMM d')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Property Rows */}
                {filteredProperties.length === 0 ? (
                  <div className="p-12 text-center">
                    <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">No properties found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search criteria
                    </p>
                  </div>
                ) : (
                  filteredProperties.map((property) => (
                    <div key={property.id} className="flex border-b hover:bg-muted/30 transition-colors">
                      {/* Property Info */}
                      <div className="w-64 flex-shrink-0 border-r p-4 bg-gray-50 dark:bg-gray-800">
                        <div className="font-medium text-sm mb-1">{property.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {property.bedrooms && (
                            <div className="flex items-center gap-1">
                              <Bed className="w-3 h-3" />
                              <span>{property.bedrooms} BR</span>
                            </div>
                          )}
                          {property.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{property.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date Cells */}
                      {dates.map((date, i) => {
                        const booking = getBookingForDate(property.id, date);
                        return (
                          <div
                            key={i}
                            className="w-32 flex-shrink-0 border-r p-1 relative group"
                            data-testid={`cell-${property.id}-${i}`}
                          >
                            {booking ? (
                              <div
                                className={`h-full rounded px-2 py-1 text-white text-xs ${getStatusColor(
                                  booking.status
                                )}`}
                                title={`${booking.guestName}\n${booking.checkIn} - ${booking.checkOut}\nStatus: ${booking.status}`}
                              >
                                <div className="font-medium truncate">{booking.guestName}</div>
                                <div className="text-[10px] opacity-90">{booking.status}</div>
                              </div>
                            ) : (
                              <div className="h-full bg-gray-100 dark:bg-gray-700/30 rounded opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-6 text-sm">
              <span className="font-medium">Status Legend:</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span>Cancelled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredProperties.length} of {properties.length} properties</span>
              <span>Total bookings: {bookings.length}</span>
              <span>Viewing next 30 days</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
