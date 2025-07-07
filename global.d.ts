declare module "next-pwa/register" {}

declare module "tesseract.js" {
  import "tesseract.js";

  export interface LineData {
    text: string;
    confidence: number;
    bbox: [number, number, number, number];
  }

  export interface RecognizeResult {
    data: {
      text: string;
      lines: LineData[];
    };
  }
  export function createWorker(
    langs?: string | string[],
    options?: Record<string, unknown>
  );
}
