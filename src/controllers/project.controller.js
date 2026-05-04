import User from '../models/User.js'
import Company from '../models/Company.js'
import Client from '../models/Client.js'
import Project from '../models/Project.js'
import { AppError } from '../utils/AppError.js'
import { getIO } from '../config/socket.js'

export const createProject = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const client = await Client.findOne({
            _id: req.body.client,
            company: user.company._id,
            deleted: false
        })
        if (!client) {
            throw new AppError('Client not found', 404)
        }
        const project = await Project.create({
            ...req.body,
            user: userId,
            company: user.company._id
        })
        getIO().to(user.company._id.toString()).emit('project:new', project)
        res.status(201).json({
            status: 'success',
            data: project
        })
    } catch (error) {
        next(error)
    }
}
export const getProjects = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) return next(AppError.notFound('Usuario'))

        const { page = 1, limit = 10, name, client, active, sort = 'createdAt' } = req.query

        const filter = {
            company: user.company._id,
            deleted: false
        }
        if (name) filter.name = { $regex: name, $options: 'i' }
        if (client) filter.client = client
        if (active !== undefined) filter.active = active === 'true'

        const skip = (page - 1) * limit
        const totalItems = await Project.countDocuments(filter)
        const totalPages = Math.ceil(totalItems / limit)

        const projects = await Project.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json({
            status: 'success',
            data: projects,
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

    export const getProject = async (req, res, next) => {
        try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const project = await Project.findOne({
            _id: req.params.id,
            company: user.company._id,
            deleted: false
        })
        if (!project) {
            throw new AppError('Project not found', 404)
        }
        res.status(200).json({
            status: 'success',
            data: project
        })
    }   catch (error) {
        next(error)
    }
}

export const updateProject = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const project = await Project.findOne({
            _id: req.params.id,
            company: user.company._id,
            deleted: false
        })
        if (!project) {
            throw new AppError('Project not found', 404)
        }
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: updatedProject
        })
    }   catch (error) {
        next(error)
    }
}

export const deleteProject = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            return next(AppError.notFound('Usuario'))
        }
        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                company: user.company._id,
                deleted: false
            },
            { deleted: true },
            { returnDocument: 'after' }
        )
        if (!project) {
            return next(AppError.notFound('Project'))
        }
        res.status(204).json({ status: 'success', data: null })
    } catch (error) {
        next(error)
    }
}

export const getArchivedProjects = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const projects = await Project.find({
            company: user.company._id,
            deleted: true
        })
        res.status(200).json({
            status: 'success',
            data: projects
        })
    } catch (error) {
        next(error)
    }      
}

export const restoreProject = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await User.findById(userId).populate('company')
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const project = await Project.findOneAndUpdate(
            {   _id: req.params.id,
                company: user.company._id,
                deleted: true},
            { deleted: false },
            { returnDocument: 'after' }
            )
        if (!project) {
            return next(AppError.notFound('Project'))
        }
        res.status(200).json({
            status: 'success',
            data: project
        })
    } catch (error) {
        next(error)
    }
}