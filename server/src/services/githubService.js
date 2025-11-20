import axios from 'axios'

export const GitHubService = {
  getUserRepos: async (username) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      return response.data
    } catch (error) {
      console.error('GitHub API Error:', error.message)
      return []
    }
  },

  getUserActivity: async (username) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/events`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      return response.data
    } catch (error) {
      console.error('GitHub API Error:', error.message)
      return []
    }
  },

  getCommitStats: async (username, repo) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${username}/${repo}/stats/commit_activity`)
      return response.data
    } catch (error) {
      console.error('GitHub API Error:', error.message)
      return null
    }
  }
}