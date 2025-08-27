// types/trpc.ts
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/api/route"

export type TRPCRouterOutput = inferRouterOutputs<AppRouter>
