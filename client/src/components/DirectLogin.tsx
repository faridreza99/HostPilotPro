import React from "react";
import { Button } from "@/components/ui/button";

const QUICK_LOGINS = [
  { email: "admin@test.com", password: "admin123", role: "Admin", dashboard: "/admin-dashboard" },
  { email: "manager@test.com", password: "manager123", role: "Portfolio Manager", dashboard: "/portfolio-dashboard" },
  { email: "owner@test.com", password: "owner123", role: "Owner", dashboard: "/owner-dashboard" },
  { email: "staff@test.com", password: "staff123", role: "Staff", dashboard: "/staff-dashboard" },
  { email: "retail@demo.com", password: "123456", role: "Retail Agent", dashboard: "/retail-agent-dashboard" },
  { email: "referral@demo.com", password: "123456", role: "Referral Agent", dashboard: "/referral-agent-dashboard" }
];

export default function DirectLogin() {
  const handleDirectLogin = async (email: string, password: string, dashboard: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      if (response.ok) {
        // Force immediate redirect
        window.location.href = dashboard;
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Login error');
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-xs">
      <h3 className="text-sm font-bold mb-3 text-gray-900 dark:text-white">🚀 Quick Login</h3>
      <div className="space-y-2">
        {QUICK_LOGINS.map((login) => (
          <Button
            key={login.email}
            onClick={() => handleDirectLogin(login.email, login.password, login.dashboard)}
            className="w-full text-xs py-1 px-2 h-8"
            variant="outline"
          >
            {login.role}
          </Button>
        ))}
      </div>
    </div>
  );
}