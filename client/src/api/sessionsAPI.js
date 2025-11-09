import api from './api'

export const sessionsAPI = {
  /**
   * Create a new coding session
   * @param {Object} sessionData - Session details (projectId, startTime, etc.)
   * @returns {Promise<Object>} Created session
   */
  createSession: async (sessionData) => {
    try {
      const response = await api.post('/sessions', sessionData)
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },
  
  /**
   * Get sessions with optional filters
   * @param {Object} params - Query parameters (page, limit, projectId, startDate, endDate)
   * @returns {Promise<Object>} Sessions list with pagination
   */
  getSessions: async (params = {}) => {
    try {
      const response = await api.get('/sessions', { params })
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },

  /**
   * Get a single session by ID
   * @param {string} id - Session ID
   * @returns {Promise<Object>} Session details
   */
  getSession: async (id) => {
    try {
      const response = await api.get(`/sessions/${id}`)
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },
  
  /**
   * Get recent sessions (last 7 days)
   * @returns {Promise<Array>} Recent sessions
   */
  getRecentSessions: async () => {
    try {
      const response = await api.get('/sessions/recent')
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },

  /**
   * Get sessions for a specific project
   * @param {string} projectId - Project ID
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Object>} Project sessions
   */
  getProjectSessions: async (projectId, params = {}) => {
    try {
      const response = await api.get(`/sessions/project/${projectId}`, { params })
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },

  /**
   * Get session statistics
   * @param {Object} params - Query parameters (startDate, endDate, projectId)
   * @returns {Promise<Object>} Session stats
   */
  getStats: async (params = {}) => {
    try {
      const response = await api.get('/sessions/stats', { params })
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },

  /**
   * Get active/ongoing session
   * @returns {Promise<Object|null>} Active session or null
   */
  getActiveSession: async () => {
    try {
      const response = await api.get('/sessions/active')
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },
  
  /**
   * Update a session
   * @param {string} id - Session ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated session
   */
  updateSession: async (id, updates) => {
    try {
      const response = await api.put(`/sessions/${id}`, updates)
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },

  /**
   * End/stop a session
   * @param {string} id - Session ID
   * @param {string} endTime - End timestamp
   * @returns {Promise<Object>} Updated session
   */
  endSession: async (id, endTime = new Date().toISOString()) => {
    try {
      const response = await api.put(`/sessions/${id}/end`, { endTime })
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },

  /**
   * Add notes to a session
   * @param {string} id - Session ID
   * @param {string} notes - Session notes
   * @returns {Promise<Object>} Updated session
   */
  addNotes: async (id, notes) => {
    try {
      const response = await api.patch(`/sessions/${id}/notes`, { notes })
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },
  
  /**
   * Delete a session
   * @param {string} id - Session ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteSession: async (id) => {
    try {
      const response = await api.delete(`/sessions/${id}`)
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },

  /**
   * Bulk delete sessions
   * @param {Array<string>} ids - Array of session IDs
   * @returns {Promise<Object>} Deletion results
   */
  bulkDeleteSessions: async (ids) => {
    try {
      const response = await api.post('/sessions/bulk-delete', { ids })
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  },

  /**
   * Export sessions data
   * @param {Object} params - Export parameters (format, startDate, endDate)
   * @returns {Promise<Blob>} Export file
   */
  exportSessions: async (params = {}) => {
    try {
      const response = await api.get('/sessions/export', {
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw transformSessionError(error)
    }
  }
}

// Helper function to transform API errors
const transformSessionError = (error) => {
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Invalid session data')
      case 404:
        return new Error('Session not found')
      case 409:
        return new Error('Session conflict. You may have an active session already')
      case 422:
        return new Error(data.message || 'Validation failed')
      case 500:
        return new Error('Server error. Please try again')
      default:
        return new Error(data.message || 'An error occurred')
    }
  } else if (error.request) {
    return new Error('Network error. Please check your connection')
  } else {
    return new Error(error.message || 'An unexpected error occurred')
  }
}

// Optional: Helper functions for common query patterns
export const sessionFilters = {
  today: () => ({
    startDate: new Date().setHours(0, 0, 0, 0),
    endDate: new Date().setHours(23, 59, 59, 999)
  }),
  
  thisWeek: () => {
    const now = new Date()
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay()))
    const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 6))
    return {
      startDate: firstDay.setHours(0, 0, 0, 0),
      endDate: lastDay.setHours(23, 59, 59, 999)
    }
  },
  
  thisMonth: () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
      startDate: firstDay.setHours(0, 0, 0, 0),
      endDate: lastDay.setHours(23, 59, 59, 999)
    }
  },

  last7Days: () => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return {
      startDate: sevenDaysAgo.setHours(0, 0, 0, 0),
      endDate: now.setHours(23, 59, 59, 999)
    }
  },

  last30Days: () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return {
      startDate: thirtyDaysAgo.setHours(0, 0, 0, 0),
      endDate: now.setHours(23, 59, 59, 999)
    }
  }
}