"use client";
import { useState } from "react";
import { Camera } from "@/components/Camera";
import { isBlurred } from "@/lib/blurCheck";
import { extractShopName } from "@/lib/ocr";
import { saveReceipt } from "@/lib/storage";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [stage, setStage] = useState<"photo" | "receipt" | "done">("photo");
  const [shop, setShop] = useState("");

  const handleJewelryShot = async (file: File) => {
    if (await isBlurred(file)) {
      alert("Photo too blurry – please retake.");
      return;
    }
    setStage("receipt");
  };

  const handleReceiptShot = async (file: File) => {
    const shopName = await extractShopName(file);
    const confirmed = prompt("Detected shop name:", shopName) ?? shopName;
    setShop(confirmed);

    await saveReceipt({
      id: uuid(),
      imgBlob: file,
      shopName: confirmed,
      createdAt: new Date().toISOString(),
    });
    setStage("done");
  };

  return (
    <main className="p-4">
      <div className="flex flex-row items-center justify-between">
        <span>Stage 1 - Snap Jewelry Photo</span>
        <span>Stage 2 - Snap Purchase Receipt</span>
        <span>Stage 3 - Saved</span>
      </div>
      {stage === "photo" && (
        <>
          <h1 className="text-xl font-semibold">Snap jewelry photo</h1>
          <Camera onShot={handleJewelryShot} />
        </>
      )}
      {stage === "receipt" && (
        <>
          <h1 className="text-xl font-semibold">Snap purchase receipt</h1>
          <Camera onShot={handleReceiptShot} />
        </>
      )}
      {stage === "done" && (
        <p className="text-green-600">
          Saved! We recognised <strong>{shop}</strong>.
        </p>
      )}
    </main>
  );
}
