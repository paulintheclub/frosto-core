// src/server/api/route.ts
import { createTRPCRouter } from "@/server/api/trpc/trpc"
import {productRouter} from "@/server/api/routers/admin/product";

// Admin routers
import { categoryRouter as adminCategoryRouter } from "./routers/admin/category"
import { adminBrandRouter } from "@/server/api/routers/admin/adminBrand";

// Client routers
import { productRouter as clientProductRouter } from "./routers/client/product"
import { brandRouter as clientBrandRouter } from "./routers/client/brand"
import { categoryRouter as clientCategoryRouter } from "./routers/client/category"

export const appRouter = createTRPCRouter({
    adminProduct: productRouter,
    adminCategory: adminCategoryRouter,
    adminBrand: adminBrandRouter,

    // Client endpoints
    client: createTRPCRouter({
        product: clientProductRouter,
        brand: clientBrandRouter,
        category: clientCategoryRouter,
    }),

    // Backward compatibility (remove these after updating frontend)
    product: clientProductRouter,
    brand: clientBrandRouter,
})

export type AppRouter = typeof appRouter
