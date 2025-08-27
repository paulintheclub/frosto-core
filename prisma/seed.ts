// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

async function main() {
  // Create Languages (assume UA and EN for now)
  const [ukLang, enLang] = await Promise.all([
    prisma.language.upsert({
      where: { code: 'uk' },
      update: {},
      create: {
        code: 'uk',
        name: 'Ukrainian',
      },
    }),
    prisma.language.upsert({
      where: { code: 'en' },
      update: {},
      create: {
        code: 'en',
        name: 'English',
      },
    }),
  ])

  // Example brand
  const brand = await prisma.brand.create({
    data: {
      slug: 'nordfrost',
      logo: '/images/brands/nordfrost.png',
      name: 'Nordfrost',
      translations: {
        create: [
          {
            languageCode: 'uk',
            description: 'Холодильні системи Nordfrost',
          },
          {
            languageCode: 'en',
            description: 'Nordfrost refrigeration systems',
          },
        ],
      },
    },
  })

  // Top-level categories
  const coldStorageCategory = await prisma.category.create({
    data: {
      slug: slugify('Cold Storage Systems', { lower: true }),
      brandId: brand.id,
      translations: {
        create: [
          {
            languageCode: 'uk',
            type: 'Системи холодного зберігання',
            description: 'Категорія холодного зберігання',
          },
          {
            languageCode: 'en',
            type: 'Cold Storage Systems',
            description: 'Cold storage systems category',
          },
        ],
      },
    },
  })

  const freezerSubCategory = await prisma.category.create({
    data: {
      slug: slugify('Walk-in Freezers', { lower: true }),
      parentId: coldStorageCategory.id,
      brandId: brand.id,
      translations: {
        create: [
          {
            languageCode: 'uk',
            type: 'Морозильні камери',
            description: 'Морозильні установки великого обсягу',
          },
          {
            languageCode: 'en',
            type: 'Walk-in Freezers',
            description: 'Large-scale freezer installations',
          },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      sku: 'WF-001',
      slug: slugify('Walk-in Freezer Nordfrost 1000L', { lower: true }),
      mainImage: '/images/products/wf-001.jpg',
      gallery: ['/images/products/wf-001.jpg'],
      price: 1800,
      availability: 'IN_STOCK',
      mainChar: '1000L | -18°C',
      techCharImage: '/images/tech/wf-001-tech.jpg',
      expCharImage: '/images/tech/wf-001-exp.jpg',
      sizeConnectionsImage: '/images/tech/wf-001-sizes.jpg',
      accessoriesImage: '/images/tech/wf-001-accessories.jpg',
      categoryId: freezerSubCategory.id,
      translations: {
        create: [
          {
            languageCode: 'uk',
            name: 'Морозильна камера Nordfrost 1000L',
            description: 'Промислова камера з обсягом 1000 литров.',
          },
          {
            languageCode: 'en',
            name: 'Walk-in Freezer Nordfrost 1000L',
            description: 'Industrial-grade 1000L freezer.',
          },
        ],
      },
    },
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
