"use client";
import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    import("next-pwa/register");
  }, []);
  return null;
}
