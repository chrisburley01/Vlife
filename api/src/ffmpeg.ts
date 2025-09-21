import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function transcodeToHLS(inputPath: string, outDir: string): Promise<{ m3u8: string }> {
  await fs.promises.mkdir(outDir, { recursive: true });
  const m3u8 = path.join(outDir, "index.m3u8");
  const args = [
    "-y",
    "-i", inputPath,
    "-c:v", "h264",
    "-c:a", "aac",
    "-flags", "+cgop",
    "-hls_time", "4",
    "-hls_playlist_type", "vod",
    "-hls_segment_filename", path.join(outDir, "seg%03d.ts"),
    m3u8
  ];
  await new Promise<void>((resolve, reject) => {
    const ff = spawn("ffmpeg", args);
    ff.stderr.on("data", d => process.stdout.write(d));
    ff.on("close", code => code === 0 ? resolve() : reject(new Error("FFmpeg failed: " + code)));
  });
  return { m3u8 };
}