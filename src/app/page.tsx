"use client";
import App from "@/pages/Main";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Ensure the document is fully loaded before applying any client-side changes
    document.documentElement.classList.add("hydrated");
    function adjustViewport() {
      const viewport = document.documentElement;
      const updateHeight = () => {
        viewport.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
      };

      window.addEventListener("resize", updateHeight);
      updateHeight();
    }

    adjustViewport();
  }, []);

  return (
    <>
      <App />
    </>
  );
}
