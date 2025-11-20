import Session from '../models/Session.js'

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { duration, project, description, tags } = req.body

    const session = await Session.create({
      userId: req.user._id,
      duration,
      project,
      description,
      tags,
      endTime: new Date()
    })

    res.status(201).json(session)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user sessions
// @route   GET /api/sessions
// @access  Private
export const getSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, project } = req.query
    
    const query = { userId: req.user._id }
    if (project) {
      query.project = new RegExp(project, 'i')
    }

    const sessions = await Session.find(query)
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Session.countDocuments(query)

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get recent sessions
// @route   GET /api/sessions/recent
// @access  Private
export const getRecentSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ startTime: -1 })
      .limit(10)

    res.json(sessions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get session statistics
// @route   GET /api/sessions/stats
// @access  Private
export const getSessionStats = async (req, res) => {
  try {
    const totalSessions = await Session.countDocuments({ userId: req.user._id })
    
    const totalHoursResult = await Session.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ])
    
    const totalHours = totalHoursResult.length > 0 ? totalHoursResult[0].total / 3600 : 0

    // Calculate current streak (simplified)
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ startTime: -1 })
    
    let currentStreak = 0
    let currentDate = new Date()
    
    for (let session of sessions) {
      const sessionDate = new Date(session.startTime).toDateString()
      if (sessionDate === currentDate.toDateString()) {
        currentStreak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    // Weekly hours (last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const weeklyHoursResult = await Session.aggregate([
      { 
        $match: { 
          userId: req.user._id,
          startTime: { $gte: oneWeekAgo }
        } 
      },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ])
    
    const weeklyHours = weeklyHoursResult.length > 0 ? weeklyHoursResult[0].total / 3600 : 0

    res.json({
      totalSessions,
      totalHours,
      currentStreak,
      weeklyHours
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
export const updateSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json(updatedSession)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    await Session.findByIdAndDelete(req.params.id)
    res.json({ message: 'Session removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}