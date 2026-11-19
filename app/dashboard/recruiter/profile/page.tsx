"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building2,
  CircleCheck,
  Globe2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { authClient, useSession } from "@/lib/auth-client"
import {
  parseHiringFocus,
  recruiterProfileFromSession,
  type RecruiterProfile,
} from "@/lib/types/recruiter-profile"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/* Small presentational helpers — keep the page itself easy to scan.          */
/* -------------------------------------------------------------------------- */

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

function Avatar({ name, image }: { name: string; image: string }) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "?"

  return (
    <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-muted text-lg font-semibold text-muted-foreground ring-1 ring-border">
      {image ? (
        // Avatar URLs come from the user's own profile, so no remote optimization is needed.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="size-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
}

function ViewField({
  label,
  value,
  icon: Icon,
  full = false,
}: {
  label: string
  value: string
  icon?: LucideIcon
  full?: boolean
}) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-start gap-2 text-sm">
        {Icon && (
          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        )}
        <span className="break-words whitespace-pre-wrap">
          {value || "Not added yet"}
        </span>
      </div>
    </div>
  )
}

type EditFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "url" | "tel"
  icon?: LucideIcon
  textarea?: boolean
  rows?: number
  readOnly?: boolean
  full?: boolean
  required?: boolean
}

function EditField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  textarea = false,
  rows = 3,
  readOnly = false,
  full = false,
  required = false,
}: EditFieldProps) {
  const iconPadding = Icon && !textarea ? "pl-8" : ""

  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>

      <div className="relative">
        {Icon && !textarea && (
          <Icon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        )}

        {textarea ? (
          <Textarea
            id={id}
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="bg-input/40"
          />
        ) : (
          <Input
            id={id}
            type={type}
            className={cn(iconPadding, "bg-input/40", readOnly && "opacity-70")}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            readOnly={readOnly}
            required={required}
          />
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function RecruiterProfilePage() {
  const { data: session, isPending, refetch } = useSession()
  const user = session?.user

  const sessionProfile = recruiterProfileFromSession(user)
  const [draft, setDraft] = useState<RecruiterProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // A `null` draft means "show saved session data". While editing, the draft
  // is the single source of truth, so a session refetch cannot overwrite it.
  const editing = draft !== null
  const profile = draft ?? sessionProfile

  const set = <K extends keyof RecruiterProfile>(
    key: K,
    value: RecruiterProfile[K]
  ) => setDraft((current) => ({ ...(current ?? sessionProfile), [key]: value }))

  function handleCancel() {
    setDraft(null)
    setError(null)
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    setSaving(true)
    setError(null)

    try {
      const { error: updateError } = await authClient.updateUser({
        name: profile.name.trim(),
        image: profile.image.trim() || null,
        phone: profile.phone.trim(),
        location: profile.location.trim(),
        headline: profile.headline.trim(),
        bio: profile.bio.trim(),
        companyName: profile.companyName.trim(),
        companyWebsite: profile.companyWebsite.trim(),
        companySize: profile.companySize.trim(),
        industry: profile.industry.trim(),
        hiringFocus: parseHiringFocus(profile.hiringFocusText),
      })

      if (updateError) {
        throw new Error(updateError.message ?? "Could not save your profile.")
      }

      await refetch()
      setDraft(null)
      toast.add({
        title: "Profile updated",
        description: "Your changes have been saved.",
      })
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not save your profile."
      setError(message)
      toast.add({ title: "Could not save profile", description: message })
    } finally {
      setSaving(false)
    }
  }

  if (isPending) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading your profile...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="font-medium">Please sign in to edit your profile.</p>
        <Button
          className="mt-4"
          nativeButton={false}
          render={<Link href="/signin" />}
        >
          Sign in
        </Button>
      </div>
    )
  }

  if (user.role && user.role !== "recruiter") {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
        This page is for recruiters.
      </div>
    )
  }

  const hiringFocus = parseHiringFocus(profile.hiringFocusText)
  const checklist = [
    { label: "Full name", done: Boolean(profile.name) },
    { label: "Headline", done: Boolean(profile.headline) },
    { label: "Description", done: Boolean(profile.bio) },
    { label: "Location", done: Boolean(profile.location) },
    { label: "Company name", done: Boolean(profile.companyName) },
    { label: "Hiring focus", done: hiringFocus.length > 0 },
  ]
  const completed = checklist.filter((item) => item.done).length
  const completeness = Math.round((completed / checklist.length) * 100)
  const websiteHref = /^https?:\/\//i.test(profile.companyWebsite)
    ? profile.companyWebsite
    : `https://${profile.companyWebsite}`

  const content = (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Identity + personal information */}
        <SectionCard
          title="Personal Information"
          description="The basics candidates see when they view your job posts."
        >
          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-input/20 p-4">
            <Avatar name={profile.name} image={profile.image} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {profile.name || "Your name"}
                </h2>
                <Badge variant="secondary" className="capitalize">
                  {user.role ?? "recruiter"}
                </Badge>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                {profile.email}
              </p>
              {profile.headline && !editing && (
                <p className="mt-1 text-sm">{profile.headline}</p>
              )}
            </div>
          </div>

          {editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <EditField
                id="name"
                label="Full name"
                value={profile.name}
                onChange={(value) => set("name", value)}
                placeholder="Jane Doe"
                icon={UserRound}
                required
              />
              <EditField
                id="email"
                label="Email"
                value={profile.email}
                onChange={() => undefined}
                icon={Mail}
                readOnly
              />
              <EditField
                id="phone"
                label="Phone number"
                value={profile.phone}
                onChange={(value) => set("phone", value)}
                placeholder="+1 555 000 1234"
                type="tel"
                icon={Phone}
              />
              <EditField
                id="location"
                label="Location"
                value={profile.location}
                onChange={(value) => set("location", value)}
                placeholder="New York, USA"
                icon={MapPin}
              />
              <EditField
                id="image"
                label="Avatar URL"
                value={profile.image}
                onChange={(value) => set("image", value)}
                placeholder="https://example.com/avatar.png"
                type="url"
                full
              />
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Email is managed by your account settings and cannot be changed
                here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <ViewField
                label="Full name"
                value={profile.name}
                icon={UserRound}
              />
              <ViewField label="Email" value={profile.email} icon={Mail} />
              <ViewField label="Phone" value={profile.phone} icon={Phone} />
              <ViewField
                label="Location"
                value={profile.location}
                icon={MapPin}
              />
            </div>
          )}
        </SectionCard>

        {/* Company + hiring details */}
        <SectionCard
          title="Company & Hiring Details"
          description="Tell candidates who you are and which roles you hire for."
        >
          {editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <EditField
                id="companyName"
                label="Company name"
                value={profile.companyName}
                onChange={(value) => set("companyName", value)}
                placeholder="HirePulse Network"
                icon={Building2}
              />
              <EditField
                id="industry"
                label="Industry"
                value={profile.industry}
                onChange={(value) => set("industry", value)}
                placeholder="Information Technology"
              />
              <EditField
                id="companySize"
                label="Company size"
                value={profile.companySize}
                onChange={(value) => set("companySize", value)}
                placeholder="11-50 employees"
                icon={UsersRound}
              />
              <EditField
                id="companyWebsite"
                label="Company website"
                value={profile.companyWebsite}
                onChange={(value) => set("companyWebsite", value)}
                placeholder="https://example.com"
                type="url"
                icon={Globe2}
              />
              <EditField
                id="headline"
                label="Professional headline"
                value={profile.headline}
                onChange={(value) => set("headline", value)}
                placeholder="Talent Acquisition Lead"
                full
              />
              <EditField
                id="bio"
                label="About you & your company"
                value={profile.bio}
                onChange={(value) => set("bio", value)}
                placeholder="A short summary of your team and what you are hiring for..."
                textarea
                rows={4}
                full
              />
              <EditField
                id="hiringFocus"
                label="Hiring focus"
                value={profile.hiringFocusText}
                onChange={(value) => set("hiringFocusText", value)}
                placeholder="Frontend Developer, Product Designer"
                full
              />
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Separate the roles you hire for with a comma.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <ViewField
                label="Company name"
                value={profile.companyName}
                icon={Building2}
              />
              <ViewField label="Industry" value={profile.industry} />
              <ViewField
                label="Company size"
                value={profile.companySize}
                icon={UsersRound}
              />
              <ViewField
                label="Company website"
                value={profile.companyWebsite}
                icon={Globe2}
              />
              <ViewField
                label="Professional headline"
                value={profile.headline}
                full
              />
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">
                  About you &amp; your company
                </p>
                <p className="break-words whitespace-pre-wrap text-sm">
                  {profile.bio || "Not added yet"}
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Hiring focus
                </p>
                {hiringFocus.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {hiringFocus.map((focus) => (
                      <Badge key={focus} variant="secondary">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not added yet</p>
                )}
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Sidebar cards */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <Building2 className="size-4 text-muted-foreground" />
            </div>
            <CardTitle>Your company</CardTitle>
            <CardDescription>
              A quick look at the organization behind your listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="font-medium">
                {profile.companyName || "No company added yet"}
              </p>
              {profile.industry && (
                <p className="text-muted-foreground">{profile.industry}</p>
              )}
              {profile.companySize && (
                <p className="text-muted-foreground">{profile.companySize}</p>
              )}
              {profile.companyWebsite && (
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 break-all text-primary hover:underline"
                >
                  <Globe2 className="size-4 shrink-0" />
                  {profile.companyWebsite}
                </a>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t pt-4">
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/dashboard/recruiter/jobs" />}
              >
                Manage job posts
              </Button>
              <Button
                nativeButton={false}
                variant="ghost"
                render={<Link href="/dashboard/recruiter/jobs/new" />}
              >
                Post a new job
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile strength</CardTitle>
            <CardDescription>
              A complete profile helps candidates trust your listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{completeness}%</span>
              <span className="text-xs text-muted-foreground">
                {completed} of {checklist.length} details
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <div className="space-y-2 text-sm">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <CircleCheck
                    className={cn(
                      "size-4 shrink-0",
                      item.done ? "text-primary" : "text-muted-foreground/40"
                    )}
                  />
                  <span
                    className={cn(
                      item.done ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[
          { label: "Recruiter", href: "/dashboard/recruiter" },
          { label: "Profile" },
        ]}
        title="Recruiter Profile"
        description="Manage the details candidates see when they view your job posts."
        action={
          editing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                <X />
                Cancel
              </Button>
              <Button
                type="submit"
                form="recruiter-profile-form"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save />
                    Save changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setDraft(recruiterProfileFromSession(user))}>
              <Pencil />
              Edit profile
            </Button>
          )
        }
      />

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {editing ? (
        <form id="recruiter-profile-form" onSubmit={handleSave}>
          {content}
        </form>
      ) : (
        content
      )}
    </div>
  )
}
