"use client"

import { Button } from "@/components/ui/button"
import { Search, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/30 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/50 px-4 py-2 text-sm font-medium text-accent-foreground">
            <Sparkles className="h-4 w-4" />
            AI-Powered Property Search
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
            Find Your Perfect Rental or PG in Tiptur
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl text-pretty">
            Discover verified properties with our AI assistant. Search by preferences, get instant recommendations, and
            connect with property owners seamlessly.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/properties">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Search className="h-5 w-5" />
                Browse Properties
              </Button>
            </Link>
            <Link href="/register?role=owner">
              <Button size="lg" variant="outline">
                List Your Property
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border pt-8">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Properties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Tenants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
