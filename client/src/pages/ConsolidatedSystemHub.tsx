import React, { lazy, Suspense, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Settings,
  Users,
  Zap,
  Brain,
  DollarSign,
  Key,
  ArrowLeft,
  Building2,
  Database,
  Shield,
  Activity,
  TestTube
} from "lucide-react";
import TopBar from "../components/TopBar";

// Lazy load all System modules
const SettingsPage = lazy(() => import("./Settings"));
const UserManagement = lazy(() => import("./UserManagement"));
const AutomationManagement = lazy(() => import("./AutomationManagement"));
const ApiConnections = lazy(() => import("./admin/ApiConnections"));
const SaasManagement = lazy(() => import("./admin/SaasManagement"));
const ActivityLogs = lazy(() => import("./ActivityLogs"));
const SystemIntegrityCheck = lazy(() => import("./SystemIntegrityCheck"));
const SandboxTestingDashboard = lazy(() => import("./SandboxTestingDashboard"));

interface SystemModule {
  title: string;
  description: string;
  key: string;
  icon: React.ElementType;
  badge: string;
  color: string;
  component: React.LazyExoticComponent<React.ComponentType>;
}

export default function ConsolidatedSystemHub() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const systemModules: SystemModule[] = [
    {
      title: "Platform Settings",
      description: "Currency, VAT, platform defaults and core configuration",
      key: "platform-settings",
      icon: Settings,
      badge: "Core",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      component: SettingsPage
    },
    {
      title: "User Management",
      description: "Manage staff members, roles, and permissions",
      key: "user-management",
      icon: Users,
      badge: "Staff",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      component: UserManagement
    },
    {
      title: "API Connections",
      description: "Configure Stripe, Hostaway, OpenAI, and other integrations",
      key: "api-connections",
      icon: Key,
      badge: "APIs",
      color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
      component: ApiConnections
    },
    {
      title: "Automation Management",
      description: "Configure automated workflows and scheduling",
      key: "automation",
      icon: Zap,
      badge: "Auto",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      component: AutomationManagement
    },
    {
      title: "SaaS Management",
      description: "Multi-tenant provisioning and subscription management",
      key: "saas",
      icon: Database,
      badge: "SaaS",
      color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
      component: SaasManagement
    },
    {
      title: "Activity Logs",
      description: "System activity monitoring and audit trail",
      key: "activity-logs",
      icon: Activity,
      badge: "Logs",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
      component: ActivityLogs
    },
    {
      title: "System Integrity",
      description: "System health monitoring and validation",
      key: "integrity",
      icon: Shield,
      badge: "Health",
      color: "bg-red-50 hover:bg-red-100 border-red-200",
      component: SystemIntegrityCheck
    },
    {
      title: "Sandbox Testing",
      description: "Demo data testing and validation tools",
      key: "sandbox",
      icon: TestTube,
      badge: "Test",
      color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
      component: SandboxTestingDashboard
    }
  ];

  const selectedModuleData = systemModules.find(m => m.key === selectedModule);

  if (selectedModule && selectedModuleData) {
    const Component = selectedModuleData.component;
    return (
      <div className="min-h-screen flex bg-background">
        <div className="flex-1 flex flex-col">
          <TopBar title={selectedModuleData.title} />
          
          <div className="p-6">
            <Button
              variant="outline"
              onClick={() => setSelectedModule(null)}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to System Hub
            </Button>
            
            <Suspense fallback={
              <div className="flex items-center justify-center p-12">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">Loading module...</span>
                </div>
              </div>
            }>
              <Component />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex flex-col">
        <TopBar 
          title="System Hub" 
          subtitle="Platform administration and configuration"
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">System Administration</h1>
              <p className="text-gray-600">
                Comprehensive platform management and configuration tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Card
                    key={module.key}
                    className={`${module.color} border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer`}
                    onClick={() => setSelectedModule(module.key)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-white/50">
                          <IconComponent className="h-6 w-6 text-gray-700" />
                        </div>
                        <Badge variant="secondary" className="bg-white/70">
                          {module.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
