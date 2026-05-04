import User from '../models/User.js'
import Company from '../models/Company.js'
import Client from '../models/Client.js'
import Project from '../models/Project.js'
import { AppError } from '../utils/AppError.js'

export const createProject = async (req, res, next) => {
    try {
        const { userId } = req.user
        // Comprobamos que el client del body existe y pertenece a la misma company
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
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const projects = await Project.find({
            company: user.company._id,
            deleted: false
        })
        res.status(200).json({
            status: 'success',
            data: projects
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

        await Project.findByIdAndUpdate(req.params.id, { deleted: true })
        res.status(204).json({
            status: 'success',
            data: null
        })
    }   catch (error) {
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