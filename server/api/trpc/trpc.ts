// src/server/trpc/trpc.ts
import { initTRPC } from "@trpc/server"
import { createTRPCContext } from "./context"

const t = initTRPC.context<typeof createTRPCContext>().create()

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware
