import React, { useState } from 'react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="relative w-full max-w-md h-[600px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
        <div 
          className={`absolute top-0 w-full h-full flex flex-col justify-center px-10 transition-all duration-700 ease-in-out ${
            isLogin ? 'translate-x-0 opacity-100 z-10' : '-translate-x-[20%] opacity-0 pointer-events-none z-0'
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in.</p>
          </div>
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Email address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-sm text-slate-600 font-medium cursor-pointer group">
                <input type="checkbox" className="w-4.5 h-4.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" />
                <span className="group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-slate-900 hover:underline transition-all">Forgot password?</a>
            </div>

            <button className="w-full py-4 mt-2 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98] duration-200 flex justify-center items-center">
              Sign In
            </button>
          </form>

          <p className="text-center text-slate-600 font-medium mt-8">
            Don't have an account?{' '}
            <button 
              onClick={() => setIsLogin(false)}
              className="font-bold text-slate-900 hover:underline focus:outline-none ml-1 transition-all"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Signup Form */}
        <div 
          className={`absolute top-0 w-full h-full flex flex-col justify-center px-10 transition-all duration-700 ease-in-out ${
            !isLogin ? 'translate-x-0 opacity-100 z-10' : 'translate-x-[20%] opacity-0 pointer-events-none z-0'
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 font-medium">Join us to get started today.</p>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Email address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button className="w-full py-4 mt-6 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98] duration-200 flex justify-center items-center">
              Sign Up
            </button>
          </form>

          <p className="text-center text-slate-600 font-medium mt-8">
            Already have an account?{' '}
            <button 
              onClick={() => setIsLogin(true)}
              className="font-bold text-slate-900 hover:underline focus:outline-none ml-1 transition-all"
            >
              Sign in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;