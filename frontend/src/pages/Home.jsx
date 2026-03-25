import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Stethoscope, Activity, User, ShieldCheck, HeartPulse, Quote, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const containerRef = useRef(null);
  const quoteRef = useRef(null);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Beautiful stagger animation for cards
    gsap.fromTo('.dash-item',
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.2)' }
    );
    
    // Animate Quote
    gsap.fromTo(quoteRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
    );
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!symptoms) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/medical/predict', { symptoms });
      if (res.data.success) {
        navigate('/medicines', { state: { prediction: res.data } });
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching ML service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 max-w-6xl mx-auto" ref={containerRef}>
      {/* Header Section */}
      <div className="dash-item flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Good Morning, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">How are you feeling?</span>
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-500 max-w-xl">
            Access your AI diagnostics, find specialists, or manage your health profile from your personal command center.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
          <HeartPulse className="text-rose-500 animate-pulse" />
          <span className="font-bold text-slate-700">System Online</span>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Symptom Checker Card (Span 2) */}
        <div className="dash-item md:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
          <div className="absolute -right-16 -top-16 bg-teal-50 w-64 h-64 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10 flex items-center gap-4 mb-6">
            <div className="p-3 bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-500/30">
              <Stethoscope size={28} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">New Diagnosis</h2>
          </div>
          
          <form onSubmit={handlePredict} className="relative z-10">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail (e.g., 'I have a sharp headache and fever...')"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl p-5 mb-4 h-32 resize-none focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 transition-all font-medium text-lg placeholder:text-slate-400"
            ></textarea>
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-teal-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-slate-900/20 hover:shadow-teal-500/40"
              >
                {loading ? 'Analyzing...' : <>Run AI Analysis <ArrowRight size={18} /></>}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Links Column */}
        <div className="dash-item flex flex-col gap-6">
          <Link to="/doctors" className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 flex-1 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-900/20 transition-all">
            <div className="absolute right-0 bottom-0 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Activity size={120} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Find Specialists</h3>
            <p className="text-slate-400 font-medium text-sm mb-6 relative z-10">Book appointments with top-rated nearby doctors.</p>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md group-hover:bg-white group-hover:text-slate-900 transition-colors relative z-10">
              <ArrowRight size={20} />
            </div>
          </Link>

          <Link to="/login" className="bg-white rounded-3xl p-8 flex-1 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-teal-200 transition-all">
             <div className="absolute right-0 bottom-0 opacity-5 scale-150 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <ShieldCheck size={120} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Secure Login</h3>
            <p className="text-slate-500 font-medium text-sm mb-6 relative z-10">Access your saved reports and history.</p>
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors relative z-10">
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>
      </div>

      {/* Doctor's Quote Section */}
      <div ref={quoteRef} className="dash-item mt-12 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <Quote className="absolute top-6 left-6 text-teal-200/50 rotate-180" size={80} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-serif italic text-slate-800 leading-relaxed mb-6">
            "The good physician treats the disease; the great physician treats the patient who has the disease."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-teal-300"></div>
            <p className="font-bold tracking-widest text-teal-700 uppercase text-sm">Sir William Osler</p>
            <div className="w-12 h-px bg-teal-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
