import os
import json
import re
import pickle

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')
ROOTS_DIR = os.path.join(BASE_DIR, '..', 'roots')
SAVED_DIR = os.path.join(MODELS_DIR, 'saved')

os.makedirs(SAVED_DIR, exist_ok=True)

def parse_notebook(filename):
    """Read a Jupyter notebook and extract its code cells."""
    path = os.path.join(MODELS_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        nb = json.load(f)
    code = ""
    for cell in nb.get('cells', []):
        if cell.get('cell_type') == 'code':
            source = "".join(cell.get('source', []))
            code += source + "\n\n"
    return code

def fix_paths_and_inputs(code):
    """Replace hardcoded local paths with dynamic paths to the roots directory, and remove input() blocks."""
    
    # helper to return safe string
    def get_safe_path(filename):
        # We replace backslashes with forward slashes so it doesn't break python strings
        safe_path = os.path.join(ROOTS_DIR, filename).replace('\\', '/')
        return f'r"{safe_path}"'

    # Replace any read_csv call containing known datasets with the roots/ path
    code = re.sub(r'pd\.read_csv\s*\(\s*r?["\'].*?diabetes\.csv(?:\.bz2)?["\']\s*\)', 
                  lambda m: f"pd.read_csv({get_safe_path('diabetes.csv')})", code, flags=re.IGNORECASE)
    
    code = re.sub(r'pd\.read_csv\s*\(\s*r?["\'].*?Parkinsson disease\.csv["\']\s*\)', 
                  lambda m: f"pd.read_csv({get_safe_path('Parkinsson disease.csv')})", code, flags=re.IGNORECASE)
    
    # Generic replacement for other CSVs
    def replace_generic_csv(match):
        filename = match.group(1)
        return f"pd.read_csv({get_safe_path(filename)})"

    code = re.sub(r'pd\.read_csv\s*\(\s*r?["\'].*?([^\\/]+?\.csv)["\']\s*\)', replace_generic_csv, code, flags=re.IGNORECASE)

    
    # Replace input() with a default dummy string to prevent hanging and NameErrors
    code = re.sub(r'input\(.*?\)', '"itching"', code)
    
    # Remove plot.show() just in case
    code = re.sub(r'^.*plt\.show\(.*$.*', '', code, flags=re.MULTILINE)
    
    # Handle print statements with very long outputs that clutter stdout
    # (Optional, but good for clean compilation)
    
    return code

def compile_notebooks():
    print("🚀 Starting compilation of .ipynb notebooks into .pkl models")
    
    # 1. Diabetes Model
    print("▶ Compiling diabites_d.ipynb...")
    diabetes_code = parse_notebook('diabites_d.ipynb')
    diabetes_code = fix_paths_and_inputs(diabetes_code)
    
    env_diabetes = {}
    exec(diabetes_code, env_diabetes)
    
    pickle.dump(env_diabetes['classifier'], open(os.path.join(SAVED_DIR, 'diabetes_model.pkl'), 'wb'))
    pickle.dump(env_diabetes['scaler'], open(os.path.join(SAVED_DIR, 'diabetes_scaler.pkl'), 'wb'))
    print("  ✅ diabetes_model.pkl & diabetes_scaler.pkl saved")
    
    # 2. Parkinson's Model
    print("▶ Compiling parkinson_d.ipynb...")
    parkinson_code = parse_notebook('parkinson_d.ipynb')
    parkinson_code = fix_paths_and_inputs(parkinson_code)
    
    env_parkinson = {}
    exec(parkinson_code, env_parkinson)
    
    pickle.dump(env_parkinson['model'], open(os.path.join(SAVED_DIR, 'parkinsons_model.pkl'), 'wb'))
    pickle.dump(env_parkinson['scaler'], open(os.path.join(SAVED_DIR, 'parkinsons_scaler.pkl'), 'wb'))
    print("  ✅ parkinsons_model.pkl & parkinsons_scaler.pkl saved")
    
    # 3. Medical Recommendation Model
    print("▶ Compiling MEDICAL recomendation_d.ipynb...")
    med_code = parse_notebook('MEDICAL recomendation_d.ipynb')
    med_code = fix_paths_and_inputs(med_code)
    
    env_med = {}
    # Medical Recommendation ends with a small dummy Random Forest test, we just let it run.
    # The actual SVC is what we want to keep.
    exec(med_code, env_med)
    
    pickle.dump(env_med['svc'], open(os.path.join(SAVED_DIR, 'svc.pkl'), 'wb'))
    pickle.dump(env_med['symptoms_dict'], open(os.path.join(SAVED_DIR, 'symptoms_dict.pkl'), 'wb'))
    pickle.dump(env_med['diseases_list'], open(os.path.join(SAVED_DIR, 'diseases_dict.pkl'), 'wb'))
    print("  ✅ svc.pkl, symptoms_dict.pkl & diseases_dict.pkl saved")

    print("\n🎉 All notebooks successfully compiled! Flask will now use these models directly.")

if __name__ == "__main__":
    compile_notebooks()
