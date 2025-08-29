import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/api/route"

type Brand = inferRouterOutputs<AppRouter>["adminBrand"]["getAllBrands"][number]
