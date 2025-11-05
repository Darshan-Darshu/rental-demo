import { Shield, MessageSquare, MapPin, CheckCircle, Users, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Get personalized property recommendations through our intelligent chatbot",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "All properties and owners are verified with Aadhar, email, and phone",
  },
  {
    icon: MapPin,
    title: "Location-Based Search",
    description: "Find properties near your workplace or college with Google Maps integration",
  },
  {
    icon: CheckCircle,
    title: "Easy Applications",
    description: "Apply to multiple properties and track your applications in one place",
  },
  {
    icon: Users,
    title: "Direct Communication",
    description: "Connect directly with property owners after profile verification",
  },
  {
    icon: Clock,
    title: "Quick Approval",
    description: "Fast admin approval process for listings and applications",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">Why Choose RentEase?</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to find or list the perfect rental property
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
