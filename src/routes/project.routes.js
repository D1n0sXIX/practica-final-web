import { Router } from 'express'
import { createProject, getProjects, getProject, updateProject, deleteProject, getArchivedProjects, restoreProject} from '../controllers/project.controller.js'    
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/', authMiddleware, createProject)
router.get('/', authMiddleware, getProjects)
router.get('/archived', authMiddleware, getArchivedProjects)
router.get('/:id', authMiddleware, getProject)
router.put('/:id', authMiddleware, updateProject)
router.delete('/:id', authMiddleware, deleteProject)
router.put('/restore/:id', authMiddleware, restoreProject)

export default router