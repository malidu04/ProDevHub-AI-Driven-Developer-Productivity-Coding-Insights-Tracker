import Project from '../models/Project.js'
import Session from '../models/Session.js'

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      userId: req.user._id,
      ...req.body
    })

    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 })

    // Calculate total hours for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const hoursResult = await Session.aggregate([
          { 
            $match: { 
              userId: req.user._id,
              project: project.name
            } 
          },
          { $group: { _id: null, total: { $sum: '$duration' } } }
        ])
        
        const totalHours = hoursResult.length > 0 ? hoursResult[0].total / 3600 : 0
        
        return {
          ...project.toObject(),
          totalHours
        }
      })
    )

    res.json(projectsWithStats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json(updatedProject)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    await Project.findByIdAndDelete(req.params.id)
    res.json({ message: 'Project removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get project statistics
// @route   GET /api/projects/:id/stats
// @access  Private
export const getProjectStats = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Get session statistics for this project
    const sessions = await Session.find({
      userId: req.user._id,
      project: project.name
    })

    const totalHours = sessions.reduce((total, session) => total + (session.duration / 3600), 0)
    const sessionCount = sessions.length
    const averageSession = sessionCount > 0 ? totalHours / sessionCount : 0

    res.json({
      project,
      stats: {
        totalHours,
        sessionCount,
        averageSession,
        sessions
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}