import { z } from "zod"
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc/trpc"

const inputWithLang = z.object({
    lang: z.string().min(2).max(5),
})

export const categoryRouter = createTRPCRouter({
    // Уже существующие процедуры: getRootCategories, getSubcategories

    getRootCategories: publicProcedure
        .input(inputWithLang)
        .query(async ({ input, ctx }) => {
            const langCode = input.lang
            const categories = await ctx.prisma.category.findMany({
                where: { parentId: null },
                include: {
                    translations: {
                        where: { languageCode: langCode },
                        select: { type: true, description: true },
                    },
                    brand: {
                        select: { name: true },
                    },
                    _count: {
                        select: { children: true },
                    },
                },
            })

            return categories.map((cat) => ({
                id: cat.id,
                type: "category",
                name: cat.translations[0]?.type || "Без назви",
                description: cat.translations[0]?.description || "",
                subcategoriesCount: cat._count.children,
                brand: cat.brand?.name || "",
                isEndCategory: cat._count.children === 0,
                level: 0,
            }))
    }),

    getSubcategories: publicProcedure
        .input(z.object({
            parentId: z.string(),
            level: z.number().default(0),
            lang: z.string().min(2).max(5),
        }))
        .query(async ({ input, ctx }) => {
            const langCode = input.lang
            const categories = await ctx.prisma.category.findMany({
                where: { parentId: input.parentId },
                include: {
                    translations: {
                        where: { languageCode: langCode },
                        select: { type: true, description: true },
                    },
                    brand: {
                        select: { name: true },
                    },
                    _count: {
                        select: { children: true },
                    },
                },
            })

            return categories.map((cat) => ({
                id: cat.id,
                type: "category",
                name: cat.translations[0]?.type || "Без назви",
                description: cat.translations[0]?.description || "",
                subcategoriesCount: cat._count.children,
                brand: cat.brand?.name || "",
                isEndCategory: cat._count.children === 0,
                level: input.level + 1,
            }))
        }),

    getProductsByCategoryId: publicProcedure
        .input(z.object({
            categoryId: z.string(),
            level: z.number().default(0),
            lang: z.string().min(2).max(5),
        }))
        .query(async ({ input, ctx }) => {
            const langCode = input.lang
            const products = await ctx.prisma.product.findMany({
                where: { categoryId: input.categoryId },
                include: {
                    translations: {
                        where: { languageCode: langCode },
                        select: { name: true, description: true },
                    },
                    category: {
                        select: {
                            brand: { select: { name: true } },
                        },
                    },
                },
            })

            return products.map((product) => ({
                id: product.id,
                type: "product" as const,
                name: product.translations[0]?.name || "Без назви",
                description: product.translations[0]?.description || "",
                subcategoriesCount: 0,
                brand: product.category.brand?.name || "",
                isEndCategory: true,
                level: input.level + 1,
            }))
        }),
})
