import {z} from "zod"
import {createTRPCRouter, publicProcedure} from "@/server/api/trpc/trpc"
import slugify from "slugify"
import {TRPCError} from "@trpc/server";

const inputWithLang = z.object({
    lang: z.string().min(2).max(5),
})

export const productRouter = createTRPCRouter({
    getProductById: publicProcedure
        .input(
            z.object({
                productId: z.string().min(1),
            })
        )
        .query(async ({ input, ctx }) => {
            const product = await ctx.prisma.product.findUnique({
                where: { id: input.productId },
                include: {
                    translations: {
                        select: {
                            languageCode: true,
                            name: true,
                            description: true,
                        },
                    },
                    category: {
                        include: {
                            brand: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            })

            if (!product) {
                throw new Error("Продукт не знайдено")
            }

            return product
        }),

    createProduct: publicProcedure
        .input(
            z.object({
                sku: z.string(),
                slug: z.string().optional(), // пользователь может не передать — мы сгенерируем
                mainImage: z.string(),
                gallery: z.array(z.string()),
                price: z.number(),
                isDiscounted: z.boolean(),
                discountPrice: z.number().nullable(),
                availability: z.enum(["IN_STOCK", "ON_ORDER"]),
                mainChar: z.string().optional(),
                techCharImage: z.string().optional(),
                expCharImage: z.string().optional(),
                sizeConnectionsImage: z.string().optional(),
                accessoriesImage: z.string().optional(),
                categoryId: z.string(),
                translations: z.array(
                    z.object({
                        languageCode: z.string().min(2).max(5),
                        name: z.string().min(1),
                        description: z.string().optional(),
                    })
                ),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const {
                sku,
                mainImage,
                gallery,
                price,
                isDiscounted,
                discountPrice,
                availability,
                mainChar,
                techCharImage,
                expCharImage,
                sizeConnectionsImage,
                accessoriesImage,
                categoryId,
                translations,
            } = input

            const baseTranslation = translations.find((t) => t.languageCode === "uk")
            if (!baseTranslation) {
                throw new Error("Украинский перевод обязателен")
            }

            const existingSku = await ctx.prisma.product.findUnique({
                where: { sku },
                select: { id: true },
            })

            if (existingSku) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Продукт с таким SKU уже существует",
                })
            }


            const baseSlug = slugify(baseTranslation.name, { lower: true, strict: true })
            let uniqueSlug = baseSlug
            let counter = 1

            while (
                await ctx.prisma.product.findUnique({
                    where: { slug: uniqueSlug },
                    select: { id: true },
                })
                ) {
                uniqueSlug = `${baseSlug}-${counter++}`
            }

            const created = await ctx.prisma.product.create({
                data: {
                    sku,
                    slug: uniqueSlug,
                    mainImage,
                    gallery,
                    price,
                    isDiscounted,
                    discountPrice,
                    availability,
                    mainChar: mainChar || null,
                    techCharImage: techCharImage || null,
                    expCharImage: expCharImage || null,
                    sizeConnectionsImage: sizeConnectionsImage || null,
                    accessoriesImage: accessoriesImage || null,
                    categoryId,
                    translations: {
                        create: translations.map((t) => ({
                            languageCode: t.languageCode,
                            name: t.name,
                            description: t.description || "",
                        })),
                    },
                },
                include: {
                    translations: true,
                },
            })

            return created
        }),

    updateProduct: publicProcedure
        .input(
            z.object({
                productId: z.string().min(1),
                sku: z.string(),
                mainImage: z.string(),
                gallery: z.array(z.string()),
                price: z.number(),
                isDiscounted: z.boolean(),
                discountPrice: z.number().nullable(),
                availability: z.enum(["IN_STOCK", "ON_ORDER"]),
                mainChar: z.string().optional(),
                techCharImage: z.string().optional(),
                expCharImage: z.string().optional(),
                sizeConnectionsImage: z.string().optional(),
                accessoriesImage: z.string().optional(),
                categoryId: z.string(),
                translations: z.array(
                    z.object({
                        languageCode: z.string().min(2).max(5),
                        name: z.string().min(1),
                        description: z.string().optional(),
                    })
                ),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const {
                productId,
                sku,
                mainImage,
                gallery,
                price,
                isDiscounted,
                discountPrice,
                availability,
                mainChar,
                techCharImage,
                expCharImage,
                sizeConnectionsImage,
                accessoriesImage,
                categoryId,
                translations,
            } = input

            // Перевірка: чи існує продукт
            const existingProduct = await ctx.prisma.product.findUnique({
                where: { id: productId },
                select: { id: true },
            })

            if (!existingProduct) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Продукт не знайдено",
                })
            }

            // Перевірка на унікальність SKU (виняток — сам продукт)
            const skuConflict = await ctx.prisma.product.findFirst({
                where: {
                    sku,
                    NOT: { id: productId },
                },
                select: { id: true },
            })

            if (skuConflict) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "SKU вже використовується",
                })
            }

            // Оновлюємо продукт
            const updated = await ctx.prisma.product.update({
                where: { id: productId },
                data: {
                    sku,
                    mainImage,
                    gallery,
                    price,
                    isDiscounted,
                    discountPrice,
                    availability,
                    mainChar: mainChar || null,
                    techCharImage: techCharImage || null,
                    expCharImage: expCharImage || null,
                    sizeConnectionsImage: sizeConnectionsImage || null,
                    accessoriesImage: accessoriesImage || null,
                    categoryId,
                    // Перезапис перекладів
                    translations: {
                        deleteMany: {}, // повністю видаляємо старі
                        create: translations.map((t) => ({
                            languageCode: t.languageCode,
                            name: t.name,
                            description: t.description || "",
                        })),
                    },
                },
                include: {
                    translations: true,
                },
            })

            return updated
        }),
    deleteProduct: publicProcedure
        .input(z.object({ productId: z.string().min(1) }))
        .mutation(async ({ input, ctx }) => {
            const { productId } = input

            const product = await ctx.prisma.product.findUnique({
                where: { id: productId },
                select: { id: true },
            })

            if (!product) throw new Error("Продукт не знайдено")

            await ctx.prisma.product.delete({ where: { id: productId } })

            return { success: true }
        })



})
