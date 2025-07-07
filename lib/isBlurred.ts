export async function isBlurred(file: File, threshold = 10): Promise<boolean> {
  const bitmap = await createImageBitmap(file);

  const scale = 512 / Math.max(bitmap.width, bitmap.height);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);

  const { data } = ctx.getImageData(0, 0, w, h);
  const k = [0, 1, 0, 1, -4, 1, 0, 1, 0] as const;
  let n = 0,
    sum = 0,
    sumSq = 0;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let lap = 0;
      k.forEach((kv, i) => {
        const xi = x + (i % 3) - 1;
        const yi = y + ((i / 3) | 0) - 1;
        const idx = (yi * w + xi) * 4;
        const g =
          0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        lap += kv * g;
      });
      sum += lap;
      sumSq += lap * lap;
      n++;
    }
  }
  const variance = (sumSq - (sum * sum) / n) / n;
  console.debug("Lap-var", variance);
  return variance < threshold;
}
