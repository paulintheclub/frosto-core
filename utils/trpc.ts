// utils/trpc.ts
import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@/server/api/route"

export const trpc = createTRPCReact<AppRouter>()
