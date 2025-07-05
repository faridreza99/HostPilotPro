import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Truck, Droplets, AlertTriangle, Plus, Calendar, DollarSign, BarChart3, FileText, CheckCircle, X } from "lucide-react";
import { format } from "date-fns";
import type { EmergencyWaterDelivery, EmergencyWaterAlert } from "@shared/schema";

interface EmergencyWaterTruckProps {
  propertyId?: number;
  userRole: string;
}

export function EmergencyWaterTruck({ propertyId, userRole }: EmergencyWaterTruckProps) {
  const [activeTab, setActiveTab] = useState<'deliveries' | 'alerts' | 'analytics'>('deliveries');
  const [showCreateDelivery, setShowCreateDelivery] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch emergency water deliveries
  const { data: deliveries = [], isLoading: deliveriesLoading } = useQuery({
    queryKey: ['/api/emergency-water/deliveries', propertyId],
    queryFn: () => apiRequest('GET', `/api/emergency-water/deliveries${propertyId ? `?propertyId=${propertyId}` : ''}`),
  });

  // Fetch emergency water alerts
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/emergency-water/alerts', propertyId],
    queryFn: () => apiRequest('GET', `/api/emergency-water/alerts${propertyId ? `?propertyId=${propertyId}` : ''}`),
  });

  // Fetch emergency water analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/emergency-water/analytics', propertyId],
    queryFn: () => apiRequest('GET', `/api/emergency-water/analytics${propertyId ? `?propertyId=${propertyId}` : ''}`),
  });

  // Create delivery mutation
  const createDeliveryMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/emergency-water/deliveries', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-water/deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-water/analytics'] });
      setShowCreateDelivery(false);
      toast({
        title: "Success",
        description: "Emergency water delivery recorded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record emergency water delivery",
        variant: "destructive",
      });
    }
  });

  // Resolve alert mutation
  const resolveAlertMutation = useMutation({
    mutationFn: ({ alertId, notes }: { alertId: number; notes: string }) =>
      apiRequest('PUT', `/api/emergency-water/alerts/${alertId}/resolve`, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-water/alerts'] });
      setShowAlertDetails(null);
      toast({
        title: "Success",
        description: "Alert resolved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive",
      });
    }
  });

  // Inject demo data mutation (admin only)
  const injectDemoMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/emergency-water/inject-demo', { propertyId: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-water/deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-water/analytics'] });
      toast({
        title: "Success",
        description: "Demo emergency water data injected successfully",
      });
    },
  });

  const handleCreateDelivery = (formData: FormData) => {
    const data = {
      propertyId: propertyId || parseInt(formData.get('propertyId') as string),
      deliveryDate: formData.get('deliveryDate') as string,
      supplierName: formData.get('supplierName') as string,
      volumeLiters: parseInt(formData.get('volumeLiters') as string),
      costPerLiter: parseFloat(formData.get('costPerLiter') as string),
      totalCost: parseFloat(formData.get('totalCost') as string),
      currency: formData.get('currency') as string || 'THB',
      paymentStatus: formData.get('paymentStatus') as string,
      paymentMethod: formData.get('paymentMethod') as string,
      emergencyType: formData.get('emergencyType') as string,
      urgencyLevel: formData.get('urgencyLevel') as string,
      deliveryNotes: formData.get('deliveryNotes') as string,
      billingAssignment: formData.get('billingAssignment') as string,
      deliveryStatus: 'delivered',
      deliveredBy: formData.get('deliveredBy') as string,
      deliveryTime: formData.get('deliveryTime') as string,
      followUpRequired: formData.get('followUpRequired') === 'true',
      waterSystemRestored: formData.get('waterSystemRestored') === 'true',
    };

    createDeliveryMutation.mutate(data);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canManageDeliveries = ['admin', 'portfolio-manager', 'staff'].includes(userRole);
  const canResolveAlerts = ['admin', 'portfolio-manager'].includes(userRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Water Truck</h2>
            <p className="text-gray-600 dark:text-gray-400">Track emergency water deliveries and alerts</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {userRole === 'admin' && (
            <Button
              onClick={() => injectDemoMutation.mutate()}
              variant="outline"
              size="sm"
              disabled={injectDemoMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Inject Demo
            </Button>
          )}
          
          {canManageDeliveries && (
            <Button onClick={() => setShowCreateDelivery(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Record Delivery
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalDeliveries}</p>
                </div>
                <Droplets className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalVolume.toLocaleString()}L</p>
                </div>
                <Truck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">฿{analytics.totalCost.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Cost/Liter</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">฿{analytics.averageCostPerLiter.toFixed(2)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'deliveries', label: 'Deliveries', icon: Truck },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'deliveries' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Emergency Water Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deliveriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : deliveries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No emergency water deliveries recorded yet
              </div>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery: EmergencyWaterDelivery) => (
                  <div
                    key={delivery.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                          {delivery.supplierName}
                        </Badge>
                        <Badge className={getUrgencyColor(delivery.urgencyLevel)}>
                          {delivery.urgencyLevel}
                        </Badge>
                        <Badge className={getPaymentStatusColor(delivery.paymentStatus)}>
                          {delivery.paymentStatus}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(delivery.deliveryDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Volume:</span>
                        <span className="ml-1">{delivery.volumeLiters.toLocaleString()}L</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Cost:</span>
                        <span className="ml-1">{delivery.currency} {parseFloat(delivery.totalCost).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Emergency Type:</span>
                        <span className="ml-1 capitalize">{delivery.emergencyType}</span>
                      </div>
                    </div>
                    
                    {delivery.deliveryNotes && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Notes:</span>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">{delivery.deliveryNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'alerts' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No active alerts
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert: EmergencyWaterAlert) => (
                  <div
                    key={alert.id}
                    className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <Badge className="bg-red-100 text-red-800">
                            {alert.alertType.replace('_', ' ')}
                          </Badge>
                          {alert.isResolved && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                        
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          {alert.alertMessage}
                        </p>
                        
                        {alert.aiRecommendations && alert.aiRecommendations.length > 0 && (
                          <div className="mb-2">
                            <span className="font-medium text-gray-600 dark:text-gray-400">AI Recommendations:</span>
                            <ul className="mt-1 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                              {alert.aiRecommendations.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last triggered: {alert.lastTriggered ? format(new Date(alert.lastTriggered), 'MMM dd, yyyy HH:mm') : 'N/A'}
                        </div>
                      </div>
                      
                      {canResolveAlerts && !alert.isResolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowAlertDetails(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Emergency Types Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.emergencyTypes).map(([type, data]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <span className="font-medium capitalize">{type}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        ({data.count} {data.count === 1 ? 'delivery' : 'deliveries'})
                      </span>
                    </div>
                    <span className="font-medium">฿{data.cost.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.monthlyData).map(([month, data]: [string, any]) => (
                  <div key={month} className="grid grid-cols-4 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Month</span>
                      <p className="font-medium">{month}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Deliveries</span>
                      <p className="font-medium">{data.deliveries}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Volume</span>
                      <p className="font-medium">{data.volume.toLocaleString()}L</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Cost</span>
                      <p className="font-medium">฿{data.cost.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Delivery Dialog */}
      <Dialog open={showCreateDelivery} onOpenChange={setShowCreateDelivery}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Emergency Water Delivery</DialogTitle>
          </DialogHeader>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateDelivery(formData);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <Label htmlFor="deliveryTime">Delivery Time</Label>
                <Input
                  id="deliveryTime"
                  name="deliveryTime"
                  type="time"
                  required
                  defaultValue="14:30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  name="supplierName"
                  required
                  placeholder="e.g., Samui Water Rescue"
                />
              </div>
              
              <div>
                <Label htmlFor="deliveredBy">Delivered By</Label>
                <Input
                  id="deliveredBy"
                  name="deliveredBy"
                  required
                  placeholder="Driver name and contact"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="volumeLiters">Volume (Liters)</Label>
                <Input
                  id="volumeLiters"
                  name="volumeLiters"
                  type="number"
                  required
                  placeholder="1500"
                />
              </div>
              
              <div>
                <Label htmlFor="costPerLiter">Cost per Liter</Label>
                <Input
                  id="costPerLiter"
                  name="costPerLiter"
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.8"
                />
              </div>
              
              <div>
                <Label htmlFor="totalCost">Total Cost</Label>
                <Input
                  id="totalCost"
                  name="totalCost"
                  type="number"
                  step="0.01"
                  required
                  placeholder="1200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyType">Emergency Type</Label>
                <Select name="emergencyType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outage">Water Outage</SelectItem>
                    <SelectItem value="quality">Water Quality Issue</SelectItem>
                    <SelectItem value="pressure">Low Pressure</SelectItem>
                    <SelectItem value="maintenance">Maintenance Work</SelectItem>
                    <SelectItem value="equipment_failure">Equipment Failure</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="urgencyLevel">Urgency Level</Label>
                <Select name="urgencyLevel" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select name="paymentStatus" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select name="paymentMethod" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="company_account">Company Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="billingAssignment">Billing Assignment</Label>
              <Select name="billingAssignment" required>
                <SelectTrigger>
                  <SelectValue placeholder="Who should be billed?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Property Owner</SelectItem>
                  <SelectItem value="management">Management Company</SelectItem>
                  <SelectItem value="guest">Guest (if applicable)</SelectItem>
                  <SelectItem value="insurance">Insurance Claim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deliveryNotes">Delivery Notes</Label>
              <Textarea
                id="deliveryNotes"
                name="deliveryNotes"
                placeholder="Additional notes about the emergency delivery..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  name="followUpRequired"
                  value="true"
                  className="rounded border-gray-300"
                />
                <Label htmlFor="followUpRequired" className="text-sm">Follow-up required</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="waterSystemRestored"
                  name="waterSystemRestored"
                  value="true"
                  className="rounded border-gray-300"
                />
                <Label htmlFor="waterSystemRestored" className="text-sm">Water system restored</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDelivery(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createDeliveryMutation.isPending}
              >
                {createDeliveryMutation.isPending ? 'Recording...' : 'Record Delivery'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Resolution Dialog */}
      {showAlertDetails && (
        <Dialog open={true} onOpenChange={() => setShowAlertDetails(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resolve Alert</DialogTitle>
            </DialogHeader>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const notes = formData.get('notes') as string;
                resolveAlertMutation.mutate({ alertId: showAlertDetails, notes });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="notes">Resolution Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Describe how this alert was resolved..."
                  required
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAlertDetails(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={resolveAlertMutation.isPending}
                >
                  {resolveAlertMutation.isPending ? 'Resolving...' : 'Resolve Alert'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}