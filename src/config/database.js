import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log(' Conectado a MongoDB')
    } catch (error) {
        console.error('Error conectandose a MongoDB: ', error)
        process.exit(1)
    }
}