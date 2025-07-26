import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Wrench, 
  Clock, 
  Users, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  UserPlus,
  Settings
} from "lucide-react";

// Import existing property-related components
import Properties from "./Properties";
import PropertyAppliancesManagement from "./PropertyAppliancesManagement";
// Placeholder components for demo
const DailyOperations = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Daily Operations</CardTitle>
        <CardDescription>Daily operational tasks and monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Daily Operations management will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const AutoScheduleTaskGenerator = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Auto-Scheduling Rules</CardTitle>
        <CardDescription>Automated task scheduling and rules management</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Auto-scheduling functionality will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const MaintenanceLogWarrantyTracker = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Log & Warranty Tracker</CardTitle>
        <CardDescription>Track maintenance activities and warranty information</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Maintenance log and warranty tracking will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const StaffProfilePayroll = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Staff Profile & Payroll</CardTitle>
        <CardDescription>Manage staff profiles and payroll information</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Staff profile and payroll management will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const StaffAdvanceSalaryOvertimeTracker = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Staff Advance & Overtime Tracker</CardTitle>
        <CardDescription>Track staff salary advances and overtime hours</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Staff advance and overtime tracking will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const MaintenanceSuggestions = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Suggestions</CardTitle>
        <CardDescription>AI-powered maintenance recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Maintenance suggestions will be available here.</p>
      </CardContent>
    </Card>
  </div>
);
// Placeholder guest service components
const GuestPortalSmartRequests = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Guest Portal Smart Requests</CardTitle>
        <CardDescription>AI-powered guest request management</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Guest smart requests functionality will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const GuestActivityRecommendations = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Guest Activity Recommendations</CardTitle>
        <CardDescription>AI-powered activity suggestions for guests</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Guest activity recommendations will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const UpsellRecommendationsManagement = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Upsell Recommendations</CardTitle>
        <CardDescription>Manage upsell opportunities and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Upsell recommendations management will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const LoyaltyTracker = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Guest Tracker</CardTitle>
        <CardDescription>Track and manage repeat guest loyalty programs</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Loyalty tracking functionality will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

export default function PropertiesWithTabs() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Properties Management Center</h1>
        <p className="text-gray-600 mt-1">Comprehensive property management with integrated appliances, operations, and guest services</p>
      </div>

      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Properties Overview
          </TabsTrigger>
          <TabsTrigger value="appliances-maintenance" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Appliances & Maintenance
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="guest-services" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Guest Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <Properties />
        </TabsContent>

        <TabsContent value="appliances-maintenance">
          <div className="space-y-6">
            <Tabs defaultValue="appliances" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appliances" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Property Appliances
                </TabsTrigger>
                <TabsTrigger value="daily-operations" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Daily Operations
                </TabsTrigger>
                <TabsTrigger value="maintenance-log" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Maintenance Log
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appliances">
                <PropertyAppliancesManagement />
              </TabsContent>

              <TabsContent value="daily-operations">
                <DailyOperations />
              </TabsContent>

              <TabsContent value="maintenance-log">
                <MaintenanceLogWarrantyTracker />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="operations">
          <div className="space-y-6">
            <Tabs defaultValue="auto-scheduling" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="auto-scheduling" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Auto-Scheduling
                </TabsTrigger>
                <TabsTrigger value="staff-profile" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  Staff Profile
                </TabsTrigger>
                <TabsTrigger value="staff-overtime" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Staff Overtime
                </TabsTrigger>
                <TabsTrigger value="maintenance-suggestions" className="text-xs">
                  <Wrench className="w-3 h-3 mr-1" />
                  Maintenance Suggestions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="auto-scheduling">
                <AutoScheduleTaskGenerator />
              </TabsContent>

              <TabsContent value="staff-profile">
                <StaffProfilePayroll />
              </TabsContent>

              <TabsContent value="staff-overtime">
                <StaffAdvanceSalaryOvertimeTracker />
              </TabsContent>

              <TabsContent value="maintenance-suggestions">
                <MaintenanceSuggestions />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="guest-services">
          <div className="space-y-6">
            <Tabs defaultValue="smart-requests" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="smart-requests" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Smart Requests
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Activity Recommendations
                </TabsTrigger>
                <TabsTrigger value="upsell" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Upsell Recommendations
                </TabsTrigger>
                <TabsTrigger value="loyalty" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Loyalty Tracker
                </TabsTrigger>
              </TabsList>

              <TabsContent value="smart-requests">
                <GuestPortalSmartRequests />
              </TabsContent>

              <TabsContent value="recommendations">
                <GuestActivityRecommendations />
              </TabsContent>

              <TabsContent value="upsell">
                <UpsellRecommendationsManagement />
              </TabsContent>

              <TabsContent value="loyalty">
                <LoyaltyTracker />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}