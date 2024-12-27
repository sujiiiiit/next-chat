import React, { useRef, useEffect } from "react";
import ChatBackgroundPatternRenderer from "@/lib/patternRenderer";

type ChatBackgroundProps = {
  url: string;
  width: number;
  height: number;
  mask?: boolean;
  className?: string;
};

const ChatBackground: React.FC<ChatBackgroundProps> = ({
  url,
  width,
  height,
  mask = false,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const renderer = ChatBackgroundPatternRenderer.getInstance({
      url,
      width,
      height,
      mask,
    });

          let patternCanvas = renderer.createCanvas();


    if (canvasRef.current) {
      renderer.renderToCanvas(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        renderer.cleanup(canvasRef.current);
      }
    };
  }, [url, width, height, mask]);

  return (
    <canvas
      width={width}
      height={height}
      className={className}
      ref={canvasRef}
    />
  );
};

export default ChatBackground;
// "use client";
// import ChatBackgroundPatternRenderer from "@/lib/patternRenderer";
// import { useEffect, useRef } from "react";

// type ChatBackgroundProps = {
//   url: string;
//   width: number;
//   height: number;
//   mask?: boolean;
//   className?: string;
// };

// const ChatBackground: React.FC<ChatBackgroundProps> = ({
//   url,
//   width,
//   height,
//   mask = false,
//   className,
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     let patternRenderer: ChatBackgroundPatternRenderer;
//     let patternCanvas = canvasRef.current;

//     if (url) {
//       patternRenderer = ChatBackgroundPatternRenderer.getInstance({
//         url,
//         width: width,
//         height: height,
//         mask: false,
//       });
//       patternCanvas = patternRenderer.createCanvas();
//       if (className && patternCanvas) {
//         className
//           .split(" ")
//           .forEach((cls) => patternCanvas!.classList.add(cls));
//       }
//     }
//     const promise = new Promise<() => void>((resolve) => {
//       const cb = () => {
//         const chatElement = document.getElementById("chat-bg");
//         if (chatElement && patternCanvas) {
//           chatElement.appendChild(patternCanvas); // Append the canvas to #chat-id
//         }
//         resolve(() => {});
//       };

//       if (patternRenderer) {
//         if (patternCanvas) {
//           patternRenderer.renderToCanvas(patternCanvas).then(cb);
//         }
//       } else {
//         cb();
//       }
//     });
//     return () => {
//       if (canvasRef.current) {
//         patternRenderer.cleanup(canvasRef.current);
//       }
//     };
//   }, [url, width, height, mask]);

//   return (
//     <>
//       <canvas
//         width={width}
//         height={height}
//         className={className}
//         ref={canvasRef}
//       />
//     </>
//   );
// };

// export default ChatBackground;
