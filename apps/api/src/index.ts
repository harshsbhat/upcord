import { Hono } from 'hono'
import { db } from '@upcord/db'

const app = new Hono()

app.get('/', (c) => {
  async function testDB() {
    const domainName = await db.query.workspaces.findFirst({
      where: (table, { and, eq, isNull }) =>
          and(eq(table.name, "sealnotes.com"), isNull(table.deletedAt))
  })
  return domainName
  }
  return c.text('Hello Hono!')
})

export default app
