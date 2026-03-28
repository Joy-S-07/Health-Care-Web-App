"""
MedAI Flask Backend — ML Prediction Service
Loads pre-trained .pkl models and serves predictions via REST API.
"""

import os
import ast
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.distance import geodesic

app = Flask(__name__)
CORS(app)

# ─── Paths ───────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '..', 'roots')
MODEL_DIR = os.path.join(BASE_DIR, '..', 'models', 'saved')

# ─── Global Model State ─────────────────────────
svc_model = None
label_encoder = None
symptoms_dict = {}
diseases_dict = {}

# Diabetes & Parkinsons
diabetes_model = None
diabetes_scaler = None
parkinsons_model = None
parkinsons_scaler = None

description_df = None
precautions_df = None
medications_df = None
diets_df = None
workout_df = None
hospital_df = None


def load_models():
    """Load pre-trained .pkl models and CSV reference data."""
    global svc_model, label_encoder, symptoms_dict, diseases_dict
    global diabetes_model, diabetes_scaler, parkinsons_model, parkinsons_scaler
    global description_df, precautions_df, medications_df, diets_df, workout_df, hospital_df

    print("⏳ Loading pre-trained models from .pkl files...")

    # ── Load .pkl models ──
    svc_model = pickle.load(open(os.path.join(MODEL_DIR, 'svc.pkl'), 'rb'))
    # No label_encoder.pkl used directly anymore, relying purely on notebook dictionaries
    symptoms_dict = pickle.load(open(os.path.join(MODEL_DIR, 'symptoms_dict.pkl'), 'rb'))
    diseases_dict = pickle.load(open(os.path.join(MODEL_DIR, 'diseases_dict.pkl'), 'rb'))
    
    diabetes_model = pickle.load(open(os.path.join(MODEL_DIR, 'diabetes_model.pkl'), 'rb'))
    diabetes_scaler = pickle.load(open(os.path.join(MODEL_DIR, 'diabetes_scaler.pkl'), 'rb'))
    
    parkinsons_model = pickle.load(open(os.path.join(MODEL_DIR, 'parkinsons_model.pkl'), 'rb'))
    parkinsons_scaler = pickle.load(open(os.path.join(MODEL_DIR, 'parkinsons_scaler.pkl'), 'rb'))

    print(f"   ✅ SVC model loaded — {len(symptoms_dict)} symptoms, {len(diseases_dict)} diseases")

    # ── Load reference CSV data ──
    description_df = pd.read_csv(os.path.join(DATA_DIR, 'description.csv'))
    precautions_df = pd.read_csv(os.path.join(DATA_DIR, 'precautions_df.csv'))
    medications_df = pd.read_csv(os.path.join(DATA_DIR, 'medications.csv'))
    diets_df = pd.read_csv(os.path.join(DATA_DIR, 'diets.csv'))
    workout_df = pd.read_csv(os.path.join(DATA_DIR, 'workout_df.csv'))

    # ── Load hospital data ──
    hospital_df = pd.read_csv(os.path.join(DATA_DIR, 'hospital_dataset_1000 (1).csv'))
    print(f"   ✅ Hospital data loaded — {len(hospital_df)} records")

    print("🚀 All models and data loaded successfully!\n")


def get_disease_info(disease_name):
    """Get full info for a predicted disease."""
    info = {}

    # Description
    desc_row = description_df[description_df['Disease'] == disease_name]
    info['description'] = desc_row['Description'].values[0] if len(desc_row) > 0 else "No description available."

    # Precautions
    pre_row = precautions_df[precautions_df['Disease'] == disease_name]
    if len(pre_row) > 0:
        precautions = []
        for col in ['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']:
            if col in pre_row.columns:
                val = pre_row[col].values[0]
                if pd.notna(val) and str(val).strip():
                    precautions.append(str(val).strip())
        info['precautions'] = precautions
    else:
        info['precautions'] = []

    # Medications
    med_row = medications_df[medications_df['Disease'] == disease_name]
    if len(med_row) > 0:
        raw = med_row['Medication'].values[0]
        try:
            info['medications'] = ast.literal_eval(raw)
        except Exception:
            info['medications'] = [str(raw)]
    else:
        info['medications'] = []

    # Diet
    diet_row = diets_df[diets_df['Disease'] == disease_name]
    if len(diet_row) > 0:
        raw = diet_row['Diet'].values[0]
        try:
            info['diets'] = ast.literal_eval(raw)
        except Exception:
            info['diets'] = [str(raw)]
    else:
        info['diets'] = []

    # Workout
    wrk_rows = workout_df[workout_df['disease'] == disease_name]
    info['workouts'] = wrk_rows['workout'].tolist() if len(wrk_rows) > 0 else []

    return info


def predict_disease(patient_symptoms):
    """Predict disease strictly matching logic from .ipynb."""
    input_vector = np.zeros(len(symptoms_dict))
    matched = []
    unmatched = []

    # Format user symptoms exactly as done in the notebook
    # user_symptoms = [symptom.strip("[]' ") for symptom in user_symptoms]
    for symptom in patient_symptoms:
        # Notebook logic sometimes passes raw strings, we try both clean and raw logic
        orig = symptom.strip("[]' ")
        clean = orig.lower().replace(' ', '_')
        
        if orig in symptoms_dict:
            input_vector[symptoms_dict[orig]] = 1
            matched.append(orig)
        elif clean in symptoms_dict:
            input_vector[symptoms_dict[clean]] = 1
            matched.append(clean)
        else:
            unmatched.append(orig)

    if not matched:
        return None, matched, unmatched

    # The diseases list in ipynb handles prediction result
    prediction_index = svc_model.predict([input_vector])[0]
    disease_name = diseases_dict.get(prediction_index, "Unknown")
    return disease_name, matched, unmatched


# ═══════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict disease from symptoms.
    Body: { "symptoms": "itching, skin_rash, headache" }
    """
    data = request.get_json()
    if not data or 'symptoms' not in data:
        return jsonify({'error': 'Please provide symptoms'}), 400

    raw_symptoms = data['symptoms']
    symptom_list = [s.strip() for s in raw_symptoms.split(',') if s.strip()]

    if not symptom_list:
        return jsonify({'error': 'No valid symptoms provided'}), 400

    disease_name, matched, unmatched = predict_disease(symptom_list)

    if disease_name is None:
        return jsonify({
            'error': 'Could not match any symptoms. Please use valid symptom names.',
            'available_symptoms': sorted(list(symptoms_dict.keys())),
            'unmatched': unmatched
        }), 400

    info = get_disease_info(disease_name)

    return jsonify({
        'disease': disease_name,
        'description': info['description'],
        'precautions': info['precautions'],
        'medications': info['medications'],
        'diets': info['diets'],
        'workouts': info['workouts'],
        'matched_symptoms': matched,
        'unmatched_symptoms': unmatched
    })


@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """Return list of all valid symptom names."""
    return jsonify({
        'symptoms': sorted(list(symptoms_dict.keys()))
    })


@app.route('/predict-diabetes', methods=['POST'])
def predict_diabetes():
    """
    Predict diabetes from features.
    Required features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
    Expects json like: {"features": [5, 166, 72, 19, 175, 25.8, 0.587, 51]}
    """
    data = request.get_json()
    if not data or 'features' not in data:
        return jsonify({'error': 'Please provide the exactly 8 features'}), 400
    
    features = data['features']
    if len(features) != 8:
        return jsonify({'error': f'Expected 8 features, got {len(features)}'}), 400
        
    input_data_as_numpy_array = np.asarray(features)
    input_data_reshaped = input_data_as_numpy_array.reshape(1, -1)
    
    std_data = diabetes_scaler.transform(input_data_reshaped)
    prediction = diabetes_model.predict(std_data)
    
    is_diabetic = bool(prediction[0] != 0)
    return jsonify({
        'disease': 'Diabetes',
        'is_diabetic': is_diabetic,
        'prediction_text': 'The person is diabetic' if is_diabetic else 'The person is not diabetic'
    })


@app.route('/predict-parkinsons', methods=['POST'])
def predict_parkinsons():
    """
    Predict Parkinson's from features.
    Expects json like: {"features": [197.076, 206.896, ...]} (22 features total)
    """
    data = request.get_json()
    if not data or 'features' not in data:
        return jsonify({'error': 'Please provide the exactly 22 features'}), 400
    
    features = data['features']
    if len(features) != 22:
        return jsonify({'error': f'Expected 22 features, got {len(features)}'}), 400
        
    input_data_as_numpy_array = np.asarray(features)
    input_data_reshaped = input_data_as_numpy_array.reshape(1, -1)
    
    std_data = parkinsons_scaler.transform(input_data_reshaped)
    prediction = parkinsons_model.predict(std_data)
    
    has_parkinsons = bool(prediction[0] != 0)
    return jsonify({
        'disease': 'Parkinsons',
        'has_parkinsons': has_parkinsons,
        'prediction_text': 'The Person has Parkinsons' if has_parkinsons else 'The Person does not have Parkinsons Disease'
    })


@app.route('/find-doctors', methods=['POST'])
def find_doctors():
    """
    Find hospitals/doctors near a location for a given disease.
    Body: { "disease": "Fungal infection", "latitude": 22.57, "longitude": 88.36 }
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    disease = data.get('disease', '')
    lat = data.get('latitude')
    lon = data.get('longitude')

    # Filter by disease if provided
    if disease:
        filtered = hospital_df[hospital_df['Disease'].str.lower() == disease.lower()]
        if len(filtered) == 0:
            filtered = hospital_df[hospital_df['Disease'].str.lower().str.contains(disease.lower(), na=False)]
        if len(filtered) == 0:
            filtered = hospital_df.copy()
    else:
        filtered = hospital_df.copy()

    results = filtered.copy()

    # Calculate distance if location provided
    if lat is not None and lon is not None:
        distances = []
        for _, row in results.iterrows():
            try:
                h_lat = float(row['Latitude'])
                h_lon = float(row['Longitude'])
                dist = geodesic((lat, lon), (h_lat, h_lon)).km
                distances.append(round(dist, 1))
            except Exception:
                distances.append(9999)
        results = results.copy()
        results['distance_km'] = distances
        results = results.sort_values('distance_km')

    # Return top 10
    top = results.head(10)
    doctors = []
    for _, row in top.iterrows():
        doctor = {
            'hospital': str(row.get('Hospital_Name', 'Unknown Hospital')),
            'disease': str(row.get('Disease', '')),
            'specialty': str(row.get('Specialty', 'General')),
            'doctor': str(row.get('Doctor_Name', 'Dr. Unknown')),
            'latitude': float(row.get('Latitude', 0)),
            'longitude': float(row.get('Longitude', 0)),
        }
        if 'distance_km' in row:
            doctor['distance_km'] = row['distance_km']
        doctors.append(doctor)

    return jsonify({'doctors': doctors})


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'models_loaded': svc_model is not None,
        'symptoms_count': len(symptoms_dict),
        'diseases_count': len(diseases_dict),
        'hospitals_count': len(hospital_df) if hospital_df is not None else 0
    })


# ═══════════════════════════════════════════════════
if __name__ == '__main__':
    load_models()
    app.run(host='0.0.0.0', port=5000, debug=True)
