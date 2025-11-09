import api from './api'

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      throw transformAuthError(error)
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw transformAuthError(error)
    }
  },
  
  getMe: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw transformAuthError(error)
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData)
      return response.data
    } catch (error) {
      throw transformAuthError(error)
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout')
      // Clear token from storage
      localStorage.removeItem('token')
      return response.data
    } catch (error) {
      // Even if server logout fails, clear local token
      localStorage.removeItem('token')
      throw transformAuthError(error)
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh')
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response.data
    } catch (error) {
      localStorage.removeItem('token')
      throw transformAuthError(error)
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw transformAuthError(error)
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw transformAuthError(error)
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      })
      return response.data
    } catch (error) {
      throw transformAuthError(error)
    }
  }
}

// Helper function to transform API errors into user-friendly messages
const transformAuthError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Invalid request')
      case 401:
        return new Error(data.message || 'Invalid credentials')
      case 403:
        return new Error('Access denied')
      case 404:
        return new Error('User not found')
      case 409:
        return new Error(data.message || 'User already exists')
      case 422:
        return new Error(data.message || 'Validation failed')
      case 429:
        return new Error('Too many requests. Please try again later')
      case 500:
        return new Error('Server error. Please try again later')
      default:
        return new Error(data.message || 'An error occurred')
    }
  } else if (error.request) {
    // Request made but no response
    return new Error('Network error. Please check your connection')
  } else {
    // Something else happened
    return new Error(error.message || 'An unexpected error occurred')
  }
}