import User from '../models/User.js'
import Company from '../models/Company.js'
import Client from '../models/Client.js'
import { AppError } from '../utils/AppError.js'
import { getIO } from '../config/socket.js'


export const createClient = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const existingClient = await Client.findOne({
            cif: req.body.cif,
            company: user.company._id
        })
        if (existingClient) {
            return next(AppError.conflict('Ya existe un cliente con ese CIF'))
        }
        const client = new Client({
            ...req.body,
            user: userId,
            company: user.company._id
        })
        await client.save()
        getIO().to(user.company._id.toString()).emit('client:new', client)
        res.status(201).json({
            status: 'success',
            data: client
        })
    } catch (error) {
        next(error)
    }
}

export const getClients = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) return next(AppError.notFound('Usuario'))

        // 1. Extraer query params
        const { page = 1, limit = 10, name, sort = 'createdAt' } = req.query

        // 2. Construir filtro
        const filter = {
            company: user.company._id,
            deleted: false
        }
        if (name) filter.name = { $regex: name, $options: 'i' }

        // 3. Paginar
        const skip = (page - 1) * limit
        const totalItems = await Client.countDocuments(filter)
        const totalPages = Math.ceil(totalItems / limit)

        const clients = await Client.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json({
            status: 'success',
            data: clients,
            pagination: {
                totalItems,
                totalPages,
                currentPage: Number(page)
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getClient = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const client = await Client.findOne({
            _id: req.params.id,
            company: user.company._id,
            deleted: false
        })
        if (!client) {
            throw new AppError('Client not found', 404)
        }
        res.status(200).json({
            status: 'success',
            data: client
        })
    }   catch (error) {
        next(error)
    }
}

export const updateClient = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const client = await Client.findOneAndUpdate(
            {
                _id: req.params.id,
                company: user.company._id,
                deleted: false
            },
            req.body,
            { returnDocument: 'after' }
        )
        if (!client) {
            throw new AppError('Client not found', 404)
        }   
        res.status(200).json({
            status: 'success',
            data: client
        })
    } catch (error) {
        next(error)
    }  
}

export const deleteClient = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const client = await Client.findOneAndUpdate(
            {
                _id: req.params.id,
                company: user.company._id,
                deleted: false
            },
            { deleted: true },
            { returnDocument: 'after' }
        )
        if (!client) {
            throw new AppError('Client not found', 404)
        }
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        next(error)
    }  
}

export const getArchivedClients = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const clients = await Client.find({ 
            company: user.company._id,
            deleted: true
        })
        res.status(200).json({
            status: 'success',
            data: clients
        })
    } catch (error) {
        next(error)
    }
}

export const restoreClient = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const client = await Client.findOneAndUpdate(
            {
                _id: req.params.id,
                company: user.company._id,
                deleted: true
            },
            { deleted: false }, 
            { returnDocument: 'after' }
        )
        if (!client) {
            throw new AppError('Client not found', 404)
        }
        res.status(200).json({
            status: 'success',
            data: client
        })
    } catch (error) {
        next(error)
    }
}