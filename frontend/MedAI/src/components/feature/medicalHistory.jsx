import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, isLoggedIn } from '../../utils/authUtils';

// -- Inline SVGs --
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

const DatabaseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
    <path d="M3 12A9 3 0 0 0 21 12"></path>
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const MedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await apiFetch('/history');
      setRecords(data.records || []);
    } catch (err) {
      if (!isLoggedIn()) {
        setError("Please log in to view your health history.");
      } else {
        setError("Failed to load your health history. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/history/${id}`, { method: 'DELETE' });
      setRecords(prev => prev.filter(r => r._id !== id));
    } catch {
      // ignore
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col w-full">

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Your Health History</h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl">
              View your past AI symptom analysis results. Each record shows the disease predicted, symptoms provided, medications suggested, and more.
            </p>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center">
             <DatabaseIcon className="w-10 h-10 text-slate-300 animate-pulse mb-4" />
             <p className="text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Loading Your Records...</p>
          </div>
        ) : error ? (
          <div className="w-full py-20 flex flex-col items-center justify-center">
            <ActivityIcon className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-600 font-bold text-lg">{error}</p>
            {!isLoggedIn() && (
              <Link to="/login" className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md">
                Sign In
              </Link>
            )}
          </div>
        ) : records.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center">
            <FileTextIcon className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No History Yet</h3>
            <p className="text-slate-500 font-medium text-center max-w-md">
              Your health history will appear here after you use the Symptom Checker. Each analysis will be saved automatically.
            </p>
            <Link to="/symptom-checker" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md">
              Try Symptom Checker
            </Link>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            {records.map((record) => (
              <div key={record._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Header */}
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === record._id ? null : record._id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                        <ActivityIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900">{record.predictedDisease}</h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                          Symptoms: {record.symptoms?.join(', ').replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-bold text-sm bg-slate-100 px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {formatDate(record.createdAt)}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(record._id); }}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete record"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === record._id && (
                  <div className="px-6 pb-6 pt-0 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Description */}
                      {record.description && (
                        <div className="md:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Description</p>
                          <p className="text-slate-700 font-medium text-sm">{record.description}</p>
                        </div>
                      )}

                      {/* Precautions */}
                      {record.precautions?.length > 0 && (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                          <p className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2">Precautions</p>
                          <ul className="space-y-1.5">
                            {record.precautions.map((p, i) => (
                              <li key={i} className="text-sm text-amber-900 font-medium flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Medications */}
                      {record.medications?.length > 0 && (
                        <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                          <p className="text-sm font-bold text-violet-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <PillIcon className="w-3.5 h-3.5" /> Medications
                          </p>
                          <ul className="space-y-1.5">
                            {record.medications.map((m, i) => (
                              <li key={i} className="text-sm text-violet-900 font-medium flex items-start gap-2">
                                <span className="text-violet-500 mt-0.5">•</span> {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Diets */}
                      {record.diets?.length > 0 && (
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                          <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">Diet</p>
                          <div className="flex flex-wrap gap-2">
                            {record.diets.map((d, i) => (
                              <span key={i} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">{d}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Workouts */}
                      {record.workouts?.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <p className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">Activities</p>
                          <ul className="space-y-1.5">
                            {record.workouts.slice(0, 5).map((w, i) => (
                              <li key={i} className="text-sm text-blue-900 font-medium flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicalHistory;
