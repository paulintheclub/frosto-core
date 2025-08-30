// src/server/api/route.ts
import { createTRPCRouter } from "@/server/api/trpc/trpc"
import { categoryRouter } from "./routers/admin/category"
import {adminBrandRouter} from "@/server/api/routers/admin/adminBrand";
import {productRouter} from "@/server/api/routers/admin/product";

export const appRouter = createTRPCRouter({
    adminCategory: categoryRouter,
    adminBrand: adminBrandRouter,
    adminProduct: productRouter,
    // інші групи можна додати тут
})

export type AppRouter = typeof appRouter
