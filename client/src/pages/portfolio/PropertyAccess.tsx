import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Key, 
  Wifi, 
  MapPin, 
  Building, 
  Search, 
  Phone,
  Clock,
  Lock,
  Home
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PropertyAccessInfo {
  id: number;
  propertyName: string;
  address: string;
  lockboxCode: string;
  lockboxLocation: string;
  gateCode: string;
  wifiNetwork: string;
  wifiPassword: string;
  keyLocation: string;
  emergencyContact: string;
  checkInInstructions: string;
  lastUpdated: string;
  status: "active" | "inactive";
}

export default function PropertyAccess() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for assigned properties
  const mockPropertyAccess: PropertyAccessInfo[] = [
    {
      id: 1,
      propertyName: "Villa Aruna",
      address: "123 Sunset Beach, Koh Samui",
      lockboxCode: "8472",
      lockboxLocation: "Behind the main gate pillar",
      gateCode: "1234*",
      wifiNetwork: "Villa_Aruna_Guest",
      wifiPassword: "Paradise2024",
      keyLocation: "Lockbox contains villa keys and pool area key",
      emergencyContact: "+66 77 123 456",
      checkInInstructions: "Enter gate code, retrieve keys from lockbox, main door auto-unlocks with key card.",
      lastUpdated: "2024-01-15",
      status: "active"
    },
    {
      id: 2,
      propertyName: "Villa Samui Breeze",
      address: "456 Coconut Grove, Koh Samui",
      lockboxCode: "5926",
      lockboxLocation: "Left side of entrance door",
      gateCode: "9876#",
      wifiNetwork: "SamuiBreeze_WiFi",
      wifiPassword: "Ocean2024!",
      keyLocation: "Lockbox contains main keys and garden shed key",
      emergencyContact: "+66 77 987 654",
      checkInInstructions: "Use gate code, lockbox on left of main door, WiFi details inside welcome folder.",
      lastUpdated: "2024-01-10",
      status: "active"
    }
  ];

  const { data: propertyAccess, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio/property-access'],
    initialData: mockPropertyAccess
  });

  const filteredProperties = propertyAccess?.filter(property =>
    property.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
              Error loading property access information. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
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
          <BreadcrumbPage>Property Access</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Property Access Information</h1>
        <p className="text-muted-foreground">
          Access codes and entry information for your assigned properties
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Property Access Cards */}
      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No property access info assigned yet</h3>
              <p className="text-muted-foreground">Contact Admin to get access information for your assigned properties.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      {property.propertyName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {property.address}
                    </CardDescription>
                  </div>
                  <Badge variant={property.status === "active" ? "default" : "secondary"}>
                    {property.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gate Access */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4" />
                    Gate Access
                  </h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm"><strong>Gate Code:</strong> {property.gateCode}</p>
                  </div>
                </div>

                {/* Lockbox Information */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Key className="h-4 w-4" />
                    Lockbox & Keys
                  </h4>
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Lockbox Code:</strong> {property.lockboxCode}</p>
                    <p className="text-sm"><strong>Location:</strong> {property.lockboxLocation}</p>
                    <p className="text-sm"><strong>Contents:</strong> {property.keyLocation}</p>
                  </div>
                </div>

                {/* WiFi Information */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Wifi className="h-4 w-4" />
                    WiFi Access
                  </h4>
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Network:</strong> {property.wifiNetwork}</p>
                    <p className="text-sm"><strong>Password:</strong> {property.wifiPassword}</p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    Emergency Contact
                  </h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">{property.emergencyContact}</p>
                  </div>
                </div>

                {/* Check-in Instructions */}
                <div>
                  <h4 className="font-semibold mb-2">Check-in Instructions</h4>
                  <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                    {property.checkInInstructions}
                  </p>
                </div>

                <Separator />

                {/* Footer */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated: {property.lastUpdated}
                  </span>
                  <Button variant="outline" size="sm">
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}