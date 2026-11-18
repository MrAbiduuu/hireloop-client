import type { Metadata } from "next"

import { PaymentForm } from "@/app/payment/payment-form"

export const metadata: Metadata = {
  title: "Upgrade — HireLoop",
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>
}) {
  const { cancelled } = await searchParams
  if (cancelled) {
    console.log(
      "Order Cancelled -- continue to shop around and check out when you\'re ready"
    )
  }
  return <PaymentForm />
}
