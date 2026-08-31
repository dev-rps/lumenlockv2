/**
 * app/lib/storage.ts
 *
 * Vercel-compatible storage abstraction.
 * - On Vercel (read-only FS): reads/writes to /tmp
 * - Locally: reads/writes to <project-root>/frontend/data/
 *
 * Data persists for the lifetime of the warm lambda on Vercel.
 * For production persistence, swap this module for Vercel KV / Postgres.
 */

import { promises as fs } from "fs";
import path from "path";

// Detect Vercel runtime
const IS_VERCEL = Boolean(process.env.VERCEL);

function getDataPath(filename: string): string {
  if (IS_VERCEL) {
    return path.join("/tmp", filename);
  }
  // Local: <repo-root>/frontend/data/<filename>
  return path.join(process.cwd(), "data", filename);
}

async function ensureDir(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  const filePath = getDataPath(filename);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = getDataPath(filename);
  await ensureDir(filePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function appendToArray<T>(filename: string, item: T): Promise<T[]> {
  const arr = await readJson<T[]>(filename, []);
  arr.push(item);
  await writeJson(filename, arr);
  return arr;
}
