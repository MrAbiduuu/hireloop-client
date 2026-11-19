"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { RefreshCw, ShieldCheck } from "lucide-react"

import {
  UserFilters,
  UsersPagination,
  UsersTable,
  UserSummary,
  type RoleFilter,
} from "@/components/admin/users"
import { describeRole, matchesRoleFilter } from "@/components/admin/users/types"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  getManagedUsers,
  setManagedUserRole,
  type ManagedUser,
} from "@/lib/actions/admin-users"
import { useSession } from "@/lib/auth-client"

const PAGE_SIZE = 8

const AdminUsersPage = () => {
  const { data: session, isPending: sessionPending } = useSession()
  const currentUserId = session?.user.id
  const isAdmin = session?.user.role === "admin"

  const [users, setUsers] = useState<ManagedUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all")
  const [page, setPage] = useState(1)

  // Remember what to restore when admin access is switched back off.
  const previousRoles = useRef<Record<string, string>>({})

  const loading = sessionPending || (isAdmin && usersLoading)

  const loadUsers = useCallback(async () => {
    setUsersLoading(true)
    setError(null)

    try {
      setUsers(await getManagedUsers())
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load users."
      )
    } finally {
      setUsersLoading(false)
    }
  }, [])

  useEffect(() => {
    if (sessionPending || !isAdmin) return

    // Defer to a microtask so the effect never sets state synchronously.
    void Promise.resolve().then(loadUsers)
  }, [sessionPending, isAdmin, loadUsers])

  const updateRole = useCallback(
    async (user: ManagedUser, role: string) => {
      if (user.role === role) return

      const previousRole = user.role
      setPendingUserId(user.id)
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, role } : item
        )
      )

      try {
        await setManagedUserRole(user.id, role)
        toast.add({
          title: "Role updated",
          description: `${user.email} is now ${describeRole(role).label}.`,
        })
      } catch (err) {
        // Revert the optimistic change when the server rejects it.
        setUsers((current) =>
          current.map((item) =>
            item.id === user.id ? { ...item, role: previousRole } : item
          )
        )
        toast.add({
          title: "Could not update role",
          description: err instanceof Error ? err.message : "Please try again.",
        })
      } finally {
        setPendingUserId(null)
      }
    },
    []
  )

  const handleRoleChange = useCallback(
    (user: ManagedUser, role: string) => {
      if (role === "admin" && user.role !== "admin") {
        previousRoles.current[user.id] = user.role
      } else if (role !== "admin") {
        delete previousRoles.current[user.id]
      }
      void updateRole(user, role)
    },
    [updateRole]
  )

  const handleAdminToggle = useCallback(
    (user: ManagedUser, enabled: boolean) => {
      if (enabled) {
        if (user.role !== "admin") {
          previousRoles.current[user.id] = user.role
        }
        void updateRole(user, "admin")
        return
      }

      const fallback = previousRoles.current[user.id] ?? "seeker"
      delete previousRoles.current[user.id]
      void updateRole(user, fallback)
    },
    [updateRole]
  )

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return users.filter((user) => {
      if (!matchesRoleFilter(user.role, roleFilter)) return false
      if (!query) return true

      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })
  }, [users, search, roleFilter])

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  if (!sessionPending && !session) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="font-medium">Please sign in to manage users.</p>
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

  if (!sessionPending && !isAdmin) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <ShieldCheck className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">Admin access required</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Only administrators can view and change user roles.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Users" }]}
        title="Manage Users"
        description="View every account, change roles, and grant or revoke admin access."
        action={
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => void loadUsers()}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        }
      />

      {error ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => void loadUsers()}>
            Retry
          </Button>
        </div>
      ) : loading ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <div className="mx-auto size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Loading users...</p>
        </div>
      ) : (
        <>
          <UserSummary users={users} />

          <div className="rounded-xl border bg-card">
            <UserFilters
              search={search}
              onSearchChange={(value) => {
                setSearch(value)
                setPage(1)
              }}
              roleFilter={roleFilter}
              onRoleFilterChange={(value) => {
                setRoleFilter(value)
                setPage(1)
              }}
              shown={filteredUsers.length}
              total={users.length}
            />

            {pageItems.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-medium">No users found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search or role filter.
                </p>
              </div>
            ) : (
              <UsersTable
                users={pageItems}
                currentUserId={currentUserId}
                pendingUserId={pendingUserId}
                onRoleChange={handleRoleChange}
                onAdminToggle={handleAdminToggle}
              />
            )}

            {filteredUsers.length > 0 && (
              <UsersPagination
                page={currentPage}
                pageCount={pageCount}
                total={filteredUsers.length}
                pageSize={PAGE_SIZE}
                onChange={setPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminUsersPage
