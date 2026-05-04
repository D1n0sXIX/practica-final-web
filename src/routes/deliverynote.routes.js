import { Router } from 'express'
import { createDeliveryNote, getDeliveryNotes, getDeliveryNote, deleteDeliveryNote, signDeliveryNote, getDeliveryNotePDF } from '../controllers/deliverynote.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
const router = Router()

router.post('/', authMiddleware, createDeliveryNote)
router.get('/', authMiddleware, getDeliveryNotes)
router.get('/pdf/:id', authMiddleware, getDeliveryNotePDF)
router.get('/:id', authMiddleware, getDeliveryNote)
router.delete('/:id', authMiddleware, deleteDeliveryNote)
router.patch('/:id/sign', authMiddleware, signDeliveryNote)



export default router