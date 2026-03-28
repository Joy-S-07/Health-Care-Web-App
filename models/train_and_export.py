"""
Train all ML models from the CSV data and export them as .pkl files.
Run this ONCE to generate the model files.
"""

import os
import pickle
import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '..', 'roots')
OUTPUT_DIR = os.path.join(BASE_DIR, 'saved')

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ═══════════════════════════════════════════════
# 1. Disease Prediction Model (SVC)
# ═══════════════════════════════════════════════
print("━━━ Training Disease Prediction Model (SVC) ━━━")

df = pd.read_csv(os.path.join(DATA_DIR, 'Training.csv'))
X = df.drop('prognosis', axis=1)
y = df['prognosis']

le = LabelEncoder()
Y = le.fit_transform(y)

svc = SVC(kernel='linear')
svc.fit(X, Y)

# Save model + encoder + symptom columns
pickle.dump(svc, open(os.path.join(OUTPUT_DIR, 'svc.pkl'), 'wb'))
pickle.dump(le, open(os.path.join(OUTPUT_DIR, 'label_encoder.pkl'), 'wb'))
pickle.dump(list(X.columns), open(os.path.join(OUTPUT_DIR, 'symptom_columns.pkl'), 'wb'))

print(f"  ✅ svc.pkl — {len(X.columns)} symptoms, {len(le.classes_)} diseases")
print(f"  ✅ label_encoder.pkl")
print(f"  ✅ symptom_columns.pkl")

# ═══════════════════════════════════════════════
# 2. Symptom → Index dictionary
# ═══════════════════════════════════════════════
symptoms_dict = {symptom: idx for idx, symptom in enumerate(X.columns)}
pickle.dump(symptoms_dict, open(os.path.join(OUTPUT_DIR, 'symptoms_dict.pkl'), 'wb'))
print(f"  ✅ symptoms_dict.pkl — {len(symptoms_dict)} entries")

# ═══════════════════════════════════════════════
# 3. Disease → Index dictionary
# ═══════════════════════════════════════════════
diseases_dict = {i: name for i, name in enumerate(le.classes_)}
pickle.dump(diseases_dict, open(os.path.join(OUTPUT_DIR, 'diseases_dict.pkl'), 'wb'))
print(f"  ✅ diseases_dict.pkl — {len(diseases_dict)} entries")

print(f"\n🚀 All models saved to: {OUTPUT_DIR}")
print(f"   Files: {os.listdir(OUTPUT_DIR)}")
