import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench,
  Calendar,
  User,
  MapPin
} from 'lucide-react';

// Ultra-fast demo tasks data - no API calls, instant loading
const ULTRA_FAST_TASKS = [
  {
    id: 1,
    title: "Pool cleaning and chemical balancing",
    description: "Weekly pool maintenance and water quality check",
    type: "maintenance",
    status: "pending",
    priority: "high",
    propertyId: 1,
    propertyName: "Villa Samui Breeze",
    assigneeId: "staff-1",
    assigneeName: "Somchai Pattaya",
    dueDate: "2025-01-31",
    createdAt: "2025-01-28",
    estimatedHours: 2,
    category: "Property Maintenance"
  },
  {
    id: 2,
    title: "AC system inspection and filter replacement",
    description: "Quarterly AC maintenance for all units",
    type: "maintenance",
    status: "in-progress",
    priority: "medium",
    propertyId: 2,
    propertyName: "Villa Ocean View",
    assigneeId: "staff-2",
    assigneeName: "Niran Koh",
    dueDate: "2025-02-02",
    createdAt: "2025-01-25",
    estimatedHours: 4,
    category: "Property Maintenance"
  },
  {
    id: 3,
    title: "Guest check-in preparation",
    description: "Prepare villa for incoming guests - cleaning and setup",
    type: "cleaning",
    status: "completed",
    priority: "high",
    propertyId: 4,
    propertyName: "Villa Aruna Demo",
    assigneeId: "staff-3",
    assigneeName: "Malee Chiang",
    dueDate: "2025-01-30",
    createdAt: "2025-01-29",
    estimatedHours: 3,
    category: "Guest Services"
  },
  {
    id: 4,
    title: "Garden maintenance and landscaping",
    description: "Monthly garden care and plant maintenance",
    type: "landscaping",
    status: "pending",
    priority: "low",
    propertyId: 3,
    propertyName: "Villa Tropical Paradise",
    assigneeId: "staff-4",
    assigneeName: "Boon Rayong",
    dueDate: "2025-02-05",
    createdAt: "2025-01-27",
    estimatedHours: 6,
    category: "Property Maintenance"
  },
  {
    id: 5,
    title: "WiFi system upgrade and testing",
    description: "Install new WiFi equipment and test connectivity",
    type: "technology",
    status: "pending",
    priority: "medium",
    propertyId: 1,
    propertyName: "Villa Samui Breeze",
    assigneeId: "staff-5",
    assigneeName: "Tech Support",
    dueDate: "2025-02-01",
    createdAt: "2025-01-26",
    estimatedHours: 4,
    category: "Technology"
  },
  {
    id: 6,
    title: "Security system check",
    description: "Monthly security system inspection and battery check",
    type: "security",
    status: "in-progress",
    priority: "high",
    propertyId: 2,
    propertyName: "Villa Ocean View",
    assigneeId: "staff-1",
    assigneeName: "Somchai Pattaya",
    dueDate: "2025-01-31",
    createdAt: "2025-01-28",
    estimatedHours: 1,
    category: "Security"
  }
];

const SUMMARY_STATS = {
  totalTasks: 6,
  pendingTasks: 3,
  inProgressTasks: 2,
  completedTasks: 1,
  overdueTasks: 0,
  highPriorityTasks: 3
};

export default function UltraFastTasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Instant filtering with no delays
  const filteredTasks = useMemo(() => {
    return ULTRA_FAST_TASKS.filter(task => {
      const matchesSearch = searchTerm === "" || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesType = typeFilter === "all" || task.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [searchTerm, statusFilter, priorityFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "in-progress": return <Wrench className="h-4 w-4" />;
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleCompleteTask = (taskId: number) => {
    // In a real app, this would make an API call
    console.log(`Completing task ${taskId}`);
  };

  const handleEditTask = (taskId: number) => {
    // In a real app, this would open an edit dialog
    console.log(`Editing task ${taskId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            Track and manage all property maintenance and operational tasks
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{SUMMARY_STATS.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              All tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{SUMMARY_STATS.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting start
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{SUMMARY_STATS.inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{SUMMARY_STATS.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Recently finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{SUMMARY_STATS.highPriorityTasks}</div>
            <p className="text-xs text-muted-foreground">
              Urgent attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{SUMMARY_STATS.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title, description, or property..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="landscaping">Landscaping</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
          <CardDescription>
            Manage all property tasks and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or create a new task.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Task
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {task.estimatedHours}h estimated
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{task.propertyName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{task.assigneeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {task.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(task.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(task.status)}
                            {task.status.replace('-', ' ')}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditTask(task.id)}
                          >
                            Edit
                          </Button>
                          {task.status !== 'completed' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleCompleteTask(task.id)}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}