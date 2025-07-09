import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthRepairNotice() {
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-200 text-sm">
          <strong>✅ Authentication System Repaired!</strong><br />
          Use the Quick Login panel (top-right) to access your dashboard immediately.
        </AlertDescription>
      </Alert>
    </div>
  );
}