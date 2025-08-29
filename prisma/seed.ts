import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

async function main() {
  // Очистка (если нужно)
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.language.deleteMany()

  // Языки
  const [ukLang, ruLang] = await Promise.all([
    prisma.language.upsert({
      where: { code: 'uk' },
      update: {},
      create: { code: 'uk', name: 'Ukrainian' },
    }),
    prisma.language.upsert({
      where: { code: 'ru' },
      update: {},
      create: { code: 'ru', name: 'Russian' },
    }),
  ])

  // Бренды
  const nordfrost = await prisma.brand.create({
    data: {
      slug: 'nordfrost',
      logo: '/images/brands/nordfrost.png',
      name: 'Nordfrost',
      translations: {
        create: [
          { languageCode: 'uk', description: 'Холодильні системи Nordfrost' },
          { languageCode: 'ru', description: 'Холодильные системы Nordfrost' },
        ],
      },
    },
  })

  const frosttech = await prisma.brand.create({
    data: {
      slug: 'frosttech',
      logo: '/images/brands/frosttech.png',
      name: 'FrostTech',
      translations: {
        create: [
          { languageCode: 'uk', description: 'Професійне охолодження FrostTech' },
          { languageCode: 'ru', description: 'Профессиональное охлаждение FrostTech' },
        ],
      },
    },
  })

  // Категории
  const storageCategory = await prisma.category.create({
    data: {
      slug: slugify('Системи холодного зберігання', { lower: true, strict: true }),
      translations: {
        create: [
          { languageCode: 'uk', type: 'Системи холодного зберігання', description: 'Категорія холодного зберігання' },
          { languageCode: 'ru', type: 'Системы холодного хранения', description: 'Категория холодного хранения' },
        ],
      },
    },
  })

  const freezerCategory = await prisma.category.create({
    data: {
      slug: slugify('Морозильні камери', { lower: true, strict: true }),
      brandId: nordfrost.id,
      parentId: storageCategory.id,
      translations: {
        create: [
          { languageCode: 'uk', type: 'Морозильні камери', description: 'Морозильні установки великого обсягу' },
          { languageCode: 'ru', type: 'Морозильные камеры', description: 'Морозильные установки большого объема' },
        ],
      },
    },
  })

  const containerCategory = await prisma.category.create({
    data: {
      slug: slugify('Охолоджуючі контейнери', { lower: true, strict: true }),
      brandId: frosttech.id,
      parentId: storageCategory.id,
      translations: {
        create: [
          { languageCode: 'uk', type: 'Охолоджуючі контейнери', description: 'Контейнери для зберігання продуктів' },
          { languageCode: 'ru', type: 'Охлаждающие контейнеры', description: 'Контейнеры для хранения продуктов' },
        ],
      },
    },
  })

  const controllersCategory = await prisma.category.create({
    data: {
      slug: slugify('Контролери температури', { lower: true, strict: true }),
      brandId: frosttech.id,
      parentId: containerCategory.id,
      translations: {
        create: [
          {
            languageCode: 'uk',
            type: 'Контролери температури',
            description: 'Категорія для цифрових термостатів, контролерів і сенсорів температури.',
          },
          {
            languageCode: 'ru',
            type: 'Контроллеры температуры',
            description: 'Категория для цифровых термостатов, контроллеров и датчиков температуры.',
          },
        ],
      },
    },
  })

  // Продукты
  await prisma.product.create({
    data: {
      sku: 'WF-001',
      slug: slugify('Морозильна камера Nordfrost 1000L', { lower: true, strict: true }),
      mainImage: '/images/products/wf-001.jpg',
      gallery: ['/images/products/wf-001.jpg'],
      price: 1800,
      availability: 'IN_STOCK',
      mainChar: '1000L | -18°C',
      techCharImage: '/images/tech/wf-001-tech.jpg',
      expCharImage: '/images/tech/wf-001-exp.jpg',
      sizeConnectionsImage: '/images/tech/wf-001-sizes.jpg',
      accessoriesImage: '/images/tech/wf-001-accessories.jpg',
      categoryId: controllersCategory.id,
      translations: {
        create: [
          {
            languageCode: 'uk',
            name: 'Морозильна камера Nordfrost 1000L',
            description: 'Промислова камера з обсягом 1000 літрів.',
          },
          {
            languageCode: 'ru',
            name: 'Морозильная камера Nordfrost 1000L',
            description: 'Промышленная камера объемом 1000 литров.',
          },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      sku: 'WF-002',
      slug: slugify('Морозильна камера Nordfrost 1500L', { lower: true, strict: true }),
      mainImage: '/images/products/wf-002.jpg',
      gallery: ['/images/products/wf-002.jpg'],
      price: 2100,
      availability: 'IN_STOCK',
      mainChar: '1500L | -18°C',
      techCharImage: '/images/tech/wf-002-tech.jpg',
      expCharImage: '/images/tech/wf-002-exp.jpg',
      sizeConnectionsImage: '/images/tech/wf-002-sizes.jpg',
      accessoriesImage: '/images/tech/wf-002-accessories.jpg',
      categoryId: controllersCategory.id,
      translations: {
        create: [
          {
            languageCode: 'uk',
            name: 'Морозильна камера Nordfrost 1500L',
            description: 'Велика морозильна камера на 1500 літрів.',
          },
          {
            languageCode: 'ru',
            name: 'Морозильная камера Nordfrost 1500L',
            description: 'Большая морозильная камера на 1500 литров.',
          },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      sku: 'CC-001',
      slug: slugify('Охолоджуючий контейнер Nordfrost 500L', { lower: true, strict: true }),
      mainImage: '/images/products/cc-001.jpg',
      gallery: ['/images/products/cc-001.jpg'],
      price: 1400,
      availability: 'IN_STOCK',
      mainChar: '500L | 0–5°C',
      techCharImage: '/images/tech/cc-001-tech.jpg',
      expCharImage: '/images/tech/cc-001-exp.jpg',
      sizeConnectionsImage: '/images/tech/cc-001-sizes.jpg',
      accessoriesImage: '/images/tech/cc-001-accessories.jpg',
      categoryId: controllersCategory.id,
      translations: {
        create: [
          {
            languageCode: 'uk',
            name: 'Охолоджуючий контейнер Nordfrost 500L',
            description: 'Компактний контейнер для охолодження продуктів.',
          },
          {
            languageCode: 'ru',
            name: 'Охлаждающий контейнер Nordfrost 500L',
            description: 'Компактный контейнер для охлаждения продуктов.',
          },
        ],
      },
    },
  })

  console.log('Seed completed.')
}

main()
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
