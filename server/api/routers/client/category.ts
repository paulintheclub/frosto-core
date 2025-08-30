import { z } from "zod"
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc/trpc"

export const categoryRouter = createTRPCRouter({
  // Простой список корневых категорий для навигации
  getRootCategories: publicProcedure
    .query(async ({ ctx }) => {

      const categories = await ctx.prisma.category.findMany({
        where: { parentId: null },
        include: {
          translations: {
            select: { name: true, description: true, languageCode: true },
          },
        },
        orderBy: { id: 'asc' },
      })

      return categories.map((cat) => {
        return {
          id: cat.id,
          slug: cat.slug,
          translations: cat.translations,
        }
      })
    }),

  // Информация о категории для страницы с subcategories (для фильтра брендов)
  getCategoryBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { slug } = input
      
      const category = await ctx.prisma.category.findUnique({
        where: { slug },
        include: {
          translations: {
            select: { name: true, type: true, description: true, languageCode: true },
          },
          children: {
            include: {
              // TODO: брать slug для ссылок на подкатегории
              translations: {
                select: { type: true, languageCode: true },
              },
              brand: {
                select: { name: true }, // Только для фильтра
              },
            },
            orderBy: { id: 'asc' },
          },
        },
      })

      if (!category) throw new Error("Category not found")

      // Fallback для основной категории
      let categoryTranslation = category.translations.find((t: any) => t.languageCode === lang)
      if (!categoryTranslation && category.translations.length > 0) {
        categoryTranslation = category.translations[0]
      }

      return {
        id: category.id,
        slug: category.slug,
        name: categoryTranslation?.type || "No name",
        description: categoryTranslation?.description || "",
        subcategories: category.children.map((child: any) => {
          // Fallback для каждой subcategory
          let childTranslation = child.translations.find((t: any) => t.languageCode === lang)
          if (!childTranslation && child.translations.length > 0) {
            childTranslation = child.translations[0]
          }
          
          return {
            id: child.id,
            slug: child.slug,
            name: childTranslation?.type || "No name",
            brandName: child.brand?.name, // Для фильтра брендов
          }
        }),
      }
    }),

  // Простые breadcrumbs (максимум parent -> child, без глубокой иерархии)
  getBreadcrumbs: publicProcedure
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
            select: { type: true, languageCode: true },
          },
          parent: {
            include: {
              translations: {
                select: { type: true, languageCode: true },
              },
            },
          },
        },
      })

      if (!category) throw new Error("Category not found")

      const breadcrumbs = []

      // Добавляем parent (если есть)
      if (category.parent) {
        let parentTranslation = category.parent.translations.find((t: any) => t.languageCode === lang)
        if (!parentTranslation && category.parent.translations.length > 0) {
          parentTranslation = category.parent.translations[0]
        }
        
        breadcrumbs.push({
          id: category.parent.id,
          slug: category.parent.slug,
          name: parentTranslation?.type || "No name",
          href: `/categories/${category.parent.slug}`,
        })
      }

      // Добавляем текущую категорию
      let categoryTranslation = category.translations.find((t: any) => t.languageCode === lang)
      if (!categoryTranslation && category.translations.length > 0) {
        categoryTranslation = category.translations[0]
      }
      
      breadcrumbs.push({
        id: category.id,
        slug: category.slug,
        name: categoryTranslation?.type || "No name",
        href: `/categories/${category.slug}`,
      })

      return breadcrumbs
    }),
})
