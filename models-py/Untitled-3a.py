# %%
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn import svm
from sklearn.metrics import accuracy_score

# %%
# loading the diabetes dataset to a pandas DataFrame
df = pd.read_csv(r"C:\Users\hp\OneDrive\Documents\Parkinsson disease.csv")

# %%
pd.read_csv

# %%
df.head()

# %%
df.shape

# %%
df.info()

# %%
# checking for missing values in each column
df.isnull().sum()

# %%
df.describe()

# %%
df['status'].value_counts()

# %%
# grouping the data bas3ed on the target variable
df.groupby('status').mean(numeric_only= True)

# %%
df['status'].mean()

# %%
X = df.drop(columns=['name','status'], axis=1)
Y = df['status']

# %%
print(X)

# %%
print(Y)

# %%
X_train, X_test, Y_train, Y_test = train_test_split(X,Y, test_size = 0.2, random_state=2)

# %%
print(X.shape, X_train.shape, X_test.shape)

# %%
scaler = StandardScaler()

# %%
scaler.fit(X_train)

# %%
X_train = scaler.transform(X_train)

X_test = scaler.transform(X_test)

# %%
print(X_train)

# %%
model = svm.SVC(kernel='linear')

# %%
# training the SVM model with training data
model.fit(X_train, Y_train)

# %%
# accuracy score on the training data
X_train_prediction = model.predict(X_train)
training_data_accuracy = accuracy_score(X_train_prediction, Y_train)

# %%
print('Accuracy score of the training data : ', training_data_accuracy)

# %%
# accuracy score on the test data
X_test_prediction = model.predict(X_test)
test_data_accuracy = accuracy_score(X_test_prediction, Y_test)

# %%
print('Accuracy score of the test data : ', test_data_accuracy)

# %%
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()

# %%
scaler.fit(X_train)

# %%
model.fit(X_train, Y_train)

# %%
input_data = (197.07600,206.89600,192.05500,0.00289,0.00001,0.00166,0.00168,0.00498,0.01098,0.09700,0.00563,0.00680,0.00802,0.01689,0.00339,26.77500,0.422229,0.741367,-7.348300,0.177551,1.743867,0.085569)

# changing input data to a numpy array
input_data_as_numpy_array = np.asarray(input_data)

# reshape the numpy array
input_data_reshaped = input_data_as_numpy_array.reshape(1,-1)

# standardize the data
std_data = scaler.transform(input_data_reshaped)

prediction = model.predict(std_data)
print(prediction)


if (prediction[0] == 0):
  print("The Person does not have Parkinsons Disease")

else:
  print("The Person has Parkinsons")

# %%


# %%


# %%


# %%


# %%


# %%


# %%


# %%



