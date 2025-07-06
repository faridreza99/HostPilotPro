import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Menu, 
  X,
  ArrowLeft,
  LogOut,
  Settings,
  User,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Activity,
  Database,
  Home,
  Building,
  CheckSquare,
  Calendar,
  DollarSign,
  FileText,
  Wrench,
  Users,
  MessageSquare,
  Clock,
  BarChart3,
  Package,
  UserPlus,
  Camera,
  BookOpen,
  Star,
  Car,
  Coffee,
  FolderOpen,
  Key,
  Luggage,
  CheckCircle,
  Phone,
  Eye,
  Brain,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Calculator,
  Droplets,
  Target,
  Filter
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
  description?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const getRoleBasedMenus = (role: string): MenuSection[] => {
  const commonMenus: MenuSection[] = [
    {
      title: "Navigation",
      items: [
        { label: "Dashboard", icon: Home, href: "/", description: "Main dashboard overview" },
      ]
    },
    {
      title: "Support",
      items: [
        { label: "Help", icon: Phone, href: "/help", description: "Contact information and support" },
      ]
    }
  ];

  const roleSpecificMenus: Record<string, MenuSection[]> = {
    admin: [
      {
        title: "Dashboard",
        items: [
          { label: "Daily Operations", icon: Calendar, href: "/daily-operations" },
          { label: "Enhanced Admin Dashboard", icon: BarChart3, href: "/enhanced-admin-dashboard", badge: "Enhanced" },
          { label: "Properties", icon: Building, href: "/properties" },
          { label: "Bookings", icon: Calendar, href: "/bookings" },
        ]
      },
      {
        title: "Finances",
        items: [
          { label: "Finances", icon: DollarSign, href: "/finances" },
          { label: "Filtered Financial Dashboard", icon: BarChart3, href: "/filtered-financial-dashboard", badge: "Filtered" },
          { label: "Enhanced Financial Controls", icon: Shield, href: "/enhanced-financial-controls" },
          { label: "Booking Revenue Transparency", icon: BarChart3, href: "/booking-revenue-transparency", badge: "New" },
          { label: "OTA Revenue & Net Payout", icon: BarChart3, href: "/ota-revenue-net-payout-calculation", badge: "New" },
          { label: "OTA Payout Logic — Smart Revenue", icon: Calculator, href: "/ota-payout-logic-smart-revenue", badge: "NEW" },
          { label: "Smart Pricing & Performance", icon: Brain, href: "/smart-pricing-performance-toolkit", badge: "AI" },
          { label: "Invoices", icon: FileText, href: "/invoice-generator" },
          { label: "Booking Income", icon: BarChart3, href: "/booking-income-rules" },
          { label: "Finance Engine", icon: Database, href: "/finance-engine" },
          { label: "Payouts", icon: DollarSign, href: "/payouts" },
        ]
      },
      {
        title: "Tasks",
        items: [
          { label: "Tasks Overview", icon: CheckSquare, href: "/tasks" },
          { label: "Maintenance System", icon: Wrench, href: "/maintenance-task-system" },
          { label: "Auto-Scheduling Rules", icon: Clock, href: "/auto-scheduling-recurring-task-generator", badge: "New" },
          { label: "Maintenance Log & Warranty", icon: Wrench, href: "/maintenance-log-warranty-tracker", badge: "New" },
          { label: "Maintenance & Service Tracking", icon: Activity, href: "/maintenance-service-tracking", badge: "New" },
          { label: "Task Attachments", icon: FileText, href: "/task-attachments-notes" },
          { label: "Check-in/Check-out", icon: LogOut, href: "/checkin-checkout-workflow" },
          { label: "Guest Check-In Tracker", icon: Luggage, href: "/guest-checkin-checkout-tracker", badge: "New" },
          { label: "Fixed Guest Check-In Tracker", icon: Luggage, href: "/fixed-guest-checkin-tracker", badge: "Fixed" },
          { label: "AI Task Manager", icon: Activity, href: "/ai-task-manager" },
        ]
      },
      {
        title: "Utilities",
        items: [
          { label: "Utilities & Maintenance", icon: Settings, href: "/maintenance-utilities-renovation-tracker" },
          { label: "Extended Utilities Management", icon: Settings, href: "/extended-utilities-management", badge: "New" },
          { label: "Water Emergency Refill Log", icon: Droplets, href: "/water-utility-emergency-truck-refill-log", badge: "New" },
          { label: "Water Utility & Emergency Tracker", icon: Droplets, href: "/water-utility-emergency-tracker", badge: "New" },
          { label: "Enhanced Water Utility", icon: Droplets, href: "/water-utility-enhanced", badge: "AI" },
          { label: "Utility Tracker", icon: Car, href: "/utility-tracker" },
        ]
      },
      {
        title: "Agents / Staff",
        items: [
          { label: "Staff Management", icon: Users, href: "/staff-tasks" },
          { label: "Guest Services", icon: MessageSquare, href: "/guest-communication-center" },
          { label: "Service Request Confirmation", icon: CheckCircle, href: "/service-request-confirmation", badge: "New" },
          { label: "Media Library", icon: Camera, href: "/agent-media-library" },
          { label: "Owner Onboarding", icon: UserPlus, href: "/owner-onboarding-system", badge: "New" },
          { label: "Local Contacts Management", icon: Phone, href: "/local-contacts-management", badge: "New" },
        ]
      },
      {
        title: "Tools / Modules",
        items: [
          { label: "Filtered Property Dashboard", icon: Building, href: "/filtered-property-dashboard", badge: "Filtered" },
          { label: "Document Center", icon: FolderOpen, href: "/document-center" },
          { label: "Property Access", icon: Key, href: "/property-access" },
          { label: "Welcome Packs", icon: Package, href: "/welcome-packs" },
          { label: "Smart Inventory", icon: Package, href: "/smart-inventory-dashboard", badge: "New" },
          { label: "Service Marketplace", icon: Star, href: "/service-marketplace-dashboard", badge: "New" },
          { label: "AI Notifications & Reminders", icon: Brain, href: "/ai-notifications-reminders", badge: "New" },
          { label: "Property Goals & Investment Plans", icon: Target, href: "/property-goals-investment-plans", badge: "New" },
        ]
      },
      {
        title: "Guest Services",
        items: [
          { label: "Guest Communication", icon: MessageSquare, href: "/guest-communication-center" },
          { label: "Service Request Confirmation", icon: CheckCircle, href: "/service-request-confirmation", badge: "New" },
          { label: "Add-on Services", icon: Coffee, href: "/addon-services-booking" },
          { label: "Agent Media Library", icon: Camera, href: "/agent-media-library" },
          { label: "Loyalty Tracker", icon: Star, href: "/loyalty-tracker" },
        ]
      },
      {
        title: "Financial",
        items: [
          { label: "Enhanced Financial Controls", icon: Shield, href: "/enhanced-financial-controls" },
          { label: "Booking Revenue Transparency", icon: BarChart3, href: "/booking-revenue-transparency", badge: "New" },
          { label: "OTA Revenue & Net Payout", icon: BarChart3, href: "/ota-revenue-net-payout-calculation", badge: "New" },
          { label: "OTA Payout Logic — Smart Revenue", icon: Calculator, href: "/ota-payout-logic-smart-revenue", badge: "NEW" },
          { label: "Smart Pricing & Performance", icon: Brain, href: "/smart-pricing-performance-toolkit", badge: "AI" },
          { label: "Financial Toolkit", icon: DollarSign, href: "/financial-toolkit" },
          { label: "Invoice Generator", icon: FileText, href: "/invoice-generator" },
          { label: "Booking Income Rules", icon: BarChart3, href: "/booking-income-rules" },
          { label: "Finance Engine", icon: Database, href: "/finance-engine" },
          { label: "Utility Tracker", icon: Car, href: "/utility-tracker" },
          { label: "Payouts", icon: DollarSign, href: "/payouts" },
        ]
      },
      {
        title: "Administration",
        items: [
          { label: "Enhanced Admin Dashboard", icon: BarChart3, href: "/enhanced-admin-dashboard", badge: "Enhanced" },
          { label: "User Management", icon: Users, href: "/admin/user-management", badge: "New" },
          { label: "User Permission Control Panel", icon: Shield, href: "/user-permission-control-panel", badge: "NEW" },
          { label: "User Access Manager", icon: Shield, href: "/admin/user-access-manager", badge: "Admin" },
          { label: "User Access & Visibility", icon: Eye, href: "/admin/user-access", badge: "New" },
          { label: "Property Visibility Control", icon: Shield, href: "/property-visibility-control", badge: "New" },
          { label: "System Integrity Check", icon: Shield, href: "/admin/system-integrity-check", badge: "QA" },
          { label: "Activity Logs", icon: Activity, href: "/admin/activity-log" },
          { label: "Finance Reset", icon: Shield, href: "/admin/finance-reset" },
          { label: "AI Notifications & Reminders", icon: Brain, href: "/ai-notifications-reminders", badge: "New" },
          { label: "Owner Targets & Upgrades", icon: Target, href: "/owner-target-upgrade-tracker", badge: "New" },
          { label: "System Settings", icon: Settings, href: "/settings" },
          { label: "Utility Settings", icon: Settings, href: "/admin/utility-customization" },
        ]
      }
    ],
    "portfolio-manager": [
      {
        title: "Portfolio Management",
        items: [
          { label: "My Properties", icon: Building, href: "/properties" },
          { label: "Check-in/Check-out", icon: LogOut, href: "/checkin-checkout-workflow" },
          { label: "Tasks Overview", icon: CheckSquare, href: "/tasks" },
          { label: "Auto-Scheduling Rules", icon: Clock, href: "/auto-scheduling-recurring-task-generator", badge: "New" },
          { label: "Maintenance Log & Warranty", icon: Wrench, href: "/maintenance-log-warranty-tracker", badge: "New" },
          { label: "Maintenance & Service Tracking", icon: Activity, href: "/maintenance-service-tracking", badge: "New" },
          { label: "Bookings", icon: Calendar, href: "/bookings" },
          { label: "Maintenance", icon: Wrench, href: "/maintenance-task-system" },
          { label: "Document Center", icon: FolderOpen, href: "/document-center" },
          { label: "Property Access", icon: Key, href: "/property-access" },
          { label: "Owner Onboarding", icon: UserPlus, href: "/owner-onboarding-system", badge: "New" },
          { label: "Owner Onboarding & Utility Settings", icon: Settings, href: "/owner-onboarding-utility-settings", badge: "New" },
          { label: "Extended Utilities Management", icon: Settings, href: "/extended-utilities-management", badge: "New" },
          { label: "Enhanced Water Utility", icon: Droplets, href: "/water-utility-enhanced", badge: "AI" },
          { label: "AI Notifications & Reminders", icon: Brain, href: "/ai-notifications-reminders", badge: "New" },
          { label: "Owner Targets & Upgrades", icon: Target, href: "/owner-target-upgrade-tracker", badge: "New" },
        ]
      },
      {
        title: "Financial",
        items: [
          { label: "Enhanced Financial Controls", icon: Shield, href: "/enhanced-financial-controls" },
          { label: "Booking Revenue Transparency", icon: BarChart3, href: "/booking-revenue-transparency", badge: "New" },
          { label: "OTA Revenue & Net Payout", icon: BarChart3, href: "/ota-revenue-net-payout-calculation", badge: "New" },
          { label: "OTA Payout Logic — Smart Revenue", icon: Calculator, href: "/ota-payout-logic-smart-revenue", badge: "NEW" },
          { label: "Smart Pricing & Performance", icon: Brain, href: "/smart-pricing-performance-toolkit", badge: "AI" },
          { label: "Invoices", icon: FileText, href: "/invoice-generator" },
          { label: "Booking Income", icon: BarChart3, href: "/booking-income-rules" },
          { label: "Finance Engine", icon: Database, href: "/finance-engine" },
          { label: "Payouts", icon: DollarSign, href: "/payouts" },
        ]
      },
      {
        title: "Operations",
        items: [
          { label: "Staff Management", icon: Users, href: "/staff-tasks" },
          { label: "Guest Services", icon: MessageSquare, href: "/guest-communication-center" },
          { label: "Service Request Confirmation", icon: CheckCircle, href: "/service-request-confirmation", badge: "New" },
          { label: "Media Library", icon: Camera, href: "/agent-media-library" },
        ]
      }
    ],
    staff: [
      {
        title: "Daily Tasks",
        items: [
          { label: "Schedule", icon: Calendar, href: "/staff-tasks", badge: "New", description: "Task calendar with filtering" },
          { label: "Task List", icon: CheckSquare, href: "/staff-task-list", description: "Complete task management" },
          { label: "Scheduled Tasks", icon: Clock, href: "/auto-scheduling-recurring-task-generator", badge: "New" },
          { label: "Maintenance Log & Warranty", icon: Wrench, href: "/maintenance-log-warranty-tracker", badge: "New" },
          { label: "Maintenance & Service Tracking", icon: Activity, href: "/maintenance-service-tracking", badge: "New" },
          { label: "Check-in/Check-out", icon: LogOut, href: "/checkin-checkout-workflow" },
          { label: "Guest Check-In Tracker", icon: Luggage, href: "/guest-checkin-checkout-tracker", badge: "New" },
          { label: "Maintenance", icon: Wrench, href: "/maintenance-task-system" },
          { label: "Task Attachments", icon: FileText, href: "/task-attachments-notes" },
        ]
      },
      {
        title: "Time Management",
        items: [
          { label: "Clock In/Out", icon: Clock, href: "/staff-clock-overtime" },
          { label: "Overtime Tracker", icon: Clock, href: "/staff-overhours-tracker" },
          { label: "Salary Tracker", icon: DollarSign, href: "/staff-salary-overtime-tracker" },
        ]
      },
      {
        title: "Resources",
        items: [
          { label: "Profile & Payroll", icon: User, href: "/staff-profile-payroll" },
          { label: "Communication", icon: MessageSquare, href: "/guest-communication-center" },
        ]
      }
    ],
    owner: [
      {
        title: "Financial Overview",
        items: [
          { label: "Finance Dashboard", icon: DollarSign, href: "/finances" },
          { label: "Balance Management", icon: BarChart3, href: "/owner/balance-management" },
          { label: "Invoicing & Payouts", icon: FileText, href: "/owner-invoicing-payouts" },
        ]
      },
      {
        title: "Property Management",
        items: [
          { label: "My Bookings", icon: Calendar, href: "/bookings" },
          { label: "Revenue Targets & Upgrades", icon: Target, href: "/owner-target-upgrade-tracker", badge: "New" },
          { label: "Maintenance Requests", icon: Wrench, href: "/maintenance-task-system" },
          { label: "Property Timeline", icon: Activity, href: "/properties" },
        ]
      }
    ],
    guest: [
      {
        title: "My Stay",
        items: [
          { label: "My Bookings", icon: Calendar, href: "/bookings" },
          { label: "Add-on Services", icon: Coffee, href: "/guest-addon-services" },
          { label: "Service Requests", icon: Wrench, href: "/guest-communication-center" },
        ]
      },
      {
        title: "Communication",
        items: [
          { label: "Chat Support", icon: MessageSquare, href: "/guest-communication-center" },
          { label: "Guest Portal", icon: Home, href: "/guest-portal" },
          { label: "Smart Requests & AI Chat", icon: MessageSquare, href: "/guest-portal-smart-requests" },
        ]
      }
    ],
    "retail-agent": [
      {
        title: "Booking Management",
        items: [
          { label: "Live Booking Engine", icon: Calendar, href: "/retail-agent-booking" },
          { label: "Commission Tracker", icon: DollarSign, href: "/agent-commission" },
        ]
      },
      {
        title: "Resources",
        items: [
          { label: "Property Media", icon: Camera, href: "/agent-media-library" },
          { label: "Booking Calendar", icon: Calendar, href: "/booking-calendar" },
        ]
      }
    ],
    "referral-agent": [
      {
        title: "Performance",
        items: [
          { label: "My Portfolio", icon: Building, href: "/referral-agent" },
          { label: "Commission Tracking", icon: DollarSign, href: "/agent-commission" },
        ]
      },
      {
        title: "Marketing",
        items: [
          { label: "Media Library", icon: Camera, href: "/agent-media-library" },
          { label: "Loyalty Program", icon: Star, href: "/loyalty-tracker" },
        ]
      }
    ]
  };

  return [...commonMenus, ...(roleSpecificMenus[role] || [])];
};

const roleColors = {
  admin: "bg-red-100 text-red-800",
  "portfolio-manager": "bg-blue-100 text-blue-800",
  staff: "bg-green-100 text-green-800",
  owner: "bg-purple-100 text-purple-800",
  guest: "bg-gray-100 text-gray-800",
  "retail-agent": "bg-orange-100 text-orange-800",
  "referral-agent": "bg-yellow-100 text-yellow-800",
};

const roleIcons = {
  admin: Shield,
  "portfolio-manager": BarChart3,
  staff: Users,
  owner: Building,
  guest: User,
  "retail-agent": UserPlus,
  "referral-agent": Star,
};

export default function Sidebar({ className }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    Dashboard: false,
    Finances: false,
    Tasks: false,
    Utilities: false,
    Settings: false,
    "Agents / Staff": false,
    "Tools / Modules": false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    tasks: true,
    bookings: true,
    payments: true,
    maintenance: false,
  });
  
  const { user, isAuthenticated } = useAuth();
  const userRole = (user as any)?.role || "guest";

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Handle mobile menu close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/demo-logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  const menuSections = getRoleBasedMenus(userRole);
  const RoleIcon = roleIcons[userRole as keyof typeof roleIcons] || User;

  if (!isAuthenticated) {
    return null;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full max-h-screen bg-background">
      {/* Fixed Header - Logo, User Info, and Controls */}
      <div className="sticky top-0 z-10 bg-background border-b flex-shrink-0">
        {/* Brand/Logo Section */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">HostPilotPro</span>
                <span className="text-xs text-muted-foreground">v2.0</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={(user as any)?.profileImageUrl} />
              <AvatarFallback>
                <RoleIcon className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {(user as any)?.email || "User"}
              </p>
              <Badge 
                variant="secondary" 
                className={cn("text-xs", roleColors[userRole as keyof typeof roleColors])}
              >
                {userRole.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleGoBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Notification Preferences */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key} updates</span>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) =>
                            setNotifications(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Dark Mode */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Appearance
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark mode</span>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                </div>

                <Separator />

                {/* Language */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Language
                  </h4>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="th">ไทย</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sidebar Collapse Toggle (Optional) */}
      {!isCollapsed && (
        <div className="px-4 py-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full justify-start"
          >
            <PanelLeftClose className="h-4 w-4 mr-2" />
            Collapse Sidebar
          </Button>
        </div>
      )}

      {/* Enhanced Navigation Menu with Full Scroll Support */}
      <div className="flex-1 overflow-hidden">
        <div className="px-3 py-2 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Navigation</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const allCollapsed = Object.values(collapsedSections).every(Boolean);
                const newState = menuSections.reduce((acc, section) => {
                  acc[section.title] = !allCollapsed;
                  return acc;
                }, {} as Record<string, boolean>);
                setCollapsedSections(newState);
              }}
              className="h-6 w-6 p-0"
            >
              {Object.values(collapsedSections).every(Boolean) ? (
                <PanelLeftOpen className="h-3 w-3" />
              ) : (
                <PanelLeftClose className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <ScrollArea className="h-full px-2">
          <div className="py-2 space-y-1">
            {menuSections.map((section, sectionIndex) => {
              const hasActiveItem = section.items.some(item => location === item.href);
              const isCollapsed = collapsedSections[section.title];
              
              return (
                <Collapsible
                  key={sectionIndex}
                  open={!isCollapsed}
                  onOpenChange={() => toggleSection(section.title)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left h-auto py-3 px-3 hover:bg-muted/50 transition-all duration-200",
                        hasActiveItem && !isCollapsed && "bg-muted/30 border-l-2 border-primary/50"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "text-sm font-medium transition-colors",
                            hasActiveItem ? "text-primary" : "text-foreground"
                          )}>
                            {section.title}
                          </h3>
                          {hasActiveItem && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {section.items.length > 0 && (
                            <Badge variant="outline" className="text-xs h-5 px-1.5">
                              {section.items.length}
                            </Badge>
                          )}
                          {isCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                          )}
                        </div>
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-3 pr-2 pb-2">
                    {section.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const isActive = location === item.href;
                      return (
                        <Link key={itemIndex} href={item.href}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start text-left h-auto py-2 px-3 hover:bg-muted/80 transition-all duration-200 relative group",
                              isActive && "bg-primary/15 text-primary border-l-2 border-primary hover:bg-primary/20 shadow-sm"
                            )}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r" />
                            )}
                            <Icon className={cn(
                              "h-4 w-4 mr-3 flex-shrink-0 transition-colors",
                              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={cn(
                                  "text-sm truncate transition-colors",
                                  isActive ? "font-medium" : "group-hover:text-foreground"
                                )}>
                                  {item.label}
                                </span>
                                <div className="flex items-center gap-1 ml-2">
                                  {item.badge && (
                                    <Badge 
                                      variant={item.badge === "NEW" || item.badge === "Enhanced" ? "destructive" : "secondary"}
                                      className="text-xs h-4 px-1.5"
                                    >
                                      {item.badge}
                                    </Badge>
                                  )}
                                  {isActive && (
                                    <ChevronRight className="h-3 w-3 text-primary" />
                                  )}
                                </div>
                              </div>
                              {item.description && (
                                <p className="text-xs text-muted-foreground mt-0.5 truncate group-hover:text-muted-foreground/80">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </Button>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-background border-t flex-shrink-0">
        <div className="p-3">
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <p>© 2025 Property Management</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 bg-background border-r", className)} style={{ maxHeight: '100vh', overflow: 'hidden' }}>
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="bg-background">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 flex flex-col" style={{ maxHeight: '100vh' }}>
            <SheetHeader className="p-4 border-b flex-shrink-0">
              <SheetTitle className="flex items-center gap-2">
                <RoleIcon className="h-5 w-5" />
                Navigation
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b p-4 pl-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={(user as any)?.profileImageUrl} />
              <AvatarFallback>
                <RoleIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Badge 
              variant="secondary" 
              className={cn("text-xs", roleColors[userRole as keyof typeof roleColors])}
            >
              {userRole.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}