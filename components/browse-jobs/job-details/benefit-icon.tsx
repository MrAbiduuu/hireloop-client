import {
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  PiggyBank,
  Plane,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import type { BenefitIcon } from "@/lib/types/jobs"

// Add a new key here (and to the BenefitIcon union in lib/types/jobs.ts)
// to support more benefit icons.
const benefitIcons: Record<BenefitIcon, LucideIcon> = {
  health: HeartPulse,
  retirement: PiggyBank,
  hardware: Laptop,
  time: Plane,
  remote: Home,
  learning: GraduationCap,
  wellness: Sparkles,
  generic: Sparkles,
}

export function BenefitIconGlyph({ icon }: { icon: BenefitIcon }) {
  const Icon = benefitIcons[icon] ?? benefitIcons.generic

  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full border bg-muted">
      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
    </span>
  )
}
