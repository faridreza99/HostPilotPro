import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  MessageCircle, 
  Bot, 
  MapPin, 
  Utensils, 
  Car, 
  Waves, 
  Camera,
  Clock,
  DollarSign,
  User,
  Building,
  AlertTriangle,
  CheckCircle,
  Calendar as CalendarIcon,
  FileText,
  Star,
  Send,
  Plus,
  Wrench,
  X
} from "lucide-react";
import { format } from "date-fns";

// Authentication Schema
const authSchema = z.object({
  bookingReference: z.string().min(1, "Booking reference is required"),
  guestEmail: z.string().email("Valid email is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
});

type AuthFormData = z.infer<typeof authSchema>;

// Add-on Service Request Schema
const serviceRequestSchema = z.object({
  serviceId: z.number(),
  serviceName: z.string(),
  serviceType: z.string(),
  requestedDate: z.string(),
  requestedTime: z.string().optional(),
  duration: z.number().optional(),
  guestCount: z.number().min(1).default(1),
  quantity: z.number().min(1).default(1),
  unitPrice: z.number(),
  totalCost: z.number(),
  chargeAssignment: z.enum(["guest", "owner", "company"]).default("guest"),
  assignmentReason: z.string().optional(),
  specialRequests: z.string().optional(),
  guestNotes: z.string().optional(),
});

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

// Maintenance Report Schema
const maintenanceReportSchema = z.object({
  issueType: z.string().min(1, "Issue type is required"),
  issueTitle: z.string().min(1, "Issue title is required"),
  issueDescription: z.string().min(1, "Description is required"),
  locationInProperty: z.string().min(1, "Location is required"),
  severityLevel: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  reportImages: z.array(z.string()).optional(),
  reportVideos: z.array(z.string()).optional(),
});

type MaintenanceReportFormData = z.infer<typeof maintenanceReportSchema>;

// Guest Authentication Component
function GuestAuthentication({ onAuthenticated }: { onAuthenticated: (token: string) => void }) {
  const { toast } = useToast();
  
  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      bookingReference: "",
      guestEmail: "",
      checkInDate: "",
    },
  });

  const authMutation = useMutation({
    mutationFn: async (data: AuthFormData) => {
      const response = await apiRequest("POST", "/api/guest/portal/auth", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("guestPortalToken", data.accessToken);
      onAuthenticated(data.accessToken);
      toast({
        title: "Welcome!",
        description: "Successfully accessed your guest portal.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Authentication Failed",
        description: error.message || "Please check your booking details and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AuthFormData) => {
    authMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome to Your Guest Portal
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Access your booking information and services
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bookingReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Reference</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your booking reference" 
                        {...field} 
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your email address" 
                        {...field} 
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="checkInDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field} 
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={authMutation.isPending}
              >
                {authMutation.isPending ? "Authenticating..." : "Access Portal"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Guest Portal Dashboard
function GuestPortalDashboard({ token }: { token: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // API request helper with authentication
  const authenticatedRequest = async (method: string, endpoint: string, data?: any) => {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed: ${response.status}`);
    }

    return response.json();
  };

  // Data queries
  const { data: sessionInfo } = useQuery({
    queryKey: ["guest-session"],
    queryFn: () => authenticatedRequest("GET", "/api/guest/session"),
  });

  const { data: bookingOverview } = useQuery({
    queryKey: ["guest-booking-overview"],
    queryFn: () => authenticatedRequest("GET", "/api/guest/booking-overview"),
  });

  const { data: activityTimeline } = useQuery({
    queryKey: ["guest-activity-timeline"],
    queryFn: () => authenticatedRequest("GET", "/api/guest/activity-timeline"),
  });

  const { data: chatMessages } = useQuery({
    queryKey: ["guest-chat-messages"],
    queryFn: () => authenticatedRequest("GET", "/api/guest/chat/messages"),
  });

  const { data: addonServices } = useQuery({
    queryKey: ["guest-addon-services"],
    queryFn: () => authenticatedRequest("GET", "/api/guest/addon-services"),
  });

  const { data: serviceRequests } = useQuery({
    queryKey: ["guest-service-requests"],
    queryFn: () => authenticatedRequest("GET", "/api/guest/addon-services/requests"),
  });

  const { data: localInfo } = useQuery({
    queryKey: ["guest-local-info"],
    queryFn: () => authenticatedRequest("GET", "/api/guest/local-info"),
  });

  const { data: maintenanceReports } = useQuery({
    queryKey: ["guest-maintenance-reports"],
    queryFn: () => authenticatedRequest("GET", "/api/guest/maintenance/reports"),
  });

  const { data: faqResponses } = useQuery({
    queryKey: ["guest-faq"],
    queryFn: () => authenticatedRequest("GET", "/api/guest/faq"),
  });

  // Chat message mutation
  const [newMessage, setNewMessage] = useState("");
  const sendMessageMutation = useMutation({
    mutationFn: async (messageContent: string) => {
      return authenticatedRequest("POST", "/api/guest/chat/send", { messageContent });
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["guest-chat-messages"] });
      queryClient.invalidateQueries({ queryKey: ["guest-activity-timeline"] });
    },
    onError: (error: any) => {
      toast({
        title: "Message Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Service request mutation
  const serviceRequestMutation = useMutation({
    mutationFn: async (data: ServiceRequestFormData) => {
      return authenticatedRequest("POST", "/api/guest/addon-services/request", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["guest-activity-timeline"] });
      toast({
        title: "Service Requested",
        description: "Your service request has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Maintenance report mutation
  const maintenanceReportMutation = useMutation({
    mutationFn: async (data: MaintenanceReportFormData) => {
      return authenticatedRequest("POST", "/api/guest/maintenance/report", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-maintenance-reports"] });
      queryClient.invalidateQueries({ queryKey: ["guest-activity-timeline"] });
      toast({
        title: "Report Submitted",
        description: "Your maintenance report has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Report Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("guestPortalToken");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {sessionInfo?.guestName}
              </h1>
              <p className="text-gray-600 mt-1">
                Your stay at {sessionInfo?.propertyName || "our property"}
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {sessionInfo && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Check-in: {format(new Date(sessionInfo.checkInDate), "MMM dd, yyyy")}
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Check-out: {format(new Date(sessionInfo.checkOutDate), "MMM dd, yyyy")}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat & AI
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="local-info" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Local Info
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Stay */}
              {bookingOverview?.currentStay && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      Current Stay
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{bookingOverview.currentStay.propertyName}</p>
                      <p className="text-sm text-gray-600">
                        {bookingOverview.currentStay.guests} guests
                      </p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active Stay
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Upcoming Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {serviceRequests?.filter((req: any) => req.requestStatus === 'confirmed').slice(0, 3).map((service: any) => (
                    <div key={service.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{service.serviceName}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(service.requestedDate), "MMM dd")}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {service.requestStatus}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No upcoming services</p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => document.querySelector('[data-state="inactive"][value="chat"]')?.click()}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Ask AI Assistant
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => document.querySelector('[data-state="inactive"][value="services"]')?.click()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Book Service
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => document.querySelector('[data-state="inactive"][value="maintenance"]')?.click()}
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chat & AI Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-blue-600" />
                      AI Assistant Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                      {chatMessages?.map((message: any) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.senderType === 'guest' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.senderType === 'guest' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{message.messageContent}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderType === 'guest' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {format(new Date(message.sentAt), "MMM dd, HH:mm")}
                            </p>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center text-gray-500 py-8">
                          <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Start a conversation with our AI assistant!</p>
                          <p className="text-sm">Ask questions about your stay, the property, or local area.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Responses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Frequently Asked
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                  {faqResponses?.map((faq: any) => (
                    <div key={faq.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">{faq.questionKeyword}</h4>
                      <p className="text-xs text-gray-600">{faq.responseText}</p>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No FAQ responses available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    Available Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {addonServices?.map((service: any) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{service.serviceName}</h3>
                          <p className="text-sm text-gray-600">{service.serviceDescription}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          ${service.unitPrice}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {service.estimatedDuration} minutes
                        </span>
                        {service.maxGuestCount && (
                          <>
                            <User className="w-4 h-4 text-gray-400 ml-2" />
                            <span className="text-sm text-gray-600">
                              Max {service.maxGuestCount} guests
                            </span>
                          </>
                        )}
                      </div>

                      <ServiceRequestDialog 
                        service={service} 
                        onSubmit={(data) => serviceRequestMutation.mutate(data)}
                        isLoading={serviceRequestMutation.isPending}
                      />
                    </div>
                  )) || (
                    <p className="text-gray-500">No services available at this time</p>
                  )}
                </CardContent>
              </Card>

              {/* Your Service Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Your Service Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {serviceRequests?.map((request: any) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{request.serviceName}</h3>
                        <Badge 
                          variant={
                            request.requestStatus === 'confirmed' ? 'default' :
                            request.requestStatus === 'pending' ? 'secondary' :
                            request.requestStatus === 'completed' ? 'outline' : 'destructive'
                          }
                        >
                          {request.requestStatus}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Date: {format(new Date(request.requestedDate), "MMM dd, yyyy")}</p>
                        {request.requestedTime && (
                          <p>Time: {request.requestedTime}</p>
                        )}
                        <p>Cost: ${request.totalCost}</p>
                        <p>Charged to: {request.chargeAssignment}</p>
                      </div>
                      
                      {request.guestNotes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Your notes:</strong> {request.guestNotes}
                        </div>
                      )}
                    </div>
                  )) || (
                    <p className="text-gray-500">No service requests yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Local Info Tab */}
          <TabsContent value="local-info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["restaurant", "beach", "activity", "transport", "shopping", "attraction"].map((type) => {
                const typeInfo = localInfo?.filter((info: any) => info.locationType === type) || [];
                const icons: { [key: string]: any } = {
                  restaurant: Utensils,
                  beach: Waves,
                  activity: Star,
                  transport: Car,
                  shopping: Building,
                  attraction: Camera,
                };
                const Icon = icons[type] || MapPin;

                return (
                  <Card key={type}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 capitalize">
                        <Icon className="w-5 h-5 text-blue-600" />
                        {type}s
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                      {typeInfo.map((info: any) => (
                        <div key={info.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{info.locationName}</h4>
                            {info.recommendationScore && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs">{info.recommendationScore}/5</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{info.description}</p>
                          {info.distanceFromProperty && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {info.distanceFromProperty}km away
                              </span>
                            </div>
                          )}
                          {info.estimatedCost && (
                            <div className="flex items-center gap-1 mt-1">
                              <DollarSign className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                ${info.estimatedCost}
                              </span>
                            </div>
                          )}
                        </div>
                      )) || (
                        <p className="text-gray-500 text-sm">No {type}s available</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Report Issue */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Report Maintenance Issue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MaintenanceReportForm 
                    onSubmit={(data) => maintenanceReportMutation.mutate(data)}
                    isLoading={maintenanceReportMutation.isPending}
                  />
                </CardContent>
              </Card>

              {/* Your Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Your Maintenance Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {maintenanceReports?.map((report: any) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{report.issueTitle}</h3>
                        <Badge 
                          variant={
                            report.reportStatus === 'resolved' ? 'default' :
                            report.reportStatus === 'in_progress' ? 'secondary' :
                            report.reportStatus === 'assigned' ? 'outline' : 'destructive'
                          }
                        >
                          {report.reportStatus}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Type:</strong> {report.issueType}</p>
                        <p><strong>Location:</strong> {report.locationInProperty}</p>
                        <p><strong>Severity:</strong> {report.severityLevel}</p>
                        <p><strong>Reported:</strong> {format(new Date(report.reportedAt), "MMM dd, yyyy HH:mm")}</p>
                      </div>
                      
                      {report.issueDescription && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Description:</strong> {report.issueDescription}
                        </div>
                      )}
                    </div>
                  )) || (
                    <p className="text-gray-500">No maintenance reports yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[700px] overflow-y-auto">
                {activityTimeline?.map((activity: any) => (
                  <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                        activity.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.activityType === 'addon_booking' ? <Plus className="w-4 h-4" /> :
                         activity.activityType === 'maintenance_request' ? <Wrench className="w-4 h-4" /> :
                         activity.activityType === 'chat_message' ? <MessageCircle className="w-4 h-4" /> :
                         <Calendar className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <Badge 
                          variant={
                            activity.status === 'completed' ? 'default' :
                            activity.status === 'confirmed' ? 'secondary' :
                            'outline'
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{format(new Date(activity.requestedAt), "MMM dd, yyyy HH:mm")}</span>
                        {activity.estimatedCost && (
                          <span>${activity.estimatedCost}</span>
                        )}
                        {activity.chargeAssignment && (
                          <span>Charged to: {activity.chargeAssignment}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-8">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No activity recorded yet</p>
                    <p className="text-sm">Your interactions and requests will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Service Request Dialog Component
function ServiceRequestDialog({ 
  service, 
  onSubmit, 
  isLoading 
}: { 
  service: any; 
  onSubmit: (data: ServiceRequestFormData) => void; 
  isLoading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceId: service.id,
      serviceName: service.serviceName,
      serviceType: service.serviceType,
      requestedDate: "",
      requestedTime: "",
      duration: service.estimatedDuration || 60,
      guestCount: 1,
      quantity: 1,
      unitPrice: service.unitPrice,
      totalCost: service.unitPrice,
      chargeAssignment: "guest",
      assignmentReason: "",
      specialRequests: "",
      guestNotes: "",
    },
  });

  const watchQuantity = form.watch("quantity");
  const watchUnitPrice = form.watch("unitPrice");

  useEffect(() => {
    const totalCost = (watchQuantity || 1) * (watchUnitPrice || 0);
    form.setValue("totalCost", totalCost);
  }, [watchQuantity, watchUnitPrice, form]);

  const handleSubmit = (data: ServiceRequestFormData) => {
    onSubmit(data);
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Book This Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {service.serviceName}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="requestedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requestedTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time (Optional)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max={service.maxGuestCount || 10}
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="chargeAssignment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charge To</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select who to charge" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="guest">Charge to Guest</SelectItem>
                      <SelectItem value="owner">Charge to Owner</SelectItem>
                      <SelectItem value="company">Charge to Company</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="guestNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests/Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special requests or notes..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Cost:</span>
                <span className="text-lg font-bold text-green-600">
                  ${form.watch("totalCost")}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Maintenance Report Form Component
function MaintenanceReportForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: MaintenanceReportFormData) => void; 
  isLoading: boolean;
}) {
  const form = useForm<MaintenanceReportFormData>({
    resolver: zodResolver(maintenanceReportSchema),
    defaultValues: {
      issueType: "",
      issueTitle: "",
      issueDescription: "",
      locationInProperty: "",
      severityLevel: "medium",
      reportImages: [],
      reportVideos: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="issueType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="appliance">Appliance</SelectItem>
                  <SelectItem value="hvac">Heating/Cooling</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="issueTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Title</FormLabel>
              <FormControl>
                <Input placeholder="Brief description of the issue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="locationInProperty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location in Property</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Master bedroom, Kitchen, Pool area" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="severityLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                  <SelectItem value="medium">Medium - Noticeable issue</SelectItem>
                  <SelectItem value="high">High - Significant problem</SelectItem>
                  <SelectItem value="urgent">Urgent - Safety concern</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="issueDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide as much detail as possible about the issue..."
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isLoading ? "Submitting Report..." : "Submit Maintenance Report"}
        </Button>
      </form>
    </Form>
  );
}

// Main Guest Portal Component
export default function GuestPortal() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("guestPortalToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  if (!token) {
    return <GuestAuthentication onAuthenticated={setToken} />;
  }

  return <GuestPortalDashboard token={token} />;
}