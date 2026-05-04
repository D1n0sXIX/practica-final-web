import { Router } from 'express'
import { createProject, getProjects, getProject, updateProject, deleteProject, getArchivedProjects, restoreProject} from '../controllers/project.controller.js'    
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()
/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Crear un proyecto
 *     tags: [Projects]
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
 *               projectCode:
 *                 type: string
 *               client:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado
 *       404:
 *         description: Cliente no encontrado
 */
router.post('/', authMiddleware, createProject)
/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Listar proyectos
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get('/', authMiddleware, getProjects)
/**
 * @swagger
 * /api/project/archived:
 *   get:
 *     summary: Listar proyectos archivados
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos archivados
 */
router.get('/archived', authMiddleware, getArchivedProjects)
/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Obtener un proyecto
 *     tags: [Projects]
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
 *         description: Datos del proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', authMiddleware, getProject)
/**
 * @swagger
 * /api/project/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Projects]
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
 *         description: Proyecto actualizado
 */
router.put('/:id', authMiddleware, updateProject)
/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Projects]
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
 *         description: Proyecto eliminado
 */
router.delete('/:id', authMiddleware, deleteProject)

/**
 * @swagger
 * /api/project/{id}/restore:
 *   patch:
 *     summary: Restaurar proyecto archivado
 *     tags: [Projects]
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
 *         description: Proyecto restaurado
 */
router.patch('/restore/:id', authMiddleware, restoreProject)

export default router