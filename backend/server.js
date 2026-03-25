require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Proxy ML requests
app.post('/api/medical/predict', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5000/predict', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: 'ML Service unavailable' });
    }
});

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-medical')
    .then(() => {
        console.log("Connected to MongoDB.");
        app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));
    })
    .catch((err) => console.log("DB Connection Error:", err));
