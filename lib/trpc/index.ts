/**
 * Главный файл для экспорта всех tRPC утилит
 * 
 * Используйте этот файл для импорта tRPC функций в ваших компонентах:
 * import { trpc } from '@/lib/trpc'
 */

// Клиентские утилиты для React компонентов
export { trpc } from './client'

// Провайдер для обертывания приложения
export { TRPCProvider } from './provider'

// Серверные утилиты (для использования в API роутах или серверных компонентах)
export { 
  prisma,
  createTRPCContext,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from './server'

// Типы
export type { AppRouter } from './root'
export type { Context } from './server'
