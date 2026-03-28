# MedAI - AI-Powered Healthcare Web App

MedAI is a comprehensive, modern healthcare platform that provides AI-driven symptom checking, personalized medical recommendations, and doctors' discovery based on user symptoms and location.

![MedAI Banner](https://via.placeholder.com/1200x600.png?text=MedAI+-+AI+Powered+Healthcare)

## 📌 Features

- **AI Symptom Checker**: Enter descriptions of your symptoms, and the underlying AI model (SVM) will predict potential diseases and suggest precautions, medications, diets, and exercise routines.
- **Find a Doctor**: Geolocation-based doctor and hospital search matching your predicted disease to specialized medical professionals near you.
- **Secure User Profiles**: JWT/Session-based authentication system with OTP verification. Manage your clinical profile (vital metrics, allergies, chronic conditions).
- **Health History Tracking**: Saves history of all your symptom analyses for future reference.
- **Modern UI**: Smooth Framer Motion animations, glassmorphic design, and highly responsive elements using Tailwind CSS.

## 🛠 Tech Stack

The platform is divided into three main components:

1. **Frontend (React)**
   - Vite + React.js
   - Tailwind CSS for styling
   - Framer Motion for smooth animations
   - React Router for seamless navigation

2. **Backend (Node.js)**
   - Express.js server
   - MongoDB + Mongoose for database management
   - express-session & connect-mongo for session management
   - Nodemailer for OTP-based authentication

3. **ML Service (Python Flask)**
   - Flask API server
   - Scikit-Learn (Support Vector Machine model) for disease prediction
   - Pandas & Numpy for data processing
   - Geopy for calculating nearest hospitals

## 🚀 Getting Started

To run this project locally, you will need to start all three servers individually.

### Prerequisites
- Node.js (v18+ recommended)
- Python (3.9+ recommended)
- MongoDB account (Atlas cluster or local DB)

### 1. Setup the Node.js Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
PORT=4000
FLASK_URL=http://localhost:5000

# Google OAuth (For Nodemailer)
EMAIL_USER=your_email@gmail.com
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REFRESH_TOKEN=your_refresh_token
```

Start the backend server:
```bash
npm run dev
```

### 2. Setup the Python Flask Service

```bash
cd flask_app
pip install -r requirements.txt
```

If you haven't generated the `.pkl` ML models yet, first run the training script:
```bash
cd models
python train_and_export.py
cd ..
```

Start the Flask application:
```bash
python flask_app/app.py
```

### 3. Setup the Frontend

```bash
cd frontend/MedAI
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Your frontend should now be running on `http://localhost:5173`!

## 📂 Project Structure

```text
├── backend/            # Express Node API (Auth, History, Proxy to Flask)
├── flask_app/          # Python AI microservice for SVC Model
├── frontend/           # React + Vite Client Application
│   └── MedAI/
├── models/             # ML Jupyter Notebook scripts & Training exporter
│   └── saved/          # Scikit-learn exported .pkl files
├── roots/              # CSV Datasets for training and disease mapping
└── README.md
```

## 🤝 Contributing
Contributions, issues and feature requests are welcome!

## 📝 License
This project is open-source and available under the MIT License.
