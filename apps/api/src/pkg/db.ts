import { db, schema } from "@upcord/db";

type ConnectionOptions = {
  retry: number | false;
};

export function createConnection(opts: ConnectionOptions) {
  async function fetchWithRetry<T>(query: () => Promise<T>): Promise<T> {
    if (!opts.retry) {
      return await query(); // No retries, just execute
    }

    let lastError: Error | undefined;
    for (let i = 0; i <= opts.retry; i++) {
      try {
        return await query();
      } catch (e) {
        lastError = e as Error;
      }
    }

    throw lastError!; // If all retries fail, throw last encountered error
  }

  return {
    db,
    schema,
    execute: async (query: any) => fetchWithRetry(() => db.execute(query)),
  };
}

export { db, schema };
export { eq, and } from "drizzle-orm" ;
