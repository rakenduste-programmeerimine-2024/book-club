"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SignInPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Incorrect email or password. Please try again.");
      return;
    }
    router.push("/");
  };

  return (
    <div
      className="max-w-md mx-auto mt-20 p-8 rounded-md shadow-lg"
      style={{
        backgroundColor: "#dbd2c3",
        border: "1px solid #b4a68f",
      }}
    >
      <h1 className="text-3xl font-bold text-center mb-6" style={{ color: "#000" }}>
        Sign In
      </h1>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2"
            style={{ color: "#000" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="block w-full px-4 py-2 rounded-md"
            style={{
              backgroundColor: "#f2ebe3",
              color: "#000",
              border: "1px solid #c4b69e",
            }}
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2"
            style={{ color: "#000" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="block w-full px-4 py-2 rounded-md"
            style={{
              backgroundColor: "#f2ebe3",
              color: "#000",
              border: "1px solid #c4b69e",
            }}
            required
          />
        </div>
        <div className="text-right">
          <a
            href="/forgot-password"
            className="text-sm underline"
            style={{ color: "#887d69" }}
          >
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md shadow-md"
          style={{
            backgroundColor: "#887d69",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-sm text-center" style={{ color: "#000" }}>
        Don’t have an account?{" "}
        <a href="/sign-up" className="font-medium underline" style={{ color: "#887d69" }}>
          Sign Up
        </a>
      </p>
    </div>
  );
}