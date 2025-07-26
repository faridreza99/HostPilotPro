import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bot, 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Clock, 
  MessageSquare, 
  Star, 
  Activity,
  Brain,
  Languages,
  Search,
  Users,
  BarChart3
} from "lucide-react";

interface AiVirtualManager {
  id: number;
  propertyId: number | null;
  organizationId: string;
  avatarName: string;
  knowledgeBase: any;
  language: string;
  lastActive: string;
  isActive: boolean;
  totalInteractions: number;
  avgResponseTime: number;
  satisfactionScore: number;
  createdAt: string;
  updatedAt: string;
}

interface Property {
  id: number;
  name: string;
}

const managerFormSchema = z.object({
  propertyId: z.number().optional(),
  avatarName: z.string().min(1, "Avatar name is required"),
  language: z.string().min(1, "Language is required"),
  isActive: z.boolean().default(true),
  knowledgeBase: z.object({
    propertyInfo: z.object({
      name: z.string().optional(),
      address: z.string().optional(),
      amenities: z.array(z.string()).optional(),
      rules: z.array(z.string()).optional(),
      checkInOut: z.string().optional(),
      emergencyContacts: z.array(z.any()).optional(),
    }).optional(),
    localInfo: z.object({
      attractions: z.array(z.string()).optional(),
      restaurants: z.array(z.string()).optional(),
      transportation: z.array(z.string()).optional(),
      services: z.array(z.string()).optional(),
    }).optional(),
    operationalInfo: z.object({
      wifiPassword: z.string().optional(),
      applianceInstructions: z.array(z.string()).optional(),
      maintenanceContacts: z.array(z.any()).optional(),
      keyProcesses: z.array(z.string()).optional(),
    }).optional(),
    personalizedSettings: z.object({
      tone: z.string().optional(),
      responseStyle: z.string().optional(),
      specializations: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
    }).optional(),
  }).optional(),
});

type ManagerFormData = z.infer<typeof managerFormSchema>;

export default function AiVirtualManagersManagement() {
  const [selectedManager, setSelectedManager] = useState<AiVirtualManager | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ManagerFormData>({
    resolver: zodResolver(managerFormSchema),
    defaultValues: {
      avatarName: "",
      language: "en",
      isActive: true,
      knowledgeBase: {
        propertyInfo: {
          amenities: [],
          rules: [],
          emergencyContacts: [],
        },
        localInfo: {
          attractions: [],
          restaurants: [],
          transportation: [],
          services: [],
        },
        operationalInfo: {
          applianceInstructions: [],
          maintenanceContacts: [],
          keyProcesses: [],
        },
        personalizedSettings: {
          specializations: [],
          languages: [],
        },
      },
    },
  });

  // Fetch AI Virtual Managers
  const { data: managers = [], isLoading } = useQuery({
    queryKey: ["/api/ai-virtual-managers"],
    queryFn: () => apiRequest("/api/ai-virtual-managers").then(res => res.json()),
  });

  // Fetch Properties for dropdown
  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: () => apiRequest("/api/properties").then(res => res.json()),
  });

  // Fetch Analytics
  const { data: analytics } = useQuery({
    queryKey: ["/api/ai-virtual-managers/analytics"],
    queryFn: () => apiRequest("/api/ai-virtual-managers/analytics").then(res => res.json()),
  });

  // Create Manager Mutation
  const createManagerMutation = useMutation({
    mutationFn: (data: ManagerFormData) =>
      apiRequest("POST", "/api/ai-virtual-managers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-virtual-managers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-virtual-managers/analytics"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "AI Virtual Manager created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI Virtual Manager",
        variant: "destructive",
      });
    },
  });

  // Update Manager Mutation
  const updateManagerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ManagerFormData }) =>
      apiRequest("PUT", `/api/ai-virtual-managers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-virtual-managers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-virtual-managers/analytics"] });
      setIsEditDialogOpen(false);
      setSelectedManager(null);
      form.reset();
      toast({
        title: "Success",
        description: "AI Virtual Manager updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update AI Virtual Manager",
        variant: "destructive",
      });
    },
  });

  // Delete Manager Mutation
  const deleteManagerMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/ai-virtual-managers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-virtual-managers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-virtual-managers/analytics"] });
      toast({
        title: "Success",
        description: "AI Virtual Manager deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete AI Virtual Manager",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (manager: AiVirtualManager) => {
    setSelectedManager(manager);
    form.reset({
      propertyId: manager.propertyId || undefined,
      avatarName: manager.avatarName,
      language: manager.language,
      isActive: manager.isActive,
      knowledgeBase: manager.knowledgeBase || {},
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this AI Virtual Manager?")) {
      deleteManagerMutation.mutate(id);
    }
  };

  const onSubmit = (data: ManagerFormData) => {
    if (selectedManager) {
      updateManagerMutation.mutate({ id: selectedManager.id, data });
    } else {
      createManagerMutation.mutate(data);
    }
  };

  const filteredManagers = managers.filter((manager: AiVirtualManager) =>
    manager.avatarName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      en: "🇺🇸", th: "🇹🇭", zh: "🇨🇳", ja: "🇯🇵", ko: "🇰🇷", 
      de: "🇩🇪", fr: "🇫🇷", it: "🇮🇹"
    };
    return flags[language] || "🌐";
  };

  const getPropertyName = (propertyId: number | null) => {
    if (!propertyId) return "Global Assistant";
    const property = properties.find((p: Property) => p.id === propertyId);
    return property?.name || `Property ${propertyId}`;
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Virtual Managers</h1>
          <p className="text-muted-foreground">
            Manage property-specific AI assistants with customized knowledge bases
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create AI Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create AI Virtual Manager</DialogTitle>
              <DialogDescription>
                Set up a new AI assistant with property-specific knowledge
              </DialogDescription>
            </DialogHeader>
            <ManagerForm
              form={form}
              onSubmit={onSubmit}
              properties={properties}
              isLoading={createManagerMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="managers">Managers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalManagers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.activeManagers || 0} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalInteractions || 0}</div>
                <p className="text-xs text-muted-foreground">Across all managers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.avgSatisfactionScore?.toFixed(1) || "0.0"}
                </div>
                <p className="text-xs text-muted-foreground">Out of 5.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Languages</CardTitle>
                <Languages className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.languageDistribution?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Supported languages</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Language Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics?.languageDistribution?.map((lang: any) => (
                  <div key={lang.language} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getLanguageFlag(lang.language)}</span>
                      <span className="capitalize">{lang.language}</span>
                    </div>
                    <Badge variant="secondary">{lang.count} managers</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managers" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredManagers.map((manager: AiVirtualManager) => (
              <Card key={manager.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{manager.avatarName}</CardTitle>
                      <CardDescription>
                        {getPropertyName(manager.propertyId)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">{getLanguageFlag(manager.language)}</span>
                      <Badge variant={manager.isActive ? "default" : "secondary"}>
                        {manager.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{manager.totalInteractions} chats</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{manager.avgResponseTime?.toFixed(1)}s avg</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span>{manager.satisfactionScore?.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(manager.lastActive).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(manager)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(manager.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance Analytics</span>
              </CardTitle>
              <CardDescription>
                Detailed performance metrics for all AI Virtual Managers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Advanced analytics coming soon</p>
                <p className="text-sm">Track conversation quality, response accuracy, and user satisfaction</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global AI Settings</CardTitle>
              <CardDescription>
                Configure system-wide AI behavior and performance settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Global settings coming soon</p>
                <p className="text-sm">Set default response styles, language preferences, and training parameters</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit AI Virtual Manager</DialogTitle>
            <DialogDescription>
              Update AI assistant configuration and knowledge base
            </DialogDescription>
          </DialogHeader>
          <ManagerForm
            form={form}
            onSubmit={onSubmit}
            properties={properties}
            isLoading={updateManagerMutation.isPending}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ManagerForm({ 
  form, 
  onSubmit, 
  properties, 
  isLoading, 
  isEdit = false 
}: {
  form: any;
  onSubmit: (data: ManagerFormData) => void;
  properties: Property[];
  isLoading: boolean;
  isEdit?: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="avatarName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Maya - Villa Assistant" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="th">🇹🇭 Thai</SelectItem>
                    <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                    <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                    <SelectItem value="ko">🇰🇷 Korean</SelectItem>
                    <SelectItem value="de">🇩🇪 German</SelectItem>
                    <SelectItem value="fr">🇫🇷 French</SelectItem>
                    <SelectItem value="it">🇮🇹 Italian</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Assignment</FormLabel>
                <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property or leave global" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Global Assistant</SelectItem>
                    {properties.map((property: Property) => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Enable this AI manager to respond to guests
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Knowledge Base Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure the AI's knowledge about the property, local area, and operational procedures
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
            ) : null}
            {isEdit ? "Update Manager" : "Create Manager"}
          </Button>
        </div>
      </form>
    </Form>
  );
}