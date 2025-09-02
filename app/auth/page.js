"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = "/chat"; // always go to chat after auth

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already authed, go straight to chat without URL params, set history state
    const existingUser = sessionStorage.getItem("pc_user");
    if (existingUser) {
      try {
        window.history.replaceState({ user: existingUser }, "", nextPath);
      } catch {}
      router.replace(nextPath);
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmed = code.trim();
    let user = "";
    console.log(trimmed);
    if (trimmed === "4048") user = "shinas";
    else if (trimmed === "2004") user = "aparna";

    if (!user) {
      setError("Invalid code. Try again.");
      return;
    }

    setLoading(true);
    try {
      sessionStorage.setItem("pc_user", user);
      try {
        window.history.replaceState({ user }, "", nextPath);
      } catch {}
      router.replace(nextPath);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white border rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-1 text-center">Enter 4-digit code</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Private access required</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••"
            className="w-full text-center tracking-widest text-2xl px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-green-500"
            autoFocus
          />
          {error && <div className="text-sm text-red-600 text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading || code.length !== 4}
            className="w-full py-2.5 rounded-lg bg-green-600 text-white disabled:opacity-50"
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-400 text-center">
          Hint: Use your personal 4-digit key
        </div>
      </div>
    </div>
  );
}
