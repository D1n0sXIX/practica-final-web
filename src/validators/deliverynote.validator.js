import { z } from 'zod'

export const createDeliveryNoteSchema = z.object({
    project: z.string().min(1, 'El proyecto es requerido'),
    format: z.enum(['material', 'hours']),
    description: z.string().optional(),
    workDate: z.string().or(z.date()).optional(),
    material: z.string().optional(),
    quantity: z.number().optional(),
    unit: z.string().optional(),
    hours: z.number().optional(),
    workers: z.array(z.object({
        name: z.string(),
        hours: z.number()
    })).optional()
})