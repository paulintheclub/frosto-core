import { createTRPCRouter } from './server'

/**
 * Главный роутер приложения
 * 
 * Здесь мы будем добавлять все наши под-роутеры:
 * - adminRouter - для административных функций
 * - clientRouter - для клиентских функций
 * - publicRouter - для публичных API (продукты, категории и т.д.)
 */
export const appRouter = createTRPCRouter({
  // Пока что пустой роутер, будем добавлять под-роутеры постепенно
  
  // Пример того, что мы добавим в следующих этапах:
  // admin: adminRouter,
  // client: clientRouter, 
  // public: publicRouter,
})

// Экспортируем тип роутера для типизации на клиенте
export type AppRouter = typeof appRouter
