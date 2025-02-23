import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";


export const mailRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => { 
      return {
        greeting: `Hello ${ctx.userId}`,
      };
    }),
});
