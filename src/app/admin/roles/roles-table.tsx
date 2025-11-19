'use client';

import { Role } from '@/types';
import { useState, useEffect } from 'react';
import { listRoles, deleteRole } from '@/app/actions/roles';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { RoleFormDialog } from './role-form-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await listRoles();
      setRoles(data);
    } catch (error) {
      toast.error("Failed to load roles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleCreate = () => {
    setSelectedRole(null);
    setDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRole(roleToDelete.id);
      toast.success("Role deleted successfully");
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
      loadRoles();
    } catch (error) {
      toast.error("Failed to delete role");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="my-4">Loading roles...</div>;
  }

  return (
    <>
      <div className="my-4 flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>
      <DataTable
        columns={columns(handleEdit, handleDelete)}
        data={roles}
      />
      <RoleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={selectedRole}
        onSuccess={loadRoles}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              &quot;{roleToDelete?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

