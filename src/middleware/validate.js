import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        const errors = result.error.issues.map(err => ({
            field: err.path.join('.') || 'general',
            message: err.message
        }))
        return next(AppError.validation('Error de validación', errors))
    }
    next();
};