import { NextResponse } from "next/server";
import { firestore } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export const adminRoleId = "admin";

export async function POST() {
  try {
    const adminRoleRef = firestore.collection('roles').doc(adminRoleId);

    // Check if Admin role already exists
    const existingDoc = await adminRoleRef.get();
    if (existingDoc.exists) {
      return NextResponse.json(
        { message: "Admin role already exists", roleId: adminRoleId },
        { status: 200 }
      );
    }

    // Create Admin role
    await adminRoleRef.set({
      name: "Admin",
      description: "Administrator role with full access",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    return NextResponse.json(
      { message: "Admin role seeded successfully", roleId: adminRoleId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding Admin role:", error);
    return NextResponse.json(
      { error: "Failed to seed Admin role", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

