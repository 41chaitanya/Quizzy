import {Router} from 'express';
import QuizRoutes from './quiz.routes.js';

const IndexRoutes = Router();

IndexRoutes.use('/quizzes', QuizRoutes);

export default IndexRoutes;