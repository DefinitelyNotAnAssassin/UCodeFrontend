import axios from "axios"
import { BASE_URL } from "./UrlConstant"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

// Add a request interceptor to include the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token")) // Adjust based on where you store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token.access}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
