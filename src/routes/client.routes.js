import { Router } from 'express'
import { createClient, getClients, getClient, updateClient, deleteClient, getArchivedClients, restoreClient} from '../controllers/client.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/', authMiddleware, createClient)
router.get('/', authMiddleware, getClients)
router.put('/:id', authMiddleware, updateClient)
router.delete('/:id', authMiddleware, deleteClient)
router.get('/archived', authMiddleware, getArchivedClients)
router.get('/:id', authMiddleware, getClient)
router.post('/:id/restore', authMiddleware, restoreClient)
export default router