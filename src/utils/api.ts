import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios'

const config: AxiosRequestConfig = {
  baseURL: `${import.meta.env.BASE_URL}`,
}

export const api: AxiosInstance = axios.create(config)

api.interceptors.response.use(
  res => res,
  (err) => {
    if (err.response?.status === 401) {
      // можно дёрнуть logout через глобальный event или singleton store
    }
    return Promise.reject(err)
  },
)
