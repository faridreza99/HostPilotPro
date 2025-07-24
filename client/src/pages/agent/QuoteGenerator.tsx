import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, MapPin, Calculator, Send, Download } from "lucide-react";

export default function QuoteGenerator() {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [commissionRate, setCommissionRate] = useState("10");

  const properties = [
    { id: "1", name: "Villa Ocean View", price: 6500, bedrooms: 2, maxGuests: 4 },
    { id: "2", name: "Villa Samui Breeze", price: 8000, bedrooms: 3, maxGuests: 6 },
    { id: "3", name: "Villa Tropical Paradise", price: 12000, bedrooms: 4, maxGuests: 8 },
    { id: "4", name: "Villa Aruna (Demo)", price: 20000, bedrooms: 3, maxGuests: 6 }
  ];

  const calculateQuote = () => {
    if (!selectedProperty || !checkIn || !checkOut) return null;
    
    const property = properties.find(p => p.id === selectedProperty);
    if (!property) return null;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const subtotal = property.price * nights;
    const commission = (subtotal * parseFloat(commissionRate)) / 100;
    const total = subtotal;

    return { property, nights, subtotal, commission, total };
  };

  const quote = calculateQuote();

  const generateQuote = () => {
    if (!quote) return;
    
    alert(`Quote generated for ${clientName}! Commission: ฿${quote.commission.toLocaleString()}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quote Generator</h1>
        <p className="text-muted-foreground">Create professional quotes for potential guests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Quote Details
            </CardTitle>
            <CardDescription>Enter booking details to generate a quote</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="property">Property</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} - ฿{property.price.toLocaleString()}/night
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkin">Check-in</Label>
                <Input
                  id="checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="checkout">Check-out</Label>
                <Input
                  id="checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                placeholder="2"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="commission">Commission Rate (%)</Label>
              <Input
                id="commission"
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                min="0"
                max="30"
                step="0.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="John Smith"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="requests">Special Requests</Label>
              <Textarea
                id="requests"
                placeholder="Airport transfer, early check-in, etc."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quote Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Preview</CardTitle>
            <CardDescription>Review the generated quote</CardDescription>
          </CardHeader>
          <CardContent>
            {quote ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-lg">{quote.property.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Koh Samui, Thailand
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Up to {quote.property.maxGuests} guests
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rate per night:</span>
                    <span>฿{quote.property.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of nights:</span>
                    <span>{quote.nights}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Subtotal:</span>
                    <span>฿{quote.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Your Commission ({commissionRate}%):</span>
                    <span>฿{quote.commission.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Guest Total:</span>
                    <span>฿{quote.total.toLocaleString()}</span>
                  </div>
                </div>

                {specialRequests && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Label className="text-sm font-medium">Special Requests:</Label>
                    <p className="text-sm mt-1">{specialRequests}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button onClick={generateQuote} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Quote
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the quote details to see preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}