import {Router} from 'express';
import AuthRoutes from './auth.routes.js';

const IndexRoutes = Router();

IndexRoutes.use('/auth', AuthRoutes);

export default IndexRoutes;