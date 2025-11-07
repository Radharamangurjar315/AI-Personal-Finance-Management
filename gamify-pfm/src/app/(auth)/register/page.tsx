"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-white mb-2">Create Account 🚀</h1>
        <p className="text-gray-200 mb-6">Start your financial fitness journey</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <InputField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-300 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-teal-300 hover:text-white transition-colors">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
