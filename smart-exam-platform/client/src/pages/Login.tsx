import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleQuickFill = (email: string, password: string = 'Password@123') => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setError(null);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-100">Sign in to your account</h3>
        <p className="text-xs text-slate-400 mt-1">Enter your academic credentials below</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Role Portal Selector */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-indigo-300">⚡ Select Academic Role to Sign In</span>
          <span className="text-[10px] text-slate-400 font-semibold">Demo Pass: Password@123</span>
        </div>

        {/* Role Select Dropdown */}
        <div>
          <select
            onChange={(e) => {
              if (e.target.value) handleQuickFill(e.target.value);
            }}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-indigo-400 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">-- Choose Portal Role to Quick Sign-In --</option>
            <option value="student@smartexams.edu">🎓 Student Portal (student@smartexams.edu)</option>
            <option value="faculty@smartexams.edu">👨‍🏫 Faculty Workspace (faculty@smartexams.edu)</option>
            <option value="hod@smartexams.edu">🏫 Department HOD (hod@smartexams.edu)</option>
            <option value="collegeadmin@smartexams.edu">🏛️ College Admin (collegeadmin@smartexams.edu)</option>
            <option value="superadmin@smartexams.edu">🛡️ Super Admin (superadmin@smartexams.edu)</option>
            <option value="internal@smartexams.edu">📝 Internal Examiner (internal@smartexams.edu)</option>
            <option value="external@smartexams.edu">🔍 External Examiner (external@smartexams.edu)</option>
            <option value="parent@smartexams.edu">👨‍👩‍👧 Parent Portal (parent@smartexams.edu)</option>
          </select>
        </div>

        {/* Quick Role Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => handleQuickFill('student@smartexams.edu')}
            className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-medium border border-slate-800 hover:border-indigo-500/40 transition-all text-left flex items-center space-x-1.5"
          >
            <span>🎓</span>
            <span className="truncate">Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('faculty@smartexams.edu')}
            className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-medium border border-slate-800 hover:border-indigo-500/40 transition-all text-left flex items-center space-x-1.5"
          >
            <span>👨‍🏫</span>
            <span className="truncate">Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('hod@smartexams.edu')}
            className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-medium border border-slate-800 hover:border-indigo-500/40 transition-all text-left flex items-center space-x-1.5"
          >
            <span>🏫</span>
            <span className="truncate">HOD</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('superadmin@smartexams.edu')}
            className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-medium border border-slate-800 hover:border-indigo-500/40 transition-all text-left flex items-center space-x-1.5"
          >
            <span>🛡️</span>
            <span className="truncate">Super Admin</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="admin@smartexams.edu"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center space-x-2 text-slate-400 select-none">
            <input type="checkbox" className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0" />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
