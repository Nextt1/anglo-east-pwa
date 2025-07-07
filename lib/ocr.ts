// lib/ocr.ts
import { createWorker } from "tesseract.js";

export async function extractShopName(file: File): Promise<string> {
  const worker = await createWorker(["eng"]);
  const { data } = await worker.recognize(file);
  await worker.terminate();

  const candidate = data.lines.find((l) => l.confidence > 80);
  return candidate?.text.trim() ?? "";
}
