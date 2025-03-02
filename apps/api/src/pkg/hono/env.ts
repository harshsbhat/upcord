import type { Env } from "@/pkg/env";



export type HonoEnv = {
  Bindings: Env;
  Variables: {
    isolateId: string;
    isolateCreatedAt: number;
    requestId: string;
    requestStartedAt: number;
    workspaceId?: string;
    /**
     * IP address or region information
     */
    location: string;
    userAgent?: string;
  };
};