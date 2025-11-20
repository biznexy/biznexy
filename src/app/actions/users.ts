'use server';

import { auth } from '@/firebase/server';
import { firestore } from '@/firebase/server';
import { User, Role } from '@/types';
import { revalidatePath } from 'next/cache';

export async function listUsers(
  nextPageToken?: string
): Promise<{ users: User[]; nextPageToken?: string }> {
  const listUsersResult = await auth.listUsers(1000, nextPageToken);
  const users: User[] = listUsersResult.users.map((user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    disabled: user.disabled,
  }));
  return {
    users,
    nextPageToken: listUsersResult.pageToken,
  };
}

export async function getUser(uid: string): Promise<User | null> {
  try {
    const userRecord = await auth.getUser(uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function deleteUser(uid: string): Promise<void> {
  try {
    await auth.deleteUser(uid);
    revalidatePath('/admin/users');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

export async function updateUser(uid: string, user: Partial<User>): Promise<User | null> {
  try {
    const userRecord = await auth.updateUser(uid, user);
    revalidatePath(`/admin/users/${uid}`);
    revalidatePath(`/admin/users/${uid}/edit`);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

export async function getUserRoles(uid: string): Promise<Role[]> {
  try {
    const userRolesDoc = await firestore.collection('userRoles').doc(uid).get();
    
    if (!userRolesDoc.exists) {
      return [];
    }
    
    const data = userRolesDoc.data();
    const roleIds: string[] = data?.roleIds || [];
    
    if (roleIds.length === 0) {
      return [];
    }
    
    const roles: Role[] = [];
    const rolePromises = roleIds.map(async (roleId) => {
      const roleDoc = await firestore.collection('roles').doc(roleId).get();
      if (roleDoc.exists) {
        const roleData = roleDoc.data();
        roles.push({
          id: roleDoc.id,
          name: roleData?.name || '',
          description: roleData?.description || '',
          createdAt: roleData?.createdAt?.toDate(),
          updatedAt: roleData?.updatedAt?.toDate(),
        });
      }
    });
    
    await Promise.all(rolePromises);
    
    return roles;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
}

export async function assignUserRoles(uid: string, roleIds: string[]): Promise<boolean> {
  try {
    await firestore.collection('userRoles').doc(uid).set({
      roleIds,
      updatedAt: new Date(),
    }, { merge: true });
    
    revalidatePath('/admin/users');
    return true;
  } catch (error) {
    console.error('Error assigning user roles:', error);
    return false;
  }
}
