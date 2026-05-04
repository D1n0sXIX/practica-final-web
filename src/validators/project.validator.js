import { z } from 'zod'

export const createProjectSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    projectCode: z.string().min(1, 'El código es requerido'),
    client: z.string().min(1, 'El cliente es requerido'),
    address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        postal: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional()
    }).optional(),
    notes: z.string().optional()
})

export const updateProjectSchema = z.object({
    name: z.string().min(1).optional(),
    projectCode: z.string().min(1).optional(),
    client: z.string().min(1).optional(),
    address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        postal: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional()
    }).optional(),
    notes: z.string().optional()
})