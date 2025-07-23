import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/Dashboard";
import StaffDashboard from "@/pages/StaffDashboard";

export default function RoleBasedDashboard() {
  const { user } = useAuth();
  
  // Route to appropriate dashboard based on user role
  switch (user?.role) {
    case 'staff':
      return <StaffDashboard />;
    case 'admin':
    case 'portfolio-manager':
    case 'owner':
    default:
      return <Dashboard />;
  }
}