import { Router } from 'express';
import { register, verifyEmail, login, updatePersonalData, updateCompany, updateLogo, getUser } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, verificationSchema, loginSchema, personalDataSchema, companySchema } from '../validators/user.validator.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';

const router = Router();

/**
 * @swagger
 * /api/user/register:
 *   put:
 *     summary: Actualizar datos personales
 *     tags: [Users]
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
 *               lastName:
 *                 type: string
 *               nif:
 *                 type: string
 *     responses:
 *       200:
 *         description: Datos actualizados correctamente
 */
router.post('/register', validate(registerSchema), register);
router.put('/validation', authMiddleware, validate(verificationSchema), verifyEmail);
router.post('/login', validate(loginSchema), login);
router.put('/register', authMiddleware, validate(personalDataSchema), updatePersonalData);
/**
 * @swagger
 * /api/user/company:
 *   patch:
 *     summary: Crear o actualizar compañía
 *     tags: [Users]
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
 *               isFreelance:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Compañía actualizada correctamente
 */
router.patch('/company', authMiddleware, validate(companySchema), updateCompany);
/**
 * @swagger
 * /api/user/logo:
 *   patch:
 *     summary: Subir logo de la compañía
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo subido correctamente
 */
router.patch('/logo', authMiddleware, upload.single('logo'), updateLogo);
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/', authMiddleware, getUser);

export default router;