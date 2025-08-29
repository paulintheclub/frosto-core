// src/server/api/routers/adminBrand.ts
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc/trpc"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

export const adminBrandRouter = createTRPCRouter({
    getAllBrands: publicProcedure.query(async () => {
        return prisma.brand.findMany({
            orderBy: {name: "asc"},
        });
    }),
})
