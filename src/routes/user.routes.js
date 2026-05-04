import { Router } from 'express';
import { register, verifyEmail, login, updatePersonalData, updateCompany, updateLogo, getUser } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, verificationSchema, loginSchema, personalDataSchema, companySchema } from '../validators/user.validator.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.put('/validation', authMiddleware, validate(verificationSchema), verifyEmail);
router.post('/login', validate(loginSchema), login);
router.put('/register', authMiddleware, validate(personalDataSchema), updatePersonalData);
router.patch('/company', authMiddleware, validate(companySchema), updateCompany);
router.patch('/logo', authMiddleware, upload.single('logo'), updateLogo);
router.get('/', authMiddleware, getUser);

// Por : implementar
// router.post('/refresh', refreshToken);
// router.post('/logout', authMiddleware, logout);
// router.delete('/', authMiddleware, deleteUser);
// router.put('/password', authMiddleware, validate(changePasswordSchema), updatePassword);
// router.post('/invite', authMiddleware, inviteUser);

export default router;