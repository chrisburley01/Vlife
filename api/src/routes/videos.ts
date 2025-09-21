import { Router } from "express";
import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";
import { prisma } from "../prisma.js";
import { authMiddleware, AuthedRequest } from "../auth.js";
import { transcodeToHLS } from "../ffmpeg.js";
import fs from "fs";

const upload = multer({ dest: process.env.UPLOAD_DIR || "/app/storage/uploads" });
const HLS_DIR = process.env.HLS_DIR || "/app/storage/hls";

export const videos = Router();

videos.get("/", async (_, res) => {
  const list = await prisma.video.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { creator: true } });
  res.json(list);
});

videos.get("/hls/*", async (req, res) => {
  const p = req.params[0];
  const file = path.join(HLS_DIR, p);
  if (fs.existsSync(file)) return res.sendFile(file);
  res.status(404).end();
});

videos.post("/upload", authMiddleware, upload.single("file"), async (req: AuthedRequest, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "file required" });
    const id = nanoid();
    const outDir = path.join(HLS_DIR, id);
    await transcodeToHLS(file.path, outDir);
    const v = await prisma.video.create({
      data: {
        id,
        title: req.body.title || file.originalname,
        type: req.body.type || "360",
        hlsPath: id,
        creatorId: req.user!.id
      }
    });
    res.json(v);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});