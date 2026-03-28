import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/authUtils';

// -- Inline SVGs --
const ActivityIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const AlertCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const commonSymptoms = [
  "headache", "high_fever", "cough", "nausea",
  "fatigue", "breathlessness", "vomiting", "muscle_pain", "dizziness", "skin_rash"
];

const API_FLASK = 'http://localhost:4000/api/flask';

const SymtptomChecker = () => {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const appendSymptom = (symptom) => {
    setPrompt(prev => {
      const current = prev.trim();
      if (!current) return symptom;
      if (current.endsWith(',')) return `${current} ${symptom}`;
      return `${current}, ${symptom}`;
    });
    if (document.activeElement) {
        document.activeElement.blur();
    }
  };

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setResults(null);
    setError("");
    
    try {
      const response = await fetch(`${API_FLASK}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to analyze symptoms. Please try again.');
        return;
      }

      setResults(data);

      // Save to history (best-effort, don't block UI)
      try {
        await apiFetch('/history', {
          method: 'POST',
          body: JSON.stringify({
            symptoms: data.matched_symptoms || prompt.split(',').map(s => s.trim()),
            predictedDisease: data.disease,
            description: data.description,
            precautions: data.precautions,
            medications: data.medications,
            diets: data.diets,
            workouts: data.workouts,
          }),
        });
      } catch {
        // User might not be logged in – ignore
      }
    } catch (err) {
      setError('Could not connect to the AI service. Make sure the Flask server is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Symptom Checker</h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              Describe how you're feeling by selecting symptoms below. Our AI model will predict potential conditions and provide recommendations.
            </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-900 mb-3 ml-1">Enter symptoms (comma-separated)</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. headache, high_fever, nausea, fatigue..."
              className="w-full h-40 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 resize-none leading-relaxed"
            ></textarea>
            <p className="text-xs text-slate-400 mt-2 ml-1">Use underscores for multi-word symptoms (e.g. skin_rash, chest_pain, joint_pain)</p>
          </div>

          {/* Suggested Symptoms */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-500 mb-3 ml-1 uppercase tracking-wider">Common Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((sym, idx) => (
                <button
                  key={idx}
                  onClick={() => appendSymptom(sym)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all active:scale-95 shadow-sm"
                >
                  <PlusIcon className="w-3.5 h-3.5" /> {sym.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !prompt.trim()}
            className={`w-full py-4 mt-2 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98] duration-200 ${
              isAnalyzing || !prompt.trim() 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            {isAnalyzing ? (
              <>
                <SearchIcon className="w-5 h-5 animate-spin" /> Analyzing Symptoms...
              </>
            ) : (
              <>
                <ActivityIcon className="w-5 h-5" /> Analyze My Symptoms
              </>
            )}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-8 bg-rose-50 border border-rose-200 rounded-2xl p-5 text-sm text-rose-800 font-medium flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AlertCircleIcon className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                 <AlertCircleIcon className="w-5 h-5" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI Prediction Results</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Predicted Disease */}
              <div className="col-span-1 md:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Predicted Condition</h3>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h4 className="font-black text-2xl text-slate-900 mb-2">{results.disease}</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">{results.description}</p>
                  
                  {results.matched_symptoms?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {results.matched_symptoms.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                          {s.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Precautions */}
                {results.precautions?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1 mb-3">Precautions</h3>
                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 space-y-2">
                      {results.precautions.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm font-medium text-amber-900">
                          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">{i + 1}</span>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Recommendations Sidebar */}
              <div className="col-span-1">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1 mb-4">Medications</h3>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 h-full">
                  {results.medications?.length > 0 ? (
                    <ul className="space-y-3">
                      {results.medications.map((med, idx) => (
                        <li key={idx} className="flex gap-3 text-sm font-medium text-slate-800 leading-relaxed">
                          <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                            {idx + 1}
                          </span>
                          {med}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 font-medium">No specific medications found. Consult a doctor.</p>
                  )}
                  
                  <div className="mt-8 flex flex-col gap-3">
                    <Link 
                      to="/medical-support" 
                      state={{ symptom: prompt }}
                      className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition-all shadow-md flex justify-center items-center"
                    >
                      View Full Medical Support
                    </Link>
                    <Link 
                      to="/find-doctor" 
                      state={{ symptom: prompt, disease: results.disease }}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md flex justify-center items-center"
                    >
                      Find a Doctor Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800 font-medium flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
              <p>
                <strong>Disclaimer:</strong> This tool uses an AI model for informational purposes only and does not provide medical advice, diagnosis, or treatment. Always consult a healthcare professional for clinical advice.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SymtptomChecker;