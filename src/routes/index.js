import { Router } from 'express';
import userRoutes from './user.routes.js';
import clientRoutes from './client.routes.js';
import projectRoutes from './project.routes.js';
import deliveryNotesRoutes from './deliverynote.routes.js'


const routes = Router();

routes.use('/user', userRoutes);
routes.use('/client', clientRoutes);
routes.use('/project', projectRoutes);
routes.use('/deliverynote', deliveryNotesRoutes);

export default routes;

