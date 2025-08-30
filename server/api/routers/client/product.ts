import { z } from "zod"
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc/trpc"

export const productRouter = createTRPCRouter({
  getProducts: publicProcedure
    .input(z.object({
      categoryId: z.string().optional(),
      limit: z.number().min(1).max(100).default(12),
      featured: z.boolean().default(false),
      lang: z.string().min(2).max(5).default("uk"), // Default to Ukrainian as per seed data
    }))
    .query(async ({ input, ctx }) => {
      const { categoryId, limit, featured, lang } = input

      const products = await ctx.prisma.product.findMany({
        where: {
          ...(categoryId && { categoryId }),
          // You can add featured logic here if you have a featured field
          // ...(featured && { featured: true }),
        },
        take: limit,
        orderBy: {
          createdAt: 'desc', // Show newest products first
        },
        include: {
          translations: {
            where: { languageCode: lang },
            select: { name: true, description: true },
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
        gallery: product.gallery,
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
          name: product.category.translations[0]?.type || "No category",
          slug: product.category.slug,
        },
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }))
    }),

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
            where: { languageCode: lang },
          },
          category: {
            include: {
              brand: {
                include: {
                  translations: {
                    where: { languageCode: lang },
                  },
                },
              },
              translations: {
                where: { languageCode: lang },
              },
            },
          },
          catalogs: {
            include: {
              translations: {
                where: { languageCode: lang },
              },
            },
          },
          comments: {
            include: {
              user: { 
                select: { 
                  name: true,
                  email: true 
                } 
              },
              replies: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true
                    }
                  }
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          relatedFrom: {
            include: {
              related: {
                include: {
                  translations: {
                    where: { languageCode: lang },
                  },
                  category: {
                    include: {
                      brand: {
                        select: { name: true }
                      }
                    }
                  }
                },
              },
            },
            take: 6, // Limit related products
          },
        },
      })

      if (!product) {
        throw new Error("Product not found")
      }

      return {
        id: product.id,
        name: product.translations[0]?.name || "No name",
        description: product.translations[0]?.description || "",
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
          name: product.category.translations[0]?.type || "No category",
          slug: product.category.slug,
          href: `/categories/${product.category.slug}`,
        },
        brand: {
          name: product.category.brand?.name || "No brand",
          slug: product.category.brand?.slug,
          href: `/brands/${product.category.brand?.slug}`,
        },
        catalogs: product.catalogs.map((catalog: any) => ({
          id: catalog.id,
          name: catalog.translations[0]?.name || "Catalog",
          pdfUrl: catalog.pdfUrl,
          previewImg: catalog.previewImg,
        })),
        comments: product.comments.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          commentType: comment.commentType,
          createdAt: comment.createdAt,
          author: comment.user.name || comment.user.email || "Anonymous",
          replies: comment.replies.map((reply: any) => ({
            id: reply.id,
            content: reply.content,
            createdAt: reply.createdAt,
            author: reply.user.name || reply.user.email || "Anonymous",
          })),
        })),
        relatedProducts: product.relatedFrom.map((rel: any) => ({
          id: rel.related.id,
          name: rel.related.translations[0]?.name || "No name",
          slug: rel.related.slug,
          image: rel.related.mainImage,
          price: rel.related.isDiscounted && rel.related.discountPrice 
            ? rel.related.discountPrice 
            : rel.related.price,
          brand: rel.related.category.brand?.name || "Unknown",
          href: `/products/${rel.related.slug}`,
        })),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }
    }),

  getFeaturedProducts: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(8),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { limit, lang } = input

      // Get products with recent activity or high availability
      const products = await ctx.prisma.product.findMany({
        where: {
          availability: 'IN_STOCK', // Only show available products
        },
        take: limit,
        orderBy: [
          { createdAt: 'desc' }, // Newest first
          { updatedAt: 'desc' }, // Recently updated
        ],
        include: {
          translations: {
            where: { languageCode: lang },
            select: { name: true, description: true },
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
        name: product.translations[0]?.name || "No name",
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
          name: product.category.translations[0]?.type || "No category",
          slug: product.category.slug,
        },
      }))
    }),

  getProductsByCategory: publicProcedure
    .input(z.object({
      categorySlug: z.string(),
      limit: z.number().min(1).max(100).default(20),
      lang: z.string().min(2).max(5).default("uk"),
    }))
    .query(async ({ input, ctx }) => {
      const { categorySlug, limit, lang } = input

      // First find the category by slug
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
            where: { languageCode: lang },
            select: { name: true, description: true },
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
        brand: {
          name: product.category.brand?.name || "Unknown Brand",
          slug: product.category.brand?.slug,
        },
        category: {
          name: product.category.translations[0]?.type || "No category",
          slug: product.category.slug,
        },
      }))
    }),
})
