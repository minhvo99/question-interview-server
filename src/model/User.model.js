import mongoose, { Query, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    passWordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        //this only works on CREATE and SAVE !!!
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords are not the match',
      },
    },
    passWordChangeAt: Date,
    role: {
      type: String,
      enum: ['guest', 'admin'],
      default: 'guest',
    },
    passWordResetToken: String,
    passWordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passWordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passWordChangeAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JTWTimestamp) {
  if (this.passWordChangeAt) {
    const changeTimestamp = this.passWordChangeAt.getTime() / 1000;
    return JTWTimestamp < changeTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passWordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passWordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
