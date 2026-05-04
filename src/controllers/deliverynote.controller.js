import User from '../models/User.js'
import Company from '../models/Company.js'
import Client from '../models/Client.js'
import Project from '../models/Project.js'
import DeliveryNote from '../models/DeliveryNote.js'
import { AppError } from '../utils/AppError.js'
import { getIO } from '../config/socket.js'
import { generatePDF } from '../services/pdf.service.js'
import { uploadImage } from '../services/storage.service.js'


export const createDeliveryNote = async (req, res, next) => {
    try {
        const { userId } = req.user
        // hayque verificar que el project del body existe y pertenece a la misma company
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const project = await Project.findOne({
            _id: req.body.project,
            company: user.company._id,
            deleted: false
        })
        if (!project) {
            throw new AppError('Project not found', 404)
        }
        const deliveryNote = await DeliveryNote.create({
            ...req.body,
            user: userId,
            company: user.company._id,
            client: project.client
        })
        getIO().to(user.company._id.toString()).emit('deliverynote:new', deliveryNote)
        res.status(201).json({
            status: 'success',
            data: deliveryNote
        })
    } catch (error) {
        next(error)
    }
}
export const getDeliveryNotes = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const deliveryNotes = await DeliveryNote.find({
            company: user.company._id,
            deleted: false
        })
        res.status(200).json({
            status: 'success',
            data: deliveryNotes
        })
    } catch (error) {
        next(error)
    }
}

export const getDeliveryNote = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const deliveryNote = await DeliveryNote.findOne({
            _id: req.params.id,
            company: user.company._id,
            deleted: false
        })
        if (!deliveryNote) {
            throw new AppError('Delivery note not found', 404)
        }
        res.status(200).json({
            status: 'success',
            data: deliveryNote
        })
    }   catch (error) {
        next(error)
    }
}
export const deleteDeliveryNote = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const deliveryNote = await DeliveryNote.findOne({
            _id: req.params.id,
            company: user.company._id,
            deleted: false
        })
        if (!deliveryNote) {
            throw new AppError('Delivery note not found', 404)
        }
        if (deliveryNote.signed) {
            return next(AppError.badRequest('No se puede borrar un albarán firmado'))
        }
        
        deliveryNote.deleted = true
        await deliveryNote.save()
        res.status(204).json({
            status: 'success',
            data: null
        })
    }   catch (error) {
        next(error)
    }
}

export const signDeliveryNote = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const deliveryNote = await DeliveryNote.findOne({
            _id: req.params.id,
            company: user.company._id,
            deleted: false
        })  
        if (!deliveryNote) {
            throw new AppError('Delivery note not found', 404)
        }
        if (!req.file) {
            return next(AppError.badRequest('Se requiere imagen de firma'))
        }

        const result = await uploadImage(req.file.path)
        deliveryNote.signatureUrl = result.secure_url
        deliveryNote.signed = true
        deliveryNote.signedAt = new Date()
        deliveryNote.signed = true
        await deliveryNote.save()
        getIO().to(user.company._id.toString()).emit('deliverynote:signed', deliveryNote)
        res.status(200).json({
            status: 'success',
            data: deliveryNote
        })
    }   catch (error) {
        next(error)
    }
}

export const getDeliveryNotePDF = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) return next(AppError.notFound('Usuario'))
        
        const deliveryNote = await DeliveryNote.findOne({
            _id: req.params.id,
            company: user.company._id,
            deleted: false
        }).populate('user client project')
        
        if (!deliveryNote) return next(AppError.notFound('Albarán'))

        const pdfBuffer = await generatePDF(deliveryNote)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename=albaran-${deliveryNote._id}.pdf`)
        res.send(pdfBuffer)
    } catch (error) {
        next(error)
    }
}