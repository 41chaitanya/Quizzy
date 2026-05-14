import {Router} from 'express';
import AuthRoutes from './auth.route.js';

const IndexRoutes = Router();

IndexRoutes.use('/v1/auth', AuthRoutes);

export default IndexRoutes;