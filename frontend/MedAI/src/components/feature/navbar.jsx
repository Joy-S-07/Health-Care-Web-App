import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const HeartPulseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path>
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  if (location.pathname === '/login') return null;

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Symptom Checker', path: '/symptom-checker' },
    { name: 'Find Doctor', path: '/find-doctor' },
    { name: 'Medical Support', path: '/medical-support' },
    { name: 'Health History', path: '/health-history' },
  ];

  return (
    <div className="w-full flex justify-center sticky top-6 z-50 px-4 pointer-events-none">
      <header className="w-full md:w-[85vw] lg:w-[70vw] bg-white/60 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50 transition-colors rounded-full pointer-events-auto">
        <div className="w-full px-5 sm:px-8">
          <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-slate-900 group">
            <HeartPulseIcon className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-extrabold tracking-tight">MedAI</span>
          </Link>

          {/* Nav Links */}
          <nav 
            className="hidden md:flex items-center gap-1 relative"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {navLinks.map((link) => {
              const activePath = hoveredPath || location.pathname;
              const isCurrentlyActiveTab = activePath === link.path;
              const isStrictlyActive = location.pathname === link.path;
              
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-colors z-10 ${
                    isCurrentlyActiveTab || isStrictlyActive
                      ? 'text-slate-900' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="relative z-20">{link.name}</span>
                  
                  {/* Fluid Shifting Indicator */}
                  {isCurrentlyActiveTab && (
                     <motion.div 
                       layoutId="navbar-indicator"
                       className="absolute inset-0 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/80 rounded-xl z-0"
                       transition={{ 
                         type: "spring", 
                         stiffness: 350, 
                         damping: 30,
                         mass: 1.2
                       }}
                     />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth & Profile */}
          <div className="flex items-center gap-4">
             {!isAuthenticated ? (
               <Link to="/login" className="hidden sm:flex px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 text-sm items-center gap-2">
                 Sign In
               </Link>
             ) : (
               <Link to="/profile" title="Patient Profile" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border-2 border-transparent hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                     <circle cx="12" cy="7" r="4"></circle>
                  </svg>
               </Link>
             )}
          </div>
        </div>
      </div>
      </header>
    </div>
    
  );
};

export default Navbar;
