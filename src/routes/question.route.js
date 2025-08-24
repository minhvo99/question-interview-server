import express from 'express';
import {
  getQuestions,
  getQuestionById,
} from '../controllers/Question.controller.js';

const questionRoute = express.Router();

questionRoute.get('/:collection', getQuestions);
questionRoute.get('/:collection/:id', getQuestionById);

export default questionRoute;
