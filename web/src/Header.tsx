import React, { useState } from "react";

export default function Header({
  onOpenUpload,
  onLogin,
}: {
  onOpenUpload: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <header className="sticky top-0 z-30 bg-black/60 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white text-black grid place-items-center font-bold">
            VR
          </div>
          <div className="text-xl font-semibold">vlife</div>
        </div>

        <div className="flex-1" />

        {/* Login form (simple demo) */}
        <div className="hidden sm:flex items-center gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="rounded-lg px-3 py-1.5 bg-white/10"
          />
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="rounded-lg px-3 py-1.5 bg-white/10"
          />
          <button
            onClick={() => onLogin(email, password)}
            className="rounded-lg px-3 py-1.5 bg-indigo-600"
          >
            Login
          </button>
        </div>

        {/* Upload button */}
        <button
          onClick={onOpenUpload}
          className="ml-3 rounded-xl px-4 py-2 bg-indigo-600 text-white hover:opacity-90 shadow"
        >
          Upload
        </button>
      </div>
    </header>
  );
}