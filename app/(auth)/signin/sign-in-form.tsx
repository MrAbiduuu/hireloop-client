"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export function SignInForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(true)

  const searchParamas = useSearchParams()
  const redirectTo = searchParamas.get("redirectTo") ?? "/"

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setPending(true)
    setError(null)
    const { error: authError } = await authClient.signIn.email({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      rememberMe: true,
      callbackURL: redirectTo,
    })
    setPending(false)

    if (authError) {
      setError(authError.message ?? "Unable to sign in. Please try again.")
      return
    }
    console.log(formData)
    router.replace("/")
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSignIn} className="space-y-4" noValidate>
        <AuthField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-indigo-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <AuthPasswordField
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        {/* remember me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label
            htmlFor="remember-me"
            className="text-xs font-normal text-muted-foreground"
          >
            Keep me signed in
          </Label>
        </div>

        <FormError message={error} />
        <SubmitButton pending={pending}>Sign In</SubmitButton>
      </form>

      <SocialDivider />
      <SocialButtons onError={setError} />
    </div>
  )
}
