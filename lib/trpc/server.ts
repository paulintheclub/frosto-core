import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { PrismaClient } from '@prisma/client'
import superjson from 'superjson'

// Создаем глобальный экземпляр Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Создаем контекст для tRPC запросов
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts

  // Здесь можно добавить логику аутентификации
  // Например, получение пользователя из JWT токена или сессии
  const getUserFromRequest = async () => {
    // TODO: Добавить логику аутентификации
    // const token = req.headers.authorization?.replace('Bearer ', '')
    // const user = await verifyToken(token)
    return null
  }

  const user = await getUserFromRequest()

  return {
    prisma,
    user,
    req,
    res,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

// Инициализируем tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error && error.cause.name === 'ZodError'
            ? error.cause.message
            : null,
      },
    }
  },
})

// Создаем базовые процедуры
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

// Middleware для проверки аутентификации
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

// Middleware для проверки прав администратора
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  
  // TODO: Добавить проверку роли админа
  // if (ctx.user.role !== 'ADMIN') {
  //   throw new TRPCError({ code: 'FORBIDDEN' })
  // }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

// Защищенные процедуры
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed)
export const adminProcedure = publicProcedure.use(enforceUserIsAdmin)
