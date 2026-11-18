import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getSession } from "@/lib/core/server"

export async function POST() {
  const userSession = await getSession()
  try {
    const headersList = await headers()
    const origin = headersList.get("origin") ?? "http://localhost:3000"

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1Uc2YtFlreKHgbrDjgTCMXx8",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userSession?.user.email,
      metadata: {
        userId: userSession?.user.id ?? null,
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment?cancelled=true`,
      integration_identifier: "hireloop_web_001",
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
