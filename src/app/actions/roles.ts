'use server';

import { firestore } from '@/firebase/server';
import { Role } from '@/types';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

export async function listRoles(): Promise<Role[]> {
  try {
    const snapshot = await firestore.collection('roles').orderBy('name').get();
    const roles: Role[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      roles.push({
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    
    return roles;
  } catch (error) {
    console.error('Error listing roles:', error);
    return [];
  }
}

export async function getRole(id: string): Promise<Role | null> {
  try {
    const doc = await firestore.collection('roles').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data();
    return {
      id: doc.id,
      name: data?.name || '',
      description: data?.description || '',
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    };
  } catch (error) {
    console.error('Error fetching role:', error);
    return null;
  }
}

export async function createRole(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role | null> {
  try {
    const docRef = firestore.collection('roles').doc();
    const newRole = {
      name: role.name,
      description: role.description || '',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    await docRef.set(newRole);
    revalidatePath('/admin/roles');
    
    const createdDoc = await docRef.get();
    const data = createdDoc.data();
    
    return {
      id: createdDoc.id,
      name: data?.name || '',
      description: data?.description || '',
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    };
  } catch (error) {
    console.error('Error creating role:', error);
    return null;
  }
}

export async function updateRole(id: string, role: Partial<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Role | null> {
  try {
    const updateData: any = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    if (role.name !== undefined) updateData.name = role.name;
    if (role.description !== undefined) updateData.description = role.description;
    
    await firestore.collection('roles').doc(id).update(updateData);
    revalidatePath('/admin/roles');
    
    return getRole(id);
  } catch (error) {
    console.error('Error updating role:', error);
    return null;
  }
}

export async function deleteRole(id: string): Promise<void> {
  try {
    await firestore.collection('roles').doc(id).delete();
    revalidatePath('/admin/roles');
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
}

