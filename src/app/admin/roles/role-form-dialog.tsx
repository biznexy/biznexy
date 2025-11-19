"use client"

import { useState, useEffect } from "react"
import { Role } from "@/types"
import { createRole, updateRole } from "@/app/actions/roles"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  role?: Role | null
  onSuccess?: () => void
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: RoleFormDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role) {
      setName(role.name || "")
      setDescription(role.description || "")
    } else {
      setName("")
      setDescription("")
    }
  }, [role, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (role) {
        const result = await updateRole(role.id, {
          name,
          description,
        })
        if (result) {
          toast.success("Role updated successfully")
          onOpenChange(false)
          onSuccess?.()
        } else {
          toast.error("Failed to update role")
        }
      } else {
        const result = await createRole({
          name,
          description,
        })
        if (result) {
          toast.success("Role created successfully")
          onOpenChange(false)
          onSuccess?.()
        } else {
          toast.error("Failed to create role")
        }
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
            <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
            <DialogDescription>
              {role
                ? "Update the role information below."
                : "Create a new role by filling in the details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Admin, Editor, Viewer"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for this role"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : role ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

