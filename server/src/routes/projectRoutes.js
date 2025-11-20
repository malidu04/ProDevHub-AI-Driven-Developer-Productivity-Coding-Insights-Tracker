import express from 'express'
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectStats
} from '../controllers/projectController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.route('/')
  .post(createProject)
  .get(getProjects)

router.route('/:id')
  .put(updateProject)
  .delete(deleteProject)

router.get('/:id/stats', getProjectStats)

export default router