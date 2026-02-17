import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Shield, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Invalid email address')
});

const resetSchema = z.object({
  securityAnswer: z.string().min(1, 'Security answer is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

const SECURITY_QUESTION = "What is your pet's name?"; // In production, fetch from user data

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'security' | 'success'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema)
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      setError(null);
      // Simulate API call - In production, verify email exists
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserEmail(data.email);
      setStep('security');
    } catch (err) {
      setError('Email not found in our records');
    }
  };

  const onResetSubmit = async (data: ResetFormData) => {
    try {
      setError(null);
      // Simulate API call - In production, verify security answer and update password
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('success');
    } catch (err) {
      setError('Invalid security answer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen cosmic-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-500/20 mb-6 animate-float">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight font-display">
          {step === 'email' && 'Recover Access'}
          {step === 'security' && 'Security Verification'}
          {step === 'success' && 'Access Restored'}
        </h2>
        <p className="mt-2 text-slate-400">
          Return to{' '}
          <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
            sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass p-8 rounded-[2.5rem] border-white/10 shadow-2xl">
          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm border border-red-500/20">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Communications Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    {...emailForm.register('email')}
                    type="email"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white"
                    placeholder="scholar@starbase.com"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="mt-2 text-xs text-red-400">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={emailForm.formState.isSubmitting}
                className="w-full py-4 bg-indigo-600 rounded-2xl text-white font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {emailForm.formState.isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" />
                    Continue Recovery
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Security Question */}
          {step === 'security' && (
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm border border-red-500/20">
                  {error}
                </div>
              )}

              <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                <p className="text-sm text-slate-400 mb-1">Account: {userEmail}</p>
                <p className="text-white font-medium">{SECURITY_QUESTION}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Your Answer
                </label>
                <input
                  {...resetForm.register('securityAnswer')}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white"
                  placeholder="Enter your answer"
                />
                {resetForm.formState.errors.securityAnswer && (
                  <p className="mt-2 text-xs text-red-400">{resetForm.formState.errors.securityAnswer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  {...resetForm.register('newPassword')}
                  type="password"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white"
                  placeholder="••••••••"
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="mt-2 text-xs text-red-400">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  {...resetForm.register('confirmPassword')}
                  type="password"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-white"
                  placeholder="••••••••"
                />
                {resetForm.formState.errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-400">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={resetForm.formState.isSubmitting}
                className="w-full py-4 bg-indigo-600 rounded-2xl text-white font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {resetForm.formState.isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-500/20 p-4 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Password Reset Successful</h3>
                <p className="text-slate-400 text-sm">
                  Your access has been restored. You can now log in with your new password.
                </p>
              </div>

              <Link
                to="/login"
                className="block w-full py-4 bg-indigo-600 rounded-2xl text-white font-bold hover:bg-indigo-700 transition-all"
              >
                Proceed to Login
              </Link>
            </div>
          )}

          {/* Back button for email/security steps */}
          {step !== 'success' && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;