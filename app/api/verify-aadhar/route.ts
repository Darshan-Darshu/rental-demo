import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { aadharNumber } = await request.json()

    // Validate Aadhar format
    if (!/^\d{12}$/.test(aadharNumber)) {
      return NextResponse.json({ success: false, message: "Invalid Aadhar format" }, { status: 400 })
    }

    const surepassApiKey = process.env.SUREPASS_API_KEY
    if (!surepassApiKey) {
      console.error("[v0] SUREPASS_API_KEY not configured")
      return NextResponse.json({ success: false, message: "API configuration error" }, { status: 500 })
    }

    try {
      const response = await fetch("https://api.surepass.io/api/v1/aadhaar-v2/generate-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${surepassApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_number: aadharNumber,
        }),
      })

      const data = await response.json()
      console.log("[v0] Surepass response:", data)

      if (data.success && data.data) {
        // Store client_id for OTP verification step
        const maskedPhone = data.data.mobile_number || `XXXXXX${Math.floor(1000 + Math.random() * 9000)}`

        return NextResponse.json({
          success: true,
          phone: maskedPhone,
          clientId: data.data.client_id,
          message: "OTP sent successfully to your registered phone number",
        })
      } else {
        return NextResponse.json({ success: false, message: data.message || "Failed to generate OTP" }, { status: 400 })
      }
    } catch (apiError) {
      console.error("[v0] Surepass API error:", apiError)
      return NextResponse.json(
        { success: false, message: "Failed to verify Aadhar. Please try again." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Aadhar verification error:", error)
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 })
  }
}
