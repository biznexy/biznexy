'use client';

import { User } from '@/types';
import { useState, useEffect } from 'react';
import { listUsers } from '@/app/actions/users';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { AssignRolesDialog } from './assign-roles-dialog';

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    undefined
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    listUsers().then(({ users, nextPageToken }) => {
      setUsers(users);
      setNextPageToken(nextPageToken);
    });
  }, []);

  const handleLoadMore = (token?: string) => {
    listUsers(token).then(({ users, nextPageToken }) => {
      setUsers((prevUsers) => [...prevUsers, ...users]);
      setNextPageToken(nextPageToken);
    });
  };

  const handleAssignRoles = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return (
    <>
      <DataTable
        columns={columns(handleAssignRoles)}
        data={users}
        nextPageToken={nextPageToken}
        onLoadMore={handleLoadMore}
      />
      <AssignRolesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSuccess={() => {
          // Optionally reload users or refresh data
        }}
      />
    </>
  );
}
