import {Router} from 'express';
import AuthRoutes from './auth.route.js';

const IndexRoutes = Router();

IndexRoutes.use('/auth', AuthRoutes);

export default IndexRoutes;