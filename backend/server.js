require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
const setupFlaskProxy = require('./routes/flask');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ──────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// ─── Session ────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'medai-dev-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60, // 7 days
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: 'lax',
  },
}));

// ─── Routes ─────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);

// ─── Flask Proxy ────────────────────────────
setupFlaskProxy(app);

// ─── Health Check ───────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ─── Error Handler ──────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// ─── Database & Server Start ────────────────
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not set in .env file');
      console.log('   Copy .env.example to .env and fill in your MongoDB connection string');
      process.exit(1);
    }

    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`\n🚀 MedAI Backend running on http://localhost:${PORT}`);
      console.log(`   Auth API:    http://localhost:${PORT}/api/auth`);
      console.log(`   Flask Proxy: http://localhost:${PORT}/api/flask`);
      console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
