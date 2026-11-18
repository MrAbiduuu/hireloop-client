import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, Check, LayoutDashboard, Sparkles } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { checkoutVerify } from "@/lib/actions/payment"
import { stripe } from "@/lib/stripe"

export const metadata: Metadata = {
  title: "Payment Successful — HireLoop",
}

const celebrationDots = [
  "left-6 top-12 size-2 bg-emerald-400/70",
  "right-9 top-20 size-1.5 bg-indigo-400/70",
  "bottom-24 left-12 size-1.5 bg-amber-400/70",
  "bottom-16 right-14 size-2 bg-emerald-500/60",
] as const

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)")

  const { status, payment_status, customer_email, metadata, payment_intent } =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })

  if (status === "open") {
    return redirect("/")
  }

  if (status === "complete" && payment_status === "paid") {
    console.log(
      status,
      payment_status,
      customer_email,
      metadata,
      payment_intent
    )
    const result = await checkoutVerify(session_id)
    console.log(result)

    return (
      <>
        <SiteHeader />
        <main className="flex min-h-[75vh] items-center justify-center px-4 py-12 sm:px-6">
          <section
            id="success"
            aria-labelledby="success-heading"
            className="w-full max-w-lg"
          >
            <Card className="relative overflow-hidden px-2 py-9 text-center shadow-xl sm:px-6 sm:py-11">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                {celebrationDots.map((position) => (
                  <span
                    key={position}
                    className={`absolute animate-pulse rounded-full ${position}`}
                  />
                ))}
                <Sparkles className="absolute top-9 right-7 size-5 rotate-12 text-emerald-500/60" />
                <Sparkles className="absolute bottom-10 left-7 size-4 text-indigo-500/60" />
              </div>

              <CardContent className="relative flex flex-col items-center gap-5 px-4">
                <div className="relative grid size-20 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                  <span
                    aria-hidden="true"
                    className="absolute inset-2 rounded-full bg-emerald-500/25 blur-xl"
                  />
                  <Check
                    aria-hidden="true"
                    strokeWidth={3}
                    className="relative size-10 text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <h1
                    id="success-heading"
                    className="text-2xl font-bold tracking-tight sm:text-3xl"
                  >
                    Payment successful!
                  </h1>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Your account is now premium. You can apply to unlimited
                    jobs.
                  </p>
                </div>

                <p className="max-w-sm rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                  A confirmation email will be sent to{" "}
                  <span className="font-medium text-foreground">
                    {customer_email}
                  </span>
                  .
                </p>

                <div className="flex w-full flex-col gap-3 pt-1 sm:flex-row sm:justify-center">
                  <Link
                    href="/dashboard/seeker"
                    className={buttonVariants({
                      size: "lg",
                      className: "h-11 w-full gap-2 px-6 sm:w-auto",
                    })}
                  >
                    <LayoutDashboard aria-hidden="true" />
                    Go to Dashboard
                    <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link
                    href="/"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                      className: "h-11 w-full px-6 sm:w-auto",
                    })}
                  >
                    Back to home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </>
    )
  }
}
