const express = require('express');
const PredictionHistory = require('../models/PredictionHistory');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/history
// Save a prediction to user's history
// ─────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { symptoms, predictedDisease, description, precautions, medications, diets, workouts } = req.body;

    if (!symptoms || !predictedDisease) {
      return res.status(400).json({ message: 'Symptoms and predicted disease are required.' });
    }

    const record = new PredictionHistory({
      userId: req.session.userId,
      symptoms: Array.isArray(symptoms) ? symptoms : symptoms.split(',').map(s => s.trim()),
      predictedDisease,
      description: description || '',
      precautions: precautions || [],
      medications: medications || [],
      diets: diets || [],
      workouts: workouts || [],
    });

    await record.save();

    res.status(201).json({ message: 'Prediction saved to history.', record });
  } catch (error) {
    console.error('Save history error:', error);
    res.status(500).json({ message: 'Failed to save prediction history.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/history
// Get current user's prediction history
// ─────────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const records = await PredictionHistory.find({ userId: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ records });
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ message: 'Failed to fetch prediction history.' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/history/:id
// Delete a specific prediction record
// ─────────────────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const record = await PredictionHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    res.json({ message: 'Record deleted.' });
  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ message: 'Failed to delete record.' });
  }
});

module.exports = router;
