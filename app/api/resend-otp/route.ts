import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { aadharNumber, clientId } = await request.json()

    if (!aadharNumber || !clientId) {
      return NextResponse.json({ success: false, message: "Aadhar number and client ID required" }, { status: 400 })
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
      console.log("[v0] Resend OTP response:", data)

      if (data.success && data.data) {
        return NextResponse.json({
          success: true,
          clientId: data.data.client_id,
          message: "OTP resent successfully to your registered phone number",
        })
      } else {
        return NextResponse.json({ success: false, message: data.message || "Failed to resend OTP" }, { status: 400 })
      }
    } catch (apiError) {
      console.error("[v0] Surepass resend OTP error:", apiError)
      return NextResponse.json({ success: false, message: "Failed to resend OTP. Please try again." }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Resend OTP error:", error)
    return NextResponse.json({ success: false, message: "Failed to resend OTP" }, { status: 500 })
  }
}
