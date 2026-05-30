"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, Lock, Mail, ArrowRight, ArrowLeft, Sun, Moon } from "lucide-react";

export default function Login() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate high-fidelity secure token generation and redirect
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors duration-300 ${
      isDarkMode ? "theme-dark bg-[#05070f] text-zinc-100" : "bg-[#f8fafc] text-slate-800"
    }`}>
      
      {/* Background elements */}
      <div className="absolute top-0 w-full h-full bg-grid-glow opacity-25 z-0 pointer-events-none" />
      
      {/* Top Navbar items */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <Link 
          href="/" 
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            isDarkMode ? "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white" : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"
          }`}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg border transition-all ${
            isDarkMode ? "border-zinc-800 bg-zinc-900/60 text-yellow-400" : "border-slate-200 bg-white text-slate-700 shadow-sm"
          }`}
        >
          {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
        <h2 className={`mt-6 text-center text-3xl font-display font-extrabold tracking-tight ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}>
          Sign in to your Workspace
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500">
          Or get started with a mock sandbox credential
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className={`py-8 px-4 border shadow sm:rounded-2xl sm:px-10 transition-colors ${
          isDarkMode ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200"
        }`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email field */}
            <div>
              <label htmlFor="email" className={`block text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? "text-zinc-400" : "text-slate-700"
              }`}>
                Corporate Email Address
              </label>
              <div className="mt-2.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-1 transition-all ${
                    isDarkMode 
                    ? "bg-zinc-900/60 border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500" 
                    : "bg-white border-slate-250 text-slate-900 focus:border-indigo-600 focus:ring-indigo-600"
                  }`}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className={`block text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? "text-zinc-400" : "text-slate-700"
              }`}>
                Secure Password
              </label>
              <div className="mt-2.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-1 transition-all ${
                    isDarkMode 
                    ? "bg-zinc-900/60 border-zinc-800 text-white focus:border-cyan-500 focus:ring-cyan-500" 
                    : "bg-white border-slate-250 text-slate-900 focus:border-indigo-600 focus:ring-indigo-600"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-zinc-800 rounded bg-zinc-900"
                />
                <label htmlFor="remember-me" className="ml-2 text-zinc-500">
                  Remember device
                </label>
              </div>

              <a href="#" className="text-cyan-500 hover:text-cyan-400">
                Forgot credentials?
              </a>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 px-4 py-3 rounded-lg font-bold text-sm transition-all shadow-md shadow-cyan-500/10"
              >
                {isSubmitting ? "Generating Session..." : "Secure Access Workspace"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Social oauth logins */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDarkMode ? "border-zinc-800/80" : "border-slate-200"}`} />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-medium">
                <span className={`px-2 transition-colors ${isDarkMode ? "bg-[#0b0f19] text-zinc-500" : "bg-white text-slate-400"}`}>
                  Identity Federations
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className={`w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                  isDarkMode 
                  ? "border-zinc-850 bg-zinc-900/60 hover:bg-zinc-900/80 text-zinc-300" 
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm"
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.48 0-6.3-2.82-6.3-6.3 0-3.48 2.82-6.3 6.3-6.3 1.625 0 3.097.618 4.2 1.638l3.15-3.15C19.26.837 15.96 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.7 0 12.24-5.48 12.24-12.24 0-.84-.077-1.656-.222-2.455H12.24z"/>
                </svg>
                Authenticate with Google Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
