"use client";

import React, { useEffect, useRef } from "react";

interface ChatBackgroundItemProps {
  width: number;
  height: number;
  patternUrl: string;
  maskColor?: string;
  className?: string;
}

const ChatBackgroundItem: React.FC<ChatBackgroundItemProps> = ({
  width,
  height,
  patternUrl,
  maskColor,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Clear the canvas for transparency
    context.clearRect(0, 0, width, height);

    const img = new Image();
    img.src = patternUrl;

    img.onload = () => {
      const pattern = context.createPattern(img, "repeat");
      if (pattern) {
        context.fillStyle = pattern;
        context.fillRect(0, 0, width, height);

        // Apply mask color if provided
        if (maskColor) {
          context.globalCompositeOperation = "destination-in";
          context.fillStyle = maskColor;
          context.fillRect(0, 0, width, height);
        }
      }
    };
  }, [patternUrl, width, height, maskColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        backgroundColor: "transparent", // Ensure no background color
      }}
    ></canvas>
  );
};

export default ChatBackgroundItem;
