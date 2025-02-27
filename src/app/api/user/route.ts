import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { user } from "@/server/db/schemas";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided"
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth({ cookies });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = updateUserSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { name, email, image } = validationResult.data;
    
    // If email is being updated, check if it's already in use
    if (email) {
      const existingUser = await db.query.users.findFirst({
        where: eq(user.email, email)
      });
      
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }
    
    // Update user in database
    await db.update(user)
      .set({
        ...(name && { name }),
        ...(email && { email }),
        ...(image && { image }),
        updatedAt: new Date()
      })
      .where(eq(user.id, session.user.id));
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
} 