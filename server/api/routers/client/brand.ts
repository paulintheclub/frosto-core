import { z } from "zod"
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc/trpc"

export const brandRouter = createTRPCRouter({
  // Простой список всех брендов для навигации
  getAllBrands: publicProcedure
    .input(z.object({
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { lang } = input

      const brands = await ctx.prisma.brand.findMany({
        include: {
          translations: {
            select: { description: true, languageCode: true },
          },
        },
        orderBy: {
          name: 'asc',
        },
      })

      return brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo,
          description: brand.translations,
      }))
    }),

  // Информация о бренде для страницы бренда (с категориями, без продуктов)
  getBrandBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { slug, lang } = input

      const brand = await ctx.prisma.brand.findUnique({
        where: { slug },
        include: {
          translations: {
            select: { description: true, languageCode: true },
          },
          categories: {
            include: {
              translations: {
                select: { type: true, description: true, languageCode: true },
              },
            },
            orderBy: { id: 'asc' },
          },
        },
      })

      if (!brand) {
        throw new Error("Brand not found")
      }

      // Fallback для бренда
      let brandTranslation = brand.translations.find((t: any) => t.languageCode === lang)
      if (!brandTranslation && brand.translations.length > 0) {
        brandTranslation = brand.translations[0]
      }

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brandTranslation?.description || "",
        categories: brand.categories.map((category: any) => {
          // Fallback для каждой категории
          let categoryTranslation = category.translations.find((t: any) => t.languageCode === lang)
          if (!categoryTranslation && category.translations.length > 0) {
            categoryTranslation = category.translations[0]
          }

          return {
            id: category.id,
            slug: category.slug,
            name: categoryTranslation?.type || "No name",
            description: categoryTranslation?.description || "",
          }
        }),
      }
    }),

  // Продукты бренда (отдельный эндпоинт, может фильтровать по категории)
  getBrandProducts: publicProcedure
    .input(z.object({
      brandSlug: z.string(),
      categoryId: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { brandSlug, categoryId, limit, lang } = input

      // Находим бренд
      const brand = await ctx.prisma.brand.findUnique({
        where: { slug: brandSlug },
        select: { id: true },
      })

      if (!brand) {
        throw new Error("Brand not found")
      }

      // Получаем продукты из категорий этого бренда
      const products = await ctx.prisma.product.findMany({
        where: {
          category: {
            brandId: brand.id,
            ...(categoryId && { id: categoryId }),
          },
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          translations: {
            select: { name: true, description: true, languageCode: true },
          },
          category: {
            select: {
              slug: true,
              translations: {
                select: { type: true, languageCode: true },
              },
            },
          },
        },
      })

      return products.map((product: any) => {
        // Fallback для продукта
        let productTranslation = product.translations.find((t: any) => t.languageCode === lang)
        if (!productTranslation && product.translations.length > 0) {
          productTranslation = product.translations[0]
        }

        // Fallback для категории
        let categoryTranslation = product.category.translations.find((t: any) => t.languageCode === lang)
        if (!categoryTranslation && product.category.translations.length > 0) {
          categoryTranslation = product.category.translations[0]
        }

        return {
          id: product.id,
          slug: product.slug,
          sku: product.sku,
          name: productTranslation?.name || "No name",
          description: productTranslation?.description || "",
          imageUrl: product.mainImage,
          price: product.isDiscounted && product.discountPrice 
            ? product.discountPrice 
            : product.price,
          originalPrice: product.isDiscounted ? product.price : null,
          isDiscounted: product.isDiscounted,
          availability: product.availability,
          category: {
            name: categoryTranslation?.type || "No category",
            slug: product.category.slug,
          },
        }
      })
    }),
})
