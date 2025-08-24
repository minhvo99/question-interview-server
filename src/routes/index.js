import express from 'express';
import authRoute from './auth.route.js';
import questionRoute from './question.route.js';

const appRouter = express.Router();

appRouter.use('', authRoute);
appRouter.use('/questions', questionRoute);

export default appRouter;
