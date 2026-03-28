# %%
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn import svm
from sklearn.metrics import accuracy_score
# import geopy as gp
from geopy.distance import geodesic

# %%
import pandas as pd

df = pd.read_csv(r"C:\Users\hp\OneDrive\Documents\hospital_dataset_1000 (1).csv")
print(df)

# %%
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
df['spec_encoded'] = le.fit_transform(df['Number of Reviews'])

# %%
from sklearn.ensemble import RandomForestClassifier

X = df['spec_encoded'].values.reshape(-1, 1)
y = df['Number of Reviews'].values

model = RandomForestClassifier()
model.fit(X, y)

# %%
from geopy.distance import geodesic

def find_nearest(lat, lon, hospitals):
    distances = []
    
    for i, row in hospitals.iterrows():
        hospital_loc = (row['latitude'], row['longitude'])
        patient_loc = (lat, lon)
        
        dist = geodesic(patient_loc, hospital_loc).km
        distances.append(dist)
    
    hospitals['distance'] = distances
    return hospitals.sort_values(by='distance')

# %%


# %%


# %%


# %%


# %%


# %%


# %%


# %%



