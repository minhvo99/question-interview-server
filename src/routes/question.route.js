import express from 'express';
import {
  getQuestions,
  getQuestionById,
  updateQuestion,
  createQuestion,
  deleteQuestion,
} from '../controllers/Question.controller.js';

const questionRoute = express.Router();

questionRoute.route('/:collection').get(getQuestions).post(createQuestion);
questionRoute
  .route('/:collection/:id')
  .get(getQuestionById)
  .patch(updateQuestion)
  .delete(deleteQuestion);

export default questionRoute;
