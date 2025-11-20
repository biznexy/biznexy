"use client"

import { useState, useEffect } from "react"
import { User, Role } from "@/types"
import { getUserRoles, assignUserRoles } from "@/app/actions/users"
import { listRoles } from "@/app/actions/roles"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { toast } from "sonner"

interface AssignRolesDialogProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  user: User | null
  onSuccess?: () => void
}

export function AssignRolesDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: AssignRolesDialogProps) {
  const [allRoles, setAllRoles] = useState<Role[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(false)

  useEffect(() => {
    if (open && user) {
      loadRoles()
    }
  }, [open, user])

  const loadRoles = async () => {
    if (!user) return

    setLoadingRoles(true)
    try {
      // Load all available roles
      const roles = await listRoles()
      setAllRoles(roles)

      // Load user's current roles
      const userRoles = await getUserRoles(user.uid)
      setSelectedRoleIds(userRoles.map((role) => role.id))
    } catch (error) {
      toast.error("Failed to load roles")
      console.error(error)
    } finally {
      setLoadingRoles(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const result = await assignUserRoles(user.uid, selectedRoleIds)
      if (result) {
        toast.success("Roles assigned successfully")
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast.error("Failed to assign roles")
      }
    } catch (error) {
      toast.error("An error occurred")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assign Roles</DialogTitle>
            <DialogDescription>
              Select roles for {user?.displayName || user?.email || user?.uid}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {loadingRoles ? (
              <div className="text-center py-4">Loading roles...</div>
            ) : allRoles.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No roles available
              </div>
            ) : (
              <ToggleGroup
                type="multiple"
                variant="outline"
                value={selectedRoleIds}
                onValueChange={setSelectedRoleIds}
                className="flex flex-wrap gap-2"
              >
                {allRoles.map((role) => (
                  <ToggleGroupItem
                    key={role.id}
                    value={role.id}
                    aria-label={`Toggle ${role.name}`}
                  >
                    {role.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || loadingRoles}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || loadingRoles}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

