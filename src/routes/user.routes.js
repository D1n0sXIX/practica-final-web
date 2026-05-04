import { Router } from 'express';
import { register , verifyEmail, login, updatePersonalData, updateCompany, updateLogo, getUser, refreshToken, logout, deleteUser, inviteUser, updatePassword} from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, verificationSchema , loginSchema, personalDataSchema, companySchema, changePasswordSchema} from '../validators/user.validator.js'
import { authMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';
import { requieredRole } from '../middleware/role.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), register);

router.put('/validation', authMiddleware, validate(verificationSchema), verifyEmail);

router.post('/login', validate(loginSchema), login);

router.put('/register', authMiddleware, validate(personalDataSchema), updatePersonalData);

router.patch('/company', authMiddleware, validate(companySchema), updateCompany);

router.patch('/logo', authMiddleware, upload.single('logo'), updateLogo);


router.get('/', authMiddleware, getUser);

router.post('/refresh', refreshToken);

router.post('/logout', authMiddleware, logout);

router.delete('/', authMiddleware, deleteUser);

router.put('/password', authMiddleware, validate(changePasswordSchema), updatePassword);

router.post('/invite', authMiddleware, requieredRole('admin'), inviteUser);

export default router;