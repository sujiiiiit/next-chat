import React, { useRef, useEffect } from "react";
import indexOfAndSplice from "@/lib/indexOfAndSplice";
import deepEqual from "@/lib/deepEqual";
import { renderImageFromUrlPromise } from "@/lib/renderImageFromUrl";

const SCALE_PATTERN = true;
const USE_BITMAP = "createImageBitmap" in window;

type ChatBackgroundPatternRendererInitOptions = {
  url: string;
  width: number;
  height: number;
  mask?: boolean;
};

class ChatBackgroundPatternRenderer {
  private static INSTANCES: ChatBackgroundPatternRenderer[] = [];
  private options?: ChatBackgroundPatternRendererInitOptions;
  private canvases = new Set<HTMLCanvasElement>();
  private renderImageFromUrlPromise?: Promise<HTMLImageElement>;
  private image?: HTMLImageElement;
  private imageBitmap?: ImageBitmap;

  static getInstance(options: ChatBackgroundPatternRendererInitOptions) {
    let instance = this.INSTANCES.find((inst) =>
      deepEqual(inst.options, options)
    );
    if (!instance) {
      instance = new ChatBackgroundPatternRenderer();
      instance.init(options);
      this.INSTANCES.push(instance);
    }
    return instance;
  }

  init(options: ChatBackgroundPatternRendererInitOptions) {
    this.options = options;
  }

  async renderToCanvas(canvas: HTMLCanvasElement) {
    return this.renderImageFromUrl(this.options!.url).then(() =>
      this.fillCanvas(canvas)
    );
  }

  private renderImageFromUrl(url: string) {
    if (this.renderImageFromUrlPromise) return this.renderImageFromUrlPromise;

    const img = (this.image = document.createElement("img"));
    img.crossOrigin = "anonymous";

    return (this.renderImageFromUrlPromise = renderImageFromUrlPromise(
      img,
      url,
      false
    ).then(() => {
      if (USE_BITMAP) {
        return createImageBitmap(img, {
          resizeWidth: 1440,
          resizeHeight: 2960,
        }).then((bitmap) => {
          this.imageBitmap = bitmap;
          return img;
        });
      }
      return img;
    }));
  }

  cleanup(canvas: HTMLCanvasElement) {
    this.canvases.delete(canvas);
    if (!this.canvases.size) {
      indexOfAndSplice(ChatBackgroundPatternRenderer.INSTANCES, this);
      this.imageBitmap?.close();
    }
  }

  fillCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context || !this.options) return;
    const drp = devicePixelRatio || 1;
    const { width, height } = canvas;
    const source = this.imageBitmap || this.image;
    if (!source) return;
    const patternHeight = (500 + window.innerHeight / 4.5) * drp;
    const ratio = patternHeight / source.height;
    const imageWidth = source.width * ratio;
    const imageHeight = patternHeight;

    if (this.options.mask) {
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
    }

    const drawPattern = (y: number) => {
      for (let x = 0; x < width; x += imageWidth) {
        context.drawImage(source, x, y, imageWidth, imageHeight);
      }
    };

    const centerY = (height - imageHeight) / 2;
    drawPattern(centerY);

    for (let y = centerY - imageHeight; y >= 0; y -= imageHeight) {
      drawPattern(y);
    }
    for (let y = centerY + imageHeight; y < height; y += imageHeight) {
      drawPattern(y);
    }
  }

  setCanvasDimensions(canvas: HTMLCanvasElement) {
    const dpr = devicePixelRatio;
    canvas.width = this.options!.width * dpr;
    canvas.height = this.options!.height * dpr;
    canvas.style.width = `${this.options!.width}px`;
    canvas.style.height = `${this.options!.height}px`;
  }

  createCanvas() {
    const canvas = document.createElement("canvas");
    this.canvases.add(canvas);
    this.setCanvasDimensions(canvas);
    return canvas;
  }
}

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = ChatBackgroundPatternRenderer.getInstance({
      url,
      width,
      height,
      mask,
    });
    const canvas = canvasRef.current;

    if (canvas) {
      renderer.renderToCanvas(canvas);
    }

    return () => {
      if (canvas) renderer.cleanup(canvas);
    };
  }, [url, width, height, mask]);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
      className={className}
    />
  );
};

export default ChatBackground;
