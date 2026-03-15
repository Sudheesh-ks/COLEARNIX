import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { userTypes } from '../types/user';

export interface userDocument extends Omit<userTypes, '_id'>, Document {
  _id: Types.ObjectId;
}

const userSchema: Schema<userDocument> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  googleId: {
    type: String,
  },

  image: {
    type: String,
  },

  gender: {
    type: String,
  },

  dob: {
    type: String,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const userModel: Model<userDocument> = mongoose.model<userDocument>('user', userSchema);

export default userModel;
