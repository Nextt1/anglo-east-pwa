import { createWorker, type RecognizeResult } from "tesseract.js";

export async function readReceipt(
  file: File,
  minLineConfidence = 80
): Promise<{ text: string; shopName: string | null }> {
  const worker = await createWorker(["eng"]);

  const { data } = (await worker.recognize(file)) as RecognizeResult;
  await worker.terminate();

  const fullText = data.text.trim();

  let name: string | null = null;

  if (data.lines?.length) {
    name =
      data.lines
        .filter((l) => l.confidence >= minLineConfidence)
        .sort((a, b) => a.bbox[1] - b.bbox[1])[0]
        ?.text.trim() ?? null;
  }

  if (!name) {
    name =
      fullText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => /^[A-Z0-9 .&'-]{4,}$/.test(l))[0] ?? null;
  }

  return { text: fullText, shopName: name };
}
