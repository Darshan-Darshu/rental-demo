"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Home, Shield, CheckCircle2 } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "user"

  const [step, setStep] = useState<"details" | "aadhar" | "otp" | "complete">("details")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: defaultRole as "user" | "owner" | "admin",
    aadharNumber: "",
    address: "",
  })
  const [otp, setOtp] = useState("")
  const [aadharPhone, setAadharPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const { register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const validateAadhar = (aadhar: string): boolean => {
    const cleaned = aadhar.replace(/\s/g, "")
    return /^\d{12}$/.test(cleaned)
  }

  const formatAadhar = (value: string): string => {
    const cleaned = value.replace(/\s/g, "")
    const match = cleaned.match(/(\d{1,4})(\d{0,4})(\d{0,4})/)
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(" ")
    }
    return value
  }

  const handleAadharVerification = async () => {
    if (!validateAadhar(formData.aadharNumber)) {
      toast({
        title: "Invalid Aadhar Number",
        description: "Please enter a valid 12-digit Aadhar number",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      // In production, integrate with Aadhar verification API (Surepass, IDfy, etc.)
      // Example: POST to /api/verify-aadhar with aadhar number
      const response = await fetch("/api/verify-aadhar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadharNumber: formData.aadharNumber.replace(/\s/g, "") }),
      })

      const data = await response.json()

      if (data.success) {
        // Get masked phone number from Aadhar (e.g., "XXXXXX7890")
        setAadharPhone(data.phone)
        setStep("otp")
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${data.phone}`,
        })
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid Aadhar number",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Unable to verify Aadhar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleOtpVerification = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      // Verify OTP with backend
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadharNumber: formData.aadharNumber.replace(/\s/g, ""),
          otp,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStep("complete")
        toast({
          title: "Aadhar Verified",
          description: "Your Aadhar has been successfully verified",
        })
      } else {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Unable to verify OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setIsVerifying(true)
    try {
      await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadharNumber: formData.aadharNumber.replace(/\s/g, "") }),
      })
      toast({
        title: "OTP Resent",
        description: `New verification code sent to ${aadharPhone}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to resend OTP",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    if (formData.phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setStep("aadhar")
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)

    try {
      await register(formData)
      toast({
        title: "Registration successful",
        description: "Welcome to RentEase!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background p-4 font-serif font-serif">
      <div className="w-full max-w-2xl">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Home className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">RentEase</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              {step === "details" && "Enter your basic information"}
              {step === "aadhar" && "Verify your Aadhar for secure registration"}
              {step === "otp" && "Enter the OTP sent to your Aadhar-linked phone"}
              {step === "complete" && "Complete your registration"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className={`flex items-center gap-2 ${step === "details" ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step !== "details" ? "bg-primary text-primary-foreground" : "bg-primary/20"
                  }`}
                >
                  {step !== "details" ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                </div>
                <span className="text-sm font-medium hidden sm:inline">Details</span>
              </div>
              <div className="h-px w-8 bg-border" />
              <div
                className={`flex items-center gap-2 ${
                  step === "aadhar" || step === "otp" || step === "complete" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step === "otp" || step === "complete" ? "bg-primary text-primary-foreground" : "bg-primary/20"
                  }`}
                >
                  {step === "otp" || step === "complete" ? <CheckCircle2 className="h-5 w-5" /> : "2"}
                </div>
                <span className="text-sm font-medium hidden sm:inline">Aadhar</span>
              </div>
              <div className="h-px w-8 bg-border" />
              <div
                className={`flex items-center gap-2 ${
                  step === "otp" || step === "complete" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step === "complete" ? "bg-primary text-primary-foreground" : "bg-primary/20"
                  }`}
                >
                  {step === "complete" ? <CheckCircle2 className="h-5 w-5" /> : "3"}
                </div>
                <span className="text-sm font-medium hidden sm:inline">Verify</span>
              </div>
            </div>

            {step === "details" && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Tenant/Seeker</SelectItem>
                        <SelectItem value="owner">Property Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Your complete address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Continue to Aadhar Verification
                </Button>
              </form>
            )}

            {step === "aadhar" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Secure Verification</p>
                    <p className="text-xs text-muted-foreground">
                      We'll send an OTP to your Aadhar-linked mobile number
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    placeholder="1234 5678 9012"
                    maxLength={14}
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData({ ...formData, aadharNumber: formatAadhar(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Enter your 12-digit Aadhar number</p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep("details")} className="flex-1">
                    Back
                  </Button>
                  <Button type="button" onClick={handleAadharVerification} disabled={isVerifying} className="flex-1">
                    {isVerifying ? "Verifying..." : "Send OTP"}
                  </Button>
                </div>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold">Verify OTP</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to
                    <br />
                    <span className="font-medium text-foreground">{aadharPhone}</span>
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isVerifying}
                    className="text-sm text-primary hover:underline"
                  >
                    Didn't receive code? Resend OTP
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep("aadhar")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleOtpVerification}
                    disabled={isVerifying || otp.length !== 6}
                    className="flex-1"
                  >
                    {isVerifying ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </div>
            )}

            {step === "complete" && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Aadhar Verified Successfully!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your identity has been verified. Click below to complete registration.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aadhar:</span>
                    <span className="font-medium">{formData.aadharNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Type:</span>
                    <span className="font-medium capitalize">{formData.role}</span>
                  </div>
                </div>

                <Button type="button" onClick={handleFinalSubmit} disabled={isLoading} className="w-full">
                  {isLoading ? "Creating Account..." : "Complete Registration"}
                </Button>
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
