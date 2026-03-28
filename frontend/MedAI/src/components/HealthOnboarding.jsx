import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, isLoggedIn } from '../utils/authUtils';

const HealthOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    age: '',
    gender: '',
    bloodGroup: '',
    height: '',
    weight: '',
    phone: '',
    allergies: '',
    conditions: '',
  });

  useEffect(() => {
    if (!isLoggedIn()) navigate('/login');
  }, [navigate]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        bloodGroup: form.bloodGroup || undefined,
        height: form.height ? `${form.height} cm` : undefined,
        weight: form.weight ? `${form.weight} kg` : undefined,
        phone: form.phone || undefined,
        allergies: form.allergies ? form.allergies.split(',').map((s) => s.trim()).filter(Boolean) : [],
        conditions: form.conditions ? form.conditions.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };

      await apiFetch('/auth/onboarding', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await apiFetch('/auth/onboarding', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      navigate('/profile');
    } catch {
      navigate('/profile');
    }
  };

  // ─── Steps config ───
  const totalSteps = 3;

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i + 1 <= step ? 'w-10 bg-slate-900' : 'w-5 bg-slate-200'
          }`}
        />
      ))}
    </div>
  );

  const InputField = ({ label, type = 'text', value, onChange, placeholder, unit }) => (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200 pr-14"
          placeholder={placeholder}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );

  const SelectField = ({ label, value, onChange, options, placeholder }) => (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const NextButton = ({ text, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-4 mt-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98] duration-200 flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        text
      )}
    </button>
  );

  const BackButton = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-xl hover:bg-slate-50 z-20"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  );

  // ─── Step 1: Basic Info ───
  const renderStep1 = () => (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tell Us About You</h2>
        <p className="text-slate-500 mt-2 font-medium">Help us personalize your healthcare experience.</p>
      </div>
      <StepIndicator />
      <div className="space-y-5">
        <InputField label="Age" type="number" value={form.age} onChange={(v) => update('age', v)} placeholder="e.g. 25" unit="years" />
        <SelectField label="Gender" value={form.gender} onChange={(v) => update('gender', v)} placeholder="Select gender" options={['Male', 'Female', 'Other', 'Prefer not to say']} />
        <SelectField label="Blood Group" value={form.bloodGroup} onChange={(v) => update('bloodGroup', v)} placeholder="Select blood group" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
        <NextButton text="Continue" onClick={() => setStep(2)} />
      </div>
    </>
  );

  // ─── Step 2: Body Metrics ───
  const renderStep2 = () => (
    <>
      <BackButton onClick={() => setStep(1)} />
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Body Metrics</h2>
        <p className="text-slate-500 mt-2 font-medium">For accurate health recommendations.</p>
      </div>
      <StepIndicator />
      <div className="space-y-5">
        <InputField label="Height" type="number" value={form.height} onChange={(v) => update('height', v)} placeholder="e.g. 170" unit="cm" />
        <InputField label="Weight" type="number" value={form.weight} onChange={(v) => update('weight', v)} placeholder="e.g. 65" unit="kg" />
        <InputField label="Phone Number" type="tel" value={form.phone} onChange={(v) => update('phone', v)} placeholder="e.g. +91 98765 43210" />
        <NextButton text="Continue" onClick={() => setStep(3)} />
      </div>
    </>
  );

  // ─── Step 3: Medical History ───
  const renderStep3 = () => (
    <>
      <BackButton onClick={() => setStep(2)} />
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-rose-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.8 0 4.7.8 6.6 1.8a1 1 0 0 1 .4.8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medical History</h2>
        <p className="text-slate-500 mt-2 font-medium">Important for safe recommendations.</p>
      </div>
      <StepIndicator />
      <div className="space-y-5">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Known Allergies</label>
          <textarea
            value={form.allergies}
            onChange={(e) => update('allergies', e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200 resize-none"
            rows={2}
            placeholder="e.g. Peanuts, Penicillin (comma separated)"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Chronic Conditions</label>
          <textarea
            value={form.conditions}
            onChange={(e) => update('conditions', e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200 resize-none"
            rows={2}
            placeholder="e.g. Diabetes, Asthma (comma separated)"
          />
        </div>
        <NextButton text="Save & Continue" onClick={handleSubmit} />
      </div>
    </>
  );

  const steps = { 1: renderStep1, 2: renderStep2, 3: renderStep3 };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col justify-center px-10 py-10">
        {steps[step]?.()}
        <button
          onClick={handleSkip}
          disabled={loading}
          className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors mt-4 disabled:opacity-50"
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
};

export default HealthOnboarding;
