import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Calendar, Download, Eye, File, FileText, Upload, Search, Filter, Plus, Trash2, Edit, FileImage, FileVideo, Clock, Building2 } from "lucide-react";

const DOCUMENT_CATEGORIES = [
  { value: 'contracts', label: 'Contracts', icon: FileText, description: 'Rental agreements and contracts' },
  { value: 'legal', label: 'Legal Documents', icon: File, description: 'Legal documents and certifications' },
  { value: 'tax_receipts', label: 'Tax Receipts', icon: FileText, description: 'Tax documents and receipts' },
  { value: 'service_contracts', label: 'Service Contracts', icon: File, description: 'Service provider contracts' },
  { value: 'plans', label: 'Plans & Blueprints', icon: FileImage, description: 'Property plans and blueprints' },
  { value: 'owner_notes', label: 'Owner Notes', icon: FileText, description: 'Owner notes and instructions' }
];

const VISIBILITY_OPTIONS = [
  { value: 'private', label: 'Private (Admin/PM Only)', description: 'Only visible to Admin and Portfolio Managers' },
  { value: 'visible_to_owner', label: 'Visible to Owner', description: 'Owner can view this document' }
];

interface PropertyDocument {
  id: number;
  organizationId: string;
  propertyId: number;
  title: string;
  category: string;
  visibility: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  description?: string;
  hasExpiration: boolean;
  expirationDate?: string;
  uploadedBy: string;
  uploadedByRole: string;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentSummary {
  totalDocuments: number;
  documentsByCategory: Array<{ category: string; count: number }>;
  expiringCount: number;
  recentUploads: number;
}

export default function DocumentCenter() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PropertyDocument | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "",
    visibility: "visible_to_owner",
    description: "",
    hasExpiration: false,
    expirationDate: "",
    propertyId: "",
    tags: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch properties for dropdown
  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties"],
  });

  // Fetch documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents", selectedProperty, selectedCategory],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedProperty) params.append('propertyId', selectedProperty);
      if (selectedCategory) params.append('category', selectedCategory);
      return apiRequest("GET", `/api/documents?${params.toString()}`);
    }
  });

  // Fetch document summary
  const { data: summary } = useQuery<DocumentSummary>({
    queryKey: ["/api/documents/summary", selectedProperty],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedProperty) params.append('propertyId', selectedProperty);
      return apiRequest("GET", `/api/documents/summary?${params.toString()}`);
    }
  });

  // Fetch expiring documents
  const { data: expiringDocuments = [] } = useQuery({
    queryKey: ["/api/documents/expiring"],
  });

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async (documentData: any) => {
      return apiRequest("POST", "/api/documents", documentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/summary"] });
      setShowUploadDialog(false);
      setUploadForm({
        title: "",
        category: "",
        visibility: "visible_to_owner",
        description: "",
        hasExpiration: false,
        expirationDate: "",
        propertyId: "",
        tags: ""
      });
      toast({
        title: "Document uploaded successfully",
        description: "The document has been added to the system.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      return apiRequest("DELETE", `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/summary"] });
      toast({
        title: "Document deleted",
        description: "The document has been removed from the system.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.category || !uploadForm.propertyId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const documentData = {
      ...uploadForm,
      propertyId: parseInt(uploadForm.propertyId),
      tags: uploadForm.tags ? uploadForm.tags.split(',').map(tag => tag.trim()) : [],
      fileName: `${uploadForm.title}.pdf`, // Mock file name
      filePath: `/documents/${uploadForm.title.replace(/\s+/g, '_')}.pdf`,
      fileSize: Math.floor(Math.random() * 1000000) + 100000, // Mock file size
      fileType: 'application/pdf'
    };

    uploadMutation.mutate(documentData);
  };

  const filteredDocuments = documents.filter((doc: PropertyDocument) => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return FileImage;
    if (fileType.includes('video')) return FileVideo;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expiry = new Date(expirationDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Center</h1>
          <p className="text-muted-foreground">
            Manage property documents, contracts, and important files
          </p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Add a new document to the property management system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title*</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    placeholder="Enter document title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property">Property*</Label>
                  <Select value={uploadForm.propertyId} onValueChange={(value) => setUploadForm({...uploadForm, propertyId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property: any) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select value={uploadForm.category} onValueChange={(value) => setUploadForm({...uploadForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={uploadForm.visibility} onValueChange={(value) => setUploadForm({...uploadForm, visibility: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIBILITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  placeholder="Document description (optional)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  placeholder="Comma-separated tags (optional)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hasExpiration"
                  checked={uploadForm.hasExpiration}
                  onCheckedChange={(checked) => setUploadForm({...uploadForm, hasExpiration: checked})}
                />
                <Label htmlFor="hasExpiration">Document has expiration date</Label>
              </div>

              {uploadForm.hasExpiration && (
                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={uploadForm.expirationDate}
                    onChange={(e) => setUploadForm({...uploadForm, expirationDate: e.target.value})}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="documents">📁 All Documents</TabsTrigger>
          <TabsTrigger value="expiring">⚠️ Expiring</TabsTrigger>
          <TabsTrigger value="access-logs">📋 Access Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary?.totalDocuments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Across all properties
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{summary?.expiringCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Next 30 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
                <Upload className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{summary?.recentUploads || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{properties.length}</div>
                <p className="text-xs text-muted-foreground">
                  With documents
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Documents by Category</CardTitle>
              <CardDescription>Distribution of documents across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DOCUMENT_CATEGORIES.map((category) => {
                  const categoryData = summary?.documentsByCategory?.find(c => c.category === category.value);
                  const count = categoryData?.count || 0;
                  const Icon = category.icon;
                  
                  return (
                    <div key={category.value} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{category.label}</p>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Properties</SelectItem>
                {properties.map((property: any) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((document: PropertyDocument) => {
              const FileIcon = getFileIcon(document.fileType);
              const categoryData = DOCUMENT_CATEGORIES.find(c => c.value === document.category);
              
              return (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm truncate">{document.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {categoryData?.label}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(document)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(document.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(document.fileSize)}</span>
                      <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {document.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {document.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge variant={document.visibility === 'private' ? 'destructive' : 'secondary'}>
                        {document.visibility === 'private' ? 'Private' : 'Owner Visible'}
                      </Badge>
                      
                      {document.hasExpiration && isExpiringSoon(document.expirationDate) && (
                        <Badge variant="destructive" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Expires Soon
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredDocuments.length === 0 && !documentsLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <File className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery || selectedProperty || selectedCategory 
                    ? "Try adjusting your filters or search query."
                    : "Upload your first document to get started."
                  }
                </p>
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expiring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Documents Expiring Soon</span>
              </CardTitle>
              <CardDescription>
                Documents that will expire within the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expiringDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No expiring documents</h3>
                  <p className="text-muted-foreground">All documents are up to date.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {expiringDocuments.map((document: PropertyDocument) => {
                    const daysUntilExpiry = document.expirationDate 
                      ? Math.ceil((new Date(document.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      : 0;
                    
                    return (
                      <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <File className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{document.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Expires: {new Date(document.expirationDate!).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={daysUntilExpiry <= 7 ? "destructive" : "destructive"}>
                            {daysUntilExpiry <= 0 ? "EXPIRED" : `${daysUntilExpiry} days`}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Access Logs</CardTitle>
              <CardDescription>
                Track who accessed which documents and when (Admin/PM only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Access logs</h3>
                <p className="text-muted-foreground">
                  Document access history will appear here when documents are viewed or modified.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Preview Dialog */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedDocument.title}</DialogTitle>
              <DialogDescription>
                {DOCUMENT_CATEGORIES.find(c => c.value === selectedDocument.category)?.label}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>File Name</Label>
                  <p className="text-muted-foreground">{selectedDocument.fileName}</p>
                </div>
                <div>
                  <Label>File Size</Label>
                  <p className="text-muted-foreground">{formatFileSize(selectedDocument.fileSize)}</p>
                </div>
                <div>
                  <Label>Uploaded By</Label>
                  <p className="text-muted-foreground">{selectedDocument.uploadedByRole}</p>
                </div>
                <div>
                  <Label>Upload Date</Label>
                  <p className="text-muted-foreground">{new Date(selectedDocument.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedDocument.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-muted-foreground text-sm">{selectedDocument.description}</p>
                </div>
              )}
              
              {selectedDocument.hasExpiration && (
                <div>
                  <Label>Expiration Date</Label>
                  <p className="text-muted-foreground">{new Date(selectedDocument.expirationDate!).toLocaleDateString()}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                  Close
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}