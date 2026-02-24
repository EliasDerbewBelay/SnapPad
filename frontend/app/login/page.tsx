"use client";
import { useState } from "react";
import { authService } from "@/lib/auth";
import AuthInput from "@/components/AuthInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PenSquare, ArrowLeft, Sparkles } from "lucide-react";
import ModeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-200/[0.02] dark:bg-grid-gray-700/[0.02] -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Side - Branding & Features */}
        <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 lg:mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </Link>

          <div className="inline-flex m-4 items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
            <span>Welcome back to SnapPad</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100">
            Your notes are
            <span className="text-blue-600 dark:text-blue-400 block">
              waiting for you
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto lg:mx-0">
            Access your thoughts, ideas, and notes from anywhere. Secure, fast,
            and beautifully organized.
          </p>

          {/* Feature List */}
          <div className="space-y-3 pt-4">
            {[
              "✏️ Create and edit notes seamlessly",
              "🔒 End-to-end encrypted",
              "⚡ Sync across all devices",
              "📱 Works offline",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
              >
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200">
            {/* Header with Logo and Theme Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <PenSquare className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-xl text-gray-800 dark:text-gray-200">
                  SnapPad
                </span>
              </div>
              <ModeToggle />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Enter your credentials to access your notes
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />

              <AuthInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  New to SnapPad?
                </span>
              </div>
            </div>

            <Link href="/register">
              <button className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                Create an account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
