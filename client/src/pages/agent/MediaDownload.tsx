import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Image, 
  Video, 
  FileText, 
  Camera,
  Search,
  Filter,
  ExternalLink,
  Folder,
  Star,
  Eye,
  Share2
} from "lucide-react";

export default function MediaDownload() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const mediaLibrary = [
    {
      id: "M001",
      name: "Villa Samui Breeze - Exterior View",
      property: "Villa Samui Breeze",
      type: "image",
      category: "exterior",
      size: "2.4 MB",
      resolution: "4096x2304",
      format: "JPG",
      url: "https://example.com/villa-samui-exterior-1.jpg",
      downloadUrl: "https://cdn.example.com/download/villa-samui-exterior-1.jpg",
      description: "Beautiful exterior shot showcasing the villa's architecture and pool area",
      tags: ["pool", "architecture", "exterior", "daytime"],
      featured: true,
      approved: true
    },
    {
      id: "M002",
      name: "Villa Samui Breeze - Living Room",
      property: "Villa Samui Breeze", 
      type: "image",
      category: "interior",
      size: "1.8 MB",
      resolution: "3840x2160",
      format: "JPG",
      url: "https://example.com/villa-samui-living-1.jpg",
      downloadUrl: "https://cdn.example.com/download/villa-samui-living-1.jpg",
      description: "Spacious living room with modern furnishings and ocean view",
      tags: ["living room", "interior", "modern", "ocean view"],
      featured: false,
      approved: true
    },
    {
      id: "M003",
      name: "Villa Tropical Paradise - Pool Video",
      property: "Villa Tropical Paradise",
      type: "video",
      category: "exterior",
      size: "45.2 MB",
      resolution: "1920x1080",
      format: "MP4",
      duration: "00:01:32",
      url: "https://example.com/villa-tropical-pool.mp4",
      downloadUrl: "https://cdn.example.com/download/villa-tropical-pool.mp4",
      description: "Cinematic video tour of the infinity pool and surrounding tropical gardens",
      tags: ["pool", "garden", "video tour", "cinematic"],
      featured: true,
      approved: true
    },
    {
      id: "M004",
      name: "Villa Ocean View - Bedroom Suite",
      property: "Villa Ocean View",
      type: "image",
      category: "interior",
      size: "2.1 MB",
      resolution: "4096x2304",
      format: "JPG",
      url: "https://example.com/villa-ocean-bedroom-1.jpg",
      downloadUrl: "https://cdn.example.com/download/villa-ocean-bedroom-1.jpg",
      description: "Master bedroom with ocean views and private balcony access",
      tags: ["bedroom", "ocean view", "balcony", "master suite"],
      featured: false,
      approved: true
    },
    {
      id: "M005",
      name: "Villa Aruna Demo - Property Brochure",
      property: "Villa Aruna (Demo)",
      type: "document",
      category: "brochure",
      size: "8.5 MB",
      format: "PDF",
      url: "https://example.com/villa-aruna-brochure.pdf",
      downloadUrl: "https://cdn.example.com/download/villa-aruna-brochure.pdf",
      description: "Complete property brochure with amenities, rates, and booking information",
      tags: ["brochure", "rates", "amenities", "booking info"],
      featured: true,
      approved: true
    },
    {
      id: "M006",
      name: "Villa Tropical Paradise - Kitchen",
      property: "Villa Tropical Paradise",
      type: "image",
      category: "interior",
      size: "1.9 MB",
      resolution: "3840x2160",
      format: "JPG",
      url: "https://example.com/villa-tropical-kitchen-1.jpg",
      downloadUrl: "https://cdn.example.com/download/villa-tropical-kitchen-1.jpg",
      description: "Modern fully-equipped kitchen with island and breakfast bar",
      tags: ["kitchen", "modern", "island", "appliances"],
      featured: false,
      approved: true
    },
    {
      id: "M007",
      name: "All Properties - Rate Card 2025",
      property: "All Properties",
      type: "document",
      category: "rates",
      size: "1.2 MB",
      format: "PDF",
      url: "https://example.com/rate-card-2025.pdf",
      downloadUrl: "https://cdn.example.com/download/rate-card-2025.pdf",
      description: "Updated rate card for all properties with seasonal pricing",
      tags: ["rates", "pricing", "2025", "seasonal"],
      featured: true,
      approved: true
    },
    {
      id: "M008",
      name: "Villa Ocean View - Drone Footage",
      property: "Villa Ocean View",
      type: "video",
      category: "exterior",
      size: "78.5 MB",
      resolution: "4K",
      format: "MP4",
      duration: "00:02:15",
      url: "https://example.com/villa-ocean-drone.mp4",
      downloadUrl: "https://cdn.example.com/download/villa-ocean-drone.mp4",
      description: "Aerial drone footage showcasing the villa's location and surroundings",
      tags: ["drone", "aerial", "location", "surroundings"],
      featured: true,
      approved: true
    }
  ];

  const properties = ["Villa Samui Breeze", "Villa Ocean View", "Villa Tropical Paradise", "Villa Aruna (Demo)"];

  const filteredMedia = mediaLibrary.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProperty = propertyFilter === "all" || item.property === propertyFilter || 
                           (propertyFilter === "all-properties" && item.property === "All Properties");
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesProperty && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "document": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image": return "bg-blue-100 text-blue-800";
      case "video": return "bg-purple-100 text-purple-800";
      case "document": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const mediaStats = {
    totalFiles: mediaLibrary.length,
    images: mediaLibrary.filter(m => m.type === "image").length,
    videos: mediaLibrary.filter(m => m.type === "video").length,
    documents: mediaLibrary.filter(m => m.type === "document").length,
    featured: mediaLibrary.filter(m => m.featured).length
  };

  const downloadMedia = (item: any) => {
    // In a real application, this would trigger the actual download
    console.log(`Downloading: ${item.name}`);
    alert(`Downloading ${item.name}...`);
  };

  const downloadBulk = () => {
    alert(`Downloading ${filteredMedia.length} files...`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Media Download Center</h1>
            <p className="text-muted-foreground">Access approved marketing materials and property media</p>
          </div>
          <Button onClick={downloadBulk} disabled={filteredMedia.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Bulk Download ({filteredMedia.length})
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{mediaStats.totalFiles}</p>
              </div>
              <Folder className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">{mediaStats.images}</p>
              </div>
              <Image className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold">{mediaStats.videos}</p>
              </div>
              <Video className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{mediaStats.documents}</p>
              </div>
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold">{mediaStats.featured}</p>
              </div>
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Library */}
      <Tabs defaultValue="gallery" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="gallery">Gallery View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="all-properties">General Materials</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property} value={property}>{property}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="gallery">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {item.featured && (
                    <Star className="absolute top-2 right-2 h-5 w-5 text-yellow-500 fill-current" />
                  )}
                  {item.type === "image" && <Camera className="h-12 w-12 text-muted-foreground" />}
                  {item.type === "video" && <Video className="h-12 w-12 text-muted-foreground" />}
                  {item.type === "document" && <FileText className="h-12 w-12 text-muted-foreground" />}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                    <Badge className={getTypeColor(item.type)}>
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{item.property}</p>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                    <span>{item.format}</span>
                    <span>{item.size}</span>
                    {item.resolution && <span>{item.resolution}</span>}
                    {item.duration && <span>{item.duration}</span>}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => downloadMedia(item)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Detailed view of all approved marketing materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredMedia.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        {item.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{item.property}</span>
                          <span>{item.format}</span>
                          <span>{item.size}</span>
                          {item.resolution && <span>{item.resolution}</span>}
                          {item.duration && <span>{item.duration}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        
                        <div className="flex gap-1 mt-2">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => downloadMedia(item)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => {
              const propertyMedia = mediaLibrary.filter(m => m.property === property);
              const imageCount = propertyMedia.filter(m => m.type === "image").length;
              const videoCount = propertyMedia.filter(m => m.type === "video").length;
              const docCount = propertyMedia.filter(m => m.type === "document").length;
              
              return (
                <Card key={property}>
                  <CardHeader>
                    <CardTitle className="text-lg">{property}</CardTitle>
                    <CardDescription>
                      {propertyMedia.length} files available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Image className="h-4 w-4" />
                          Images
                        </span>
                        <span>{imageCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Videos
                        </span>
                        <span>{videoCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          Documents
                        </span>
                        <span>{docCount}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" onClick={() => {
                      setPropertyFilter(property);
                      // Switch to gallery tab to show filtered results
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      Download All ({propertyMedia.length})
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* General Materials Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">General Materials</CardTitle>
                <CardDescription>
                  Rate cards, brochures, and company materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Rate Cards
                    </span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Brochures
                    </span>
                    <span>1</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={() => setPropertyFilter("all-properties")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All (2)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}