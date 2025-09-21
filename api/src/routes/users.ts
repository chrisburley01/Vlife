import { Router } from "express";
import { prisma } from "../prisma.js";
import { hashPassword, verifyPassword, signToken } from "../auth.js";

export const users = Router();

users.post("/register", async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email & password required" });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "email already in use" });
  const user = await prisma.user.create({ data: { email, password: await hashPassword(password), name: name || email } });
  const token = signToken({ id: user.id, email: user.email });
  res.json({ token, user });
});

users.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "invalid credentials" });
  const ok = await verifyPassword(password, user.password);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });
  const token = signToken({ id: user.id, email: user.email });
  res.json({ token, user });
});