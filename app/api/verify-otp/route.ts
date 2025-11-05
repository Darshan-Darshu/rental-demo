import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { aadharNumber, otp, clientId } = await request.json()

    if (!aadharNumber || !otp || !clientId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const surepassApiKey = process.env.SUREPASS_API_KEY
    if (!surepassApiKey) {
      console.error("[v0] SUREPASS_API_KEY not configured")
      return NextResponse.json({ success: false, message: "API configuration error" }, { status: 500 })
    }

    try {
      const response = await fetch("https://api.surepass.io/api/v1/aadhaar-v2/submit-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${surepassApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          otp: otp,
        }),
      })

      const data = await response.json()
      console.log("[v0] OTP verification response:", data)

      if (data.success && data.data) {
        // Return verified Aadhar details
        return NextResponse.json({
          success: true,
          verified: true,
          aadharData: {
            name: data.data.name,
            dob: data.data.dob,
            gender: data.data.gender,
            address: data.data.address,
            phone: data.data.mobile_number,
          },
          message: "Aadhar verified successfully",
        })
      } else {
        return NextResponse.json({ success: false, message: data.message || "Invalid OTP" }, { status: 400 })
      }
    } catch (apiError) {
      console.error("[v0] Surepass OTP verification error:", apiError)
      return NextResponse.json(
        { success: false, message: "OTP verification failed. Please try again." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] OTP verification error:", error)
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 })
  }
}
