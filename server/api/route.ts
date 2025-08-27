// src/server/api/route.ts
import { createTRPCRouter } from "@/server/api/trpc/trpc"
import { categoryRouter } from "./routers/admin/category"

export const appRouter = createTRPCRouter({
    adminCategory: categoryRouter,
    // інші групи можна додати тут
})

export type AppRouter = typeof appRouter
