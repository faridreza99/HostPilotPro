import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Calendar,
  User,
  Building,
  Eye,
  Trash2,
  Plus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: string;
  propertyName: string;
  category: string;
  uploadDate: string;
  uploadedBy: string;
  description: string;
  status: "approved" | "pending" | "rejected";
  downloadUrl: string;
}

export default function Documents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Mock data for portfolio manager's assigned property documents
  const mockDocuments: Document[] = [
    {
      id: 1,
      fileName: "Villa_Aruna_Insurance_Policy.pdf",
      fileType: "PDF",
      fileSize: "2.1 MB",
      propertyName: "Villa Aruna",
      category: "Insurance",
      uploadDate: "2024-01-15",
      uploadedBy: "Admin User",
      description: "Property insurance policy document",
      status: "approved",
      downloadUrl: "#"
    },
    {
      id: 2,
      fileName: "Villa_Aruna_Floorplan.pdf",
      fileType: "PDF",
      fileSize: "5.3 MB",
      propertyName: "Villa Aruna",
      category: "Property Plans",
      uploadDate: "2024-01-10",
      uploadedBy: "Owner",
      description: "Detailed floor plan and layout",
      status: "approved",
      downloadUrl: "#"
    },
    {
      id: 3,
      fileName: "Samui_Breeze_Rental_License.pdf",
      fileType: "PDF",
      fileSize: "1.8 MB",
      propertyName: "Villa Samui Breeze",
      category: "Legal Documents",
      uploadDate: "2024-01-05",
      uploadedBy: "Admin User",
      description: "Government rental operation license",
      status: "approved",
      downloadUrl: "#"
    },
    {
      id: 4,
      fileName: "Villa_Aruna_Welcome_Guide.pdf",
      fileType: "PDF",
      fileSize: "3.2 MB",
      propertyName: "Villa Aruna",
      category: "Guest Information",
      uploadDate: "2024-01-12",
      uploadedBy: "Portfolio Manager",
      description: "Guest welcome guide and house rules",
      status: "pending",
      downloadUrl: "#"
    }
  ];

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio/documents'],
    initialData: mockDocuments
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Mock upload functionality
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Document uploaded successfully",
        description: "The document is now pending review.",
      });
      setUploadDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio/documents'] });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const categories = ["Insurance", "Property Plans", "Legal Documents", "Guest Information", "Maintenance Records", "Safety Certificates"];
  const properties = ["Villa Aruna", "Villa Samui Breeze"];

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || doc.category === filterCategory;
    const matchesProperty = !filterProperty || doc.propertyName === filterProperty;
    
    return matchesSearch && matchesCategory && matchesProperty;
  }) || [];

  const handleUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    uploadMutation.mutate(formData);
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
              Error loading documents. Please try again later.
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
          <BreadcrumbPage>Documents</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Document Center</h1>
          <p className="text-muted-foreground">
            View and manage documents for your assigned properties
          </p>
        </div>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload a document for one of your assigned properties
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="property">Property</Label>
                <Select name="property" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property..." />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(property => (
                      <SelectItem key={property} value={property}>{property}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input name="description" placeholder="Brief description..." required />
              </div>
              
              <div>
                <Label htmlFor="file">File</Label>
                <Input name="file" type="file" accept=".pdf,.doc,.docx,.jpg,.png" required />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
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
        
        <Button variant="outline" onClick={() => {
          setSearchTerm("");
          setFilterCategory("");
          setFilterProperty("");
        }}>
          Clear Filters
        </Button>
      </div>

      {/* Documents Table */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                {documents?.length === 0 
                  ? "No documents have been uploaded yet." 
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.fileName}</p>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Building className="h-3 w-3 mr-1" />
                          {doc.propertyName}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {doc.uploadDate}
                        </span>
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {doc.uploadedBy}
                        </span>
                        <span>{doc.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      doc.status === "approved" ? "default" :
                      doc.status === "pending" ? "secondary" : "destructive"
                    }>
                      {doc.status}
                    </Badge>
                    <Badge variant="outline">{doc.category}</Badge>
                    
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}