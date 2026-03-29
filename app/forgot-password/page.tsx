"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthHeader from "@/components/auth/AuthHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function ForgotPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear success message after some time if it's not a password reset success
  useEffect(() => {
    if (success && !token) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, token]);

  const validateEmail = () => {
    if (!email) return "Email is required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Please enter a valid email";
    return null;
  };

  const validatePasswords = () => {
    if (!newPassword || !confirmPassword) return "Both password fields are required";
    if (newPassword.length < 6) return "New password must be at least 6 characters long";
    if (newPassword !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const onSubmitRequestReset = async () => {
    setError(null);
    setSuccess(null);
    const clientError = validateEmail();
    if (clientError) {
      setError(clientError);
      toast.error(clientError);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setSuccess(response.data.message);
      toast.success(response.data.message);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitResetPassword = async () => {
    setError(null);
    setSuccess(null);
    const clientError = validatePasswords();
    if (clientError) {
      setError(clientError);
      toast.error(clientError);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', { token, newPassword });
      setSuccess(response.data.message);
      toast.success(response.data.message);
      router.push('/login'); // Redirect to login after successful reset
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 px-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        {token ? (
          // Reset password form
          <>
            <AuthHeader 
              title="Set New Password" 
              subtitle="Enter your new password below" 
            />
            <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 block w-full"
                  />
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}
              <Button
                onClick={onSubmitResetPassword}
                loading={loading}
                className="w-full"
              >
                Reset Password
              </Button>
              <p className="text-center text-sm text-purple-700 mt-4">
                Remember your password? <Link href="/login" className="font-medium text-purple-800 hover:underline">Sign In</Link>
              </p>
            </div>
          </>
        ) : (
          // Request reset email form
          <>
            <AuthHeader 
              title="Reset Password" 
              subtitle="Enter your email to receive a reset link" 
            />
            <ForgotPasswordForm
              email={email}
              setEmail={setEmail}
              loading={loading}
              error={error}
              success={success}
              onSubmit={onSubmitRequestReset}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}