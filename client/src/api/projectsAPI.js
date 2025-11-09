import api from './api'

export const projectsAPI = {
  /**
   * Create a new project
   * @param {Object} projectData - Project details (name, description, techStack, etc.)
   * @returns {Promise<Object>} Created project
   */
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData)
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },
  
  /**
   * Get all projects with optional filters
   * @param {Object} params - Query parameters (page, limit, status, search)
   * @returns {Promise<Object>} Projects list with pagination
   */
  getProjects: async (params = {}) => {
    try {
      const response = await api.get('/projects', { params })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Get a single project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Project details
   */
  getProject: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`)
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Search projects by name or description
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching projects
   */
  searchProjects: async (query) => {
    try {
      const response = await api.get('/projects/search', {
        params: { q: query }
      })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Get active projects
   * @returns {Promise<Array>} Active projects
   */
  getActiveProjects: async () => {
    try {
      const response = await api.get('/projects', {
        params: { status: 'active' }
      })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Get archived projects
   * @returns {Promise<Array>} Archived projects
   */
  getArchivedProjects: async () => {
    try {
      const response = await api.get('/projects', {
        params: { status: 'archived' }
      })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },
  
  /**
   * Update a project
   * @param {string} id - Project ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated project
   */
  updateProject: async (id, updates) => {
    try {
      const response = await api.put(`/projects/${id}`, updates)
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Archive a project (soft delete)
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Archived project
   */
  archiveProject: async (id) => {
    try {
      const response = await api.patch(`/projects/${id}/archive`)
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Restore an archived project
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Restored project
   */
  restoreProject: async (id) => {
    try {
      const response = await api.patch(`/projects/${id}/restore`)
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },
  
  /**
   * Delete a project permanently
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`)
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Bulk delete projects
   * @param {Array<string>} ids - Array of project IDs
   * @returns {Promise<Object>} Deletion results
   */
  bulkDeleteProjects: async (ids) => {
    try {
      const response = await api.post('/projects/bulk-delete', { ids })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },
  
  /**
   * Get project statistics
   * @param {string} id - Project ID
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise<Object>} Project stats
   */
  getProjectStats: async (id, params = {}) => {
    try {
      const response = await api.get(`/projects/${id}/stats`, { params })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Get project sessions
   * @param {string} id - Project ID
   * @param {Object} params - Query parameters (page, limit, startDate, endDate)
   * @returns {Promise<Object>} Project sessions
   */
  getProjectSessions: async (id, params = {}) => {
    try {
      const response = await api.get(`/projects/${id}/sessions`, { params })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Get project timeline/activity
   * @param {string} id - Project ID
   * @returns {Promise<Array>} Project activity timeline
   */
  getProjectTimeline: async (id) => {
    try {
      const response = await api.get(`/projects/${id}/timeline`)
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Update project status
   * @param {string} id - Project ID
   * @param {string} status - New status (active, on-hold, completed, archived)
   * @returns {Promise<Object>} Updated project
   */
  updateProjectStatus: async (id, status) => {
    try {
      const response = await api.patch(`/projects/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Add/update project tech stack
   * @param {string} id - Project ID
   * @param {Array<string>} techStack - Technologies used
   * @returns {Promise<Object>} Updated project
   */
  updateTechStack: async (id, techStack) => {
    try {
      const response = await api.patch(`/projects/${id}/tech-stack`, { techStack })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Get projects summary/overview
   * @returns {Promise<Object>} Projects overview stats
   */
  getProjectsOverview: async () => {
    try {
      const response = await api.get('/projects/overview')
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Export projects data
   * @param {Object} params - Export parameters (format, status)
   * @returns {Promise<Blob>} Export file
   */
  exportProjects: async (params = {}) => {
    try {
      const response = await api.get('/projects/export', {
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  },

  /**
   * Duplicate a project
   * @param {string} id - Project ID to duplicate
   * @param {Object} overrides - Fields to override in the duplicate
   * @returns {Promise<Object>} New duplicated project
   */
  duplicateProject: async (id, overrides = {}) => {
    try {
      const response = await api.post(`/projects/${id}/duplicate`, overrides)
      return response.data
    } catch (error) {
      throw transformProjectError(error)
    }
  }
}

// Helper function to transform API errors
const transformProjectError = (error) => {
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Invalid project data')
      case 404:
        return new Error('Project not found')
      case 409:
        return new Error('Project with this name already exists')
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

// Optional: Helper functions for project filtering and sorting
export const projectFilters = {
  byStatus: (status) => ({ status }),
  
  byTechStack: (tech) => ({ techStack: tech }),
  
  sortBy: {
    NEWEST: { sortBy: 'createdAt', order: 'desc' },
    OLDEST: { sortBy: 'createdAt', order: 'asc' },
    NAME_ASC: { sortBy: 'name', order: 'asc' },
    NAME_DESC: { sortBy: 'name', order: 'desc' },
    MOST_ACTIVE: { sortBy: 'sessions', order: 'desc' },
    LEAST_ACTIVE: { sortBy: 'sessions', order: 'asc' }
  }
}

// Project status constants
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
}