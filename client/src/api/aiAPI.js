import api from './api'

export const aiAPI = {
  /**
   * Get AI-generated insights about coding patterns
   * @param {Object} params - Query parameters (startDate, endDate, projectId, type)
   * @returns {Promise<Object>} AI insights
   */
  getInsights: async (params = {}) => {
    try {
      const response = await api.get('/ai/insights', { params })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get specific type of insight
   * @param {string} type - Insight type (productivity, patterns, recommendations, trends)
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Specific insights
   */
  getInsightByType: async (type, params = {}) => {
    try {
      const response = await api.get(`/ai/insights/${type}`, { params })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get project-specific insights
   * @param {string} projectId - Project ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Project insights
   */
  getProjectInsights: async (projectId, params = {}) => {
    try {
      const response = await api.get(`/ai/insights/project/${projectId}`, { params })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },
  
  /**
   * Generate weekly report
   * @param {Object} options - Report options (startDate, endDate, includeCharts)
   * @returns {Promise<Object>} Generated report
   */
  generateWeeklyReport: async (options = {}) => {
    try {
      const response = await api.post('/ai/weekly-report', options)
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Generate custom report for specific date range
   * @param {Object} options - Report options (startDate, endDate, projects, metrics)
   * @returns {Promise<Object>} Generated report
   */
  generateCustomReport: async (options) => {
    try {
      const response = await api.post('/ai/reports/custom', options)
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get report history
   * @param {Object} params - Query parameters (page, limit, type)
   * @returns {Promise<Object>} Past reports
   */
  getReportHistory: async (params = {}) => {
    try {
      const response = await api.get('/ai/reports/history', { params })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get a specific report by ID
   * @param {string} reportId - Report ID
   * @returns {Promise<Object>} Report details
   */
  getReport: async (reportId) => {
    try {
      const response = await api.get(`/ai/reports/${reportId}`)
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Export report as PDF or other format
   * @param {string} reportId - Report ID
   * @param {string} format - Export format (pdf, docx, html)
   * @returns {Promise<Blob>} Report file
   */
  exportReport: async (reportId, format = 'pdf') => {
    try {
      const response = await api.get(`/ai/reports/${reportId}/export`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },
  
  /**
   * Get AI suggestions for improvement
   * @param {Object} params - Query parameters (category, limit)
   * @returns {Promise<Array>} AI suggestions
   */
  getSuggestions: async (params = {}) => {
    try {
      const response = await api.get('/ai/suggestions', { params })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get suggestions for a specific project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} Project-specific suggestions
   */
  getProjectSuggestions: async (projectId) => {
    try {
      const response = await api.get(`/ai/suggestions/project/${projectId}`)
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Mark suggestion as helpful or not
   * @param {string} suggestionId - Suggestion ID
   * @param {boolean} helpful - Whether suggestion was helpful
   * @returns {Promise<Object>} Updated suggestion
   */
  rateSuggestion: async (suggestionId, helpful) => {
    try {
      const response = await api.post(`/ai/suggestions/${suggestionId}/rate`, { helpful })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Dismiss a suggestion
   * @param {string} suggestionId - Suggestion ID
   * @returns {Promise<Object>} Confirmation
   */
  dismissSuggestion: async (suggestionId) => {
    try {
      const response = await api.delete(`/ai/suggestions/${suggestionId}`)
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },
  
  /**
   * Send a chat message to AI assistant
   * @param {string} message - User message
   * @param {Object} options - Chat options (conversationId, context)
   * @returns {Promise<Object>} AI response
   */
  chat: async (message, options = {}) => {
    try {
      const response = await api.post('/ai/chat', { 
        message,
        ...options
      })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Send chat message with streaming response
   * @param {string} message - User message
   * @param {Object} options - Chat options
   * @param {Function} onChunk - Callback for each chunk
   * @returns {Promise<Object>} Complete response
   */
  chatStream: async (message, options = {}, onChunk) => {
    try {
      const response = await api.post('/ai/chat/stream', 
        { message, ...options },
        {
          responseType: 'stream',
          onDownloadProgress: (progressEvent) => {
            if (onChunk && progressEvent.event?.target?.response) {
              onChunk(progressEvent.event.target.response)
            }
          }
        }
      )
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get chat conversation history
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Array>} Message history
   */
  getChatHistory: async (conversationId) => {
    try {
      const response = await api.get(`/ai/chat/history/${conversationId}`)
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get all chat conversations
   * @param {Object} params - Query parameters (page, limit)
   * @returns {Promise<Object>} Conversations list
   */
  getChatConversations: async (params = {}) => {
    try {
      const response = await api.get('/ai/chat/conversations', { params })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Delete a chat conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Confirmation
   */
  deleteChatConversation: async (conversationId) => {
    try {
      const response = await api.delete(`/ai/chat/conversations/${conversationId}`)
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get productivity analysis
   * @param {Object} params - Analysis parameters (startDate, endDate, granularity)
   * @returns {Promise<Object>} Productivity metrics and insights
   */
  getProductivityAnalysis: async (params = {}) => {
    try {
      const response = await api.get('/ai/analysis/productivity', { params })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get coding patterns analysis
   * @param {Object} params - Analysis parameters
   * @returns {Promise<Object>} Pattern insights
   */
  getCodingPatterns: async (params = {}) => {
    try {
      const response = await api.get('/ai/analysis/patterns', { params })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get focus time analysis
   * @param {Object} params - Analysis parameters
   * @returns {Promise<Object>} Focus time insights
   */
  getFocusAnalysis: async (params = {}) => {
    try {
      const response = await api.get('/ai/analysis/focus', { params })
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Get AI-powered goal recommendations
   * @returns {Promise<Array>} Recommended goals
   */
  getGoalRecommendations: async () => {
    try {
      const response = await api.get('/ai/goals/recommendations')
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  },

  /**
   * Analyze progress towards a goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<Object>} Progress analysis
   */
  analyzeGoalProgress: async (goalId) => {
    try {
      const response = await api.get(`/ai/goals/${goalId}/analysis`)
      return response.data
    } catch (error) {
      throw transformAIError(error)
    }
  }
}

// Helper function to transform API errors
const transformAIError = (error) => {
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Invalid request to AI service')
      case 402:
        return new Error('AI feature requires premium subscription')
      case 429:
        return new Error('Too many AI requests. Please wait a moment')
      case 500:
        return new Error('AI service temporarily unavailable')
      case 503:
        return new Error('AI service is currently busy. Please try again')
      default:
        return new Error(data.message || 'An error occurred with AI service')
    }
  } else if (error.request) {
    return new Error('Network error. Please check your connection')
  } else {
    return new Error(error.message || 'An unexpected error occurred')
  }
}

// Constants for AI features
export const INSIGHT_TYPES = {
  PRODUCTIVITY: 'productivity',
  PATTERNS: 'patterns',
  RECOMMENDATIONS: 'recommendations',
  TRENDS: 'trends',
  FOCUS: 'focus',
  BURNOUT_RISK: 'burnout-risk'
}

export const REPORT_TYPES = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  CUSTOM: 'custom'
}

export const SUGGESTION_CATEGORIES = {
  PRODUCTIVITY: 'productivity',
  TIME_MANAGEMENT: 'time-management',
  WORK_LIFE_BALANCE: 'work-life-balance',
  SKILL_DEVELOPMENT: 'skill-development',
  PROJECT_PLANNING: 'project-planning'
}