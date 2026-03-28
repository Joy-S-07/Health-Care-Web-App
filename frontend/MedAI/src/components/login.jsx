import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setLocalAuth } from '../utils/authUtils';

const Login = () => {
  // View modes: 'signin-email' | 'signin-otp' | 'signup-email' | 'signup-otp' | 'signup-name'
  const [view, setView] = useState('signin-email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const clearMessages = () => { setError(''); setSuccess(''); };
  const resetOtp = () => setOtp('');

  // ─── Sign In: Send OTP ────────────────────
  const handleSignInSendOTP = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await apiFetch('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email, purpose: 'login' }),
      });
      setSuccess('OTP sent! Check your email.');
      resetOtp();
      setView('signin-otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Sign In: Verify OTP → Login ─────────
  const handleSignInVerify = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      // OTP verified, now login (creates session)
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setLocalAuth(true);
      navigate(data.user?.profileCompleted ? '/profile' : '/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Sign Up: Send OTP ────────────────────
  const handleSignUpSendOTP = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await apiFetch('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email, purpose: 'signup' }),
      });
      setSuccess('OTP sent! Check your email.');
      resetOtp();
      setView('signup-otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Sign Up: Verify OTP ─────────────────
  const handleSignUpVerifyOTP = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      setSuccess('Email verified! Enter your name.');
      setView('signup-name');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Sign Up: Register ───────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email }),
      });
      setLocalAuth(true);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Shared UI Components ─────────────────
  const InputField = ({ label, type = 'text', value, onChange, placeholder }) => (
    <div>
      <label className="block text-sm font-bold text-slate-900 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200"
        placeholder={placeholder}
        required
      />
    </div>
  );

  const OTPField = ({ value, onChange }) => (
    <div>
      <label className="block text-sm font-bold text-slate-900 mb-2">Verification Code</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-2xl text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200"
        placeholder="000000"
        maxLength={6}
        required
      />
    </div>
  );

  const SubmitButton = ({ text }) => (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-4 mt-2 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98] duration-200 flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
      ) : text}
    </button>
  );

  const StatusMessages = () => (
    <>
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          {success}
        </div>
      )}
    </>
  );

  const StepIndicator = ({ current, total }) => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= current ? 'w-8 bg-slate-900' : 'w-4 bg-slate-200'}`} />
      ))}
    </div>
  );

  const BackButton = ({ onClick }) => (
    <button
      type="button"
      onClick={() => { clearMessages(); onClick(); }}
      className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-xl hover:bg-slate-50 z-20"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
    </button>
  );

  // ─── Views ────────────────────────────────
  const renderSignInEmail = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-slate-500 mt-2 font-medium">We'll send a verification code to your email.</p>
      </div>
      <form className="space-y-5" onSubmit={handleSignInSendOTP}>
        <StatusMessages />
        <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <SubmitButton text="Send OTP" />
      </form>
      <p className="text-center text-slate-600 font-medium mt-8">
        Don't have an account?{' '}
        <button onClick={() => { clearMessages(); setView('signup-email'); }} className="font-bold text-slate-900 hover:underline focus:outline-none ml-1 transition-all">Sign up</button>
      </p>
    </>
  );

  const renderSignInOTP = () => (
    <>
      <BackButton onClick={() => setView('signin-email')} />
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Enter OTP</h2>
        <p className="text-slate-500 mt-2 font-medium">Code sent to <span className="font-bold text-slate-700">{email}</span></p>
      </div>
      <StepIndicator current={2} total={2} />
      <form className="space-y-5" onSubmit={handleSignInVerify}>
        <StatusMessages />
        <OTPField value={otp} onChange={setOtp} />
        <SubmitButton text="Verify & Sign In" />
        <button type="button" onClick={handleSignInSendOTP} disabled={loading} className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50">
          Resend code
        </button>
      </form>
    </>
  );

  const renderSignUpEmail = () => (
    <>
      <BackButton onClick={() => setView('signin-email')} />
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
        <p className="text-slate-500 mt-2 font-medium">We'll verify your email with an OTP.</p>
      </div>
      <StepIndicator current={1} total={3} />
      <form className="space-y-5" onSubmit={handleSignUpSendOTP}>
        <StatusMessages />
        <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <SubmitButton text="Send Verification Code" />
      </form>
      <p className="text-center text-slate-600 font-medium mt-8">
        Already have an account?{' '}
        <button onClick={() => { clearMessages(); setView('signin-email'); }} className="font-bold text-slate-900 hover:underline focus:outline-none ml-1 transition-all">Sign in</button>
      </p>
    </>
  );

  const renderSignUpOTP = () => (
    <>
      <BackButton onClick={() => setView('signup-email')} />
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Verify Email</h2>
        <p className="text-slate-500 mt-2 font-medium">Enter the 6-digit code sent to <span className="font-bold text-slate-700">{email}</span></p>
      </div>
      <StepIndicator current={2} total={3} />
      <form className="space-y-5" onSubmit={handleSignUpVerifyOTP}>
        <StatusMessages />
        <OTPField value={otp} onChange={setOtp} />
        <SubmitButton text="Verify Code" />
        <button type="button" onClick={handleSignUpSendOTP} disabled={loading} className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50">
          Resend code
        </button>
      </form>
    </>
  );

  const renderSignUpName = () => (
    <>
      <BackButton onClick={() => setView('signup-otp')} />
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Almost There!</h2>
        <p className="text-slate-500 mt-2 font-medium">What should we call you?</p>
      </div>
      <StepIndicator current={3} total={3} />
      <form className="space-y-5" onSubmit={handleRegister}>
        <StatusMessages />
        <InputField label="Full Name" value={name} onChange={setName} placeholder="John Doe" />
        <SubmitButton text="Create Account" />
      </form>
    </>
  );

  const viewMap = {
    'signin-email': renderSignInEmail,
    'signin-otp': renderSignInOTP,
    'signup-email': renderSignUpEmail,
    'signup-otp': renderSignUpOTP,
    'signup-name': renderSignUpName,
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="relative w-full max-w-md min-h-[600px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col justify-center px-10 py-10">
        {viewMap[view]?.()}
      </div>
    </div>
  );
};

export default Login;