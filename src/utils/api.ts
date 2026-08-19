import { useRouter } from 'vue-router'

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

const config: AxiosRequestConfig = {
  baseURL: `${import.meta.env.BASE_URL}`,
}

export const api: AxiosInstance = axios.create(config)

function unauthorized() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  window.location.assign('/login')
}

api.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')

    if (token && request.headers) {
      request.headers.Authorization = `Bearer ${token}`
    }

    return request
  },
  error => Promise.reject(error),
)

api.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 401) {
      // unauthorized()
    }
    return Promise.reject(error)
  },
)
