"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BriefcaseBusiness,
  CircleCheck,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  UserRound,
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
  parseSkills,
  profileFromSession,
  type SeekerProfile,
} from "@/lib/types/seeker-profile"
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
}: {
  label: string
  value: string
  icon?: LucideIcon
}) {
  return (
    <div className="space-y-1.5">
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

export default function SeekerProfilePage() {
  const { data: session, isPending, refetch } = useSession()
  const user = session?.user

  const sessionProfile = profileFromSession(user)
  const [draft, setDraft] = useState<SeekerProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // A `null` draft means "show saved session data". While editing, the draft
  // is the single source of truth, so a session refetch cannot overwrite it.
  const editing = draft !== null
  const profile = draft ?? sessionProfile

  const set = <K extends keyof SeekerProfile>(
    key: K,
    value: SeekerProfile[K]
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
        headline: profile.headline.trim(),
        bio: profile.bio.trim(),
        location: profile.location.trim(),
        phone: profile.phone.trim(),
        skills: parseSkills(profile.skillsText),
        resumeName: profile.resumeName.trim(),
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

  if (user.role && user.role !== "seeker") {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
        This page is for job seekers.
      </div>
    )
  }

  const skills = parseSkills(profile.skillsText)
  const completed = [
    profile.name,
    profile.headline,
    profile.bio,
    profile.location,
    skills.length > 0 ? "skills" : "",
  ].filter(Boolean).length
  const completeness = Math.round((completed / 5) * 100)

  const content = (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Identity + profile information */}
        <SectionCard
          title="Profile Information"
          description="The basics recruiters see when they open your profile."
        >
          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-input/20 p-4">
            <Avatar name={profile.name} image={profile.image} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {profile.name || "Your name"}
                </h2>
                <Badge variant="secondary" className="capitalize">
                  {user.role ?? "seeker"}
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

        {/* Professional details */}
        <SectionCard
          title="Professional Details"
          description="Tell recruiters what you do and what you are great at."
        >
          {editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <EditField
                id="headline"
                label="Professional headline"
                value={profile.headline}
                onChange={(value) => set("headline", value)}
                placeholder="Frontend Developer"
                icon={BriefcaseBusiness}
                full
              />
              <EditField
                id="bio"
                label="Short description"
                value={profile.bio}
                onChange={(value) => set("bio", value)}
                placeholder="A short summary of your experience and goals..."
                textarea
                rows={4}
                full
              />
              <EditField
                id="skills"
                label="Skills"
                value={profile.skillsText}
                onChange={(value) => set("skillsText", value)}
                placeholder="React, TypeScript, Node.js"
                full
              />
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Separate skills with a comma.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <ViewField
                label="Professional headline"
                value={profile.headline}
                icon={BriefcaseBusiness}
              />
              <ViewField label="Short description" value={profile.bio} />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Skills
                </p>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
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
              <FileText className="size-4 text-muted-foreground" />
            </div>
            <CardTitle>Resume</CardTitle>
            <CardDescription>
              Keep your latest resume handy when applying for jobs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.resumeName ? (
              <div className="flex items-center gap-2 rounded-lg border bg-input/20 p-3 text-sm">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 truncate">{profile.resumeName}</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No resume added yet.
              </p>
            )}

            {editing && (
              <EditField
                id="resumeName"
                label="Resume file name"
                value={profile.resumeName}
                onChange={(value) => set("resumeName", value)}
                placeholder="jane-doe-resume.pdf"
                full
              />
            )}

            <p className="text-xs text-muted-foreground">
              File uploads can be connected to storage later. For now the file
              name is saved with your profile.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile strength</CardTitle>
            <CardDescription>
              A complete profile helps recruiters find you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{completeness}%</span>
              <span className="text-xs text-muted-foreground">
                {completed} of 5 details
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Full name", done: Boolean(profile.name) },
                { label: "Headline", done: Boolean(profile.headline) },
                { label: "Description", done: Boolean(profile.bio) },
                { label: "Location", done: Boolean(profile.location) },
                {
                  label: "At least one skill",
                  done: skills.length > 0,
                },
              ].map((item) => (
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
          { label: "Seeker", href: "/dashboard/seeker" },
          { label: "Profile" },
        ]}
        title="My Profile"
        description="Manage how your profile appears to recruiters on Hireloop."
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
                form="seeker-profile-form"
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
            <Button onClick={() => setDraft(profileFromSession(user))}>
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
        <form id="seeker-profile-form" onSubmit={handleSave}>
          {content}
        </form>
      ) : (
        content
      )}
    </div>
  )
}
