// src/utils/api.ts

import createClient from 'openapi-fetch'
import type { paths } from '@/types/api'

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
})

api.use({
  async onRequest({ request }) {
    const token = localStorage.getItem('token')

    if (token) {
      request.headers.set(
        'Authorization',
        `Bearer ${token}`,
      )
    }

    return request
  },
})

api.use({
  async onResponse({ response }) {
    if (response.status === 401) {
    }

    return response
  },
})
