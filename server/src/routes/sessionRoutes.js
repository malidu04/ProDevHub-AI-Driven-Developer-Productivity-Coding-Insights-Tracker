import express from 'express'
import {
  createSession,
  getSessions,
  getRecentSessions,
  getSessionStats,
  updateSession,
  deleteSession
} from '../controllers/sessionController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.route('/')
  .post(createSession)
  .get(getSessions)

router.get('/recent', getRecentSessions)
router.get('/stats', getSessionStats)

router.route('/:id')
  .put(updateSession)
  .delete(deleteSession)

export default router