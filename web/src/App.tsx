import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import UploadModal from "./components/UploadModal";
import VRViewer from "./components/VRViewer";
import VideoCard from "./components/VideoCard";
import { Users, Videos } from "./api";

export default function App() {
  const [videos, setVideos] = useState<any[]>([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
  const [current, setCurrent] = useState<any>(null);
  const [query, setQuery] = useState("");

  // Load video list
  useEffect(() => {
    Videos.list().then(setVideos).catch(console.error);
  }, []);

  // Search filter
  const filtered = useMemo(() => {
    return videos.filter((v) => {
      if (!query) return true;
      const q = query.toLowerCase();
      const hay = `${v.title} ${v.creator?.name ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [videos, query]);

  // Login / Register
  async function onLogin(email: string, password: string) {
    try {
      const { token } = await Users.login(email, password);
      localStorage.setItem("vlife_token", token);
      alert("Logged in");
    } catch {
      // auto-register if user not found
      const { token } = await Users.register(
        email,
        password,
        email.split("@")[0]
      );
      localStorage.setItem("vlife_token", token);
      alert("Registered & logged in");
    }
  }

  // Upload
  async function onAdd(file: File, title: string, type: string) {
    const v = await Videos.upload(file, title, type);
    setVideos((prev) => [v, ...prev]);
    setOpenUpload(false);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onOpenUpload={() => setOpenUpload(true)} onLogin={onLogin} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos…"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 outline-none"
          />
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <VideoCard
              key={v.id}
              v={v}
              onOpen={(x) => {
                setCurrent(x);
                setOpenViewer(true);
              }}
            />
          ))}
        </section>
      </main>

      <UploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onAdd={onAdd}
      />

      {current && (
        <VRViewer
          open={openViewer}
          onClose={() => setOpenViewer(false)}
          video={current}
          hlsUrl={Videos.hlsUrl(current.hlsPath)}
        />
      )}

      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-6 text-xs text-white/50">
        <div>
          vlife demo • React + A-Frame • HLS via FFmpeg • Auth: demo
          auto-register on first login.
        </div>
      </footer>
    </div>
  );
}