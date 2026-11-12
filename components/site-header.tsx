"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import logo from "@/public/images/logo.png"
import { authClient, useSession } from "@/lib/auth-client"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Hireloop home"
      className={cn(
        "inline-flex items-center gap-0.5 text-2xl font-extrabold tracking-tight",
        className
      )}
    >
      <Image src={logo} alt="logo" width={154} height={44} />
    </Link>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  )
}

export function SiteHeader() {
  const router = useRouter()
  const { data: session } = useSession()
  const navLinks = [
    { href: "/browse-jobs", label: "Browse Jobs" },
    { href: "/company", label: "Company" },
    { href: "/pricing", label: "Pricing" },
    {
      href: `/dashboard/${session?.user.role || "seeker"}`,
      label: "Dashboard",
    },
  ] as const

  async function handleSignOut() {
    await authClient.signOut()
    router.replace("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full p-2 sm:p-4">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-xl border bg-card/80 px-4 shadow-sm backdrop-blur sm:h-16 sm:px-6">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
          <div className="h-6 w-px bg-border" />
          {session?.user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome,&nbsp;
                <span className="font-medium text-foreground">
                  {session.user.name}
                </span>
              </span>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-border bg-card/40 hover:bg-muted"
                onClick={handleSignOut}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                nativeButton={false}
                variant="ghost"
                className="text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-500"
                render={<Link href="/signin" />}
              >
                Sign In
              </Button>
              <Button
                nativeButton={false}
                size="lg"
                className="h-10 rounded-xl bg-indigo-500 px-5 text-white hover:bg-indigo-400"
                render={<Link href="/signup" />}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile nav */}
        <details className="group relative md:hidden">
          <summary
            aria-label="Open menu"
            className="grid size-9 cursor-pointer list-none place-items-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden"
          >
            <svg
              className="size-5 group-open:hidden"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className="hidden size-5 group-open:block"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </summary>
          <div className="absolute top-[calc(100%+0.5rem)] right-0 z-50 flex w-56 flex-col gap-1 rounded-xl border bg-popover p-2 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-1 h-px bg-border" />
            {session?.user ? (
              <>
                <span className="rounded-lg px-3 py-2 text-sm text-muted-foreground">
                  Welcome,{" "}
                  <span className="font-medium text-foreground">
                    {session.user.name}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-lg px-3 py-2 text-left text-sm text-indigo-500 transition-colors hover:bg-indigo-500/10"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg px-3 py-2 text-sm text-indigo-500 transition-colors hover:bg-indigo-500/10"
                >
                  Sign In
                </Link>
                <Button
                  nativeButton={false}
                  className="mt-1 bg-indigo-500 text-white hover:bg-indigo-400"
                  render={<Link href="/signup" />}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </details>
      </nav>
    </header>
  )
}
