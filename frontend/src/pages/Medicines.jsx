import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Pill, AlertTriangle } from 'lucide-react';

export default function Medicines() {
  const location = useLocation();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const prediction = location.state?.prediction;

  useEffect(() => {
    if (prediction) {
      gsap.fromTo(cardRef.current,
        { scale: 0.9, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }
  }, [prediction]);

  if (!prediction) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 mb-4">No Data Found</h2>
        <p className="text-slate-500 mb-8">Please enter your symptoms on the home page first.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-primary transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Analysis Result</h1>
        <p className="text-lg text-slate-500 font-medium">Based on your symptoms, here is the AI-generated insight.</p>
      </div>

      <div ref={cardRef} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-0"></div>
        
        <div className="bg-teal-50 p-6 rounded-3xl text-primary shrink-0 z-10">
          <Pill size={64} />
        </div>
        
        <div className="z-10 w-full">
          <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Recommended Medicine</h2>
          <p className="text-3xl md:text-5xl font-black text-slate-900 mb-6 font-serif">
            {prediction.medicine}
          </p>

          <div className="h-px w-full bg-slate-100 my-6"></div>

          <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Recommended Specialist</h2>
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
            <p className="text-2xl font-bold text-primary">
              {prediction.specialist}
            </p>
            <button 
              onClick={() => navigate('/doctors')}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md"
            >
              Find Nearby doctors
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-center text-sm text-slate-400 mt-8 font-medium max-w-2xl mx-auto">
        Disclaimer: This is an AI-generated suggestion and does not substitute professional medical advice. Always consult with a certified healthcare provider before taking any medication.
      </p>
    </div>
  );
}
