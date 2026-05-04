import { Router } from 'express'
import { createDeliveryNote, getDeliveryNotes, getDeliveryNote, deleteDeliveryNote, signDeliveryNote, getDeliveryNotePDF } from '../controllers/deliverynote.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.js'
import { createDeliveryNoteSchema } from '../validators/deliverynote.validator.js'
const router = Router()

/**
 * @swagger
 * /api/deliverynote:
 *   post:
 *     summary: Crear un albarán
 *     tags: [DeliveryNotes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project:
 *                 type: string
 *               format:
 *                 type: string
 *                 enum: [material, hours]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Albarán creado
 *       404:
 *         description: Proyecto no encontrado
 */
router.post('/', authMiddleware, validate(createDeliveryNoteSchema), createDeliveryNote)
/**
 * @swagger
 * /api/deliverynote:
 *   get:
 *     summary: Listar albaranes
 *     tags: [DeliveryNotes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes
 */
router.get('/', authMiddleware, getDeliveryNotes)
/**
 * @swagger
 * /api/deliverynote/pdf/{id}:
 *   get:
 *     summary: Descargar albarán en PDF
 *     tags: [DeliveryNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF del albarán
 *       404:
 *         description: Albarán no encontrado
 */
router.get('/pdf/:id', authMiddleware, getDeliveryNotePDF)
/**
 * @swagger
 * /api/deliverynote/{id}:
 *   get:
 *     summary: Obtener un albarán
 *     tags: [DeliveryNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del albarán
 *       404:
 *         description: Albarán no encontrado
 */
router.get('/:id', authMiddleware, getDeliveryNote)
/**
 * @swagger
 * /api/deliverynote/{id}:
 *   delete:
 *     summary: Eliminar un albarán
 *     tags: [DeliveryNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Albarán eliminado
 *       400:
 *         description: No se puede borrar un albarán firmado
 */
router.delete('/:id', authMiddleware, deleteDeliveryNote)/**
 * @swagger
 * /api/deliverynote/{id}/sign:
 *   patch:
 *     summary: Firmar un albarán
 *     tags: [DeliveryNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Albarán firmado
 *       404:
 *         description: Albarán no encontrado
 */
router.patch('/:id/sign', authMiddleware, signDeliveryNote)


export default router