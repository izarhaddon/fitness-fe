// vitest.config.ts

import {
  defineConfig,
  mergeConfig,
} from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: [
        'src/**/__tests__/*.spec.ts',
      ],
      env: {
        VITE_API_URL: 'http://localhost:3000/api',
      },
    },
  }),
)
