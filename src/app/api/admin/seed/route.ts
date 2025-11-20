import { NextResponse } from "next/server";
import { firestore } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

async function seedRoles() {
  const results = [];
  
  // Seed Admin role
  const adminRoleId = "admin";
  const adminRoleRef = firestore.collection('roles').doc(adminRoleId);
  
  const existingAdminDoc = await adminRoleRef.get();
  if (!existingAdminDoc.exists) {
    await adminRoleRef.set({
      name: "Admin",
      description: "Administrator role with full access",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    results.push({ type: "roles", action: "created", item: "Admin" });
  } else {
    results.push({ type: "roles", action: "skipped", item: "Admin", reason: "already exists" });
  }
  
  return results;
}

export async function POST() {
  try {
    const allResults = [];
    
    // Run all seed functions
    const roleResults = await seedRoles();
    allResults.push(...roleResults);
    
    // Add more seed functions here as needed
    // const otherResults = await seedOther();
    // allResults.push(...otherResults);
    
    const created = allResults.filter(r => r.action === "created").length;
    const skipped = allResults.filter(r => r.action === "skipped").length;
    
    return NextResponse.json(
      {
        message: "Seeding completed",
        summary: {
          created,
          skipped,
          total: allResults.length,
        },
        results: allResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error running seeds:", error);
    return NextResponse.json(
      {
        error: "Failed to run seeds",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

