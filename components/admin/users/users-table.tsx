"use client"

import type { ManagedUser } from "@/lib/actions/admin-users"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { AdminToggle } from "./admin-toggle"
import { RoleBadge } from "./role-badge"
import { RoleSelect } from "./role-select"
import { formatDate, initials } from "./types"

type UsersTableProps = {
  users: ManagedUser[]
  currentUserId?: string
  pendingUserId: string | null
  onRoleChange: (user: ManagedUser, role: string) => void
  onAdminToggle: (user: ManagedUser, enabled: boolean) => void
}

/** Read-only identity columns plus the two role controls admins can use. */
export function UsersTable({
  users,
  currentUserId,
  pendingUserId,
  onRoleChange,
  onAdminToggle,
}: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden lg:table-cell">Account</TableHead>
          <TableHead className="hidden sm:table-cell">Joined</TableHead>
          <TableHead className="text-right">Admin Access</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => {
          const isSelf = user.id === currentUserId
          const isUpdating = pendingUserId === user.id
          const isAdmin = user.role === "admin"

          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {initials(user.name, user.email)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {user.name || "Unnamed user"}
                      {isSelf && (
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground md:hidden">
                      {user.email}
                    </p>
                    {user.location && (
                      <p className="truncate text-xs text-muted-foreground">
                        {user.location}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell className="hidden whitespace-nowrap text-sm md:table-cell">
                {user.email}
              </TableCell>

              <TableCell>
                <div className="flex flex-col items-start gap-1.5">
                  <RoleBadge role={user.role} />
                  <RoleSelect
                    value={user.role}
                    disabled={isSelf || isUpdating}
                    label={`Change role for ${user.email}`}
                    onChange={(role) => onRoleChange(user, role)}
                  />
                </div>
              </TableCell>

              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className={
                      user.emailVerified
                        ? "border-emerald-500/30 text-emerald-500"
                        : "text-muted-foreground"
                    }
                  >
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                  {user.premium && (
                    <Badge
                      variant="outline"
                      className="border-amber-500/30 text-amber-500"
                    >
                      Premium
                    </Badge>
                  )}
                  {user.banned && (
                    <Badge variant="destructive">Banned</Badge>
                  )}
                </div>
              </TableCell>

              <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground sm:table-cell">
                {formatDate(user.createdAt)}
              </TableCell>

              <TableCell className="text-right">
                <AdminToggle
                  checked={isAdmin}
                  disabled={isSelf || isUpdating}
                  label={`Toggle admin access for ${user.email}`}
                  onCheckedChange={(enabled) => onAdminToggle(user, enabled)}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
