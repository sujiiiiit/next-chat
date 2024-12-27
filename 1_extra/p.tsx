import React, { useRef, useEffect } from "react";
import indexOfAndSplice from "@/lib/indexOfAndSplice";
import deepEqual from "@/lib/deepEqual";
import { renderImageFromUrlPromise } from "@/lib/renderImageFromUrl";
import "@/types/global";
import mediaSizes, { ScreenSize } from "@/lib/mediaSizes";

const SCALE_PATTERN = true;
const IS_IMAGE_BITMAP_SUPPORTED = "createImageBitmap" in window;
const USE_BITMAP = IS_IMAGE_BITMAP_SUPPORTED;

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

  public renderToCanvas(canvas: HTMLCanvasElement) {
    // return this.createCanvasPattern(canvas).then(() => {
    // return this.fillCanvas(canvas);
    // });

    if (!this.options) {
      return Promise.reject(new Error("Options are not defined"));
    }
    return this.renderImageFromUrl(this.options.url).then(() => {
      return this.fillCanvas(canvas);
    });
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
      if (!IS_IMAGE_BITMAP_SUPPORTED || !USE_BITMAP) {
        return img;
      }

      return createImageBitmap(img, {
        resizeWidth: 1440,
        resizeHeight: 2960,
      }).then((imageBitmap) => {
        this.imageBitmap = imageBitmap;
        return img;
      });
    }));
  }

  cleanup(canvas: HTMLCanvasElement) {
    this.canvases.delete(canvas);
    if (!this.canvases.size) {
      indexOfAndSplice(ChatBackgroundPatternRenderer.INSTANCES, this);
      this.imageBitmap?.close();
    }
  }

  public setCanvasDimensions(canvas: HTMLCanvasElement) {
    const devicePixelRatio = Math.min(2, window.devicePixelRatio); // Use a higher scaling factor for better quality
    const width = this.options!.width * devicePixelRatio;
    let height = this.options!.height * devicePixelRatio;
  
    canvas.dpr = devicePixelRatio;
    canvas.dataset.originalHeight = "" + height;
  
    // Adjust height for large screens if needed
    if (mediaSizes.activeScreen === ScreenSize.large && SCALE_PATTERN) height *= 1.5;
  
    canvas.width = width;
    canvas.height = height;
  }
  
  public fillCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    const { width, height } = canvas;
  
    const source = this.imageBitmap || this.image;
    if (!source) return;
  
    let imageWidth = source.width;
    let imageHeight = source.height;
  
    // Scale the image for better rendering quality
    const patternHeight = (500 + window.innerHeight / 2.5) * (canvas.dpr || 1);
    const ratio = patternHeight / imageHeight;
    imageWidth *= ratio;
    imageHeight = patternHeight;
  
    // Drawing the image across the canvas
    const d = (y: number) => {
      for (let x = 0; x < width; x += imageWidth) {
        context?.drawImage(source, x, y, imageWidth, imageHeight);
      }
    };
  
    // Apply the mask if necessary
    if (context) {
      if (this.options?.mask) {
        context.fillStyle = "#000";
        context.fillRect(0, 0, width, height);
        context.globalCompositeOperation = "destination-out";
      } else {
        context.globalCompositeOperation = "source-over";
      }
  
      const centerY = (height - imageHeight) / 2;
      d(centerY);
  
      if (centerY > 0) {
        let topY = centerY;
        do {
          d((topY -= imageHeight));
        } while (topY >= 0);
      }
  
      const endY = height - 1;
      for (let bottomY = centerY + imageHeight; bottomY < endY; bottomY += imageHeight) {
        d(bottomY);
      }
    }
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
