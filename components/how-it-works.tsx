import { UserPlus, Search, MessageCircle, Home } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up as a tenant or property owner with email, phone, and Aadhar verification",
  },
  {
    icon: Search,
    title: "Search Properties",
    description: "Use filters or chat with our AI assistant to find properties matching your needs",
  },
  {
    icon: MessageCircle,
    title: "Apply & Connect",
    description: "Submit applications and communicate directly with property owners",
  },
  {
    icon: Home,
    title: "Move In",
    description: "Complete the process and move into your new home hassle-free",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">Get started in four simple steps</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  {index + 1}
                </div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/50">
                  <step.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
