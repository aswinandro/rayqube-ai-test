import axios from "axios"
import { toast } from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred"

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/auth/login"
      return Promise.reject(error)
    }

    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.")
    } else if (error.response?.status >= 400) {
      toast.error(message)
    }

    return Promise.reject(error)
  },
)

export default api
