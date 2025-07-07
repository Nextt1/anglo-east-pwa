import "tesseract.js";
declare module "next-pwa/register" {
  const register: void;
  export = register;
}

declare module "tesseract.js" {
  interface LineData {
    text: string;
    confidence: number;
    bbox: [number, number, number, number];
  }
  interface Page {
    lines: LineData[];
  }
}
