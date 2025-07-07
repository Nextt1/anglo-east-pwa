"use client";
import { useState } from "react";
import { Camera } from "@/components/Camera";
import { readReceipt } from "@/lib/ocr";

export default function Home() {
  const [stage, setStage] = useState<"photo" | "receipt" | "done">("photo");

  const [jewelryImg, setJewelryImg] = useState<string | null>(null);
  const [receiptImg, setReceiptImg] = useState<string | null>(null);
  const [receiptTxt, setReceiptTxt] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string | null>(null);
  const handleJewelryShot = async (file: File) => {
    setJewelryImg(URL.createObjectURL(file));
    setStage("receipt");
  };

  const handleReceiptShot = async (file: File) => {
    setReceiptImg(URL.createObjectURL(file));
    const { text, shopName } = await readReceipt(file);
    setReceiptTxt(text);
    setShopName(shopName);
    setStage("done");
  };

  return (
    <main className="p-4 space-y-6">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className={stage === "photo" ? "text-blue-600" : ""}>
          1 ▸ Snap Jewelry Photo
        </span>
        <span className={stage === "receipt" ? "text-blue-600" : ""}>
          2 ▸ Snap Receipt Snap
        </span>
        <span className={stage === "done" ? "text-blue-600" : ""}>
          3 ▸ Review
        </span>
      </div>

      {stage === "photo" && (
        <>
          <h1 className="text-xl font-semibold mb-2">Snap jewelry photo</h1>
          <Camera onShot={handleJewelryShot} />
        </>
      )}

      {stage === "receipt" && (
        <>
          <h1 className="text-xl font-semibold mb-2">Snap purchase receipt</h1>
          <Camera onShot={handleReceiptShot} />
        </>
      )}

      {stage === "done" && (
        <section className="space-y-4">
          <h1 className="text-xl font-semibold">Review & save</h1>

          {jewelryImg && (
            <div>
              <h2 className="font-medium mb-1">Jewelry photo</h2>
              <img
                src={jewelryImg}
                alt="Jewelry"
                className="w-full max-w-sm rounded shadow"
              />
            </div>
          )}

          {receiptImg && (
            <div>
              <h2 className="font-medium mb-1">Receipt & detected text</h2>
              <img
                src={receiptImg}
                alt="Receipt"
                className="w-full max-w-sm rounded shadow mb-2"
              />
              <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded border">
                {receiptTxt ?? "(no text found)"}
              </pre>
            </div>
          )}

          <p className="text-green-600 font-medium">
            Saved!{" "}
            {shopName
              ? `We recognised “${shopName}.”`
              : "Shop name not detected."}
          </p>
        </section>
      )}
    </main>
  );
}
