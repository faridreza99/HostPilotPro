import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Wrench, 
  Search, 
  Filter,
  Calendar,
  User,
  Building,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceTask {
  id: number;
  taskTitle: string;
  description: string;
  propertyName: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "resolved" | "cancelled";
  reportedBy: string;
  reportedDate: string;
  assignedStaff: string;
  estimatedCost: number;
  actualCost?: number;
  notes: string;
  category: string;
  dueDate: string;
  completedDate?: string;
}

export default function Maintenance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  // Mock maintenance tasks for assigned properties
  const mockMaintenanceTasks: MaintenanceTask[] = [
    {
      id: 1,
      taskTitle: "Pool Filter Replacement",
      description: "Pool filter needs replacement, water clarity issues reported by guest",
      propertyName: "Villa Aruna",
      priority: "high",
      status: "pending",
      reportedBy: "Guest (John Doe)",
      reportedDate: "2024-01-18",
      assignedStaff: "Pool Maintenance Team",
      estimatedCost: 1500,
      notes: "Guest reported cloudy water this morning. Urgent replacement needed.",
      category: "Pool Maintenance",
      dueDate: "2024-01-20"
    },
    {
      id: 2,
      taskTitle: "Air Conditioning Unit Service",
      description: "AC in master bedroom not cooling properly",
      propertyName: "Villa Aruna",
      priority: "medium",
      status: "in_progress",
      reportedBy: "Portfolio Manager",
      reportedDate: "2024-01-15",
      assignedStaff: "AC Technician - Somchai",
      estimatedCost: 2000,
      actualCost: 1800,
      notes: "Technician on-site. Refrigerant leak found and being repaired.",
      category: "HVAC",
      dueDate: "2024-01-19"
    },
    {
      id: 3,
      taskTitle: "Garden Sprinkler Repair",
      description: "Two sprinkler heads not working in front garden area",
      propertyName: "Villa Samui Breeze",
      priority: "low",
      status: "resolved",
      reportedBy: "Staff Member",
      reportedDate: "2024-01-12",
      assignedStaff: "Garden Team - Niran",
      estimatedCost: 800,
      actualCost: 650,
      notes: "Replaced two damaged sprinkler heads. System working normally.",
      category: "Landscaping",
      dueDate: "2024-01-16",
      completedDate: "2024-01-15"
    },
    {
      id: 4,
      taskTitle: "Kitchen Sink Drain Blockage",
      description: "Kitchen sink draining slowly, possible blockage",
      propertyName: "Villa Samui Breeze",
      priority: "medium",
      status: "pending",
      reportedBy: "Housekeeping Staff",
      reportedDate: "2024-01-17",
      assignedStaff: "Plumber - Chai",
      estimatedCost: 1200,
      notes: "Scheduled for inspection tomorrow morning",
      category: "Plumbing",
      dueDate: "2024-01-21"
    }
  ];

  const { data: maintenanceTasks, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio/maintenance'],
    initialData: mockMaintenanceTasks
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status, notes }: { taskId: number; status: string; notes?: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Task updated successfully",
        description: "Maintenance task status has been updated.",
      });
      setUpdateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio/maintenance'] });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const properties = ["Villa Aruna", "Villa Samui Breeze"];
  const statuses = ["pending", "in_progress", "resolved", "cancelled"];
  const priorities = ["low", "medium", "high", "urgent"];

  const filteredTasks = maintenanceTasks?.filter(task => {
    const matchesSearch = task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesProperty = !filterProperty || task.propertyName === filterProperty;
    const matchesPriority = !filterPriority || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesProperty && matchesPriority;
  }) || [];

  const handleStatusUpdate = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setUpdateDialogOpen(true);
  };

  const submitStatusUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTask) return;
    
    const formData = new FormData(event.currentTarget);
    const status = formData.get('status') as string;
    const notes = formData.get('notes') as string;
    
    updateStatusMutation.mutate({
      taskId: selectedTask.id,
      status,
      notes
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

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
              Error loading maintenance tasks. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
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
          <BreadcrumbPage>Maintenance</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Maintenance Management</h1>
        <p className="text-muted-foreground">
          Track and manage maintenance tasks for your assigned properties
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{maintenanceTasks?.filter(t => t.status === 'pending').length || 0}</p>
                <p className="text-xs text-muted-foreground">Pending Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{maintenanceTasks?.filter(t => t.status === 'in_progress').length || 0}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{maintenanceTasks?.filter(t => t.priority === 'urgent' || t.priority === 'high').length || 0}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  ${maintenanceTasks?.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterProperty} onValueChange={setFilterProperty}>
          <SelectTrigger>
            <SelectValue placeholder="All properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All properties</SelectItem>
            {properties.map(property => (
              <SelectItem key={property} value={property}>{property}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger>
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All priorities</SelectItem>
            {priorities.map(priority => (
              <SelectItem key={priority} value={priority}>{priority}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={() => {
          setSearchTerm("");
          setFilterStatus("");
          setFilterProperty("");
          setFilterPriority("");
        }}>
          Clear Filters
        </Button>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No maintenance tasks found</h3>
              <p className="text-muted-foreground">
                {maintenanceTasks?.length === 0 
                  ? "No maintenance tasks have been reported yet." 
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="border-l-4" style={{
              borderLeftColor: task.priority === 'urgent' ? '#ef4444' : 
                              task.priority === 'high' ? '#f97316' :
                              task.priority === 'medium' ? '#eab308' : '#22c55e'
            }}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      {task.taskTitle}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {task.propertyName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {task.dueDate}
                      </span>
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getStatusIcon(task.status)}
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{task.description}</p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reported by:</span>
                      <span>{task.reportedBy}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span>{task.assignedStaff}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{task.category}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reported:</span>
                      <span>{task.reportedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Cost:</span>
                      <span>${task.estimatedCost.toLocaleString()}</span>
                    </div>
                    {task.actualCost && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Actual Cost:</span>
                        <span>${task.actualCost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {task.notes && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm"><strong>Notes:</strong> {task.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusUpdate(task)}
                    disabled={task.status === 'resolved' || task.status === 'cancelled'}
                  >
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task Status</DialogTitle>
            <DialogDescription>
              Update the status and add notes for: {selectedTask?.taskTitle}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={submitStatusUpdate} className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={selectedTask?.status} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                name="notes" 
                placeholder="Add notes about the status update..."
                defaultValue={selectedTask?.notes}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateStatusMutation.isPending}>
                {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}