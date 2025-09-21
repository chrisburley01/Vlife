import { Router } from "express";
import { authMiddleware, AuthedRequest } from "../auth.js";
import { prisma } from "../prisma.js";

export const social = Router();

social.post("/like/:videoId", authMiddleware, async (req: AuthedRequest, res) => {
  await prisma.like.upsert({
    where: { userId_videoId: { userId: req.user!.id, videoId: req.params.videoId } },
    update: {},
    create: { userId: req.user!.id, videoId: req.params.videoId }
  });
  res.json({ ok: true });
});

social.post("/comment/:videoId", authMiddleware, async (req: AuthedRequest, res) => {
  if (!req.body.body) return res.status(400).json({ error: "body required" });
  const c = await prisma.comment.create({ data: { body: req.body.body, userId: req.user!.id, videoId: req.params.videoId } });
  res.json(c);
});

social.get("/comments/:videoId", async (req, res) => {
  const list = await prisma.comment.findMany({ where: { videoId: req.params.videoId }, include: { user: true }, orderBy: { createdAt: "desc" } });
  res.json(list);
});