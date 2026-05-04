import { createServer } from 'node:http'
import app from "./app.js";
import { connectDB } from "./config/database.js";
import { authMiddleware } from './middleware/auth.middleware.js'
import { initSocket } from './config/socket.js'

const PORT = process.env.PORT;
const httpServer = createServer(app)
const io = initSocket(httpServer)

io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('No autorizado'))
    try {
        const req = { headers: { authorization: `Bearer ${token}` } }
        const res = {}
        authMiddleware(req, res, (err) => {
            if (err) return next(new Error('Token inválido'))
            socket.user = req.user
            next()
        })
    } catch {
        next(new Error('Token inválido'))
    }
})

io.on('connection', (socket) => {
    const { userId } = socket.user
    console.log(`Usuario conectado: ${userId}`)
    
    socket.on('join:company', (companyId) => {
        socket.join(companyId)
    })

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${userId}`)
    })
})

const startServer = async () => {
    try {
        await connectDB()
        console.log('Conexión exitosa a MongoDB');
        httpServer.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};
startServer();