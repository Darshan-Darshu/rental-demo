"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Home,
  Building2,
  Hotel,
  DoorOpen,
  Search,
  MapPin,
  IndianRupee,
  Users,
  Utensils,
  Wifi,
  Car,
  Wind,
  Droplets,
  Zap,
  Shield,
  LogOut,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import OnlineCustomerChatbot from "@/components/chat-bot";

export default function TenantDashboard() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [occupation, setOccupation] = useState<string>("all");
  const [occupancyType, setOccupancyType] = useState<string>("all");
  const [foodPreference, setFoodPreference] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [bhkType, setBhkType] = useState<string>("all");

  // localStorage is only available in the browser. Read it inside useEffect
  // to avoid server-side errors ("localStorage is not defined").
  const [mockProperties, setMockProperties] = useState<any[]>([]);

  useEffect(() => {
    try {
      const items = localStorage.getItem("items");
      setMockProperties(items ? JSON.parse(items) : []);
    } catch (e) {
      // If parsing fails or access is denied, fallback to empty array
      // and log the error for debugging.
      // eslint-disable-next-line no-console
      console.error("Failed to read/parse localStorage items:", e);
      setMockProperties([]);
    }
  }, []);

  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "ac", label: "AC", icon: Wind },
    { id: "parking", label: "Parking", icon: Car },
    { id: "water", label: "Water Supply", icon: Droplets },
    { id: "power", label: "Power Backup", icon: Zap },
    { id: "security", label: "Security", icon: Shield },
  ];

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const filteredProperties = mockProperties.filter((property: any) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      propertyType === "all" || property.type === propertyType;
    const matchesOccupancy =
      occupancyType === "all" || property.occupancy === occupancyType;
    const matchesFood =
      foodPreference === "all" ||
      property.food.toLowerCase().includes(foodPreference.toLowerCase());
    const matchesPrice =
      property.rent >= priceRange[0] && property.rent <= priceRange[1];
    const matchesBhk = bhkType === "all" || property.bhk === bhkType;

    return (
      matchesSearch &&
      matchesType &&
      matchesOccupancy &&
      matchesFood &&
      matchesPrice &&
      matchesBhk
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background">
      {/* Header */}
      <OnlineCustomerChatbot />
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">RentEase</h1>
              <p className="text-xs text-muted-foreground">Tenant Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
                <CardDescription>Refine your search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Property Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={propertyType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPropertyType("all")}
                      className="justify-start"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      All
                    </Button>
                    <Button
                      variant={propertyType === "PG" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPropertyType("PG")}
                      className="justify-start"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      PG
                    </Button>
                    <Button
                      variant={
                        propertyType === "Hostel" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setPropertyType("Hostel")}
                      className="justify-start"
                    >
                      <Hotel className="h-4 w-4 mr-2" />
                      Hostel
                    </Button>
                    <Button
                      variant={propertyType === "Room" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPropertyType("Room")}
                      className="justify-start"
                    >
                      <DoorOpen className="h-4 w-4 mr-2" />
                      Room
                    </Button>
                    <Button
                      variant={propertyType === "House" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPropertyType("House")}
                      className="justify-start col-span-2"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      House
                    </Button>
                  </div>
                </div>

                {/* Occupation */}
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Select value={occupation} onValueChange={setOccupation}>
                    <SelectTrigger id="occupation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="professional">
                        Working Professional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Occupancy Type */}
                <div className="space-y-2">
                  <Label htmlFor="occupancy">Occupancy Type</Label>
                  <Select
                    value={occupancyType}
                    onValueChange={setOccupancyType}
                  >
                    <SelectTrigger id="occupancy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Double">Double</SelectItem>
                      <SelectItem value="Triple">Triple</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* BHK Type */}
                <div className="space-y-2">
                  <Label htmlFor="bhk">BHK Type (for Houses)</Label>
                  <Select value={bhkType} onValueChange={setBhkType}>
                    <SelectTrigger id="bhk">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1BHK">1 BHK</SelectItem>
                      <SelectItem value="2BHK">2 BHK</SelectItem>
                      <SelectItem value="3BHK">3 BHK</SelectItem>
                      <SelectItem value="4BHK">4+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Food Preference */}
                <div className="space-y-2">
                  <Label htmlFor="food">Food Preference</Label>
                  <Select
                    value={foodPreference}
                    onValueChange={setFoodPreference}
                  >
                    <SelectTrigger id="food">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="veg">Veg Only</SelectItem>
                      <SelectItem value="non-veg">Non-Veg Available</SelectItem>
                      <SelectItem value="no mess">No Mess</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label>
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </Label>
                  <Slider
                    min={0}
                    max={15000}
                    step={500}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Amenities</Label>
                  <div className="space-y-2">
                    {amenitiesList.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={amenity.id}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={() => toggleAmenity(amenity.id)}
                        />
                        <Label
                          htmlFor={amenity.id}
                          className="text-sm font-normal cursor-pointer flex items-center gap-2"
                        >
                          <amenity.icon className="h-4 w-4" />
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setPropertyType("all");
                    setOccupation("all");
                    setOccupancyType("all");
                    setFoodPreference("all");
                    setPriceRange([0, 15000]);
                    setSelectedAmenities([]);
                    setBhkType("all");
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>

            {/* AI Assistant Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Assistant
                </CardTitle>
                <CardDescription>
                  Get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Chat with our AI to find properties that match your exact
                  needs
                </p>
                <Button className="w-full" variant="default">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by location, property name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Available Properties</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredProperties.length} properties found
                </p>
              </div>
            </div>

            {/* Property Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProperties.map((property: any) => (
                <Card
                  key={property.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-3 left-3">
                      {property.type}
                    </Badge>
                    {property.bhk && (
                      <Badge
                        className="absolute top-3 right-3"
                        variant="secondary"
                      >
                        {property.bhk}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                        <IndianRupee className="h-5 w-5" />
                        {property.rent}
                        <span className="text-sm font-normal text-muted-foreground">
                          /month
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{property.occupancy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                        <span>{property.food}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {property.amenities.slice(0, 3).map((amenity: any) => (
                        <Badge
                          key={amenity}
                          variant="outline"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {property.distance}
                    </p>

                    <div className="flex gap-2">
                      <Button className="flex-1" asChild>
                        <Link href={`/property/${property.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No properties found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
