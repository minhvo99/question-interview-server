import { getQuestionModel } from '../model/Question.model.js';
import AppError from '../utils/appError.js';

export const getQuestions = async (req, res, next) => {
  try {
    const collectionName = req.params.collection;
    const limit = 10;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;
    if (!collectionName) {
      return next(new AppError('Please provide collection name!', 400));
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
export const updateQuestion = async (req, res, next) => {
  try {
    const collectionName = req.params.collection;
    const body = Object.keys(req.body);
    const allowedFields = ['Title', 'Description', 'Level'];
    if (!collectionName) {
      return next(new AppError('Please provide collection name!', 404));
    }
    if (body.length === 0) {
      return next(new AppError(`Question to update can not be empty!`, 400));
    }
    const invalidFields = body.filter(
      (field) => !allowedFields.includes(field),
    );
    if (invalidFields.length > 0) {
      return next(
        new AppError(
          `Invalid field(s): ${invalidFields.join(
            ', ',
          )}. Only [${allowedFields.join(', ')}] are allowed.`,
          400,
        ),
      );
    }

    const Question = getQuestionModel(collectionName);
    const docs = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!docs) {
      return next(new AppError(`Question not found`, 404));
    }
    res.status(200).json({
      message: `Update Question successfully!`,
      data: docs,
    });
  } catch (error) {
    next(error);
  }
};
export const createQuestion = async (req, res, next) => {
  try {
    const collectionName = req.params.collection;
    const body = Object.keys(req.body);
    if (!collectionName) {
      return next(new AppError('Please provide collection name!', 404));
    }
    if (body.length === 0) {
      return next(new AppError(`Question to create can not be empty!`, 400));
    }
    const Question = getQuestionModel(collectionName);
    const newTour = await Question.create(req.body);
    res.status(201).json({
      message: `Create a new question successfully!`,
      data: newTour,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return next(new AppError('Please provide id', 400));
    }
    const collectionName = req.params.collection;
    if (!collectionName) {
      return next(new AppError('Please provide collection name!', 404));
    }
    const Question = getQuestionModel(collectionName);
    const result = await Question.findByIdAndDelete(id);
    if (!result) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      messgage: `Question deleted successfully!`,
    });
  } catch (error) {
    next(error);
  }
};
