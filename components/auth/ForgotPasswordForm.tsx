import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import Alert from "@/components/ui/Alert";
import InputField from "@/components/auth/InputField";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (value: string) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
  onSubmit: () => void;
}

export default function ForgotPasswordForm({
  email, setEmail, loading, error, success, onSubmit
}: ForgotPasswordFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <KeyRound className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">No worries, we'll send you reset instructions</p>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {!success && (
          <div className="space-y-5">
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              icon={Mail}
            />

            <button
              onClick={onSubmit}
              disabled={loading}
              className="group w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <a
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </a>
          </div>
        )}

        {success && (
          <div className="space-y-5">
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Mail className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-gray-700 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            <a
              href="/login"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Login
            </a>
          </div>
        )}
      </div>

      <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}