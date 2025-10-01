import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

// Context 타입 정의
export interface AppRouterContext {
  queryClient: QueryClient | undefined
}

const defaultContext: AppRouterContext = {
  queryClient: undefined,
}

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: defaultContext,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
