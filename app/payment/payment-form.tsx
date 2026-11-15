"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Keyboard,
  Lock,
} from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/toast"

const PLANS = {
  BDT: { label: "BDT 2,533.33", flag: "🇧🇩" },
  USD: { label: "$20.00", flag: "🇺🇸" },
} as const

const COUNTRIES = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
]

export function PaymentForm() {
  const [currency, setCurrency] = useState<"BDT" | "USD">("BDT")
  const [cardOpen, setCardOpen] = useState(true)
  const [email, setEmail] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardholder, setCardholder] = useState("")
  const [country, setCountry] = useState("Bangladesh")

  const price = PLANS[currency].label

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ")

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`
  }

  const handlePay = () => {
    if (!email || !cardholder) {
      toast.add({
        title: "Missing details",
        description: "Please fill in your email and cardholder name.",
      })
      return
    }
    toast.add({
      title: "Payment gateway coming soon",
      description: "Checkout is not wired up yet — this is a demo page.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0b] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between bg-[#151517] px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/browse-jobs"
            aria-label="Go back"
            className="text-zinc-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <span className="grid size-7 place-items-center rounded-md border border-zinc-700 text-zinc-300">
            <Lock className="size-3.5" />
          </span>
        </div>
        <span className="rounded-sm bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-zinc-900">
          EXAMPLE
        </span>
      </header>

      {/* Checkout body */}
      <main className="mx-auto w-full max-w-5xl flex-1 border-x border-zinc-800 bg-[#111113] px-6 py-10 sm:px-10">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left: plan summary */}
          <div className="space-y-6">
            <p className="text-sm font-medium text-zinc-300">
              Subscribe to HireLoop
            </p>

            {/* Currency selector */}
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(PLANS) as Array<"BDT" | "USD">).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCurrency(key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    currency === key
                      ? "border-zinc-300 bg-zinc-800/60 text-white"
                      : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  <span aria-hidden="true">{PLANS[key].flag}</span>
                  {PLANS[key].label}
                </button>
              ))}
            </div>
            <p className="-mt-3 text-xs text-zinc-500">USD = BDT126.667</p>

            {/* Product summary */}
            <div className="flex items-start justify-between gap-4 pt-4">
              <div className="space-y-0.5">
                <p className="font-medium">HireLoop Pro Plan</p>
                <p className="text-xs text-zinc-500">Access to all features</p>
              </div>
              <p className="font-semibold">{price}</p>
            </div>
          </div>

          {/* Right: payment details */}
          <div className="space-y-5">
            {/* Link express checkout */}
            <button
              type="button"
              onClick={() =>
                toast.add({
                  title: "Link checkout coming soon",
                  description: "Express checkout is not wired up yet.",
                })
              }
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#00d66f] font-semibold text-black transition-colors hover:bg-[#00c264]"
            >
              <span className="grid size-5 place-items-center rounded-full bg-black text-[10px] font-bold text-white">
                L
              </span>
              link
              <span className="ml-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                VISA 4242
              </span>
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="h-px flex-1 bg-zinc-800" />
              OR
              <span className="h-px flex-1 bg-zinc-800" />
            </div>

            {/* Contact information */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Contact information</p>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-zinc-700 bg-[#0d0d10] px-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#0073e6] focus:ring-2 focus:ring-[#0073e6]/40"
              />
            </div>

            {/* Payment method */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment method</p>
              <div className="overflow-hidden rounded-lg border border-zinc-700 bg-[#0d0d10]">
                <button
                  type="button"
                  onClick={() => setCardOpen((open) => !open)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-800/60"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="size-4 text-zinc-400" />
                    Card
                  </span>
                  {cardOpen ? (
                    <ChevronUp className="size-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="size-4 text-zinc-400" />
                  )}
                </button>

                {cardOpen && (
                  <div className="space-y-4 border-t border-zinc-800 px-3 py-4">
                    {/* Card information */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                        Card information
                      </p>
                      <div className="relative">
                        <input
                          inputMode="numeric"
                          placeholder="1234 1234 1234 1234"
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(formatCardNumber(e.target.value))
                          }
                          className="h-10 w-full rounded-md border border-zinc-700 bg-[#0d0d10] px-3 pr-16 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#0073e6] focus:ring-2 focus:ring-[#0073e6]/40"
                        />
                        <span className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
                          <span className="rounded bg-zinc-700/80 px-1 text-[9px] font-bold text-zinc-200">
                            VISA
                          </span>
                          <span className="rounded bg-zinc-700/80 px-1 text-[9px] font-bold text-zinc-200">
                            MC
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          inputMode="numeric"
                          placeholder="MM / YY"
                          value={expiry}
                          onChange={(e) =>
                            setExpiry(formatExpiry(e.target.value))
                          }
                          className="h-10 w-full rounded-md border border-zinc-700 bg-[#0d0d10] px-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#0073e6] focus:ring-2 focus:ring-[#0073e6]/40"
                        />
                        <div className="relative">
                          <input
                            inputMode="numeric"
                            placeholder="CVC"
                            value={cvc}
                            onChange={(e) =>
                              setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                            }
                            className="h-10 w-full rounded-md border border-zinc-700 bg-[#0d0d10] px-3 pr-9 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#0073e6] focus:ring-2 focus:ring-[#0073e6]/40"
                          />
                          <Keyboard className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-zinc-500" />
                        </div>
                      </div>
                    </div>

                    {/* Cardholder name */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                        Cardholder&apos;s name
                      </p>
                      <input
                        placeholder="Full name on card"
                        value={cardholder}
                        onChange={(e) => setCardholder(e.target.value)}
                        className="h-10 w-full rounded-md border border-zinc-700 bg-[#0d0d10] px-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#0073e6] focus:ring-2 focus:ring-[#0073e6]/40"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                        Country or region
                      </p>
                      <div className="relative">
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="h-10 w-full appearance-none rounded-md border border-zinc-700 bg-[#0d0d10] px-3 pr-8 text-sm text-white outline-none transition-colors focus:border-[#0073e6] focus:ring-2 focus:ring-[#0073e6]/40 [&>option]:bg-[#0d0d10] [&>option]:text-white"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-zinc-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save info */}
            <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
              <Checkbox
                className="mt-0.5 border-zinc-600 bg-transparent text-black dark:bg-transparent dark:data-checked:bg-white dark:data-checked:text-black"
                aria-label="Save my information for faster checkout"
              />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">
                  Save my information for faster checkout
                </p>
                <p className="text-xs text-zinc-500">
                  Pay securely on HireLoop and save time when you access.
                </p>
              </div>
            </div>

            {/* Pay button */}
            <button
              type="button"
              onClick={handlePay}
              className="h-11 w-full rounded-lg bg-[#0073e6] text-sm font-semibold text-white transition-colors hover:bg-[#0064c9]"
            >
              Pay
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="space-y-2 border-t border-zinc-800 bg-[#0a0a0b] py-6 text-center">
        <p className="text-xs text-zinc-500">Powered by Stripe</p>
        <p className="flex justify-center gap-4 text-xs text-zinc-600">
          <a href="#" className="hover:text-zinc-400">
            Terms
          </a>
          <a href="#" className="hover:text-zinc-400">
            Privacy
          </a>
        </p>
      </footer>
    </div>
  )
}
