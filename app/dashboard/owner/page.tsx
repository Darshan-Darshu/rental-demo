"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Building2,
  Upload,
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
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockOwnerProperties = [
  {
    id: "1",
    type: "PG",
    title: "Modern PG near KIT College",
    location: "Near KIT, Tiptur",
    rent: 5500,
    status: "approved",
    applications: 5,
    occupancy: "Single",
    bhk: null,
  },
  {
    id: "2",
    type: "House",
    title: "2BHK Independent House",
    location: "MG Road, Tiptur",
    rent: 8000,
    status: "pending",
    applications: 2,
    occupancy: "Family",
    bhk: "2BHK",
  },
]

export default function OwnerDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("properties")
  const [showAddProperty, setShowAddProperty] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    propertyType: "PG",
    title: "",
    description: "",
    address: "",
    city: "Tiptur",
    pincode: "",
    rent: "",
    bhk: "",
    occupancyType: "Single",
    foodAvailable: "yes",
    foodType: "veg",
    amenities: [] as string[],
    images: [] as File[],
    video: null as File | null,
    contactName: user?.name || "",
    contactPhone: user?.phone || "",
    contactEmail: user?.email || "",
  })

  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "ac", label: "AC", icon: Wind },
    { id: "parking", label: "Parking", icon: Car },
    { id: "water", label: "Water Supply", icon: Droplets },
    { id: "power", label: "Power Backup", icon: Zap },
    { id: "security", label: "24/7 Security", icon: Shield },
    { id: "laundry", label: "Laundry", icon: Home },
    { id: "mess", label: "Mess Facility", icon: Utensils },
  ]

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files!)],
      }))
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        video: e.target.files![0],
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Property submitted for approval",
      description: "Your property will be reviewed by our admin team within 24 hours.",
    })
    setShowAddProperty(false)
    // Reset form
    setFormData({
      propertyType: "PG",
      title: "",
      description: "",
      address: "",
      city: "Tiptur",
      pincode: "",
      rent: "",
      bhk: "",
      occupancyType: "Single",
      foodAvailable: "yes",
      foodType: "veg",
      amenities: [],
      images: [],
      video: null,
      contactName: user?.name || "",
      contactPhone: user?.phone || "",
      contactEmail: user?.email || "",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">RentEase</h1>
              <p className="text-xs text-muted-foreground">Owner Dashboard</p>
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
        {!showAddProperty ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="properties">My Properties</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
              </TabsList>
              <Button onClick={() => setShowAddProperty(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            <TabsContent value="properties" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Properties</CardDescription>
                    <CardTitle className="text-3xl">2</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Active Listings</CardDescription>
                    <CardTitle className="text-3xl text-green-600">1</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Applications</CardDescription>
                    <CardTitle className="text-3xl text-primary">7</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Properties List */}
              <div className="space-y-4">
                {mockOwnerProperties.map((property) => (
                  <Card key={property.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline">{property.type}</Badge>
                            {getStatusBadge(property.status)}
                            {property.bhk && <Badge variant="secondary">{property.bhk}</Badge>}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{property.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-4 w-4" />
                              {property.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1 font-semibold text-primary">
                              <IndianRupee className="h-4 w-4" />
                              {property.rent}/month
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {property.occupancy}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              {property.applications} applications
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Manage tenant applications for your properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">No applications yet</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Add New Property</h2>
                <p className="text-sm text-muted-foreground mt-1">Fill in the details to list your property</p>
              </div>
              <Button variant="outline" onClick={() => setShowAddProperty(false)}>
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                      >
                        <SelectTrigger id="propertyType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PG">PG</SelectItem>
                          <SelectItem value="Hostel">Hostel</SelectItem>
                          <SelectItem value="Room">Room</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Modern PG near KIT College"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property, nearby facilities, rules, etc."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="House/Building number, Street name, Landmark"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        placeholder="572201"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rent">Monthly Rent (₹) *</Label>
                      <Input
                        id="rent"
                        type="number"
                        placeholder="5000"
                        value={formData.rent}
                        onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                        required
                      />
                    </div>

                    {formData.propertyType === "House" && (
                      <div className="space-y-2">
                        <Label htmlFor="bhk">BHK Type *</Label>
                        <Select
                          value={formData.bhk}
                          onValueChange={(value) => setFormData({ ...formData, bhk: value })}
                        >
                          <SelectTrigger id="bhk">
                            <SelectValue placeholder="Select BHK" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1BHK">1 BHK</SelectItem>
                            <SelectItem value="2BHK">2 BHK</SelectItem>
                            <SelectItem value="3BHK">3 BHK</SelectItem>
                            <SelectItem value="4BHK">4+ BHK</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="occupancy">Occupancy Type *</Label>
                      <Select
                        value={formData.occupancyType}
                        onValueChange={(value) => setFormData({ ...formData, occupancyType: value })}
                      >
                        <SelectTrigger id="occupancy">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Double">Double</SelectItem>
                          <SelectItem value="Triple">Triple</SelectItem>
                          <SelectItem value="Family">Family</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Food Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="foodAvailable">Food Available *</Label>
                      <Select
                        value={formData.foodAvailable}
                        onValueChange={(value) => setFormData({ ...formData, foodAvailable: value })}
                      >
                        <SelectTrigger id="foodAvailable">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="nearby">Nearby Mess Available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.foodAvailable === "yes" && (
                      <div className="space-y-2">
                        <Label htmlFor="foodType">Food Type *</Label>
                        <Select
                          value={formData.foodType}
                          onValueChange={(value) => setFormData({ ...formData, foodType: value })}
                        >
                          <SelectTrigger id="foodType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="veg">Veg Only</SelectItem>
                            <SelectItem value="non-veg">Non-Veg Available</SelectItem>
                            <SelectItem value="both">Both Veg & Non-Veg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {amenitiesList.map((amenity) => (
                        <div key={amenity.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`amenity-${amenity.id}`}
                            checked={formData.amenities.includes(amenity.id)}
                            onCheckedChange={() => toggleAmenity(amenity.id)}
                          />
                          <Label
                            htmlFor={`amenity-${amenity.id}`}
                            className="text-sm font-normal cursor-pointer flex items-center gap-2"
                          >
                            <amenity.icon className="h-4 w-4" />
                            {amenity.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Photos & Videos</CardTitle>
                  <CardDescription>Upload clear images and videos of your property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="images">Property Images * (Max 10)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label htmlFor="images" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload images</p>
                      </Label>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image) || "/placeholder.svg"}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video">Property Video (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Input id="video" type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                      <Label htmlFor="video" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formData.video ? formData.video.name : "Click to upload video"}
                        </p>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone *</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" size="lg" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Submit for Approval
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => setShowAddProperty(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
