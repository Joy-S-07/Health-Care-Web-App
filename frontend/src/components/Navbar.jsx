import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Activity, User } from 'lucide-react';

export default function Navbar() {
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(navRef.current, 
      { y: -50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className="fixed top-6 left-0 w-full z-50 px-4 md:px-8 flex justify-center pointer-events-none">
      <nav ref={navRef} className="pointer-events-auto w-full max-w-5xl rounded-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(31,_41,_55,_0.08)] py-3 px-6 md:px-8 flex justify-between items-center transition-all duration-300">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 text-white p-2.5 rounded-2xl group-hover:scale-105 group-hover:rotate-3 transition-all shadow-lg shadow-teal-500/30">
            <Activity size={22} className="stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-800">
            Medi<span className="text-teal-500">AI</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center bg-slate-100/50 rounded-full p-1.5 border border-slate-200/50 shadow-inner">
          <Link to="/" className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${location.pathname === '/' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Dashboard</Link>
          <Link to="/medicines" className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${location.pathname === '/medicines' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Diagnostics</Link>
          <Link to="/doctors" className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${location.pathname === '/doctors' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Specialists</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
            Sign In
          </Link>
          <Link to="/profile" className="flex items-center justify-center p-3 rounded-full bg-slate-900 text-white hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/30 transition-all group">
            <User size={18} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
