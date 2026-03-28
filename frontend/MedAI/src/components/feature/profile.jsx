import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, logout, isLoggedIn } from '../../utils/authUtils';

// --- Icons ---
const UserSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MailSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const PhoneSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const ShieldSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.8 0 4.7.8 6.6 1.8a1 1 0 0 1 .4.8z"></path>
  </svg>
);

const CalendarSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
);

const PencilSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
    <path d="m15 5 4 4"></path>
  </svg>
);

const CheckSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const XSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Vital Card (view / edit) ---
const VitalCard = ({ title, value, unit, editing, editValue, onChange }) => (
  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center items-center text-center shadow-sm">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</span>
    {editing ? (
      <input
        type={title === 'Age' ? 'number' : 'text'}
        value={editValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-center text-lg font-extrabold text-slate-900 bg-white border border-slate-200 rounded-xl py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        placeholder="—"
      />
    ) : (
      <span className="text-xl font-extrabold text-slate-900">{value || '—'}</span>
    )}
    {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
  </div>
);

const HistoryItem = ({ id, disease, symptoms, date, onRemove }) => {
  const formattedDate = (() => {
    try {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return date; }
  })();
  return (
    <div className="flex bg-white/60 p-4 rounded-2xl border border-slate-100 shadow-sm gap-4 items-center hover:bg-white transition-colors group/item">
      <div className="p-3 rounded-full flex-shrink-0 bg-blue-100 text-blue-600">
        <CalendarSvg className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">{disease}</h4>
        <p className="text-xs md:text-sm text-slate-500 font-medium truncate">
          {symptoms?.map(s => s.replace(/_/g, ' ')).join(', ') || 'No symptoms'} • {formattedDate}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
          AI Analysis
        </span>
        {onRemove && (
          <button
            onClick={() => onRemove(id)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover/item:opacity-100 transition-all"
            title="Remove"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Loading skeleton
const ProfileSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10 animate-pulse">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3">
        <div className="bg-white/70 rounded-[2rem] p-8 shadow-xl border border-slate-200/60 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-slate-200 mb-5" />
          <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-32 bg-slate-200 rounded-lg mb-8" />
          <div className="w-full space-y-3">
            <div className="h-14 bg-slate-100 rounded-2xl" />
            <div className="h-14 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/3 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
        </div>
        <div className="h-48 bg-white/70 rounded-[2rem] border border-slate-200/60" />
      </div>
    </div>
  </div>
);

// --- Edit Form Field ---
const EditField = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
    />
  </div>
);

const EditSelect = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const EditTextarea = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm resize-none"
    />
  </div>
);

const MAX_IMAGE_SIZE = 20 * 1024; // 20KB



const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [editForm, setEditForm] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const fileInputRef = React.useRef(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Fetch real prediction history from API
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isLoggedIn()) {
        setHistoryLoading(false);
        return;
      }
      try {
        const data = await apiFetch('/history');
        setHistory(data.records || []);
      } catch {
        // User might not be logged in or no history
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const removeHistoryItem = async (id) => {
    try {
      await apiFetch(`/history/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch {
      // ignore
    }
  };

  const clearAllHistory = async () => {
    try {
      // Delete all records one by one
      await Promise.all(history.map(item => apiFetch(`/history/${item._id}`, { method: 'DELETE' })));
      setHistory([]);
    } catch {
      // ignore
    }
    setShowClearConfirm(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError('');

    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(`Image must be under 20KB. Yours is ${(file.size / 1024).toFixed(1)}KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await apiFetch('/auth/profile');
        setUser(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('sign in') || err.message.includes('Access denied')) {
          await logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const startEditing = () => {
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      age: user.age || '',
      gender: user.gender || '',
      bloodGroup: user.bloodGroup || '',
      height: user.height?.replace(' cm', '') || '',
      weight: user.weight?.replace(' kg', '') || '',
      allergies: user.allergies?.join(', ') || '',
      conditions: user.conditions?.join(', ') || '',
    });
    setImagePreview(null);
    setImageError('');
    setEditing(true);
    setSaveSuccess('');
  };

  const cancelEditing = () => {
    setEditing(false);
    setImagePreview(null);
    setImageError('');
    setSaveSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess('');
    try {
      const payload = {
        name: editForm.name || undefined,
        phone: editForm.phone || undefined,
        age: editForm.age ? Number(editForm.age) : undefined,
        gender: editForm.gender || undefined,
        bloodGroup: editForm.bloodGroup || undefined,
        height: editForm.height ? `${editForm.height} cm` : undefined,
        weight: editForm.weight ? `${editForm.weight} kg` : undefined,
        allergies: editForm.allergies ? editForm.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        conditions: editForm.conditions ? editForm.conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (imagePreview) payload.profileImage = imagePreview;

      const res = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setUser(res.user);
      setEditing(false);
      setSaveSuccess('Profile updated successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return <ProfileSkeleton />;

  if (error && !user) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl font-medium">
          {error}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
      {/* Success Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 font-bold text-sm flex items-center gap-2"
          >
            <CheckSvg className="w-4 h-4" /> {saveSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="flex flex-col md:flex-row gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        
        {/* Left Column: Profile Card */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
           <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-200/60 flex flex-col items-center text-center relative overflow-hidden">
             {/* Decorative Background Glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             
             <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
             <div
               className={`w-32 h-32 rounded-full overflow-hidden mb-3 ring-4 ring-white shadow-xl bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center relative z-10 group ${editing ? 'cursor-pointer' : ''}`}
               onClick={() => editing && fileInputRef.current?.click()}
             >
                {(imagePreview || user.profileImage) ? (
                  <img src={imagePreview || user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserSvg className="w-16 h-16 text-blue-500" />
                )}
                {editing && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                  </div>
                )}
             </div>
             {editing && imageError && (
               <p className="text-xs text-rose-500 font-bold mb-2 relative z-10">{imageError}</p>
             )}
             {editing && (
               <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="text-xs font-bold text-blue-500 hover:text-blue-700 mb-3 relative z-10 flex items-center gap-1 transition-colors"
               >
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                   <circle cx="12" cy="13" r="3"/>
                 </svg>
                 Upload Photo (max 20KB)
               </button>
             )}

             {editing ? (
               <div className="w-full relative z-10 mb-4">
                 <EditField label="Name" value={editForm.name} onChange={(v) => updateField('name', v)} placeholder="Your name" />
               </div>
             ) : (
               <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight relative z-10">{user.name}</h2>
             )}

             <p className="text-sm font-bold text-blue-500 mb-2 relative z-10">Member since {memberSince}</p>
             <p className="text-xs text-slate-400 font-medium mb-6 relative z-10">ID: {user._id?.slice(-8).toUpperCase()}</p>

             <div className="w-full flex flex-col gap-3 text-left relative z-10">
                <div className="flex items-center gap-4 text-slate-800 bg-white/80 p-3.5 rounded-2xl shadow-sm border border-slate-100/50">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                    <MailSvg className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold">{user.email}</span>
                </div>

                {editing ? (
                  <div className="bg-white/80 p-3.5 rounded-2xl shadow-sm border border-slate-100/50">
                    <EditField label="Phone" type="tel" value={editForm.phone} onChange={(v) => updateField('phone', v)} placeholder="+91 98765 43210" />
                  </div>
                ) : user.phone ? (
                  <div className="flex items-center gap-4 text-slate-800 bg-white/80 p-3.5 rounded-2xl shadow-sm border border-slate-100/50">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                      <PhoneSvg className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold">{user.phone}</span>
                  </div>
                ) : null}

                {/* Edit / Save / Cancel Buttons */}
                {editing ? (
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold transition-all hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-60"
                    >
                      {saving ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                      ) : (
                        <><CheckSvg className="w-5 h-5" /> Save</>
                      )}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all hover:bg-slate-200 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <XSvg className="w-5 h-5" /> Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startEditing}
                    className="mt-2 w-full py-3 bg-blue-50/50 text-blue-600 rounded-2xl font-bold transition-all hover:bg-blue-100/80 hover:text-blue-700 flex items-center justify-center gap-2 border border-blue-100 shadow-sm active:scale-95"
                  >
                    <PencilSvg className="w-5 h-5" /> Edit Profile
                  </button>
                )}

                {/* Logout Button */}
                {!editing && (
                  <button onClick={handleLogout} className="w-full py-3 bg-rose-50/50 text-rose-600 rounded-2xl font-bold transition-all hover:bg-rose-100/80 hover:text-rose-700 flex items-center justify-center gap-2 border border-rose-100 shadow-sm active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Sign Out
                  </button>
                )}
             </div>
           </div>
        </div>

        {/* Right Column: Vitals & Health */}
        <div className="w-full md:w-2/3 flex flex-col gap-8">
           
           {/* Vitals Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <VitalCard title="Age" value={user.age} unit="Years" editing={editing} editValue={editForm.age} onChange={(v) => updateField('age', v)} />
              <VitalCard title="Blood" value={user.bloodGroup} unit="Type" editing={editing} editValue={editForm.bloodGroup} onChange={(v) => updateField('bloodGroup', v)} />
              <VitalCard title="Height" value={user.height?.split(" ")[0]} unit="cm" editing={editing} editValue={editForm.height} onChange={(v) => updateField('height', v)} />
              <VitalCard title="Weight" value={user.weight?.split(" ")[0]} unit="kg" editing={editing} editValue={editForm.weight} onChange={(v) => updateField('weight', v)} />
           </div>

           {/* Edit Mode: Extra Fields */}
           <AnimatePresence>
             {editing && (
               <motion.div
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-blue-200/60 overflow-hidden"
               >
                 <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                   <PencilSvg className="w-5 h-5 text-blue-500" /> Edit Details
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <EditSelect label="Gender" value={editForm.gender} onChange={(v) => updateField('gender', v)} placeholder="Select gender" options={['Male', 'Female', 'Other', 'Prefer not to say']} />
                   <EditSelect label="Blood Group" value={editForm.bloodGroup} onChange={(v) => updateField('bloodGroup', v)} placeholder="Select blood group" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
                   <EditTextarea label="Allergies (comma separated)" value={editForm.allergies} onChange={(v) => updateField('allergies', v)} placeholder="e.g. Peanuts, Penicillin" />
                   <EditTextarea label="Conditions (comma separated)" value={editForm.conditions} onChange={(v) => updateField('conditions', v)} placeholder="e.g. Diabetes, Asthma" />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Health Information Overview (view mode) */}
           {!editing && (
             <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-200/60">
               <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                 <ShieldSvg className="w-6 h-6 text-rose-500"/> Clinical Overview
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Known Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.allergies?.length > 0 ? user.allergies.map(a => (
                        <span key={a} className="px-3.5 py-1.5 bg-rose-50/80 text-rose-600 rounded-full text-sm font-bold border border-rose-100/50 shadow-sm">{a}</span>
                      )) : (
                        <span className="text-sm text-slate-400 font-medium">None recorded</span>
                      )}
                    </div>
                 </div>
                 <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Chronic Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.conditions?.length > 0 ? user.conditions.map(c => (
                        <span key={c} className="px-3.5 py-1.5 bg-amber-50/80 text-amber-600 rounded-full text-sm font-bold border border-amber-100/50 shadow-sm">{c}</span>
                      )) : (
                        <span className="text-sm text-slate-400 font-medium">None recorded</span>
                      )}
                    </div>
                 </div>
               </div>
             </div>
           )}

            {/* History Summary */}
            {!editing && (
              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-200/60 relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl -mr-20 -mb-20"></div>
               
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
                 <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
                 <div className="flex gap-2">
                   {history.length > 0 && (
                     <button
                       onClick={() => setShowClearConfirm(true)}
                       className="text-sm font-bold text-rose-500 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                         <polyline points="3 6 5 6 21 6"></polyline>
                         <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                       </svg>
                       Clear All
                     </button>
                   )}
                   <Link to="/health-history" className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">View Full History</Link>
                 </div>
               </div>

               {/* Clear All Confirmation */}
               <AnimatePresence>
                 {showClearConfirm && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="mb-4 relative z-10 overflow-hidden"
                   >
                     <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                       <p className="text-sm font-bold text-rose-700">Are you sure you want to clear all history?</p>
                       <div className="flex gap-2">
                         <button
                           onClick={clearAllHistory}
                           className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors active:scale-95"
                         >
                           Yes, Clear All
                         </button>
                         <button
                           onClick={() => setShowClearConfirm(false)}
                           className="px-4 py-2 bg-white text-slate-600 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors active:scale-95"
                         >
                           Cancel
                         </button>
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

                <div className="space-y-4 relative z-10">
                  {historyLoading ? (
                    <div className="text-center py-8">
                      <svg className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                      </svg>
                      <p className="text-sm text-slate-400 font-medium animate-pulse">Loading history...</p>
                    </div>
                  ) : history.length > 0 ? (
                    history.slice(0, 5).map(item => (
                      <HistoryItem
                        key={item._id}
                        id={item._id}
                        disease={item.predictedDisease}
                        symptoms={item.symptoms}
                        date={item.createdAt}
                        onRemove={removeHistoryItem}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                      </svg>
                      <p className="text-sm text-slate-400 font-medium mb-3">No prediction history yet</p>
                      <Link
                        to="/symptom-checker"
                        className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        Try the Symptom Checker
                      </Link>
                    </div>
                  )}
                </div>
               </div>
            )}

        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
