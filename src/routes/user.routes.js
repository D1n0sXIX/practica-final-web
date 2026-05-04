import { Router } from 'express';
import { register, verifyEmail, login, updatePersonalData, updateCompany, updateLogo, getUser, refreshToken, logout, deleteUser, inviteUser, updatePassword } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, verificationSchema, loginSchema, personalDataSchema, companySchema, changePasswordSchema } from '../validators/user.validator.js';
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
/**
 * @swagger
 * /api/user/refresh:
 *   post:
 *     summary: Refrescar token de acceso
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo token generado
 *       401:
 *         description: Refresh token inválido
 */
router.post('/refresh', refreshToken);
/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */
router.post('/logout', authMiddleware, logout);
/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: soft
 *         schema:
 *           type: boolean
 *         description: Si true hace soft delete
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/', authMiddleware, deleteUser);
/**
 * @swagger
 * /api/user/password:
 *   put:
 *     summary: Cambiar contraseña
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
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       401:
 *         description: Contraseña actual incorrecta
 */
router.put('/password', authMiddleware, validate(changePasswordSchema), updatePassword);
/**
 * @swagger
 * /api/user/invite:
 *   post:
 *     summary: Invitar usuario a la compañía
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario invitado correctamente
 *       409:
 *         description: Email ya registrado
 */
router.post('/invite', authMiddleware, inviteUser);

export default router;