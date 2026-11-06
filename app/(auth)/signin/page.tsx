import type { Metadata } from "next"
import Link from "next/link"

import { SignInForm } from "@/app/(auth)/signin/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In — HireLoop",
}

export default function SignInPage() {
  return (
    <div className="w-full rounded-2xl border bg-card/80 p-6 shadow-lg backdrop-blur sm:p-8">
      <div className="mb-6 space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue your job hunt
        </p>
      </div>

      <SignInForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-indigo-400 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
