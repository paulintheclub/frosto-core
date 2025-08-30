import { z } from "zod"
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc/trpc"

export const categoryRouter = createTRPCRouter({
  // Get all root categories for navigation/homepage
  getRootCategories: publicProcedure
    .input(z.object({
      lang: z.string().min(2).max(5).default("uk"), // Default to Ukrainian as per seed data
    }))
    .query(async ({ input, ctx }) => {
      const { lang } = input

      const categories = await ctx.prisma.category.findMany({
        where: { parentId: null },
        include: {
          translations: {
            where: { languageCode: lang },
            select: { type: true, description: true },
          },
          brand: {
            select: { 
              name: true, 
              slug: true,
              logo: true 
            },
          },
          children: {
            include: {
              translations: {
                where: { languageCode: lang },
                select: { type: true },
              },
              _count: {
                select: { products: true },
              },
            },
          },
          _count: {
            select: { 
              children: true,
              products: true 
            },
          },
        },
        orderBy: {
          id: 'asc', // Consistent ordering
        },
      })

      return categories.map((category: any) => ({
        id: category.id,
        slug: category.slug,
        name: category.translations[0]?.type || "No name",
        description: category.translations[0]?.description || "",
        brand: category.brand ? {
          name: category.brand.name,
          slug: category.brand.slug,
          logo: category.brand.logo,
        } : null,
        subcategoriesCount: category._count.children,
        productsCount: category._count.products,
        hasSubcategories: category._count.children > 0,
        subcategories: category.children.map((child: any) => ({
          id: child.id,
          slug: child.slug,
          name: child.translations[0]?.type || "No name",
          productsCount: child._count.products,
        })),
        href: `/categories/${category.slug}`,
      }))
    }),

  // Get category by slug with full hierarchy info
  getCategoryBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { slug, lang } = input

      const category = await ctx.prisma.category.findUnique({
        where: { slug },
        include: {
          translations: {
            where: { languageCode: lang },
          },
          brand: {
            include: {
              translations: {
                where: { languageCode: lang },
              },
            },
          },
          parent: {
            include: {
              translations: {
                where: { languageCode: lang },
                select: { type: true },
              },
              parent: {
                include: {
                  translations: {
                    where: { languageCode: lang },
                    select: { type: true },
                  },
                },
              },
            },
          },
          children: {
            include: {
              translations: {
                where: { languageCode: lang },
                select: { type: true, description: true },
              },
              _count: {
                select: { products: true },
              },
            },
            orderBy: {
              id: 'asc',
            },
          },
          products: {
            take: 20, // Limit products shown
            include: {
              translations: {
                where: { languageCode: lang },
                select: { name: true, description: true },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          _count: {
            select: {
              children: true,
              products: true,
            },
          },
        },
      })

      if (!category) {
        throw new Error("Category not found")
      }

      // Build breadcrumb trail
      const breadcrumbs = []
      let current = category.parent
      while (current) {
        breadcrumbs.unshift({
          name: current.translations[0]?.type || "No name",
          slug: current.slug,
          href: `/categories/${current.slug}`,
        })
        current = current.parent
      }

      return {
        id: category.id,
        slug: category.slug,
        name: category.translations[0]?.type || "No name",
        description: category.translations[0]?.description || "",
        brand: category.brand ? {
          name: category.brand.name,
          slug: category.brand.slug,
          logo: category.brand.logo,
          description: category.brand.translations[0]?.description || "",
          href: `/brands/${category.brand.slug}`,
        } : null,
        breadcrumbs,
        parentId: category.parentId,
        subcategoriesCount: category._count.children,
        productsCount: category._count.products,
        hasSubcategories: category._count.children > 0,
        hasProducts: category._count.products > 0,
        subcategories: category.children.map((child: any) => ({
          id: child.id,
          slug: child.slug,
          name: child.translations[0]?.type || "No name",
          description: child.translations[0]?.description || "",
          productsCount: child._count.products,
          href: `/categories/${child.slug}`,
        })),
        products: category.products.map((product: any) => ({
          id: product.id,
          slug: product.slug,
          sku: product.sku,
          name: product.translations[0]?.name || "No name",
          description: product.translations[0]?.description || "",
          mainImage: product.mainImage,
          price: product.isDiscounted && product.discountPrice 
            ? product.discountPrice 
            : product.price,
          originalPrice: product.isDiscounted ? product.price : null,
          isDiscounted: product.isDiscounted,
          availability: product.availability,
          href: `/products/${product.slug}`,
        })),
      }
    }),

  // Get category hierarchy for navigation menus
  getCategoryHierarchy: publicProcedure
    .input(z.object({
      lang: z.string().min(2).max(5).default("uk"),
      maxDepth: z.number().min(1).max(5).default(3),
    }))
    .query(async ({ input, ctx }) => {
      const { lang, maxDepth } = input

      // Get all categories in a flat structure first
      const allCategories = await ctx.prisma.category.findMany({
        include: {
          translations: {
            where: { languageCode: lang },
            select: { type: true },
          },
          _count: {
            select: { products: true },
          },
        },
        orderBy: {
          id: 'asc',
        },
      })

      // Build hierarchical structure
      const categoryMap = new Map()
      const rootCategories: any[] = []

      // First pass: create map of all categories
      allCategories.forEach((category: any) => {
        categoryMap.set(category.id, {
          id: category.id,
          slug: category.slug,
          name: category.translations[0]?.type || "No name",
          parentId: category.parentId,
          productsCount: category._count.products,
          children: [],
          href: `/categories/${category.slug}`,
        })
      })

      // Second pass: build hierarchy
      allCategories.forEach((category: any) => {
        const categoryData = categoryMap.get(category.id)
        if (category.parentId) {
          const parent = categoryMap.get(category.parentId)
          if (parent) {
            parent.children.push(categoryData)
          }
        } else {
          rootCategories.push(categoryData)
        }
      })

      return rootCategories
    }),

  // Get popular categories (categories with most products)
  getPopularCategories: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(6),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { limit, lang } = input

      const categories = await ctx.prisma.category.findMany({
        include: {
          translations: {
            where: { languageCode: lang },
            select: { type: true, description: true },
          },
          brand: {
            select: { 
              name: true, 
              logo: true 
            },
          },
          _count: {
            select: { products: true },
          },
        },
        orderBy: {
          products: {
            _count: 'desc',
          },
        },
        take: limit,
      })

      return categories.map((category: any) => ({
        id: category.id,
        slug: category.slug,
        name: category.translations[0]?.type || "No name",
        description: category.translations[0]?.description || "",
        brand: category.brand ? {
          name: category.brand.name,
          logo: category.brand.logo,
        } : null,
        productsCount: category._count.products,
        href: `/categories/${category.slug}`,
      }))
    }),
})
