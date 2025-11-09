import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Track if we're currently refreshing the token
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Return the full response, not just data
    // This allows API files to access response.data consistently
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        type: 'network_error'
      })
    }

    const { status } = error.response

    // Handle 401 Unauthorized
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        // No refresh token, logout user
        handleLogout()
        return Promise.reject(error)
      }

      try {
        // Attempt to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        })

        const { token, refreshToken: newRefreshToken } = response.data

        // Update tokens
        localStorage.setItem('token', token)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }

        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        originalRequest.headers.Authorization = `Bearer ${token}`

        // Process queued requests
        processQueue(null, token)

        // Retry original request
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null)
        handleLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other error status codes
    if (status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden')
    } else if (status === 404) {
      // Not found
      console.error('Resource not found')
    } else if (status === 429) {
      // Too many requests
      console.error('Too many requests. Please slow down.')
    } else if (status >= 500) {
      // Server errors
      console.error('Server error. Please try again later.')
    }

    return Promise.reject(error)
  }
)

// Helper function to handle logout
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  
  // Use event to notify app instead of hard redirect
  window.dispatchEvent(new CustomEvent('auth:logout'))
  
  // Fallback redirect if event not handled
  setTimeout(() => {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }, 100)
}

// Request cancellation support
export const createCancelToken = () => {
  return axios.CancelToken.source()
}

export const isCancel = axios.isCancel

// Helper to check if request was cancelled
export const isCancelError = (error) => {
  return axios.isCancel(error)
}

// Retry logic for failed requests
export const retryRequest = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      
      // Don't retry on client errors (4xx) or cancelled requests
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error
      }
      if (isCancelError(error)) {
        throw error
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
}

// Batch requests helper
export const batchRequests = async (requests, batchSize = 5) => {
  const results = []
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(batch)
    results.push(...batchResults)
  }
  return results
}

// Request queue for rate limiting
class RequestQueue {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent
    this.running = 0
    this.queue = []
  }

  async add(fn) {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve))
    }
    
    this.running++
    
    try {
      return await fn()
    } finally {
      this.running--
      const resolve = this.queue.shift()
      if (resolve) resolve()
    }
  }
}

export const requestQueue = new RequestQueue()

// Helper to add request monitoring
export const monitorRequest = (config) => {
  const startTime = Date.now()
  
  return {
    ...config,
    onUploadProgress: (progressEvent) => {
      console.log('Upload progress:', Math.round((progressEvent.loaded * 100) / progressEvent.total))
    },
    onDownloadProgress: (progressEvent) => {
      console.log('Download progress:', Math.round((progressEvent.loaded * 100) / progressEvent.total))
    },
  }
}

// Debugging helper
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.data)
    return config
  })
  
  api.interceptors.response.use(
    (response) => {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data)
      return response
    },
    (error) => {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message)
      return Promise.reject(error)
    }
  )
}

export default api