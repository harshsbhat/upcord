import { Hono } from 'hono'
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context as GenericContext } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { newApp } from "@/pkg/hono/app"


const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
