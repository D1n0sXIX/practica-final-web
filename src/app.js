import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import errorHandler from './middleware/error-Handler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
// TODO: aquí conectaremos las rutas
app.use(errorHandler);


export default app;