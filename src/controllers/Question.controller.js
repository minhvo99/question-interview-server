import { getQuestionModel } from '../model/Question.model.js';
import AppError from '../utils/appError.js';

export const getQuestions = async (req, res, next) => {
  try {
    const collectionName = req.params.collection;
    const limit = 10;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;
    if (!collectionName) {
      return next(new AppError('Please provide collection name!', 404));
    }
    const Question = getQuestionModel(collectionName);
    const data = await Question.find().skip(skip).limit(limit);
    const total = await Question.countDocuments();
    if (!data) {
      return next(new AppError('Can not find question', 404));
    }
    return res.json({
      message: 'Successfully',
      data,
      page,
      limit,
      total,
    });
  } catch (error) {
    next(error);
  }
};
export const getQuestionById = async (req, res, next) => {
  try {
    const collectionName = req.params.collection;
    const id = req.params.id;
    if (!collectionName) {
      return next(new AppError('Please provide collection name!', 404));
    }
    if (!id) {
      return next(new AppError(`Can not found question with id ${id}!`, 404));
    }
    const Question = getQuestionModel(collectionName);
    const data = await Question.findById(id);
    return res.json({
      message: 'Successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
