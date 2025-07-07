"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

export const Camera: React.FC<{ onShot: (file: File) => void }> = ({
  onShot,
}) => {
  const [constraints, setConstraints] = useState<MediaStreamConstraints>({
    video: { facingMode: { ideal: "environment" } },
  });
  const camRef = useRef<any>(null);

  // Fallback once if the preferred constraints fail
  const handleError = (err: Error) => {
    if ((err as any).name === "OverconstrainedError") {
      console.warn("Rear camera not available, falling back to default", err);
      setConstraints({ video: true }); // retry with no facingMode
    } else {
      console.error(err);
      alert("Unable to access camera.");
    }
  };

  // Capture on tap / click
  const capture = () => {
    const imgSrc = camRef.current?.getScreenshot();

    console.log(imgSrc, "imgSrc")
    if (imgSrc)
      fetch(imgSrc)
        .then((r) => r.blob())
        .then((b) => onShot(new File([b], "photo.jpg", { type: b.type })));
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <Webcam
        ref={camRef}
        className="flex-1 rounded"
        mirrored={false}
        screenshotFormat="image/jpeg"
        videoConstraints={constraints.video}
        onUserMediaError={handleError}
        onClick={capture}
      />
      <button onClick={capture}>Click me</button>
    </div>
  );
};
