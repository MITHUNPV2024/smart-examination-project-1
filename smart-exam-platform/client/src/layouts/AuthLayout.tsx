import React from 'react';
import { GraduationCap } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
            <GraduationCap className="h-7 w-7 text-indigo-500" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-50 font-display">
          Smart Examination Hub
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Enterprise-grade Academic Automation & Digital Evaluation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/40 backdrop-blur-xl py-8 px-4 border border-slate-800 shadow-glass rounded-xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
