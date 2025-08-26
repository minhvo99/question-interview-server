import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

const questionSchema = new Schema(
  {
    Title: {
      type: String,
      required: [true, 'title is required!'],
    },
    Description: {
      type: String,
      required: [true, 'description is required!'],
    },
    Level: {
      type: String,
      enum: {
        values: ['BAS', 'JUN', 'MID', 'SEN'],
        message: 'Level  is either: basic, junior, middle or senior',
      },
      required: [true, 'level is required!'],
    },
    URL: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// questionSchema.pre('save', function (next) {
//   this.URL = slugify(this.Title, { lower: true });
//   this.updatedAt = Date.now();
//   console.log('middleware is runnig');
//   next();
// });
questionSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  if (this.getUpdate().Title) {
    this.set({ URL: slugify(this.getUpdate().Title, { lower: true }) });
  }
  next();
});

export function getQuestionModel(collectionName) {
  if (mongoose.models[collectionName]) {
    return mongoose.model(collectionName);
  }
  return mongoose.model(collectionName, questionSchema, collectionName);
}
