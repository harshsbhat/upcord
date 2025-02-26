import type { Context } from "hono";

export async function unkeyAuth(c :Context<HonoEnv>){
    const authorization = c.req.header("authorization")?.replace("Bearer ", "");
}