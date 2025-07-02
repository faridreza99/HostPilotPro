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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Settings,
  Calendar,
  Phone,
  Mail,
  FileText,
  CreditCard
} from "lucide-react";
import type { GuestAddonBooking, GuestAddonService, Property, User as UserType } from "@shared/schema";

export default function AdminAddonBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedBooking, setSelectedBooking] = useState<GuestAddonBooking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [billingFilter, setBillingFilter] = useState<string>("all");
  const [internalNotes, setInternalNotes] = useState("");

  // Fetch bookings with filters
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/guest-addon-bookings", { 
      status: statusFilter !== "all" ? statusFilter : undefined,
      billingRoute: billingFilter !== "all" ? billingFilter : undefined
    }],
  });

  // Fetch services for display
  const { data: services = [] } = useQuery({
    queryKey: ["/api/guest-addon-services"],
  });

  // Fetch properties for display
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Fetch staff users for assignment
  const { data: staffUsers = [] } = useQuery<UserType[]>({
    queryKey: ["/api/users", { role: "staff" }],
  });

  // Update booking status mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PATCH", `/api/guest-addon-bookings/${id}`, data);
    },
    onSuccess: (_, { data }) => {
      toast({
        title: "Booking Updated",
        description: `Booking ${data.status === "confirmed" ? "confirmed" : data.status === "cancelled" ? "cancelled" : "updated"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/guest-addon-bookings"] });
      setSelectedBooking(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Confirm booking
  const handleConfirmBooking = (booking: GuestAddonBooking) => {
    updateBookingMutation.mutate({
      id: booking.id,
      data: {
        status: "confirmed",
        confirmedBy: user?.id,
        internalNotes: internalNotes || booking.internalNotes
      }
    });
  };

  // Cancel booking
  const handleCancelBooking = (booking: GuestAddonBooking, reason: string) => {
    updateBookingMutation.mutate({
      id: booking.id,
      data: {
        status: "cancelled",
        cancelledBy: user?.id,
        cancellationReason: reason,
        internalNotes: internalNotes || booking.internalNotes
      }
    });
  };

  // Complete booking
  const handleCompleteBooking = (booking: GuestAddonBooking) => {
    updateBookingMutation.mutate({
      id: booking.id,
      data: {
        status: "completed",
        internalNotes: internalNotes || booking.internalNotes
      }
    });
  };

  // Update billing route
  const handleUpdateBilling = (booking: GuestAddonBooking, billingRoute: string, complimentaryType?: string) => {
    updateBookingMutation.mutate({
      id: booking.id,
      data: {
        billingRoute,
        complimentaryType,
        internalNotes: internalNotes || booking.internalNotes
      }
    });
  };

  const getService = (serviceId: number) => {
    return services.find((s: GuestAddonService) => s.id === serviceId);
  };

  const getProperty = (propertyId: number) => {
    return properties.find((p: Property) => p.id === propertyId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case "confirmed":
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case "completed":
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getBillingBadge = (billingRoute: string, complimentaryType?: string) => {
    switch (billingRoute) {
      case "guest_billable":
        return <Badge variant="default">Guest Paid</Badge>;
      case "owner_billable":
        return <Badge variant="secondary">Owner Charge</Badge>;
      case "company_expense":
        return <Badge variant="outline">Company Expense</Badge>;
      case "complimentary":
        return <Badge variant="outline" className="text-green-600">
          {complimentaryType === "owner_gift" ? "Owner Gift" : "Company Gift"}
        </Badge>;
      default:
        return <Badge variant="secondary">{billingRoute}</Badge>;
    }
  };

  if (bookingsLoading) {
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
          <h1 className="text-3xl font-bold">Add-On Service Bookings</h1>
          <p className="text-muted-foreground">Manage guest add-on service requests and bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <Label htmlFor="status">Status:</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <Label htmlFor="billing">Billing:</Label>
          <Select value={billingFilter} onValueChange={setBillingFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Billing Types</SelectItem>
              <SelectItem value="guest_billable">Guest Paid</SelectItem>
              <SelectItem value="owner_billable">Owner Charge</SelectItem>
              <SelectItem value="company_expense">Company Expense</SelectItem>
              <SelectItem value="complimentary">Complimentary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Bookings</CardTitle>
          <CardDescription>
            All guest add-on service requests and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Service Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking: GuestAddonBooking) => {
                const service = getService(booking.serviceId);
                const property = getProperty(booking.propertyId);
                
                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service?.serviceName || "Unknown Service"}</div>
                        <div className="text-sm text-muted-foreground">{service?.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.guestName}</div>
                        <div className="text-sm text-muted-foreground">{booking.guestEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{property?.name || "Unknown Property"}</TableCell>
                    <TableCell>{format(new Date(booking.serviceDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>${booking.totalAmount} {booking.currency}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>{getBillingBadge(booking.billingRoute, booking.complimentaryType || undefined)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Manage Booking</DialogTitle>
                            <DialogDescription>
                              Update booking status, billing route, and add internal notes
                            </DialogDescription>
                          </DialogHeader>

                          {selectedBooking && (
                            <div className="space-y-6">
                              {/* Booking Details */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Service</Label>
                                  <p className="text-sm">{service?.serviceName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Guest</Label>
                                  <p className="text-sm">{selectedBooking.guestName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Property</Label>
                                  <p className="text-sm">{property?.name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Service Date</Label>
                                  <p className="text-sm">{format(new Date(selectedBooking.serviceDate), "PPP")}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Amount</Label>
                                  <p className="text-sm">${selectedBooking.totalAmount} {selectedBooking.currency}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Current Status</Label>
                                  <p className="text-sm">{getStatusBadge(selectedBooking.status)}</p>
                                </div>
                              </div>

                              {selectedBooking.specialRequests && (
                                <div>
                                  <Label className="text-sm font-medium">Special Requests</Label>
                                  <p className="text-sm bg-muted p-2 rounded">{selectedBooking.specialRequests}</p>
                                </div>
                              )}

                              <Tabs defaultValue="status" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="status">Update Status</TabsTrigger>
                                  <TabsTrigger value="billing">Billing Route</TabsTrigger>
                                  <TabsTrigger value="notes">Notes</TabsTrigger>
                                </TabsList>

                                <TabsContent value="status" className="space-y-4">
                                  <div className="flex gap-2">
                                    {selectedBooking.status === "pending" && (
                                      <>
                                        <Button 
                                          onClick={() => handleConfirmBooking(selectedBooking)}
                                          disabled={updateBookingMutation.isPending}
                                          className="flex-1"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Confirm Booking
                                        </Button>
                                        <Button 
                                          variant="destructive"
                                          onClick={() => handleCancelBooking(selectedBooking, "Cancelled by staff")}
                                          disabled={updateBookingMutation.isPending}
                                          className="flex-1"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Cancel Booking
                                        </Button>
                                      </>
                                    )}
                                    {selectedBooking.status === "confirmed" && (
                                      <Button 
                                        onClick={() => handleCompleteBooking(selectedBooking)}
                                        disabled={updateBookingMutation.isPending}
                                        className="w-full"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark as Completed
                                      </Button>
                                    )}
                                    {selectedBooking.status === "completed" && (
                                      <div className="text-center text-muted-foreground py-4">
                                        Booking is completed
                                      </div>
                                    )}
                                    {selectedBooking.status === "cancelled" && (
                                      <div className="text-center text-muted-foreground py-4">
                                        Booking is cancelled
                                        {selectedBooking.cancellationReason && (
                                          <p className="text-sm mt-2">Reason: {selectedBooking.cancellationReason}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>

                                <TabsContent value="billing" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    <Button 
                                      variant={selectedBooking.billingRoute === "guest_billable" ? "default" : "outline"}
                                      onClick={() => handleUpdateBilling(selectedBooking, "guest_billable")}
                                      disabled={updateBookingMutation.isPending}
                                    >
                                      Guest Paid
                                    </Button>
                                    <Button 
                                      variant={selectedBooking.billingRoute === "owner_billable" ? "default" : "outline"}
                                      onClick={() => handleUpdateBilling(selectedBooking, "owner_billable")}
                                      disabled={updateBookingMutation.isPending}
                                    >
                                      Owner Charge
                                    </Button>
                                    <Button 
                                      variant={selectedBooking.billingRoute === "company_expense" ? "default" : "outline"}
                                      onClick={() => handleUpdateBilling(selectedBooking, "company_expense")}
                                      disabled={updateBookingMutation.isPending}
                                    >
                                      Company Expense
                                    </Button>
                                    <Select 
                                      onValueChange={(value) => handleUpdateBilling(selectedBooking, "complimentary", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Complimentary" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="owner_gift">Owner Gift</SelectItem>
                                        <SelectItem value="company_gift">Company Gift</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TabsContent>

                                <TabsContent value="notes" className="space-y-4">
                                  <div>
                                    <Label htmlFor="internalNotes">Internal Notes</Label>
                                    <Textarea
                                      id="internalNotes"
                                      value={internalNotes || selectedBooking.internalNotes || ""}
                                      onChange={(e) => setInternalNotes(e.target.value)}
                                      placeholder="Add internal notes about this booking..."
                                      rows={4}
                                    />
                                  </div>
                                  <Button 
                                    onClick={() => {
                                      updateBookingMutation.mutate({
                                        id: selectedBooking.id,
                                        data: { internalNotes }
                                      });
                                    }}
                                    disabled={updateBookingMutation.isPending}
                                  >
                                    Save Notes
                                  </Button>
                                </TabsContent>
                              </Tabs>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground">No add-on service bookings match your current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}