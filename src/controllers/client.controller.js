import User from '../models/User.js'
import Company from '../models/Company.js'
import Client from '../models/Client.js'
import { AppError } from '../utils/AppError.js'

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
            throw new AppError('Client with same CIF already exists', 400)
        }
        const client = new Client({
            ...req.body,
            user: userId,
            company: user.company._id
        })
        await client.save()
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
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const clients = await Client.find({
            company: user.company._id,
            deleted: false
        })
        res.status(200).json({
            status: 'success',
            data: clients
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