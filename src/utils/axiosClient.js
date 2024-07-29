import axios from 'axios'
import { setCookie, getCookie } from '@/services/Cookies'

const baseURL = 'https://genzu-chatting-be.onrender.com'

const axiosClient = axios.create({
  baseURL: baseURL,
})

// Request interceptor to add access token to headers
axiosClient.interceptors.request.use(
  async (config) => {
    const userLogin = JSON.parse(getCookie('userLogin') || '{}')
    const accessToken = userLogin?.accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle 401 errors and retry the original request
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 403) {
      // Optionally handle the 403 error here
      // console.error('403 Forbidden error occurred')
      // You can throw an error or handle it as needed
      throw new Error(error.response?.status)
    }
    // If the error is 401 Unauthorized and it's not a retry request
    if (
      error.response?.status === 401 ||
      (error?.response?.status === 403 && !originalRequest._retry) ||
      error.response?.status === 500
    ) {
      originalRequest._retry = true

      try {
        const userLogin = JSON.parse(getCookie('userLogin'))
        const refreshToken = userLogin?.refreshToken

        if (!refreshToken) {
          throw new Error('No refreshToken found')
        }

        // Call your refresh token endpoint to get new tokens
        const { data } = await axios.post(
          `${baseURL}/auth/refresh-token`,
          { refreshToken: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        )
        // Update the accessToken and refreshToken in cookies or global state
        setCookie(
          'userLogin',
          JSON.stringify({
            ...userLogin,
            accessToken: data?.data?.accessToken,
            refreshToken: data?.data?.refreshToken,
          }),
        )

        // Update the Authorization header with the new accessToken
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${data?.data?.accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${data?.data?.accessToken}`
        // Retry the original request with the new accessToken
        return axiosClient(originalRequest)
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError)
        // Optionally, you can redirect to login or handle logout here
        throw refreshError
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
