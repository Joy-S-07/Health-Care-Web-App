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

const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
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

// Medical Database for safely matching symptoms
const MEDICAL_DATABASE = [
  {
    keywords: ["headache", "migraine", "head", "pain"],
    medicines: [
      { name: "Acetaminophen (Paracetamol)", dosage: "500mg as needed, every 4-6 hours", type: "Pain Reliever", safety: "Over-the-counter. Do not exceed 4000mg per day." },
      { name: "Ibuprofen", dosage: "200-400mg every 4-6 hours", type: "NSAID", safety: "Over-the-counter. Take with food to avoid stomach upset." }
    ],
    specialties: ["General Physician", "Neurologist (if persistent or severe)"]
  },
  {
    keywords: ["fever", "temperature", "hot", "chills"],
    medicines: [
      { name: "Acetaminophen (Paracetamol)", dosage: "500mg every 4-6 hours", type: "Antipyretic", safety: "Over-the-counter. Excellent for reducing fever safely." },
      { name: "Ibuprofen", dosage: "200-400mg every 4-6 hours", type: "NSAID / Antipyretic", safety: "Over-the-counter. Helps reduce fever and muscle aches." }
    ],
    specialties: ["General Physician", "Infectious Disease Specialist (if prolonged)"]
  },
  {
    keywords: ["cough", "throat", "phlegm", "cold", "congestion"],
    medicines: [
      { name: "Dextromethorphan", dosage: "10-20mg every 4 hours", type: "Cough Suppressant", safety: "Over-the-counter. Best for dry, hacking coughs to soothe the throat reflex." },
      { name: "Guaifenesin", dosage: "200-400mg every 4 hours", type: "Expectorant", safety: "Over-the-counter. Best for clearing chest congestion. Must drink plenty of water." }
    ],
    specialties: ["General Physician", "Pulmonologist", "ENT Specialist"]
  },
  {
    keywords: ["allergy", "sneezing", "itchy", "eyes", "rash"],
    medicines: [
      { name: "Cetirizine (Zyrtec)", dosage: "10mg once daily", type: "Antihistamine", safety: "Over-the-counter. Highly effective non-drowsy allergy relief." },
      { name: "Diphenhydramine (Benadryl)", dosage: "25-50mg every 4-6 hours", type: "Fast-acting Antihistamine", safety: "Over-the-counter. May cause significant drowsiness. Do not drive after use." }
    ],
    specialties: ["Allergist / Immunologist", "Dermatologist (for rash)"]
  },
  {
    keywords: ["stomach", "pain", "acid", "heartburn", "nausea"],
    medicines: [
      { name: "Calcium Carbonate (Tums)", dosage: "Chew 2-4 tablets as symptoms occur", type: "Antacid", safety: "Over-the-counter. For quick relief of mild, occasional heartburn." },
      { name: "Bismuth Subsalicylate (Pepto-Bismol)", dosage: "30ml or 2 caplets every hour as needed", type: "Antidiarrheal/Antacid", safety: "Over-the-counter. Helps soothe stomach lining. Do not take with aspirin." }
    ],
    specialties: ["Gastroenterologist", "General Physician"]
  }
];

const MedicalSupport = () => {
  const location = useLocation();
  const initialSymptom = location.state?.symptom || "";
  
  const [symptoms, setSymptoms] = useState(initialSymptom);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = () => {
    if (!symptoms.trim()) return;

    setIsSearching(true);
    setResults(null);

    // Simulate database query delay
    setTimeout(() => {
      const queryWords = symptoms.toLowerCase().split(/[,\s]+/);
      
      const matchedData = MEDICAL_DATABASE.filter(entry => 
        queryWords.some(word => word.length > 2 && entry.keywords.some(kw => kw.includes(word) || word.includes(kw)))
      );

      // Default safe suggestion if no matches occur
      const fallbackData = [{
        keywords: ["general"],
        medicines: [],
        specialties: ["General Physician"]
      }];

      setResults(matchedData.length > 0 ? matchedData : fallbackData);
      setIsSearching(false);
    }, 1500);
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
            <PillIcon className="w-6 h-6 text-violet-500" />
            <span className="text-xl font-bold tracking-tight">Medical Support</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Safe Medication Guidance</h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              Describe your symptoms below to get over-the-counter medical suggestions and know which doctor to consult.
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
                placeholder="E.g. Fever, persistent cough, bad headache..."
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
        </div>

        {/* High Priority Medical Disclaimer */}
        <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl p-5 mb-10 shadow-sm flex items-start gap-4">
            <AlertTriangleIcon className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900">Important Medical Disclaimer</h4>
              <p className="text-rose-800 text-sm mt-1 leading-relaxed">
                The medications listed here are solely for informational purposes and consist of common Over-The-Counter (OTC) drugs. 
                They do not constitute professional medical advice, diagnosis, or treatment. Always read medicine labels carefully and consult with your doctor or pharmacist before taking any new medication, especially if you have pre-existing conditions or are pregnant.
              </p>
            </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight pl-2">Medical Suggestions</h2>
            
            {results.map((resultGroup, idx) => (
              <div key={idx} className="space-y-6">
                 
                {/* Medicines List */}
                {resultGroup.medicines.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {resultGroup.medicines.map((med, midx) => (
                      <div key={midx} className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-violet-200 hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
                              <PillIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl text-slate-900">{med.name}</h3>
                              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md mt-1">
                                {med.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Standard Dosage</p>
                            <p className="text-slate-800 font-medium text-sm">{med.dosage}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Safety Notes</p>
                            <p className="text-slate-700 font-medium text-sm flex items-start gap-1.5 line-clamp-2">
                              <ShieldCheckIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              {med.safety}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-slate-600 font-medium">
                    We couldn't clearly match your symptoms with safe over-the-counter medicine. Please see the doctor recommendations below.
                  </div>
                )}

                {/* Highly Recommended Doctors */}
                <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm shadow-emerald-100/50">
                   <h3 className="flex items-center gap-2 font-bold text-emerald-800 mb-4">
                     <StethoscopeIcon className="w-5 h-5 text-emerald-500" />
                     Recommended Specialist Consultation
                   </h3>
                   <div className="flex flex-wrap gap-3">
                     {resultGroup.specialties.map((spec, sidx) => (
                       <div key={sidx} className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl font-bold text-sm">
                         {spec}
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-emerald-100 pt-6">
                     <p className="text-sm font-medium text-slate-600">
                       Medication only masks symptoms. Finding the root cause is crucial.
                     </p>
                     <Link 
                       to="/find-doctor" 
                       state={{ symptom: symptoms }}
                       className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 active:scale-95"
                     >
                       Find these Doctors Near You
                     </Link>
                   </div>
                </div>

              </div>
            ))}
            
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicalSupport;
