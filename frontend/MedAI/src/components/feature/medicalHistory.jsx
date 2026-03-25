import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// -- Inline SVGs --
const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const FileTextIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const PillIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
    <path d="m8.5 8.5 7 7"></path>
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const DatabaseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
    <path d="M3 12A9 3 0 0 0 21 12"></path>
  </svg>
);

// Mock Database Records
const MOCK_DB = {
  consultations: [
    { id: "C1", date: "Mar 15, 2026", doctor: "Dr. Emily Rodriguez", specialty: "Cardiologist", diagnosis: "Routine Checkup", facility: "Heart Rhythm Clinic", notes: "Blood pressure is stable. Continue current lifestyle.", status: "Completed" },
    { id: "C2", date: "Jan 10, 2026", doctor: "Dr. Sarah Jenkins", specialty: "General Physician", diagnosis: "Viral Pharyngitis", facility: "City Health Clinic", notes: "Prescribed antibiotics. Advised rest for 3 days.", status: "Resolved" },
    { id: "C3", date: "Nov 22, 2025", doctor: "Dr. Anita Sharma", specialty: "Dermatologist", diagnosis: "Contact Dermatitis", facility: "DermaCare Hospital", notes: "Allergic reaction. Prescribed topical steroid.", status: "Resolved" }
  ],
  prescriptions: [
    { id: "P1", date: "Jan 10, 2026", medicine: "Amoxicillin 500mg", type: "Antibiotic", instructions: "1 tablet every 8 hours for 7 days", doctor: "Dr. Sarah Jenkins", status: "Completed" },
    { id: "P2", date: "Nov 22, 2025", medicine: "Hydrocortisone Cream 1%", type: "Topical Steroid", instructions: "Apply locally twice a day", doctor: "Dr. Anita Sharma", status: "Completed" },
    { id: "P3", date: "Ongoing", medicine: "Vitamin D3 2000 IU", type: "Supplement", instructions: "1 tablet daily after breakfast", doctor: "Self-prescribed", status: "Active" }
  ],
  labReports: [
    { id: "L1", date: "Mar 12, 2026", title: "Complete Blood Count (CBC)", lab: "Metro Diagnostics", result: "Normal", doctor: "Dr. Emily Rodriguez" },
    { id: "L2", date: "Mar 12, 2026", title: "Lipid Panel", lab: "Metro Diagnostics", result: "Slightly Elevated LDL", doctor: "Dr. Emily Rodriguez" },
    { id: "L3", date: "Jan 09, 2026", title: "Throat Swab Culture", lab: "City Health Lab", result: "Strep Negative", doctor: "Dr. Sarah Jenkins" }
  ]
};

const MedicalHistory = () => {
  const [activeTab, setActiveTab] = useState("consultations");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate database fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-slate-900">
            <FileTextIcon className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold tracking-tight">Health History</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Patient Records</h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl">
              Access your complete medical history, fetched directly from your secure database records. View past visits, ongoing prescriptions, and lab test results.
            </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 max-w-fit">
          <button 
            onClick={() => setActiveTab("consultations")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'consultations' ? 'bg-amber-100 text-amber-800 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <CalendarIcon className="w-4 h-4" /> Consultations
          </button>
          <button 
            onClick={() => setActiveTab("prescriptions")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'prescriptions' ? 'bg-violet-100 text-violet-800 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <PillIcon className="w-4 h-4" /> Prescriptions
          </button>
          <button 
            onClick={() => setActiveTab("labReports")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'labReports' ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <ActivityIcon className="w-4 h-4" /> Lab Reports
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center">
             <DatabaseIcon className="w-10 h-10 text-slate-300 animate-pulse mb-4" />
             <p className="text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Fetching Database Records...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Consultations */}
            {activeTab === "consultations" && (
              <div className="space-y-4">
                {MOCK_DB.consultations.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-slate-900">{item.diagnosis}</h3>
                          <p className="text-slate-500 font-medium text-sm mt-1">{item.doctor} • {item.specialty}</p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
                          <span className="text-slate-600 font-bold text-sm bg-slate-100 px-3 py-1 rounded-lg w-fit">{item.date}</span>
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit ${item.status === 'Resolved' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                            {item.status}
                          </span>
                        </div>
                     </div>
                     <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 font-medium">
                       <strong>Notes:</strong> {item.notes}
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* Prescriptions */}
            {activeTab === "prescriptions" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_DB.prescriptions.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                     <div>
                       <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-lg text-slate-900">{item.medicine}</h3>
                         <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                           {item.status}
                         </span>
                       </div>
                       <p className="text-slate-500 text-sm font-bold mb-4">{item.type}</p>
                       <p className="bg-violet-50 text-violet-800 text-sm font-bold p-3 rounded-xl border border-violet-100">
                         {item.instructions}
                       </p>
                     </div>
                     <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-bold">
                       <span>Prescribed: {item.date}</span>
                       <span>By: {item.doctor}</span>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* Lab Reports */}
            {activeTab === "labReports" && (
              <div className="space-y-4">
                {MOCK_DB.labReports.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-blue-200 transition-colors group">
                     <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                           <ActivityIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                          <p className="text-slate-500 text-sm font-medium">{item.lab} • Ordered by {item.doctor}</p>
                          <div className="mt-2 inline-block px-3 py-1 bg-slate-50 text-slate-700 text-sm font-bold rounded-lg border border-slate-200">
                            Result: <span className={item.result === 'Normal' || item.result === 'Strep Negative' ? 'text-emerald-600' : 'text-rose-600'}>{item.result}</span>
                          </div>
                        </div>
                     </div>
                     <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                       <span className="text-sm font-bold text-slate-500">{item.date}</span>
                       <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
                         <DownloadIcon className="w-4 h-4" /> Download
                       </button>
                     </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default MedicalHistory;
