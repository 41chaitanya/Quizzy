import {Router} from 'express';
import QuestionRoutes from './question.routes.js';

const IndexRoutes = Router();

IndexRoutes.use('/questions', QuestionRoutes);

export default IndexRoutes;