import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  DollarSign, 
  Building2, 
  CheckSquare,
  TrendingUp,
  Users,
  Calendar,
  Activity
} from "lucide-react";
export default function DashboardHub() {
  const dashboardItems = [
    {
      title: "Admin Dashboard",
      description: "Comprehensive overview of all properties, bookings, tasks, and financial metrics",
      href: "/",
      icon: BarChart3,
      badge: "Main",
      color: "bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200/60"
    },
    {
      title: "Financial Dashboard", 
      description: "Revenue tracking, expense analysis, and financial performance insights",
      href: "/simple-filtered-financial-dashboard",
      icon: DollarSign,
      badge: "Finance",
      color: "bg-teal-50/50 hover:bg-teal-100/70 border-teal-200/60"
    },
    {
      title: "Property Dashboard",
      description: "Property-specific metrics, occupancy rates, and performance analytics",
      href: "/property-hub", 
      icon: Building2,
      badge: "Properties",
      color: "bg-cyan-50/50 hover:bg-cyan-100/70 border-cyan-200/60"
    },
    {
      title: "Task Overview",
      description: "Global task monitoring across all properties with staff performance tracking",
      href: "/tasks",
      icon: CheckSquare,
      badge: "Operations",
      color: "bg-green-50/50 hover:bg-green-100/70 border-green-200/60"
    },
    {
      title: "Daily Operations",
      description: "Today's activities, urgent tasks, and operational status overview",
      href: "/daily-operations",
      icon: Activity,
      badge: "Today",
      color: "bg-slate-50/50 hover:bg-slate-100/70 border-slate-200/60"
    },
    {
      title: "Portfolio Manager Dashboard",
      description: "Multi-property portfolio insights and management tools",
      href: "/portfolio-manager-dashboard",
      icon: TrendingUp,
      badge: "Portfolio",
      color: "bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200/60"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Dashboard Hub</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">Access all dashboard views and analytics from one central location</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className={`cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 hover:scale-[1.02] rounded-xl border-2 shadow-lg ${item.color}`}>
                <CardHeader className="pb-4 pt-6 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20">
                        <IconComponent className="h-7 w-7 text-emerald-700" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">{item.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs font-semibold bg-emerald-100 text-emerald-700 border-emerald-200">
                      {item.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}