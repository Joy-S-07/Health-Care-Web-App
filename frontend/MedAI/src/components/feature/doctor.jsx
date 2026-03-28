import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

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

const StethoscopeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

const API_FLASK = 'http://localhost:4000/api/flask';

const Doctor = () => {
  const params = useLocation();
  const initialSymptom = params.state?.symptom || "";
  const initialDisease = params.state?.disease || "";

  const [disease, setDisease] = useState(initialDisease);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!disease.trim()) return;

    setLocationError("");
    setError("");
    setIsLocating(true);
    setResults(null);

    // 1. Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "Your Current Location"
          };
          setUserLocation(loc);
          setIsLocating(false);
          performSearch(loc.lat, loc.lng);
        },
        () => {
          setIsLocating(false);
          setLocationError("Could not access location. Showing results without distance sorting.");
          performSearch(null, null);
        },
        { timeout: 10000 }
      );
    } else {
      setIsLocating(false);
      setLocationError("Geolocation is not supported by your browser.");
      performSearch(null, null);
    }
  };

  const performSearch = async (lat, lon) => {
    setIsSearching(true);
    
    try {
      const body = { disease: disease.trim() };
      if (lat != null && lon != null) {
        body.latitude = lat;
        body.longitude = lon;
      }

      const response = await fetch(`${API_FLASK}/find-doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to find doctors.');
        return;
      }

      setResults(data.doctors || []);
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
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Find Nearby Specialists</h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              Enter a disease or condition, and we'll use your location to find the best matching hospitals and doctors near you.
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
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                placeholder="E.g. Fungal infection, Diabetes, Heart attack..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
              />
            </div>
            
            <button 
              onClick={handleSearch}
              disabled={isLocating || isSearching || !disease.trim()}
              className={`py-4 px-8 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98] duration-200 ${
                isLocating || isSearching || !disease.trim()
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
               <MapPinIcon className="w-4 h-4" /> Using your current location to sort by distance.
             </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-10 text-sm text-rose-800 font-medium flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="text-rose-500 mt-0.5">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
               <div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Matching Hospitals & Doctors</h2>
                 <p className="text-slate-500 font-medium text-sm mt-1">Found {results.length} results for "{disease}"</p>
               </div>
            </div>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {results.map((doc, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-slate-200 shrink-0 relative overflow-hidden">
                         <UserIcon className="w-8 h-8 relative z-10" />
                         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-slate-200"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 leading-tight">{doc.doctor}</h3>
                        <p className="text-emerald-600 font-bold text-sm mt-0.5">{doc.specialty}</p>
                        <p className="text-slate-500 text-xs font-medium mt-1">For: {doc.disease}</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-2xl p-4 flex-1 border border-slate-100 space-y-3">
                      <div className="flex items-start gap-2">
                         <MapPinIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                         <div>
                           <p className="text-sm font-bold text-slate-800">{doc.hospital}</p>
                           {doc.distance_km !== undefined && (
                             <p className="text-xs font-medium text-slate-500">{doc.distance_km} km away</p>
                           )}
                         </div>
                      </div>
                    </div>
                    
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${doc.latitude},${doc.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 mt-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] text-center block"
                    >
                      View on Map
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                 <StethoscopeIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-900">No results found</h3>
                 <p className="text-slate-500 mt-2">Try a different disease name or broader condition.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Doctor;
