import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// -- Inline SVGs --
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
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

// Mock Database of Doctors
const MOCK_DOCTORS = [
  { id: 1, name: "Dr. Sarah Jenkins", specialty: "General Physician", clinic: "City Health Clinic", hospital: "Metro General Hospital", rating: 4.8, distance: "1.2 miles", waitTime: "15 mins", fees: "$60", keywords: ["fever", "cold", "cough", "flu", "pain", "fatigue", "headache"] },
  { id: 2, name: "Dr. Michael Chen", specialty: "Neurologist", clinic: "Brain & Spine Care", hospital: "St. Jude's Medical Center", rating: 4.9, distance: "3.5 miles", waitTime: "40 mins", fees: "$120", keywords: ["headache", "migraine", "dizziness", "nerves", "seizure", "stroke"] },
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Cardiologist", clinic: "Heart Rhythm Clinic", hospital: "Cardiac Care Center", rating: 4.7, distance: "2.8 miles", waitTime: "30 mins", fees: "$150", keywords: ["chest pain", "heart", "blood pressure", "palpitations", "breathless"] },
  { id: 4, name: "Dr. James Wilson", specialty: "Orthopedist", clinic: "Joint & Bone Health", hospital: "Orthopedic Institute", rating: 4.6, distance: "4.1 miles", waitTime: "25 mins", fees: "$110", keywords: ["bone", "joint", "muscle ache", "back pain", "knee", "fracture"] },
  { id: 5, name: "Dr. Alan Turing", specialty: "Pulmonologist", clinic: "Breathing Easy Clinic", hospital: "Respira Hospital", rating: 4.9, distance: "5.0 miles", waitTime: "10 mins", fees: "$130", keywords: ["asthma", "shortness of breath", "breathing", "lung", "cough"] },
  { id: 6, name: "Dr. Anita Sharma", specialty: "Dermatologist", clinic: "Skin Glow Center", hospital: "DermaCare Hospital", rating: 4.8, distance: "1.5 miles", waitTime: "20 mins", fees: "$80", keywords: ["skin", "rash", "acne", "hair", "allergy", "itchy"] },
  { id: 7, name: "Dr. Robert Fox", specialty: "Gastroenterologist", clinic: "Digestive Health Clinic", hospital: "City Medical Center", rating: 4.5, distance: "2.2 miles", waitTime: "35 mins", fees: "$100", keywords: ["stomach", "pain", "nausea", "vomiting", "digestion", "acid"] },
];

const Doctor = () => {
  const params = useLocation();
  const initialSymptom = params.state?.symptom || "";

  const [symptoms, setSymptoms] = useState(initialSymptom);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [results, setResults] = useState(null);

  const handleSearch = () => {
    if (!symptoms.trim()) return;

    setLocationError("");
    setIsLocating(true);
    setResults(null);

    // 1. Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            // Mocking a local area name since we don't have a reverse geocoding API
            name: "Your Current Location"
          });
          setIsLocating(false);
          performSearch();
        },
        (error) => {
          // Failure
          setIsLocating(false);
          setLocationError("Could not access location. Displaying general results based on symptoms.");
          performSearch(); // Still perform search but with a warning
        },
        { timeout: 10000 }
      );
    } else {
      setIsLocating(false);
      setLocationError("Geolocation is not supported by your browser.");
      performSearch();
    }
  };

  const performSearch = () => {
    setIsSearching(true);
    
    // Simulate API call for searching doctors
    setTimeout(() => {
      const queryWords = symptoms.toLowerCase().split(/[,\s]+/);
      
      // Match doctors based on keywords
      const matchedDoctors = MOCK_DOCTORS.filter(doc => {
        return queryWords.some(word => 
          word.length > 2 && doc.keywords.some(kw => kw.includes(word) || word.includes(kw))
        );
      });
      
      // If no strong match, return general physicians
      const finalResults = matchedDoctors.length > 0 
        ? matchedDoctors 
        : MOCK_DOCTORS.filter(doc => doc.specialty === "General Physician");

      setResults(finalResults);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col w-full">


      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Find Nearby Specialists</h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              Enter your condition or symptoms, and we'll access your location to find the best matching doctors, clinics, and hospitals in your area.
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
                placeholder="E.g. Headache, Chest pain, persistent cough..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
              />
            </div>
            
            <button 
              onClick={handleSearch}
              disabled={isLocating || isSearching || !symptoms.trim()}
              className={`py-4 px-8 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98] duration-200 ${
                isLocating || isSearching || !symptoms.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30'
              }`}
            >
              {isLocating ? (
                <><MapPinIcon className="w-5 h-5 animate-pulse" /> Locating...</>
              ) : isSearching ? (
                <><SearchIcon className="w-5 h-5 animate-spin" /> Searching...</>
              ) : (
                <><SearchIcon className="w-5 h-5" /> Find Doctors</>
              )}
            </button>
          </div>
          
          {locationError && (
             <p className="text-amber-600 text-sm font-bold mt-4 flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> {locationError}
             </p>
          )}
          {userLocation && !locationError && (
             <p className="text-emerald-600 text-sm font-bold mt-4 flex items-center gap-1.5">
               <MapPinIcon className="w-4 h-4" /> Using your current location to find nearby clinics.
             </p>
          )}
        </div>

        {/* Results Section */}
        {results && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
               <div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Matching Specialists</h2>
                 <p className="text-slate-500 font-medium text-sm mt-1">Found {results.length} doctors based on your symptoms</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {results.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-slate-200 shrink-0 relative overflow-hidden">
                       {/* Placeholder for Doctor Avatar */}
                       <UserIcon className="w-8 h-8 relative z-10" />
                       <div className="absolute inset-x-0 bottom-0 h-1/2 bg-slate-200"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{doctor.name}</h3>
                      <p className="text-emerald-600 font-bold text-sm mt-0.5">{doctor.specialty}</p>
                      
                      <div className="flex items-center gap-1 mt-2 text-amber-500 translate-x-[-2px]">
                        <StarIcon className="w-4 h-4" />
                        <span className="font-bold text-slate-700 text-sm ml-0.5">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 flex-1 border border-slate-100 space-y-3">
                    <div className="flex items-start gap-2">
                       <MapPinIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                       <div>
                         <p className="text-sm font-bold text-slate-800">{doctor.clinic}</p>
                         <p className="text-xs font-medium text-slate-500">{doctor.hospital} • {doctor.distance} away</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                       <div className="text-xs font-bold text-slate-500">
                         Wait Time: <span className="text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm ml-1">{doctor.waitTime}</span>
                       </div>
                       <div className="text-xs font-bold text-slate-500">
                         Cons. Fee: <span className="text-slate-800">{doctor.fees}</span>
                       </div>
                    </div>
                  </div>
                  
                  <button className="w-full py-3.5 mt-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]">
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
            
            {results.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                 <StethoscopeIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-900">No specific matches found</h3>
                 <p className="text-slate-500 mt-2">Try adjusting your symptoms or search for General Physicians.</p>
              </div>
            )}
            
          </div>
        )}
      </main>
    </div>
  );
};

export default Doctor;
