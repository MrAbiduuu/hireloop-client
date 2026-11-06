"use client"

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import * as React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

/** Text input with label — the idle state (empty) rarely flips; avoid it */
export function AuthField({
  id,
  label,
  hint,
  ...props
}: React.ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className="h-10 w-full" {...props} />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

/** Password input with a visibility toggle */
export function AuthPasswordField({
  id,
  label = "",
  hint,
  ...props
}: React.ComponentProps<"input"> & { label?: string; hint?: string }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          className="h-10 w-full pr-10"
          type={visible ? "text" : "password"}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-0.5 size-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-10 w-full rounded-xl bg-indigo-500 text-white hover:bg-indigo-400"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  )
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null

  return (
    <p
      role="alert"
      className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive"
    >
      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}

/** Divider: "or continue with" */
export function SocialDivider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground uppercase">
        or continue with
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.1 3.57-5.2 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15a7.14 7.14 0 0 1-6.9-4.94H1.06v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.1 14.3a7.15 7.15 0 0 1 0-4.57V6.64H1.06a12 12 0 0 0 0 10.75L5.1 14.3Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.83 0 3.47.63 4.77 1.86l3.57-3.57A11.98 11.98 0 0 0 12 0a12 12 0 0 0-10.94 6.64L5.1 9.73A7.14 7.14 0 0 1 12 4.76Z"
      />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.53-1.35-1.3-1.7-1.3-1.7-1.05-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.15v3.19c0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

const socialOptions = [
  { provider: "google" as const, label: "Google", Icon: GoogleIcon },
  // TODO: enable the github provider in lib/auth.ts to activate this button
  { provider: "github" as const, label: "GitHub", Icon: GithubIcon },
]

/** Google/GitHub OAuth buttons wired to better-auth social sign-in */
export function SocialButtons({
  onError,
}: {
  onError?: (message: string) => void
}) {
  const [pending, setPending] = useState<string | null>(null)

  async function handleSocial(provider: "google" | "github") {
    setPending(provider)
    onError?.("")
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    })
    setPending(null)
    if (error) {
      onError?.(error.message ?? `Unable to sign in with ${provider}.`)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {socialOptions.map(({ provider, label, Icon }) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          className="h-10 w-full rounded-xl border-border bg-card/40"
          disabled={pending !== null}
          onClick={() => handleSocial(provider)}
        >
          {pending === provider ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Icon className="size-4" />
          )}
          {label}
        </Button>
      ))}
    </div>
  )
}
