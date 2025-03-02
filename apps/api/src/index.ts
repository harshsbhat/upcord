import { Hono } from 'hono'
import { schema } from '@upcord/db'


const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
