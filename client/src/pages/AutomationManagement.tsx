import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap, Clock, Calendar, DollarSign, AlertTriangle, CheckCircle, Play, Cog } from "lucide-react";

export default function AutomationManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch utility alerts
  const { data: utilityAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/automation/utility-alerts"],
    staleTime: 2 * 60 * 1000
  });

  // Manual trigger mutations
  const triggerCommissionTest = useMutation({
    mutationFn: () => apiRequest("POST", "/api/automation/test-booking-confirmation", {}),
    onSuccess: (data) => {
      toast({
        title: "Commission Test Completed",
        description: `✅ ${data.message}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Commission Test Failed",
        description: error.message || "Test failed",
        variant: "destructive"
      });
    }
  });

  const triggerUtilityCheck = useMutation({
    mutationFn: () => apiRequest("POST", "/api/automation/check-utility-alerts", {}),
    onSuccess: (data) => {
      toast({
        title: "Utility Check Completed",
        description: `✅ ${data.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/automation/utility-alerts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Utility Check Failed",
        description: error.message || "Check failed",
        variant: "destructive"
      });
    }
  });

  const processBookingCommission = useMutation({
    mutationFn: (bookingId: number) => apiRequest("POST", "/api/automation/process-booking-commission", { bookingId }),
    onSuccess: (data) => {
      toast({
        title: "Commission Processed",
        description: `✅ ${data.message}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Commission Processing Failed",
        description: error.message || "Processing failed",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Cog className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Automation Management</h1>
        <Badge variant="secondary">Live System</Badge>
      </div>

      {/* Automation Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Automation</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-calculates on booking confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utility Alerts</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-600">Daily 9:00 AM</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Checks for overdue bills and missing receipts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Bills Check</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">Weekly Mondays</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Reviews all properties for overdue utilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Auto-Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600">Threshold-based</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-triggers when balance ≥ ฿5,000
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Manual Testing & Triggers</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => triggerCommissionTest.mutate()} 
              disabled={triggerCommissionTest.isPending}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">Test Commission Calc</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Simulate booking confirmation with demo agents
              </span>
            </Button>

            <Button 
              onClick={() => triggerUtilityCheck.mutate()} 
              disabled={triggerUtilityCheck.isPending}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
            >
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Trigger Utility Check</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Manually run utility alerts scan
              </span>
            </Button>

            <Button 
              onClick={() => processBookingCommission.mutate(123)} 
              disabled={processBookingCommission.isPending}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
            >
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span className="font-medium">Process Booking #123</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Manually trigger commission for booking
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Utility Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Current Utility Alerts</span>
            {!alertsLoading && utilityAlerts && (
              <Badge variant="secondary">{utilityAlerts.length} alerts</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : utilityAlerts && utilityAlerts.length > 0 ? (
            <div className="space-y-3">
              {utilityAlerts.map((alert: any) => (
                <div key={alert.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={alert.alertSeverity === 'urgent' ? 'destructive' : 'secondary'}
                        >
                          {alert.alertSeverity}
                        </Badge>
                        <span className="font-medium">{alert.propertyName}</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          {alert.utilityType}
                        </span>
                      </div>
                      <p className="text-sm">{alert.alertMessage}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No current utility alerts</p>
              <p className="text-sm">All utility bills are up to date</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automation Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Automation Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="font-medium">Daily Utility Alerts</p>
                  <p className="text-sm text-muted-foreground">Check for missing receipts and overdue bills</p>
                </div>
              </div>
              <Badge variant="secondary">9:00 AM Daily</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-red-600" />
                <div>
                  <p className="font-medium">Weekly Overdue Review</p>
                  <p className="text-sm text-muted-foreground">Comprehensive review of all overdue utilities</p>
                </div>
              </div>
              <Badge variant="secondary">Mondays</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Commission Calculation</p>
                  <p className="text-sm text-muted-foreground">Triggered automatically on booking confirmation</p>
                </div>
              </div>
              <Badge variant="secondary">Real-time</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">Agent Auto-Payouts</p>
                  <p className="text-sm text-muted-foreground">When agent balance reaches ฿5,000 threshold</p>
                </div>
              </div>
              <Badge variant="secondary">Threshold-based</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}