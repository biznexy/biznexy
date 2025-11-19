"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Role } from "@/types"
import { DataTableActionsMenu } from "@/components/data-table"
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export const columns = (
  onEdit: (_role: Role) => void,
  onDelete: (_role: Role) => void
): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[300px] truncate">
          {description || <span className="text-muted-foreground">No description</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date | undefined
      return date ? (
        <span className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original

      return (
        <DataTableActionsMenu>
          <DropdownMenuItem onClick={() => onEdit(role)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(role)}
            className="text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DataTableActionsMenu>
      )
    },
  },
]

