import { useEffect } from "react";
import { useLocation } from "wouter";
import { fastCache } from "@/lib/fastCache";

// Pre-cache critical data for instant page switching
const CRITICAL_ENDPOINTS = [
  "/api/properties",
  "/api/tasks", 
  "/api/bookings",
  "/api/dashboard/stats",
  "/api/auth/user"
];

export function InstantPageSwitcher() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Pre-cache critical data on app start
    const preCacheData = async () => {
      for (const endpoint of CRITICAL_ENDPOINTS) {
        if (!fastCache.has(endpoint)) {
          try {
            const res = await fetch(endpoint, { credentials: "include" });
            if (res.ok) {
              const data = await res.json();
              fastCache.set(endpoint, data, 60); // Cache for 1 hour
              console.log(`Pre-cached: ${endpoint}`);
            }
          } catch (error) {
            console.log(`Failed to pre-cache: ${endpoint}`);
          }
        }
      }
    };
    
    // Pre-cache after a short delay to not block initial render
    setTimeout(preCacheData, 100);
  }, []);
  
  return null;
}