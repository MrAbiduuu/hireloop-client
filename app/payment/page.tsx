import type { Metadata } from "next"

import { PaymentForm } from "@/app/payment/payment-form"

export const metadata: Metadata = {
  title: "Upgrade — HireLoop",
}

export default function PaymentPage() {
  return <PaymentForm />
}
