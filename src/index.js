import app from "./app.js";
import { connectDB } from "./config/database.js";

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        console.log('Conexión exitosa a MongoDB');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};
startServer();  
