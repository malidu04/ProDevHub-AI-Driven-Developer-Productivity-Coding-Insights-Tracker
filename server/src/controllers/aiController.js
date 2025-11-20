import { AIService } from '../services/aiService.js'
import { GitHubService } from '../services/githubService.js'
import Session from '../models/Session.js'
import AIReport from '../models/AIReport.js'
import logger from '../utils/logger.js'

// @desc    Get AI insights
// @route   GET /api/ai/insights
// @access  Private
export const getInsights = async (req, res) => {
  try {
    // Get user's recent sessions and statistics
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ startTime: -1 })
      .limit(50)

    if (sessions.length === 0) {
      return res.json({
        productivityScore: 0,
        totalSessions: 0,
        totalHours: 0,
        averageSession: 0,
        weeklyReport: null
      })
    }

    // Use AIService to analyze productivity
    const productivityData = await AIService.analyzeProductivity(sessions)

    // If user has GitHub username, fetch GitHub activity
    let githubActivity = []
    if (req.user.githubUsername) {
      githubActivity = await GitHubService.getUserActivity(req.user.githubUsername)
    }

    const insights = {
      ...productivityData,
      githubActivity: githubActivity.length
    }

    // Check for existing weekly report
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const recentReport = await AIReport.findOne({
      userId: req.user._id,
      type: 'weekly',
      createdAt: { $gte: oneWeekAgo }
    }).sort({ createdAt: -1 })

    if (recentReport) {
      insights.weeklyReport = recentReport.insights
    }

    logger.info('AI insights generated', { userId: req.user._id, sessionCount: sessions.length })
    res.json(insights)
  } catch (error) {
    logger.error('Error in getInsights:', error)
    res.status(500).json({ message: 'Failed to get insights' })
  }
}

// @desc    Generate weekly AI report
// @route   POST /api/ai/weekly-report
// @access  Private
export const generateWeeklyReport = async (req, res) => {
  try {
    // Get sessions from the last week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const sessions = await Session.find({
      userId: req.user._id,
      startTime: { $gte: oneWeekAgo }
    }).sort({ startTime: -1 })

    if (sessions.length === 0) {
      return res.status(400).json({ message: 'No sessions found for the last week' })
    }

    // Generate AI report using AIService
    const aiReport = await AIService.generateWeeklyReport(sessions, req.user)

    // Parse the AI report (assuming it returns JSON string)
    let reportData
    try {
      reportData = JSON.parse(aiReport)
    } catch (parseError) {
      logger.error('Error parsing AI report:', parseError)
      reportData = {
        summary: aiReport,
        achievements: [],
        recommendations: [],
        focusAreas: []
      }
    }

    // Save the report to database
    const report = await AIReport.create({
      userId: req.user._id,
      type: 'weekly',
      reportText: aiReport,
      insights: reportData,
      periodStart: oneWeekAgo,
      periodEnd: new Date()
    })

    logger.info('Weekly AI report generated', { userId: req.user._id, reportId: report._id })
    res.json(reportData)
  } catch (error) {
    logger.error('Error in generateWeeklyReport:', error)
    res.status(500).json({ message: 'Failed to generate AI report' })
  }
}

// @desc    Get AI suggestions
// @route   GET /api/ai/suggestions
// @access  Private
export const getSuggestions = async (req, res) => {
  try {
    // Get user's recent sessions
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ startTime: -1 })
      .limit(20)

    // Use AIService to get suggestions based on sessions
    const suggestions = await AIService.getSuggestions(sessions, req.user)

    res.json(suggestions)
  } catch (error) {
    logger.error('Error in getSuggestions:', error)
    res.status(500).json({ message: 'Failed to get suggestions' })
  }
}

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    const chatResponse = await AIService.chat(message, req.user)

    res.json({ response: chatResponse })
  } catch (error) {
    logger.error('Error in chatWithAI:', error)
    res.status(500).json({ message: 'Failed to process chat message' })
  }
}