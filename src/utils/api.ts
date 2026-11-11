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
  async onResponse({
    request,
    response,
  }) {
    const isAuthRequest = request.url.endsWith('/auth/login') || request.url.endsWith('/auth/registration')

    if (response.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token')

      const loginPath = `${import.meta.env.BASE_URL}login`

      if (window.location.pathname !== loginPath) {
        const redirectPath = encodeURIComponent(`${window.location.pathname}${window.location.search}`)

        window.location.assign(`${loginPath}?redirect=${redirectPath}`)
      }
    }

    return response
  },
})
