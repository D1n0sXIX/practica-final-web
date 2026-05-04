import { Router } from 'express'
import { createClient, getClients, getClient, updateClient, deleteClient, getArchivedClients, restoreClient} from '../controllers/client.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.js'
import { createClientSchema, updateClientSchema } from '../validators/client.validator.js'

const router = Router()
/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Crear un cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cif:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 *       409:
 *         description: CIF ya existe
 */
router.post('/', authMiddleware, validate(createClientSchema), createClient)
/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Listar clientes
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', authMiddleware, getClients)
/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     tags: [Clients]
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
 *         description: Cliente actualizado
 */
router.put('/:id', authMiddleware, validate(updateClientSchema), updateClient)
/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clients]
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
 *         description: Cliente eliminado
 */
router.delete('/:id', authMiddleware, deleteClient)
/**
 * @swagger
 * /api/client/archived:
 *   get:
 *     summary: Listar clientes archivados
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes archivados
 */
router.get('/archived', authMiddleware, getArchivedClients)
/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Obtener un cliente
 *     tags: [Clients]
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
 *         description: Datos del cliente
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', authMiddleware, getClient)
/**
 * @swagger
 * /api/client/{id}/restore:
 *   patch:
 *     summary: Restaurar cliente archivado
 *     tags: [Clients]
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
 *         description: Cliente restaurado
 */
router.patch('/:id/restore', authMiddleware, restoreClient)
export default router