/* eslint-disable @next/next/no-img-element */
"use client";

import { isBlurred } from "@/lib/isBlurred";
import { readReceipt } from "@/lib/ocr";
import dynamic from "next/dynamic";
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  type FC,
} from "react";

import type ReactWebcam from "react-webcam";
import type { WebcamProps } from "react-webcam";

type WebcamComponent = React.ForwardRefExoticComponent<
  WebcamProps & React.RefAttributes<ReactWebcam>
>;

const Webcam = dynamic(
  () =>
    import("react-webcam").then(
      (mod) => mod.default as unknown as WebcamComponent
    ),
  { ssr: false }
);

interface CameraOptions {
  runBlurCheck: boolean;
  runOcrCheck: boolean;
}

interface CameraProps {
  onShot: (file: File) => void;
  options?: CameraOptions;
}

export const Camera: FC<CameraProps> = ({ onShot, options }) => {
  const [image, setImage] = useState<string | null>(null);
  const [constraints, setConstraints] = useState<MediaStreamConstraints>({
    video: { facingMode: { ideal: "environment" } },
  });
  type WebcamHandle = InstanceType<typeof ReactWebcam>;
  const camRef = useRef<WebcamHandle | null>(null);
  const [blurInfo, setBlurInfo] = useState<{
    isBlur: boolean;
    score: number;
  }>();
  const [text, setText] = useState("");
  const [shopName, setShopName] = useState("");

  const handleError = useCallback((err: string | DOMException) => {
    if (err instanceof DOMException && err.name === "OverconstrainedError") {
      console.warn("Rear camera not available, retrying default");
      setConstraints({ video: true });
    } else {
      console.error(err);
      alert("Unable to access camera");
    }
  }, []);

  const capture = async () => {
    const src = camRef.current?.getScreenshot();
    if (!src) return;

    setImage(src);

    const blob = await fetch(src).then((r) => r.blob());
    const file = new File([blob], "photo.jpg", { type: blob.type });

    const _blurInfo = await isBlurred(file);

    if (options?.runBlurCheck) {
      setBlurInfo(_blurInfo);

      if (_blurInfo.isBlur) {
        alert("Too blurry – please retake 📸");
        return;
      }
    }

    if (options?.runOcrCheck) {
      const _data = await readReceipt(file);
      setShopName(_data?.shopName ?? "");
      setText(_data.text);
    }
  };

  const confirm = async () => {
    if (!image) return;

    const blob = await fetch(image).then((r) => r.blob());
    const file = new File([blob], "photo.jpg", { type: blob.type });

    onShot(file);
    setImage(null);
  };

  useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="flex flex-col items-center w-full">
      {image ? (
        <>
          <img
            src={image}
            alt="preview"
            className="w-full max-w-md rounded shadow"
          />
          {options?.runBlurCheck && <span>Blur Score: {blurInfo?.score}</span>}
          {options?.runOcrCheck && <span>Extracted Text: {text}</span>}
          {options?.runOcrCheck && <span>Shop Name: {shopName}</span>}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setImage(null)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Retake
            </button>
            <button
              onClick={confirm}
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={blurInfo && blurInfo.isBlur}
            >
              Use photo
            </button>
          </div>
        </>
      ) : (
        <>
          <Webcam
            ref={camRef}
            audio={false}
            className="w-full max-w-md aspect-video rounded"
            mirrored={false}
            screenshotFormat="image/jpeg"
            videoConstraints={constraints.video}
            onUserMediaError={handleError}
            disablePictureInPicture={true}
            forceScreenshotSourceSize={false}
            imageSmoothing={true}
            screenshotQuality={100}
            onUserMedia={() => {}}
          />
          <button
            onClick={capture}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Capture
          </button>
        </>
      )}
    </div>
  );
};
