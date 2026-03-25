import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

// --- Mock Data ---
const MOCK_USER = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, USA",
  age: 28,
  gender: "Male",
  bloodGroup: "O+",
  height: "180 cm",
  weight: "75 kg",
  allergies: ["Penicillin", "Peanuts", "Dust Mites"],
  conditions: ["Mild Asthma", "Seasonal Allergies"],
  memberSince: "January 2024"
};

const VitalCard = ({ title, value, unit }) => (
  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center items-center text-center shadow-sm">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</span>
    <span className="text-xl font-extrabold text-slate-900">{value}</span>
    {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
  </div>
);

const HistoryItem = ({ date, title, doctor, status }) => {
  const isCompleted = status === 'Completed';
  return (
    <div className="flex bg-white/60 p-4 rounded-2xl border border-slate-100 shadow-sm gap-4 items-center hover:bg-white transition-colors cursor-pointer">
      <div className={`p-3 rounded-full flex-shrink-0 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
        <CalendarSvg className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900 text-sm md:text-base">{title}</h4>
        <p className="text-xs md:text-sm text-slate-500 font-medium">{doctor} • {date}</p>
      </div>
      <div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
      <motion.div 
        className="flex flex-col md:flex-row gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        
        {/* Left Column: Profile Card */}
        <motion.div className="w-full md:w-1/3 flex flex-col gap-6" layout>
           <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-200/60 flex flex-col items-center text-center relative overflow-hidden">
             {/* Decorative Background Glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             
             <div className="w-32 h-32 rounded-full overflow-hidden mb-5 ring-4 ring-white shadow-xl bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center relative z-10">
                <UserSvg className="w-16 h-16 text-blue-500" />
             </div>
             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight relative z-10">{MOCK_USER.name}</h2>
             <p className="text-sm font-bold text-blue-500 mb-8 relative z-10">Patient ID: #MED-8842</p>

             <div className="w-full flex flex-col gap-3 text-left relative z-10">
                {/* Contact Info Rows */}
                <div className="flex items-center gap-4 text-slate-800 bg-white/80 p-3.5 rounded-2xl shadow-sm border border-slate-100/50">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                    <MailSvg className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold">{MOCK_USER.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-800 bg-white/80 p-3.5 rounded-2xl shadow-sm border border-slate-100/50">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                    <PhoneSvg className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold">{MOCK_USER.phone}</span>
                </div>

                {/* Logout Button */}
                <button onClick={handleLogout} className="mt-4 w-full py-3 bg-rose-50/50 text-rose-600 rounded-2xl font-bold transition-all hover:bg-rose-100/80 hover:text-rose-700 flex items-center justify-center gap-2 border border-rose-100 shadow-sm active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Sign Out
                </button>
             </div>
           </div>
        </motion.div>

        {/* Right Column: Vitals & History Summary */}
        <div className="w-full md:w-2/3 flex flex-col gap-8">
           
           {/* Vitals Grid */}
           <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4" layout>
              <VitalCard title="Age" value={MOCK_USER.age} unit="Years" />
              <VitalCard title="Blood" value={MOCK_USER.bloodGroup} unit="Type" />
              <VitalCard title="Height" value={MOCK_USER.height.split(" ")[0]} unit="cm" />
              <VitalCard title="Weight" value={MOCK_USER.weight.split(" ")[0]} unit="kg" />
           </motion.div>

           {/* Health Information Overview */}
           <motion.div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-200/60" layout>
             <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
               <ShieldSvg className="w-6 h-6 text-rose-500"/> Clinical Overview
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Known Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_USER.allergies.map(a => (
                      <span key={a} className="px-3.5 py-1.5 bg-rose-50/80 text-rose-600 rounded-full text-sm font-bold border border-rose-100/50 shadow-sm">{a}</span>
                    ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Chronic Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_USER.conditions.map(c => (
                      <span key={c} className="px-3.5 py-1.5 bg-amber-50/80 text-amber-600 rounded-full text-sm font-bold border border-amber-100/50 shadow-sm">{c}</span>
                    ))}
                  </div>
               </div>
             </div>
           </motion.div>

            {/* History Summary */}
            <motion.div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-200/60 relative overflow-hidden" layout>
             <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl -mr-20 -mb-20"></div>
             
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
               <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
               <button className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                  View Full History
               </button>
             </div>

             <div className="space-y-4 relative z-10">
                <HistoryItem date="Oct 24, 2026" title="General Consultation" doctor="Dr. Sarah Jenkins" status="Completed" />
                <HistoryItem date="Sep 12, 2026" title="Blood Test (CBC)" doctor="City Labs" status="Report Ready" />
                <HistoryItem date="Aug 05, 2026" title="Cardiology Review" doctor="Dr. Robert Chen" status="Completed" />
             </div>
           </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
