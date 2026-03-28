const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
  },
  age: {
    type: Number,
    default: null,
  },
  gender: {
    type: String,
    default: '',
  },
  bloodGroup: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '',
  },
  weight: {
    type: String,
    default: '',
  },
  allergies: {
    type: [String],
    default: [],
  },
  conditions: {
    type: [String],
    default: [],
  },
  profileImage: {
    type: String,
    default: '',
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('User', userSchema);
