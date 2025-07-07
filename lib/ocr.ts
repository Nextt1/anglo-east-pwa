// import { createWorker } from "tesseract.js";

export async function extractShopName(file: File): Promise<string> {
  console.log(file)
  // const worker = await createWorker(["eng"]);
  // const { data } = await worker.recognize(file);
  // await worker.terminate();

  return ""
  // const candidate = data.lines.find((l) => l.confidence > 80);
  // return candidate?.text.trim() ?? "";
}
