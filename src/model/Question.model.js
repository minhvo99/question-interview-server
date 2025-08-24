import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema(
  {
    // Id: ObjectId,
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

questionSchema.pre('save', function (next) {
  this.URL = slugify(this.Title, { lower: true });
  this.updatedAt = Date.now();
  next();
});
export function getQuestionModel(collectionName) {
  if (mongoose.models[collectionName]) {
    return mongoose.model(collectionName);
  }
  return mongoose.model(collectionName, questionSchema, collectionName);
}
