import type { Context } from "hono";
import { HonoEnv } from "@/pkg/hono/env";

export async function unkeyAuth(c :Context<HonoEnv>){
    const authorization = c.req.header("authorization")?.replace("Bearer ", "");
}