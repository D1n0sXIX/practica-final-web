import jsonwebtoken from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { config } from '../config/index.js';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return next(AppError.unauthorized('Token de acceso no proporcionado'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(AppError.unauthorized('Token de acceso invalido'));
    }

    try {
        const decoded = jsonwebtoken.verify(token, config.accessTokenSecret);
        req.user = decoded;
        next();
    } catch (err) {
        return next(AppError.unauthorized('Token de acceso invalido'));
    }
};