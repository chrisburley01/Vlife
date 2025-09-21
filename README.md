# vlife — VR-first YouTube Clone 🎥🕶️

A YouTube-style platform built around **VR video playback**.  
Users can upload videos → server transcodes them to **HLS with FFmpeg** → frontend plays them in **360° VR (A-Frame/WebXR)** or a standard flat player.  
Includes **user accounts (JWT)**, **likes**, **comments**, and a basic feed.

---

## ✨ Features
- Upload → **FFmpeg → HLS** (ready for adaptive streaming)
- **360° VR sphere playback** (A-Frame/WebXR) or flat video player
- Accounts (register/login), likes, comments
- Frontend: **React 18 + Vite + Tailwind + A-Frame + hls.js**
- Backend: **Node.js/Express + Prisma + PostgreSQL + FFmpeg**
- Infrastructure: **Docker Compose**

---

## 🚀 Quickstart (local dev with Docker)

```bash
git clone https://github.com/chrisburley01/vlife.git
cd vlife

# create env
cp .env.example .env

# create storage dirs
mkdir -p storage/uploads storage/hls

# start everything
docker compose up --build