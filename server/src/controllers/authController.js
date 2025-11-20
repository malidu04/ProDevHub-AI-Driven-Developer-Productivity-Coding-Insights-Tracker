import User from '../models/User.js'
import { generateToken } from '../middleware/authMiddleware.js'
import logger from '../utils/logger.js'

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, githubUsername } = req.body

    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      githubUsername
    })

    if (user) {
      logger.info('New user registered', { userId: user._id, email: user.email })
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        token: generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    logger.error('User registration error:', error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email }).select('+password')

    if (user && (await user.matchPassword(password))) {
      logger.info('User logged in', { userId: user._id, email: user.email })
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        token: generateToken(user._id),
      })
    } else {
      logger.warn('Failed login attempt', { email })
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } catch (error) {
    logger.error('User login error:', error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json(user)
  } catch (error) {
    logger.error('Get user profile error:', error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    )

    logger.info('User profile updated', { userId: user._id })
    res.json(user)
  } catch (error) {
    logger.error('Update user profile error:', error)
    res.status(500).json({ message: error.message })
  }
}