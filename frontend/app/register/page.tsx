"use client";
import { useState } from "react";
import { authService } from "@/lib/auth";
import AuthInput from "@/components/AuthInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PenSquare,
  ArrowLeft,
  Sparkles,
  Mail,
  Lock,
  User,
  CheckCircle,
} from "lucide-react";
import ModeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    display_name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Simple password strength calculation
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (value.match(/[A-Z]/)) strength++;
      if (value.match(/[0-9]/)) strength++;
      if (value.match(/[^A-Za-z0-9]/)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.register(formData);
      router.push("/login?registered=true");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Error creating account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    const texts = ["Weak", "Fair", "Good", "Strong"];
    return texts[passwordStrength - 1] || "";
  };

  const getPasswordStrengthColor = () => {
    const colors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];
    return colors[passwordStrength - 1] || "bg-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-200/[0.02] dark:bg-grid-gray-700/[0.02] -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Side - Branding & Benefits */}
        <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left">
          <Link
            href="/"
            className="inline-flex m-4 items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 lg:mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </Link>

          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
            <span>Join SnapPad today</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100">
            Start capturing your
            <span className="text-blue-600 dark:text-blue-400 block">
              thoughts effortlessly
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto lg:mx-0">
            Create your free account and experience the simplest way to organize
            your ideas.
          </p>

          {/* Benefits List with Icons */}
          <div className="space-y-4 pt-4">
            {[
              {
                icon: <PenSquare className="w-5 h-5" />,
                text: "Unlimited notes and notebooks",
              },
              {
                icon: <CheckCircle className="w-5 h-5" />,
                text: "Rich text formatting",
              },
              {
                icon: <Lock className="w-5 h-5" />,
                text: "Privacy first, always",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400"
              >
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {benefit.icon}
                </div>
                <span className="text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Registration Form */}
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
              Create your account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Get started with your free account in seconds
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthInput
                label="Display Name"
                name="display_name"
                type="text"
                value={formData.display_name}
                onChange={handleChange}
                placeholder="John Doe"
              
                required
              />

              <AuthInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
            
                required
              />

              <div className="space-y-2">
                <AuthInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1 h-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength
                              ? getPasswordStrengthColor()
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs ${passwordStrength > 0 ? `text-${getPasswordStrengthColor().replace("bg-", "")}-600` : "text-gray-400"}`}
                    >
                      {getPasswordStrengthText()} password
                    </p>
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
                <p className="font-medium mb-1">Password must contain:</p>
                <ul className="space-y-1">
                  {[
                    {
                      text: "At least 8 characters",
                      met: formData.password.length >= 8,
                    },
                    {
                      text: "One uppercase letter",
                      met: /[A-Z]/.test(formData.password),
                    },
                    {
                      text: "One number",
                      met: /[0-9]/.test(formData.password),
                    },
                    {
                      text: "One special character",
                      met: /[^A-Za-z0-9]/.test(formData.password),
                    },
                  ].map((req, index) => (
                    <li key={index} className="flex items-center gap-1.5">
                      <span
                        className={`${req.met ? "text-green-500" : "text-gray-300 dark:text-gray-600"}`}
                      >
                        {req.met ? "✓" : "○"}
                      </span>
                      <span
                        className={
                          req.met ? "text-gray-700 dark:text-gray-300" : ""
                        }
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.display_name ||
                  !formData.email ||
                  !formData.password
                }
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create account</span>
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
                  Already have an account?
                </span>
              </div>
            </div>

            <Link href="/login">
              <button className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                Sign in instead
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
