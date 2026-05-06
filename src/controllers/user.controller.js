import User from '../models/User.js';
import bcrypt  from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import notificationService from '../services/notification.service.js';
import Company from '../models/Company.js'

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(AppError.conflict('Email ya registrado'));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const user = new User({ email, password: hashedPassword, verificationCode , verificationAttempts : 3});

        await user.save();
        notificationService.emit('user:registered', user);

        const accessToken = jsonwebtoken.sign({ userId: user._id, role: user.role }, config.accessTokenSecret, { expiresIn: config.accessTokenExpiration });
        const refreshToken = jsonwebtoken.sign({ userId: user._id, role: user.role }, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiration });

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                status: user.status,
                role: user.role
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        next(error);
    }

};

export const verifyEmail = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { code } = req.body;

        const user = await User.findById(userId);
        
        if (!user) {
            return next(AppError.notFound('Usuario no encontrado'));
        }
        if (user.verificationAttempts <= 0) {
            return next(AppError.tooManyRequests());
        }
        if (code !== user.verificationCode) {
            user.verificationAttempts -= 1;
            await user.save();
            return next(AppError.badRequest('Código incorrecto. Intentos restantes: ' + user.verificationAttempts));
        }
        
        if (code == user.verificationCode) {
            user.status = 'verified';
            await user.save();
            notificationService.emit('user:verified', user);
            return res.json({ message: 'Email verificado correctamente' });
        }
        
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return next(AppError.notFound('Credencial'));
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return next(AppError.unauthorized('Contraseña incorrecta'));
        }

        const accessToken = jsonwebtoken.sign({ userId: existingUser._id, role: existingUser.role }, config.accessTokenSecret, { expiresIn: config.accessTokenExpiration });
        const refreshToken = jsonwebtoken.sign({ userId: existingUser._id, role: existingUser.role }, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiration });

        notificationService.emit('user:login', existingUser);

        res.status(200).json({
            user: {
                id: existingUser._id,
                email: existingUser.email,
                status: existingUser.status,
                role: existingUser.role
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        next(error);
    }

};

export const updatePersonalData = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { name, lastName, nif } = req.body;

        const user = await User.findByIdAndUpdate(userId, { name, lastName, nif }, { returnDocument: 'after' });
        if (!user) {
            return next(AppError.notFound('Usuario'));
        }
        notificationService.emit('user:updated', user);

        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                nif: user.nif,
                status: user.status,
            }
        });

        

    }    catch (error) {
        next(error);
    }
};

export const updateCompany = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { cif, name, address, isFreelance } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return next(AppError.notFound('Usuario'));
        }
        if (isFreelance) {
            let company = await Company.findOne({ cif: user.nif })
            if (!company) {
                company = new Company({ 
                    owner: userId, 
                    name: user.name, 
                    cif: user.nif, 
                    address: user.address, 
                    isFreelance: true 
                })
                await company.save()
            }
            user.company = company._id
            await user.save()
        }
        else {
            let company = await Company.findOne({ cif })
            if (!company) {
                company = new Company({ owner: userId, name, cif, address })
                await company.save()
            } else {
                user.role = 'guest'
            }
            user.company = company._id
            await user.save()
        }
        
        notificationService.emit('user:updated', user);
        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                company: user.company
            }
        });

    } catch (error) {
        next(error);
    }
};

export const updateLogo = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId).populate('company');

        if (!user) {
            return next(AppError.notFound('Usuario'));
        }
        if (!user.company) {
            return next(AppError.notFound('Empresa'));
        }
        if (!req.file) {
            return next(AppError.notFound('Imagen'));
        }
        user.company.logo = req.file.path;
        await user.company.save();

        notificationService.emit('user:updated', user);
        res.json({
            logo: user.company.logo
        });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId).populate('company');
        if (!user) {
            return next(AppError.notFound('Usuario'));
        }
        notificationService.emit('user:fetched', user);
        res.json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                nif: user.nif,
                role: user.role,
                status: user.status,
                company: user.company
            }
        });
    }    catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const payload = jsonwebtoken.verify(refreshToken, config.refreshTokenSecret);

        const accessToken = jsonwebtoken.sign({ userId: payload.userId, role: payload.role }, config.accessTokenSecret, { expiresIn: config.accessTokenExpiration });
        const newRefreshToken = jsonwebtoken.sign({ userId: payload.userId, role: payload.role }, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiration });

        res.json({ accessToken, refreshToken: newRefreshToken });
    }   catch (error) {
        next(AppError.unauthorized('Refresh token inválido'));
    }
};

export const logout = async (req, res, next) => {
    try {
        notificationService.emit('user:logout', req.user)
        res.json({ message: 'Sesión cerrada correctamente' })
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { soft } = req.query;
        if (soft === 'true') {
            const user = await User.findByIdAndUpdate(userId, { deleted: true }, { returnDocument: 'after' });
            if (!user) {
                return next(AppError.notFound('Usuario'));
            }
            notificationService.emit('user:deleted', user);
            res.json({ message: 'Usuario eliminado correctamente' });
        } else {
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return next(AppError.notFound('Usuario'));
            }
            notificationService.emit('user:deleted', user);
            res.json({ message: 'Usuario eliminado correctamente' });
        }
    } catch (error) {
        next(error);
    }
};

export const inviteUser = async (req, res, next) => {
    try {
        const { userId, role } = req.user;
        const admin = await User.findById(userId)

        if (role !== 'admin') {
            return next(AppError.forbidden('Acceso prohibido'));
        }

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(AppError.conflict('Email ya registrado'));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role: 'guest', status: 'verified', company: admin.company, verificationCode: '000000' });
        
        await user.save();
        notificationService.emit('user:invited', user);
        
        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                company: user.company
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updatePassword = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return next(AppError.notFound('Usuario'));
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return next(AppError.unauthorized('Contraseña actual incorrecta'));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        notificationService.emit('user:updated', user);
        res.json({ message: 'Contraseña actualizada correctamente' });
    }
    catch (error) {
        next(error);
    }
};  