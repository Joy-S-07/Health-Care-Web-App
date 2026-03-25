import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ActivityIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const StethoscopeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

const PillIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
    <path d="m8.5 8.5 7 7"></path>
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

const ChevronRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const HeartPulseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path>
  </svg>
);

const quotes = [
  "Wherever the art of Medicine is loved, there is also a love of Humanity. – Hippocrates",
  "The good physician treats the disease; the great physician treats the patient who has the disease. – William Osler",
  "Medicines cure diseases, but only doctors can cure patients. – Carl Jung",
  "Let food be thy medicine and medicine be thy food. – Hippocrates",
  "The art of healing comes from nature, not from the physician. – Paracelsus"
];

const cards = [
  {
    title: "Symptom Checker",
    description: "Analyze your symptoms instantly using our AI-driven diagnostic tool.",
    icon: <ActivityIcon className="w-8 h-8 text-blue-500" />,
    color: "bg-blue-50 border-blue-100",
    hover: "hover:border-blue-300 hover:shadow-blue-200",
    link: "/symptom-checker"
  },
  {
    title: "Find a Doctor",
    description: "Connect with specialized doctors near you for personalized consultations.",
    icon: <StethoscopeIcon className="w-8 h-8 text-emerald-500" />,
    color: "bg-emerald-50 border-emerald-100",
    hover: "hover:border-emerald-300 hover:shadow-emerald-200",
    link: "/find-doctor"
  },
  {
    title: "Medical Support",
    description: "Get immediate medical assistance and guidance from our AI-powered support system.",
    icon: <PillIcon className="w-8 h-8 text-violet-500" />,
    color: "bg-violet-50 border-violet-100",
    hover: "hover:border-violet-300 hover:shadow-violet-200",
    link: "/medical-support"
  },
  {
    title: "Health History",
    description: "Access and track your complete health records and medical history.",
    icon: <FileTextIcon className="w-8 h-8 text-amber-500" />,
    color: "bg-amber-50 border-amber-100",
    hover: "hover:border-amber-300 hover:shadow-amber-200",
    link: "/health-history"
  }
];

const DashBoard = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 500); // Wait for fade out
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full">


      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        
        {/* Left Content */}
        <div className="flex-1 w-full flex flex-col justify-center space-y-10">
          <div className="space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-sm shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                AI-Powered Healthcare
             </div>
             <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">MedAI</span>
             </h1>
             <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-lg border-l-4 border-slate-300 pl-4">
                A tool which will help you to figure out your disease and prescribe medicines and doctors at one place.
             </p>
          </div>

          {/* Animated Quote Box */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-blue-500 to-indigo-500"></div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-slate-400" /> Moment of Wisdom
            </h3>
            <div className={`transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-2xl font-serif text-slate-800 italic relative z-10 leading-snug">
                "{quotes[quoteIndex].split('–')[0].trim()}"
              </p>
              <p className="text-right text-slate-500 font-bold mt-4">
                — {quotes[quoteIndex].split('–')[1]?.trim()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Content - Cards */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How we can help</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {cards.map((card, index) => {
              const CardInner = (
                <div 
                  className={`group relative overflow-hidden rounded-3xl p-6 border-2 flex flex-col h-full bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${card.hover} border-slate-100 ${card.link ? 'cursor-pointer' : ''}`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 transform -translate-y-2 translate-x-2 text-slate-300">
                    <ActivityIcon className="w-12 h-12" />
                  </div>
                  
                  <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 relative z-10`}>
                    {card.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{card.title}</h3>
                  
                  <p className="text-slate-500 font-medium flex-1 relative z-10 text-sm leading-relaxed">
                    {card.description}
                  </p>
                  
                  <div className="mt-8 flex items-center text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors relative z-10">
                    Try it out <ChevronRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );

              return card.link ? (
                <Link to={card.link} key={index} className="block h-full w-full">
                  {CardInner}
                </Link>
              ) : (
                <div key={index} className="h-full w-full">
                  {CardInner}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-900">
            <HeartPulseIcon className="w-6 h-6 text-rose-500" />
            <span className="font-extrabold tracking-tight text-lg">MedAI &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact Us</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashBoard;