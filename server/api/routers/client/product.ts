import { z } from "zod"
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc/trpc"

export const productRouter = createTRPCRouter({
  // Список продуктов с фильтрацией по категории
  getProducts: publicProcedure
    .input(z.object({
      categoryId: z.string().optional(),
      limit: z.number().min(1).max(100).default(12),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { categoryId, limit, lang } = input

      const products = await ctx.prisma.product.findMany({
        where: {
          ...(categoryId && { categoryId }),
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
              brand: { 
                select: { 
                  name: true,
                  slug: true 
                } 
              },
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
          imageUrl: product.mainImage,
          price: product.isDiscounted && product.discountPrice 
            ? product.discountPrice 
            : product.price,
          originalPrice: product.isDiscounted ? product.price : null,
          isDiscounted: product.isDiscounted,
          availability: product.availability,
          brand: {
            name: product.category.brand?.name || "Unknown Brand",
            slug: product.category.brand?.slug,
          },
          category: {
            name: categoryTranslation?.type || "No category",
            slug: product.category.slug,
          },
        }
      })
    }),

  // Полная информация о продукте для страницы продукта
  getProductBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { slug, lang } = input

      const product = await ctx.prisma.product.findUnique({
        where: { slug },
        include: {
          translations: {
            select: { name: true, description: true, languageCode: true },
          },
          category: {
            include: {
              brand: {
                include: {
                  translations: {
                    select: { description: true, languageCode: true },
                  },
                },
              },
              translations: {
                select: { type: true, languageCode: true },
              },
            },
          },
          catalogs: {
            include: {
              translations: {
                select: { name: true, languageCode: true },
              },
            },
          },
        },
      })

      if (!product) {
        throw new Error("Product not found")
      }

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

      // Fallback для бренда
      let brandTranslation = product.category.brand?.translations.find((t: any) => t.languageCode === lang)
      if (!brandTranslation && product.category.brand?.translations.length > 0) {
        brandTranslation = product.category.brand.translations[0]
      }

      return {
        id: product.id,
        name: productTranslation?.name || "No name",
        description: productTranslation?.description || "",
        sku: product.sku,
        slug: product.slug,
        mainImage: product.mainImage,
        gallery: product.gallery,
        price: product.isDiscounted && product.discountPrice 
          ? product.discountPrice 
          : product.price,
        originalPrice: product.isDiscounted ? product.price : null,
        isDiscounted: product.isDiscounted,
        availability: product.availability,
        mainChar: product.mainChar,
        techCharImage: product.techCharImage,
        expCharImage: product.expCharImage,
        sizeConnectionsImage: product.sizeConnectionsImage,
        accessoriesImage: product.accessoriesImage,
        category: {
          name: categoryTranslation?.type || "No category",
          slug: product.category.slug,
        },
        brand: {
          name: product.category.brand?.name || "No brand",
          slug: product.category.brand?.slug,
          logo: product.category.brand?.logo,
          description: brandTranslation?.description || "",
        },
        catalogs: product.catalogs.map((catalog: any) => {
          // Fallback для каталога
          let catalogTranslation = catalog.translations.find((t: any) => t.languageCode === lang)
          if (!catalogTranslation && catalog.translations.length > 0) {
            catalogTranslation = catalog.translations[0]
          }

          return {
            id: catalog.id,
            name: catalogTranslation?.name || "Catalog",
            pdfUrl: catalog.pdfUrl,
            previewImg: catalog.previewImg,
          }
        }),
      }
    }),


  // Продукты по slug категории (отдельный эндпоинт)
  getProductsByCategory: publicProcedure
    .input(z.object({
      categorySlug: z.string(),
      limit: z.number().min(1).max(100).default(20),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { categorySlug, limit, lang } = input

      // Находим категорию по slug
      const category = await ctx.prisma.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      })

      if (!category) {
        throw new Error("Category not found")
      }

      const products = await ctx.prisma.product.findMany({
        where: {
          categoryId: category.id,
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
              brand: { 
                select: { 
                  name: true,
                  slug: true 
                } 
              },
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
          brand: {
            name: product.category.brand?.name || "Unknown Brand",
            slug: product.category.brand?.slug,
          },
          category: {
            name: categoryTranslation?.type || "No category",
            slug: product.category.slug,
          },
        }
      })
    }),
})
