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
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export function SignUpForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    setPending(true)
    setError(null)
    const { error: authError } = await authClient.signUp.email({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      role: String(data.get("role") ?? "seeker"),
    } as never)
    setPending(false)

    if (authError) {
      setError(
        authError.message ?? "Unable to create your account. Please try again."
      )
      return
    }
    // Success — TODO: route to the signed-in area (e.g. /onboarding or /dashboard)
    router.replace("/")
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSignUp} className="space-y-4" noValidate>
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
        <div className="space-y-2">
          <Label htmlFor="role">Joining hireloop as:</Label>
          <span className="text-sm text-muted-foreground">(Select One)</span>
          <select
            id="role"
            name="role"
            defaultValue="seeker"
            className="flex h-10 w-full rounded-xl border border-input bg-[#1E1E1E] px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="seeker">Seeker</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <FormError message={error} />
        <SubmitButton pending={pending}>Create Account</SubmitButton>
      </form>

      <SocialDivider />
      <SocialButtons onError={setError} />
    </div>
  )
}
