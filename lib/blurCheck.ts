// lib/blurCheck.ts  – robust Laplacian test
export async function isBlurred(
  file: File,
  edgeCountMin = 3000
): Promise<boolean> {
  const img = await createImageBitmap(file);

  const scale = 512 / Math.max(img.width, img.height);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  const { data } = ctx.getImageData(0, 0, w, h);
  const kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0] as const;

  let edges = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let lap = 0;
      kernel.forEach((k, i) => {
        const xi = x + (i % 3) - 1;
        const yi = y + ((i / 3) >> 0) - 1;
        const idx = (yi * w + xi) * 4;
        const g =
          0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        lap += k * g;
      });
      if (Math.abs(lap) > 12) edges++;
    }
  }
  console.log("Edge-pixels:", edges);
  return edges < edgeCountMin;
}
