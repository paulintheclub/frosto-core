import {z} from "zod"
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc/trpc"
import slugify from "slugify"

const inputWithLang = z.object({
    lang: z.string().min(2).max(5),
})

export const categoryRouter = createTRPCRouter({

    getRootCategories: publicProcedure
        .query(async ({ ctx }) => {
            const categories = await ctx.prisma.category.findMany({
                where: { parentId: null },
                include: {
                    translations: {
                        select: {
                            name: true,
                            description: true,
                            languageCode: true,
                        },
                    },
                    brand: {
                        select: { name: true },
                    },
                    _count: {
                        select: {
                            children: true,
                            products: true
                        },
                    },
                },
            })

            return categories.map((cat) => ({
                id: cat.id,
                type: "category",
                translations: cat.translations,
                subcategoriesCount: cat._count.children,
                productCount: cat._count.products,
                brand: cat.brand?.name || "",
                isEndCategory: cat._count.children === 0,
                level: 0,
            }))
    }),

    getSubcategories: publicProcedure
        .input(z.object({
            parentId: z.string(),
            level: z.number().default(0),
        }))
        .query(async ({ input, ctx }) => {
            const categories = await ctx.prisma.category.findMany({
                where: { parentId: input.parentId },
                include: {
                    translations: {
                        select: {
                            name: true,
                            description: true,
                            languageCode: true,
                        },
                    },
                    brand: {
                        select: { name: true },
                    },
                    _count: {
                        select: {
                            children: true,
                            products: true
                        },
                    },
                },
            })

            return categories.map((cat) => ({
                id: cat.id,
                type: "category",
                translations: cat.translations,
                subcategoriesCount: cat._count.children,
                productCount: cat._count.products,
                brand: cat.brand?.name || "",
                isEndCategory: cat._count.children === 0,
                level: input.level + 1,
            }))
        }),

    getAllFlatCategories: publicProcedure
        .input(z.object({ lang: z.string().min(2).max(5) }))
        .query(async ({ input, ctx }) => {
            const categories = await ctx.prisma.category.findMany({
                where: {
                    products: {
                        none: {},
                    },
                },
                include: {
                    translations: {
                        where: { languageCode: input.lang },
                        select: { name: true },
                    },
                    _count: {
                        select: {
                            children: true,
                        },
                    },
                },
            })

            return categories.map((cat) => ({
                id: cat.id,
                parentId: cat.parentId,
                name: cat.translations[0]?.name || "Без назви",
                brandId: cat.brandId,
            }))
        }),

    getAllFlatCategoriesForProduct: publicProcedure
        .input(z.object({ lang: z.string().min(2).max(5) }))
        .query(async ({ input, ctx }) => {
            const categories = await ctx.prisma.category.findMany({
                include: {
                    translations: {
                        where: { languageCode: input.lang },
                        select: { name: true },
                    },
                    _count: {
                        select: {
                            children: true,
                        },
                    },
                },
            })

            return categories.map((cat) => ({
                id: cat.id,
                parentId: cat.parentId,
                name: cat.translations[0]?.name || "Без назви",
                brandId: cat.brandId,
                isEndCategory: cat._count.children === 0,
            }))
        }),

    getCategoryById: publicProcedure
        .input(z.object({
            catId: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            return ctx.prisma.category.findFirst({
                where: {id: input.catId},
                include: {
                    translations: {
                        select: {
                            type: true,
                            description: true,
                            languageCode: true,
                        },
                    },
                    brand: {
                        select: {name: true},
                    },
                },
            });
        }),

    createCategory: publicProcedure
        .input(
            z.object({
                parentId: z.string().nullable(),
                brandId: z.string().nullable(),
                translations: z.array(
                    z.object({
                        languageCode: z.string().min(2).max(5),
                        type: z.string().min(1),
                        description: z.string().optional(),
                    })
                ),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { parentId, brandId, translations } = input

            // Основной перевод (uk) используется для slug
            const baseTranslation = translations.find((t) => t.languageCode === "uk")
            if (!baseTranslation) {
                throw new Error("Украинский перевод обязателен")
            }

            const baseSlug = slugify(baseTranslation.type, { lower: true, strict: true })
            let uniqueSlug = baseSlug
            let count = 1

            // Уникализируем slug
            while (
                await ctx.prisma.category.findUnique({
                    where: { slug: uniqueSlug },
                    select: { id: true },
                })
                ) {
                uniqueSlug = `${baseSlug}-${count++}`
            }

            return ctx.prisma.category.create({
                data: {
                    slug: uniqueSlug,
                    parentId,
                    brandId,
                    translations: {
                        create: translations.map((t) => ({
                            name: t.type,
                            languageCode: t.languageCode,
                            type: t.type,
                            description: t.description || "",
                        })),
                    },
                },
                include: {
                    translations: true,
                },
            });
        }),

    updateCategory: publicProcedure
        .input(z.object({
            catId: z.string(),
            brandId: z.string().nullable(),
            translations: z.array(
                z.object({
                    languageCode: z.string().min(2).max(5),
                    type: z.string().min(1),
                    name: z.string().min(1),
                    description: z.string().optional(),
                })
            ),
        }))
        .mutation(async ({ input, ctx }) => {
            const oldCategory = await ctx.prisma.category.findUnique({
                where: { id: input.catId },
                select: { brandId: true },
            })

            // Обновляем саму категорию
            await ctx.prisma.category.update({
                where: { id: input.catId },
                data: {
                    brandId: input.brandId,
                    translations: {
                        deleteMany: {},
                        createMany: {
                            data: input.translations,
                        },
                    },
                },
            })

            // Если бренд изменился, обновим все подкатегории
            if (oldCategory?.brandId !== input.brandId) {
                // Вариант с raw SQL
                const descendants = await ctx.prisma.$queryRaw<
                    { id: string }[]
                >`
        WITH RECURSIVE descendants AS (
          SELECT id FROM "Category" WHERE id = ${input.catId}
          UNION
          SELECT c.id FROM "Category" c
          INNER JOIN descendants d ON c."parentId" = d.id
        )
        SELECT id FROM descendants WHERE id != ${input.catId};
      `

                await ctx.prisma.category.updateMany({
                    where: {
                        id: { in: descendants.map((d) => d.id) },
                    },
                    data: {
                        brandId: input.brandId,
                    },
                })
            }

            return { success: true }
        }),

    deleteCategory: publicProcedure
        .input(
            z.object({
                categoryId: z.string().min(1),
            })
        )
        .mutation(async ({ input, ctx }) => {

            const { categoryId } = input

            const category = await ctx.prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true },
            })

            if (!category) throw new Error("Категорію не знайдено")

            await ctx.prisma.category.delete({
                where: {
                    id: input.categoryId,
                },
            })

            return { success: true }
        }),

    getProductsByCategoryId: publicProcedure
        .input(z.object({
            categoryId: z.string(),
            level: z.number().default(0),
        }))
        .query(async ({ input, ctx }) => {
            const products = await ctx.prisma.product.findMany({
                where: { categoryId: input.categoryId },
                include: {
                    translations: {
                        select: {
                            name: true,
                            description: true,
                            languageCode: true,
                        },
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
                translations: product.translations,
                subcategoriesCount: 0,
                productCount: 0,
                brand: product.category.brand?.name || "",
                isEndCategory: true,
                level: input.level + 1,
            }))
        }),
})
