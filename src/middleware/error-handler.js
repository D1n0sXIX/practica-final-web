import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
    if (!err.isOperational) {
        console.error('Error no manejado:', err);
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            code: err.code,
            ...(err.details && { details: err.details })
        });
    }
    console.error('Error no manejado:', err);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
};