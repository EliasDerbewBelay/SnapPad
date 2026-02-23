"use client";
import { useState } from "react";
import { authService } from "@/lib/auth";
import AuthInput from "@/components/AuthInput";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    display_name: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      router.push("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Error creating account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Start snapping your thoughts today.
        </p>
        <form onSubmit={handleSubmit}>
          <AuthInput
            label="Display Name"
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, display_name: e.target.value })
            }
          />
          <AuthInput
            label="Email"
            type="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <AuthInput
            label="Password"
            type="password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
