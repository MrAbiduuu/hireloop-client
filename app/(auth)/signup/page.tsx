import type { Metadata } from "next"
import Link from "next/link"

import { SignUpForm } from "@/app/(auth)/signup/sign-up-form"

export const metadata: Metadata = {
  title: "Create Account — HireLoop",
}

export default function SignUpPage() {
  return (
    <div className="w-full rounded-2xl border bg-card/80 p-6 shadow-lg backdrop-blur sm:p-8">
      <div className="mb-6 space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join HireLoop and find your dream job
        </p>
      </div>

      <SignUpForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-indigo-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
