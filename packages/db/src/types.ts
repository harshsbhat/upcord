import type { InferSelectModel } from "drizzle-orm";
import * as schema from "../schema";

export type Workspaces = InferSelectModel<typeof schema.workspaces>;
export type Domains = InferSelectModel<typeof schema.domains>;
export type Channels = InferSelectModel<typeof schema.channels>;
export type ApiKeys = InferSelectModel<typeof schema.apiKeys>;