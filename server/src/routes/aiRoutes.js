import express from 'express'
import {
  getInsights,
  generateWeeklyReport,
  getSuggestions,
  chatWithAI
} from '../controllers/aiController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/insights', getInsights)
router.post('/weekly-report', generateWeeklyReport)
router.get('/suggestions', getSuggestions)
router.post('/chat', chatWithAI)

export default router