import React from "react";
export default function VideoCard({ v, onOpen }: { v: any; onOpen: (v:any)=>void }) {
  return (
    <div className="group cursor-pointer" onClick={()=>onOpen(v)}>
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-sm">
        <div className="absolute inset-0 grid place-items-center text-white/60">{v.title}</div>
        <div className="absolute top-2 left-2 text-[10px] uppercase bg-white/10 text-white px-1.5 py-0.5 rounded">{v.type === '360' ? '360°' : 'Flat'}</div>
      </div>
      <div className="mt-2">
        <div className="font-medium">{v.title}</div>
        <div className="text-sm text-white/60">{v.creator?.name || v.creator?.email || 'anonymous'}</div>
      </div>
    </div>
  );
}