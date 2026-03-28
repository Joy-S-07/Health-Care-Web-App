const mongoose = require('mongoose');

const predictionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  symptoms: {
    type: [String],
    required: true,
  },
  predictedDisease: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  precautions: {
    type: [String],
    default: [],
  },
  medications: {
    type: [String],
    default: [],
  },
  diets: {
    type: [String],
    default: [],
  },
  workouts: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('PredictionHistory', predictionHistorySchema);
