// src/server/trpc/context.ts
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { prisma } from '@/lib/prisma'

export function createTRPCContext(opts: CreateNextContextOptions) {
    return {
        prisma,
        req: opts.req,
        res: opts.res,
        // можеш додати auth тут
    }
}
