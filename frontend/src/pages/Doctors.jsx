import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MapPin, Star, Phone, Calendar } from 'lucide-react';

const mockDoctors = [
  { id: 1, name: "Dr. Ayesha Khan", spec: "General Physician", dist: "1.2 km", exp: "12 Years", rating: 4.8 },
  { id: 2, name: "Dr. Rahul Sharma", spec: "Neurologist", dist: "3.5 km", exp: "8 Years", rating: 4.6 },
  { id: 3, name: "Dr. Sarah Johnson", spec: "ENT Specialist", dist: "2.8 km", exp: "15 Years", rating: 4.9 },
  { id: 4, name: "Dr. Manoj Desai", spec: "General Physician", dist: "5.0 km", exp: "20 Years", rating: 4.7 }
];

export default function Doctors() {
  const listRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(listRef.current.children,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Nearby Specialists</h1>
        <p className="text-lg text-slate-500 font-medium">Book a consultation with top-rated doctors in your area.</p>
      </div>

      <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockDoctors.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/30 transition-all group flex flex-col cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                  {doc.name.charAt(4)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-primary font-semibold text-sm">{doc.spec}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg text-sm font-bold">
                <Star size={14} fill="currentColor" /> {doc.rating}
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-2 mb-6">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <MapPin size={16} /> {doc.dist}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Calendar size={16} /> {doc.exp}
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <button className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex justify-center items-center transition-colors">
                <Phone size={18} className="mr-2" /> Call
              </button>
              <button className="flex-1 py-3 bg-slate-900 hover:bg-primary text-white font-bold rounded-xl transition-colors">
                Book Slot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
