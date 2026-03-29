// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Alert from "@/components/ui/Alert";
import InputField from "./InputField";
import Link from 'next/link';

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
  onSubmit: () => void;
}

export default function LoginForm({
  email, setEmail, password, setPassword,
  showPassword, setShowPassword, loading, error, success, onSubmit
}: LoginFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="space-y-5">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            icon={Mail}
          />

          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            icon={Lock}
            showToggle
            togglePassword={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600" />
              <span className="text-gray-700">Remember me</span>
            </label>
           

              <Link href="/forgot-password" className="text-purple-600 hover:text-purple-700 font-medium transition">
                Forgot password?
              </Link>
          </div>

          <button
            onClick={onSubmit}
            disabled={loading}
            className="group w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
            Sign up for free
          </a>
        </p>
      </div>
    </div>
  );
}
