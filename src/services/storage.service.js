import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImage = (filePath) => {
    if (process.env.NODE_ENV === 'test') {
        return Promise.resolve({ secure_url: 'https://cloudinary.com/test.png' })
    }
    return cloudinary.uploader.upload(filePath, {
        folder: 'bildyapp/signatures'
    })
}

export const uploadPDF = (filePath) => {
    return cloudinary.uploader.upload(filePath, {
        folder: 'bildyapp/pdfs',
        resource_type: 'raw'
    })
}

export const deleteFile = (publicId) => {
    return cloudinary.uploader.destroy(publicId)
}