import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { User, Mail, ShieldCheck, Activity, Calendar } from 'lucide-react';

export default function Profile() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  
  const email = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    gsap.fromTo(containerRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );
  }, [navigate, token]);

  if (!token) return null;

  return (
    <div className="pt-24 pb-12 max-w-4xl mx-auto" ref={containerRef}>
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-white flex items-center justify-center text-4xl font-black shadow-lg shadow-teal-500/30">
          {email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Profile</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2 mt-2">
            <Mail size={16} /> {email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl w-max">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Security</h2>
          <p className="text-slate-500 text-sm">Your account is secured with email OTP authentication.</p>
          <div className="mt-4 px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-lg w-max border border-green-200">
            Verified
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl w-max">
            <Activity size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Health Records</h2>
          <p className="text-slate-500 text-sm">View your past AI diagnostic suggestions and connected specialists.</p>
          <button className="mt-4 text-teal-600 font-bold hover:text-teal-700 w-max flex items-center gap-2 transition-colors">
            View History <Activity size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
