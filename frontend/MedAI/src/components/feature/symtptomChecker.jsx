import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const commonSymptoms = [
  "Headache", "Fever", "Dry Cough", "Nausea", 
  "Fatigue", "Shortness of breath", "Sore throat", "Muscle ache", "Dizziness", "Loss of taste/smell"
];

const SymtptomChecker = () => {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const appendSymptom = (symptom) => {
    setPrompt(prev => {
      const current = prev.trim();
      if (!current) return symptom;
      // if already ends with comma, just append space and symptom
      if (current.endsWith(',')) return `${current} ${symptom}`;
      return `${current}, ${symptom}`;
    });
    // Remove focus from added chip for better UI
    if (document.activeElement) {
        document.activeElement.blur();
    }
  };

  const handleAnalyze = () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setResults(null);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Mock result data 
      setResults({
        conditions: [
          { name: "Viral Infection", match: 85, severity: "Mild", dept: "General Physician" },
          { name: "Common Cold", match: 70, severity: "Mild", dept: "General Physician" },
          { name: "Seasonal Allergies", match: 40, severity: "Low", dept: "Allergist" }
        ],
        recommendations: [
          "Rest and drink plenty of fluids",
          "Monitor fever and take over-the-counter fever reducers if needed",
          "If symptoms persist or worsen after 3 days, consult a doctor"
        ]
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-slate-900">
            <ActivityIcon className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold tracking-tight">AI Diagnostic</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Symptom Checker</h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              Describe how you're feeling in detail or select from common symptoms below. Our AI will analyze your inputs to suggest potential causes and next steps.
            </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-900 mb-3 ml-1">How are you feeling?</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I have a severe headache since morning along with slight fever..."
              className="w-full h-40 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 resize-none leading-relaxed"
            ></textarea>
          </div>

          {/* Suggested Symptoms */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-500 mb-3 ml-1 uppercase tracking-wider">Suggested Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((sym, idx) => (
                <button
                  key={idx}
                  onClick={() => appendSymptom(sym)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all active:scale-95 shadow-sm"
                >
                  <PlusIcon className="w-3.5 h-3.5" /> {sym}
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

        {/* Results Section */}
        {results && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                 <AlertCircleIcon className="w-5 h-5" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analysis Results</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-1 md:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Possible Conditions</h3>
                {results.conditions.map((cond, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{cond.name}</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Suggested Dept: {cond.dept}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-sm">
                        {cond.match}% Match
                      </div>
                      <div className={`text-xs font-bold mt-2 uppercase tracking-wide ${
                        cond.severity === 'Mild' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {cond.severity} Severity
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="col-span-1">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1 mb-4">Recommendations</h3>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 h-full">
                  <ul className="space-y-4">
                    {results.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3 text-sm font-medium text-slate-800 leading-relaxed">
                        <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 flex flex-col gap-3">
                    <Link 
                      to="/medical-support" 
                      state={{ symptom: prompt }}
                      className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition-all shadow-md flex justify-center items-center"
                    >
                      View Safe Medications
                    </Link>
                    <Link 
                      to="/find-doctor" 
                      state={{ symptom: prompt }}
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
                <strong>Disclaimer:</strong> This tool is for informational purposes only and does not provide medical advice, diagnosis, or treatment. Always consult a healthcare professional for clinical advice.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SymtptomChecker;