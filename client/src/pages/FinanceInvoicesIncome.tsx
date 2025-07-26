import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3 } from "lucide-react";

// Import existing finance components
// Placeholder components for invoice and income modules
const InvoiceGenerator = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Invoice Generator</CardTitle>
        <CardDescription>Generate and manage property invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Invoice generator will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const BookingIncomeRules = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle>Booking Income Rules</CardTitle>
        <CardDescription>Configure booking income rules and calculations</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Booking income rules will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

export default function FinanceInvoicesIncome() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices & Income</h1>
        <p className="text-gray-600 mt-1">Invoice generation and booking income management</p>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Invoice Generator
          </TabsTrigger>
          <TabsTrigger value="booking-income" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Booking Income Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <InvoiceGenerator />
        </TabsContent>

        <TabsContent value="booking-income">
          <BookingIncomeRules />
        </TabsContent>
      </Tabs>
    </div>
  );
}