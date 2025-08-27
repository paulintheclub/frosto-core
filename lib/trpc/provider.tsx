'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { trpc, createTRPCClient } from './client'

/**
 * Провайдер tRPC и React Query для всего приложения
 * 
 * Этот компонент должен оборачивать все приложение в layout.tsx
 * чтобы tRPC и React Query были доступны во всех компонентах
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Данные считаются устаревшими через 30 секунд
            staleTime: 30 * 1000,
            // Кэшируем данные 5 минут
            cacheTime: 5 * 60 * 1000,
            // Не делаем запрос при фокусе на окно
            refetchOnWindowFocus: false,
            // Повторные попытки при ошибке
            retry: 1,
          },
        },
      })
  )

  const [trpcClient] = useState(() => createTRPCClient())

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Показываем DevTools только в development режиме */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
