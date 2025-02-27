import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { user } from "@/server/db/schemas";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  update: privateProcedure
    .input(z.object({
      name: z.string().min(2).max(50).optional(),
      email: z.string().email().optional(),
      image: z.string().url().optional(),
    }).refine(data => Object.keys(data).length > 0, {
      message: "At least one field must be provided"
    }))
    .mutation(async ({ ctx, input }) => {
      const { name, email, image } = input;
      
      // Check email uniqueness if updating email
      if (email) {
        const existingUser = await ctx.db.query.user.findFirst({
          where: eq(user.email, email)
        });
        
        if (existingUser && existingUser.id !== ctx.session.user.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email already in use"
          });
        }
      }

      // Update user
      await ctx.db.update(user)
        .set({
          ...(name && { name }),
          ...(email && { email }),
          ...(image && { image }),
          updatedAt: new Date()
        })
        .where(eq(user.id, ctx.session.user.id));

      return { success: true };
    }),
}); 