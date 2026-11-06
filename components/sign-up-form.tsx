"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { useState } from "react"

import {
  AuthField,
  AuthPasswordField,
  FormError,
  SocialButtons,
  SocialDivider,
  SubmitButton,
} from "@/components/auth-forms"
import { authClient } from "@/lib/auth-client"

export function SignUpForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    setPending(true)
    setError(null)
    const { error: authError } = await authClient.signUp.email({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    })
    setPending(false)

    if (authError) {
      setError(authError.message ?? "Unable to create your account. Please try again.")
      return
    }
    // Success — TODO: route to the signed-in area (e.g. /onboarding or /dashboard)
    router.replace("/")
  }

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthField
          id="name"
          name="name"
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
          required
        />
        <AuthField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthPasswordField
          id="password"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          hint="Must be at least 8 characters."
          required
          minLength={8}
        />

        <FormError message={error} />
        <SubmitButton pending={pending}>Create Account</SubmitButton>
      </form>

      <SocialDivider />
      <SocialButtons onError={setError} />
    </div>
  )
}
