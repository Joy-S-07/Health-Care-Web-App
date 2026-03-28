import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// -- Inline SVGs --
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PillIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
    <path d="m8.5 8.5 7 7"></path>
  </svg>
);

const StethoscopeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

const AlertTriangleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <path d="M12 9v4"></path>
    <path d="M12 17h.01"></path>
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

const API_FLASK = 'http://localhost:4000/api/flask';

const MedicalSupport = () => {
  const location = useLocation();
  const initialSymptom = location.state?.symptom || "";
  
  const [symptoms, setSymptoms] = useState(initialSymptom);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!symptoms.trim()) return;

    setIsSearching(true);
    setResults(null);
    setError("");

    try {
      const response = await fetch(`${API_FLASK}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not analyze symptoms.');
        return;
      }

      setResults(data);
    } catch (err) {
      setError('Could not connect to the AI service. Make sure the Flask server is running.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Safe Medication Guidance</h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              Enter your symptoms below to get AI-powered medication suggestions, diet recommendations, and specialist guidance.
            </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <SearchIcon className="w-5 h-5" />
              </div>
              <input 
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="E.g. headache, high_fever, nausea..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all duration-200"
              />
            </div>
            
            <button 
              onClick={handleSearch}
              disabled={isSearching || !symptoms.trim()}
              className={`py-4 px-8 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98] duration-200 ${
                isSearching || !symptoms.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                  : 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-600/30'
              }`}
            >
              {isSearching ? (
                <><SearchIcon className="w-5 h-5 animate-spin" /> Analyzing...</>
              ) : (
                <><PillIcon className="w-5 h-5" /> Get Support</>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3 ml-1">Use underscores for multi-word symptoms (e.g. skin_rash, chest_pain)</p>
        </div>

        {/* High Priority Medical Disclaimer */}
        <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl p-5 mb-10 shadow-sm flex items-start gap-4">
            <AlertTriangleIcon className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900">Important Medical Disclaimer</h4>
              <p className="text-rose-800 text-sm mt-1 leading-relaxed">
                The medications listed here are AI-generated suggestions for informational purposes only. 
                They do not constitute professional medical advice, diagnosis, or treatment. Always consult with your doctor or pharmacist before taking any new medication.
              </p>
            </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-10 text-sm text-rose-800 font-medium flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AlertTriangleIcon className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight pl-2">
              AI Medical Suggestions for <span className="text-violet-600">{results.disease}</span>
            </h2>
            <p className="text-slate-600 font-medium pl-2 -mt-4">{results.description}</p>
            
            {/* Medications */}
            {results.medications?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1 mb-4">Suggested Medications</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {results.medications.map((med, midx) => (
                    <div key={midx} className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-violet-200 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
                          <PillIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{med}</h3>
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md mt-1">
                            AI Suggested
                          </span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-sm font-medium text-slate-700 flex items-start gap-1.5">
                          <ShieldCheckIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          Consult your doctor for proper dosage and suitability.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diets */}
            {results.diets?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1 mb-4">Recommended Diet</h3>
                <div className="flex flex-wrap gap-3">
                  {results.diets.map((d, i) => (
                    <span key={i} className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-sm">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Workouts */}
            {results.workouts?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1 mb-4">Suggested Activities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.workouts.map((w, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-sm font-medium text-slate-800 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">{i + 1}</span>
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctor link */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm shadow-emerald-100/50">
               <h3 className="flex items-center gap-2 font-bold text-emerald-800 mb-4">
                 <StethoscopeIcon className="w-5 h-5 text-emerald-500" />
                 Need Professional Help?
               </h3>
               <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                 <p className="text-sm font-medium text-slate-600">
                   Medication only masks symptoms. Finding the root cause with a specialist is crucial.
                 </p>
                 <Link 
                   to="/find-doctor" 
                   state={{ symptom: symptoms, disease: results.disease }}
                   className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 active:scale-95 whitespace-nowrap"
                 >
                   Find Doctors Near You
                 </Link>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicalSupport;
