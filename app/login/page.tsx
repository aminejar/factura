"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import LoginForm from "@/components/auth/LoginForm";
import AuthHeader from "@/components/auth/AuthHeader";
import { useAuth } from "@/lib/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validate = () => {
    if (!email) return "Email is required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Please enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const onSubmit = async () => {
    setError(null);
    setSuccess(null);
    const clientError = validate();
    if (clientError) {
      setError(clientError);
      return;
    }
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🔍 LOGIN PAGE - API response received:", {
          hasToken: !!data.token,
          hasUser: !!data.user,
          hasCompany: !!data.user?.company,
          userId: data.user?.id
        });

        // CRITICAL: Login BEFORE navigation
        const loggedInUser = await login(data.token, data.user);
        console.log("🔍 LOGIN PAGE - AuthContext login completed, user:", loggedInUser);

        setSuccess("Logged in successfully!");

        // Navigate AFTER user state is set
        console.log("🔍 NAVIGATING to:", redirectTo);
        router.push(redirectTo);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to log in');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 px-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        <AuthHeader 
          title="Facturaa" 
          subtitle="Electronic Invoicing Made Simple" 
        />
        
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          loading={loading}
          error={error}
          success={success}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginPageContent />
    </Suspense>
  );
}