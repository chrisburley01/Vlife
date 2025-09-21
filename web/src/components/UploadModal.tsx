import React, { useState } from "react";

export default function UploadModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (file: File, title: string, type: string) => Promise<void>; }) {
  const [file, setFile] = useState<File|null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("360");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl bg-neutral-950 border border-white/10 p-4" onClick={e=>e.stopPropagation()}>
        <h3 className="text-lg font-semibold">Upload video</h3>
        <div className="mt-3 space-y-3">
          <input type="text" className="w-full rounded-xl border border-white/10 px-3 py-2 bg-transparent" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <div className="flex items-center gap-3 text-sm">
            <label><input type="radio" value="360" checked={type==='360'} onChange={()=>setType('360')} /> 360°</label>
            <label><input type="radio" value="flat" checked={type==='flat'} onChange={()=>setType('flat')} /> Flat</label>
          </div>
          <input type="file" accept="video/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={()=> file && onAdd(file, title || file.name, type)}>Add</button>
        </div>
      </div>
    </div>
  );
}