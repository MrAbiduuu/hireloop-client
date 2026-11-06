import { Logo } from "@/components/site-header"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-4 py-12">
      {/* ambient glow, consistent with the hero backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="-top-40px absolute left-1/2 size-150 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute -bottom-35 left-1/2 size-125 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        {children}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireLoop. All rights reserved.
        </p>
      </div>
    </main>
  )
}
