"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Building2, CalendarIcon, MapPin } from "lucide-react"

import { PublishJobs } from "@/lib/actions/jobs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// All form data in one flat object — easy to read, easy to send
export type JobForm = {
  jobTitle: string
  companyName: string
  jobCategory: string
  jobType: string
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  salaryFrequency: string
  responsibilities: string
  qualifications: string
}

const initialForm: JobForm = {
  jobTitle: "",
  companyName: "",
  jobCategory: "Engineering & Tech",
  jobType: "Full-time",
  isRemote: true,
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  salaryFrequency: "per hour",
  responsibilities: "",
  qualifications: "",
}

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"]
const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Marketing & Sales",
  "Finance & Legal",
  "Healthcare",
  "Education",
  "Other",
]
const SALARY_FREQUENCIES = ["per hour", "per day", "per month", "per year"]

const inputStyles = "h-9 bg-input/40"
const sectionTitleStyles =
  "flex items-center gap-2 text-sm font-semibold text-foreground"
const sectionDotStyles = "size-1.5 rounded-full bg-primary"
const fieldLabelStyles = "text-xs font-medium text-muted-foreground"
const requiredMark = <span className="text-primary">*</span>

function Section({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-5">
      <h2 className={sectionTitleStyles}>
        <span className={sectionDotStyles} />
        {number}. {title}
      </h2>
      {children}
    </section>
  )
}

const NewJobsPage = () => {
  const [form, setForm] = useState<JobForm>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // single helper to update any field: set("jobTitle", value)
  const set = <K extends keyof JobForm>(key: K, value: JobForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await PublishJobs(form)
      router.push("/dashboard/recruiter/jobs") // back to Manage Jobs on success
    } catch (err) {
      console.error(err)
      setError(
        "Failed to publish the job. Make sure the backend is running and try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            <Link href="/dashboard/recruiter/jobs" className="hover:underline">
              Manage Jobs
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Create New Listing</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Post a New Job</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>
        <Button
          size="lg"
          disabled={submitting}
          form="new-job-form"
          type="submit"
        >
          {submitting ? "Publishing..." : "Publish Job →"}
        </Button>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <form id="new-job-form" onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic Information */}
        <Section number={1} title="Basic Information">
          <div className="space-y-1.5">
            <Label className={fieldLabelStyles} htmlFor="jobTitle">
              Job Title {requiredMark}
            </Label>
            <Input
              id="jobTitle"
              className={inputStyles}
              placeholder="Frontend Developer"
              value={form.jobTitle}
              onChange={(e) => set("jobTitle", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className={fieldLabelStyles} htmlFor="companyName">
                Company Name {requiredMark}
              </Label>
              <div className="relative">
                <Building2 className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="companyName"
                  className={`${inputStyles} pl-8`}
                  placeholder="HirePulse Network"
                  value={form.companyName}
                  onChange={(e) => set("companyName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className={fieldLabelStyles} htmlFor="jobCategory">
                Job Category {requiredMark}
              </Label>
              <Select
                id="jobCategory"
                className={inputStyles}
                value={form.jobCategory}
                onChange={(e) => set("jobCategory", e.target.value)}
              >
                {JOB_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className={fieldLabelStyles}>Job Type {requiredMark}</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {JOB_TYPES.map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={form.jobType === type ? "secondary" : "outline"}
                  onClick={() => set("jobType", type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </Section>

        {/* 2. Location, Compensation & Timeline */}
        <Section number={2} title="Location, Compensation & Timeline">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-input/20 p-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-muted">
                🏠
              </span>
              <div>
                <p className="text-sm font-medium">
                  Remote Work Allowed (IsRemote)
                </p>
                <p className="text-xs text-muted-foreground">
                  Enable local &amp; low &amp; distributed candidate
                  applications
                </p>
              </div>
            </div>
            <Switch
              checked={form.isRemote}
              onCheckedChange={(checked) => set("isRemote", checked)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className={fieldLabelStyles} htmlFor="location">
                Job Location (location)
              </Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  className={`${inputStyles} pl-8`}
                  placeholder="New York, USA"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className={fieldLabelStyles} htmlFor="deadline">
                Application Deadline (deadline){" "}
                <span className="text-primary">Required</span>
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="deadline"
                  type="date"
                  className={`${inputStyles} pl-8`}
                  value={form.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className={fieldLabelStyles} htmlFor="minSalary">
                Min Salary / Rate
              </Label>
              <Input
                id="minSalary"
                type="number"
                min="0"
                className={inputStyles}
                placeholder="€ 25"
                value={form.minSalary}
                onChange={(e) => set("minSalary", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className={fieldLabelStyles} htmlFor="maxSalary">
                Max Salary / Rate
              </Label>
              <Input
                id="maxSalary"
                type="number"
                min="0"
                className={inputStyles}
                placeholder="€ 40"
                value={form.maxSalary}
                onChange={(e) => set("maxSalary", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className={fieldLabelStyles} htmlFor="salaryFrequency">
                Frequency
              </Label>
              <Select
                id="salaryFrequency"
                className={inputStyles}
                value={form.salaryFrequency}
                onChange={(e) => set("salaryFrequency", e.target.value)}
              >
                {SALARY_FREQUENCIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Section>

        {/* 3. Responsibilities & Requirements */}
        <Section number={3} title="Responsibilities & Requirements">
          <div className="space-y-1.5">
            <Label className={fieldLabelStyles} htmlFor="responsibilities">
              Key Responsibilities {requiredMark}
            </Label>
            <Textarea
              id="responsibilities"
              rows={4}
              className="bg-input/40"
              placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences..."
              value={form.responsibilities}
              onChange={(e) => set("responsibilities", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className={fieldLabelStyles} htmlFor="qualifications">
              Qualifications &amp; Requirements {requiredMark}
            </Label>
            <Textarea
              id="qualifications"
              rows={4}
              className="bg-input/40"
              placeholder={
                "• 3+ years of experience with React, TypeScript...\n• Solid understanding of DOM performance..."
              }
              value={form.qualifications}
              onChange={(e) => set("qualifications", e.target.value)}
              required
            />
          </div>
        </Section>
      </form>
    </div>
  )
}

export default NewJobsPage
