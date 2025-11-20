"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types"
import Link from "next/link"
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { InputCopyable } from "@/components/ui/input-copyable"
import { DataTableActionsMenu } from "@/components/data-table"
import UserAvatar from "@/components/user/avatar"

export const columns = (onAssignRoles?: (user: User) => void): ColumnDef<User>[] => [
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => {
      const user = row.original
      return <UserAvatar user={user} />
    },
  },
  {
    accessorKey: "displayName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "uid",
    header: "UID",
    cell: ({ row }) => {
      const user = row.original

      return (
        <InputCopyable value={user.uid} className="w-48 border-none shadow-none" />
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DataTableActionsMenu>
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user.uid}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user.uid}/edit`}>Edit</Link>
          </DropdownMenuItem>
          {onAssignRoles && (
            <DropdownMenuItem onClick={() => onAssignRoles(user)}>
              Assign Roles
            </DropdownMenuItem>
          )}
        </DataTableActionsMenu>
      )
    },
  },
]
