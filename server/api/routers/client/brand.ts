import { z } from "zod"
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc/trpc"

export const brandRouter = createTRPCRouter({
  getAllBrands: publicProcedure
    .input(z.object({
      lang: z.string().min(2).max(5).default("uk"), // Default to Ukrainian as per seed data
    }))
    .query(async ({ input, ctx }) => {
      const { lang } = input

      const brands = await ctx.prisma.brand.findMany({
        include: {
          translations: {
            where: { languageCode: lang },
            select: { description: true },
          },
          categories: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              categories: true,
            },
          },
        },
        orderBy: {
          name: 'asc', // Alphabetical order
        },
      })

      return brands.map((brand: any) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.translations[0]?.description || "",
        categoriesCount: brand._count.categories,
        href: `/brands/${brand.slug}`,
      }))
    }),

  getBrandBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { slug, lang } = input

      const brand = await ctx.prisma.brand.findUnique({
        where: { slug },
        include: {
          translations: {
            where: { languageCode: lang },
          },
          categories: {
            include: {
              translations: {
                where: { languageCode: lang },
                select: { type: true, description: true },
              },
              products: {
                take: 10, // Limit products per category
                include: {
                  translations: {
                    where: { languageCode: lang },
                    select: { name: true },
                  },
                },
                orderBy: {
                  createdAt: 'desc',
                },
              },
              _count: {
                select: {
                  products: true,
                },
              },
            },
          },
          _count: {
            select: {
              categories: true,
            },
          },
        },
      })

      if (!brand) {
        throw new Error("Brand not found")
      }

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.translations[0]?.description || "",
        categoriesCount: brand._count.categories,
        categories: brand.categories.map((category: any) => ({
          id: category.id,
          slug: category.slug,
          name: category.translations[0]?.type || "No name",
          description: category.translations[0]?.description || "",
          productsCount: category._count.products,
          products: category.products.map((product: any) => ({
            id: product.id,
            slug: product.slug,
            sku: product.sku,
            name: product.translations[0]?.name || "No name",
            mainImage: product.mainImage,
            price: product.isDiscounted && product.discountPrice 
              ? product.discountPrice 
              : product.price,
            availability: product.availability,
          })),
        })),
      }
    }),

  getBrandProducts: publicProcedure
    .input(z.object({
      brandSlug: z.string(),
      categoryId: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { brandSlug, categoryId, limit, lang } = input

      // First find the brand
      const brand = await ctx.prisma.brand.findUnique({
        where: { slug: brandSlug },
        select: { id: true },
      })

      if (!brand) {
        throw new Error("Brand not found")
      }

      // Get products from categories belonging to this brand
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
            where: { languageCode: lang },
            select: { name: true, description: true },
          },
          category: {
            select: {
              slug: true,
              translations: {
                where: { languageCode: lang },
                select: { type: true },
              },
            },
          },
        },
      })

      return products.map((product: any) => ({
        id: product.id,
        slug: product.slug,
        sku: product.sku,
        name: product.translations[0]?.name || "No name",
        description: product.translations[0]?.description || "",
        imageUrl: product.mainImage,
        price: product.isDiscounted && product.discountPrice 
          ? product.discountPrice 
          : product.price,
        originalPrice: product.isDiscounted ? product.price : null,
        isDiscounted: product.isDiscounted,
        availability: product.availability,
        category: {
          name: product.category.translations[0]?.type || "No category",
          slug: product.category.slug,
        },
      }))
    }),

  getBrandsWithProductCounts: publicProcedure
    .input(z.object({
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { lang } = input

      const brands = await ctx.prisma.brand.findMany({
        include: {
          translations: {
            where: { languageCode: lang },
            select: { description: true },
          },
          categories: {
            include: {
              _count: {
                select: {
                  products: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      })

      return brands.map((brand: any) => {
        const totalProducts = brand.categories.reduce(
          (total: number, category: any) => total + category._count.products,
          0
        )

        return {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo,
          description: brand.translations[0]?.description || "",
          categoriesCount: brand.categories.length,
          productsCount: totalProducts,
          href: `/brands/${brand.slug}`,
        }
      })
    }),
})
