import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter } from './root'
import superjson from 'superjson'

/**
 * Клиентская настройка tRPC для React компонентов
 */
export const trpc = createTRPCReact<AppRouter>()

/**
 * Создаем клиент tRPC с настройками
 */
export const createTRPCClient = () => {
  return trpc.createClient({
    transformer: superjson,
    links: [
      // Логирование запросов в development режиме
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      // HTTP батч линк для объединения запросов
      httpBatchLink({
        url: '/api/trpc',
        // Добавляем заголовки аутентификации
        headers() {
          return {
            // TODO: Добавить токен аутентификации
            // authorization: getAuthToken(),
          }
        },
        transformer: undefined
      }),
    ],
  })
}
