import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

let aframeLoaded = false;
const useAFrame = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && !aframeLoaded) {
      import("aframe").then(() => { aframeLoaded = true; setReady(true); }).catch(() => setReady(true));
    } else setReady(true);
  }, []);
  return ready;
};

export default function VRViewer({ open, onClose, video, hlsUrl }: { open: boolean; onClose: ()=>void; video: any; hlsUrl: string; }) {
  const ready = useAFrame();
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(()=>{
    if(!open) return;
    const el = vref.current!;
    if (el && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(el);
      hls.on(Hls.Events.MANIFEST_PARSED, () => el.play().catch(()=>{}));
      return () => hls.destroy();
    } else if (el && el.canPlayType("application/vnd.apple.mpegurl")) {
      el.src = hlsUrl; el.play().catch(()=>{});
    }
  }, [open, hlsUrl]);

  if(!open || !video) return null;
  const is360 = video.type === "360";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-2 text-white">
        <div>{video.title}</div>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="flex-1 grid place-items-center p-4" onClick={e=>e.stopPropagation()}>
        <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden">
          {is360 ? (
            ready ? (
              <a-scene embedded vr-mode-ui="enabled: true">
                <a-assets>
                  <video id="v360" crossOrigin="anonymous" playsInline ref={vref} loop></video>
                </a-assets>
                <a-videosphere src="#v360"></a-videosphere>
                <a-entity camera look-controls position="0 0 0"></a-entity>
              </a-scene>
            ) : <div className="text-white">Loading VR…</div>
          ) : (
            <video ref={vref} controls className="w-full h-full object-contain bg-black" />
          )}
        </div>
      </div>
    </div>
  );
}