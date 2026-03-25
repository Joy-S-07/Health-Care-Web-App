import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';
import { Mail, Key, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { scale: 0.9, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/send-otp', { email });
      if (res.data.success) {
        setStep(2);
      }
    } catch (err) {
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/verify-otp', { email, otp });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', res.data.email);
        navigate('/');
      }
    } catch (err) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div ref={cardRef} className="w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-teal-50 rounded-2xl text-primary">
            <ShieldCheck size={40} />
          </div>
        </div>
        <h2 className="text-3xl font-black text-center text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-center text-slate-500 font-medium mb-8">
          {step === 1 ? 'Enter your email to receive a secure OTP.' : 'We sent a 6-digit code to your email.'}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide transition-colors"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium tracking-widest text-slate-800 text-center text-lg"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary hover:bg-teal-600 text-white font-bold tracking-wide transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-slate-500 font-medium hover:text-slate-800 transition-colors"
            >
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
