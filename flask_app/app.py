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
description_df = None
precautions_df = None
medications_df = None
diets_df = None
workout_df = None
hospital_df = None


def load_models():
    """Load pre-trained .pkl models and CSV reference data."""
    global svc_model, label_encoder, symptoms_dict, diseases_dict
    global description_df, precautions_df, medications_df, diets_df, workout_df, hospital_df

    print("⏳ Loading pre-trained models from .pkl files...")

    # ── Load .pkl models ──
    svc_model = pickle.load(open(os.path.join(MODEL_DIR, 'svc.pkl'), 'rb'))
    label_encoder = pickle.load(open(os.path.join(MODEL_DIR, 'label_encoder.pkl'), 'rb'))
    symptoms_dict = pickle.load(open(os.path.join(MODEL_DIR, 'symptoms_dict.pkl'), 'rb'))
    diseases_dict = pickle.load(open(os.path.join(MODEL_DIR, 'diseases_dict.pkl'), 'rb'))

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
    """Predict disease from a list of symptom strings."""
    input_vector = np.zeros(len(symptoms_dict))
    matched = []
    unmatched = []

    for symptom in patient_symptoms:
        clean = symptom.strip().lower().replace(' ', '_')
        if clean in symptoms_dict:
            input_vector[symptoms_dict[clean]] = 1
            matched.append(clean)
        else:
            unmatched.append(symptom.strip())

    if not matched:
        return None, matched, unmatched

    prediction = svc_model.predict([input_vector])[0]
    disease_name = diseases_dict.get(prediction, "Unknown")
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
