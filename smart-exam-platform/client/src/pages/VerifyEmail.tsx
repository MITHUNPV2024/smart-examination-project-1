import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';

const verifySchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'Verification code must be exactly 6 characters'),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve email state if passed from registration
  const prefilledEmail = (location.state as { email?: string })?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: prefilledEmail,
    },
  });

  const onSubmit = async (data: VerifyFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post('/auth/verify-email', data);
      if (response.data.success) {
        setSuccess('Account verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please check your code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-100">Verify your email</h3>
        <p className="text-xs text-slate-400 mt-1">Please enter the 6-digit OTP code sent to you</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="student@smartexams.edu"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            6-Digit Verification Code (OTP)
          </label>
          <input
            type="text"
            maxLength={6}
            {...register('otp')}
            placeholder="123456"
            className="w-full text-center tracking-widest px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-lg font-bold text-indigo-400 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
          />
          {errors.otp && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.otp.message}</p>
          )}
        </div>

        <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading}>
          Verify Account
        </Button>
      </form>
    </div>
  );
};

export default VerifyEmail;
