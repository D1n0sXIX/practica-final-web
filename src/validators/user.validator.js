import { z } from 'zod'

export const registerSchema = z.object({
    email: z.string().email().transform((val) => val.toLowerCase()),
    password: z.string().min(8),
})

export const loginSchema = z.object({
    email: z.string().email().transform((val) => val.toLowerCase()),
    password: z.string().min(8),
}) 

export const verificationSchema = z.object({
    code: z.string().length(6),
})

export const personalDataSchema = z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    nif: z.string().min(1),
})

export const companySchema = z.object({
    name: z.string().min(1),
    cif: z.string().min(1),
    isFreelance: z.boolean(),
    address: z.object({
        street: z.string().min(1),
        number: z.string().min(1),
        postal: z.string().min(1),
        city: z.string().min(1),
        province: z.string().min(1),
    }),
})

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
}).refine((data) => data.currentPassword !== data.newPassword, { 
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['newPassword']
})