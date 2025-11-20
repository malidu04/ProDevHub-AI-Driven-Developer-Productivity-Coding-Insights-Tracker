import api from './api'

export const aiService = {
  getInsights: async () => {
    const response = await api.get('/ai/insights')
    return response
  },

  generateReport: async () => {
    const response = await api.post('/ai/weekly-report')
    return response
  },

  getSuggestions: async () => {
    const response = await api.get('/ai/suggestions')
    return response
  },

  chat: async (message) => {
    const response = await api.post('/ai/chat', { message })
    return response
  }
}