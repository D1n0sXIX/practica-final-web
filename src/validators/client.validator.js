import { z } from 'zod'

export const createClientSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    cif: z.string().min(1, 'El CIF es requerido'),
    email: z.string().email('Email no válido').optional(),
    phone: z.string().optional(),
    address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        postal: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional()
    }).optional()
})

export const updateClientSchema = z.object({
    name: z.string().min(1).optional(),
    cif: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        postal: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional()
    }).optional()
})