import indexOfAndSplice from "@/lib/indexOfAndSplice";
import deepEqual from "@/lib/deepEqual";
import { renderImageFromUrlPromise } from "@/lib/renderImageFromUrl";
import mediaSizes, { ScreenSize } from "@/lib/mediaSizes";
import IS_IMAGE_BITMAP_SUPPORTED from "@/lib/imageBitmapSupport";
import windowSize from "@/lib/windowSize";
import React, { useRef } from "react";

type ChatBackgroundProps = {
  url: string;
  width: number;
  height: number;
  mask?: boolean;
  className?: string;
};

type ChatBackgroundPatternRendererInitOptions = {
  url: string;
  width: number;
  height: number;
  mask?: boolean;
};

type Props = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    options: ChatBackgroundPatternRendererInitOptions;
};

const SCALE_PATTERN = false;
const USE_BITMAP = IS_IMAGE_BITMAP_SUPPORTED;

function ChatBackgroundPatternRendererComponent({
    canvasRef,
    options,
}: Props) {
    class ChatBackgroundPatternRenderer {
        private static INSTANCES: ChatBackgroundPatternRenderer[] = [];
        private config!: ChatBackgroundPatternRendererInitOptions;
        private renderImagePromise!: Promise<HTMLImageElement>;
        private image!: HTMLImageElement;
        private imageBitmap!: ImageBitmap;

        constructor() {
            this.config = options;
        }

        public static getInstance(
            config: ChatBackgroundPatternRendererInitOptions
        ) {
            let instance = this.INSTANCES.find((instance) => {
                return deepEqual(instance.config, config);
            });

            if (!instance) {
                instance = new ChatBackgroundPatternRenderer();
                instance.init(config);
                this.INSTANCES.push(instance);
            }

            return instance;
        }

        public init(config: ChatBackgroundPatternRendererInitOptions) {
            this.config = config;
        }

        public async renderToCanvas(canvas: HTMLCanvasElement) {
            return this.renderImageFromUrl(this.config.url).then(() => {
                return this.fillCanvas(canvas);
            });
        }

        public renderImageFromUrl(url: string) {
            if (this.renderImagePromise) return this.renderImagePromise;
            const img = (this.image = document.createElement("img"));
            img.crossOrigin = "anonymous";
            return (this.renderImagePromise = renderImageFromUrlPromise(
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

        public cleanup(canvas: HTMLCanvasElement) {
            const canvases = new Set();
            canvases.delete(canvas);

            if (!canvases.size) {
                indexOfAndSplice(ChatBackgroundPatternRenderer.INSTANCES, this);

                this.imageBitmap?.close();
            }
        }

        public fillCanvas(canvas: HTMLCanvasElement) {
            const context = canvas.getContext("2d");
            const { width, height } = canvas;
            console.log(`Canvas width: ${width}, height: ${height}`);
            const source = this.imageBitmap || this.image;

            let imageWidth = source.width,
                imageHeight = source.height;
            console.log(`Image width: ${imageWidth}, height: ${imageHeight}`);
            const patternHeight = (500 + windowSize.height / 2.5) * (canvas.dpr || 1);
            const ratio = patternHeight / imageHeight;
            imageWidth *= ratio;
            imageHeight = patternHeight;
            console.log(`Pattern width: ${imageWidth}, height: ${imageHeight}`);

            if (this.config.mask) {
                if (context) context.fillStyle = "#000";
                if (context) context.fillRect(0, 0, width, height);
                if (context) context.globalCompositeOperation = "destination-out";
                if (context) context.globalAlpha = 0.5;
            } else {
                if (context) context.globalCompositeOperation = "source-over";
            }

            const drawPattern = (y: number) => {
                for (let x = 0; x < width; x += imageWidth) {
                    if (context) context.drawImage(source, x, y, imageWidth, imageHeight);
                }
            };

            const centerY = (height - imageHeight) / 2;
            drawPattern(centerY);

            if (centerY > 0) {
                let topY = centerY;
                do {
                    drawPattern((topY -= imageHeight));
                } while (topY >= 0);
            }

            const endY = height - 1;
            for (
                let bottomY = centerY + imageHeight;
                bottomY < endY;
                bottomY += imageHeight
            ) {
                drawPattern(bottomY);
            }

            if (this.config.mask) {
                if (context) context.globalAlpha = 0.3;
            } else {
                if (context) context.globalAlpha = 1.0;
            }
        }

        public setCanvasDimensions(canvas: HTMLCanvasElement) {
          const { width: parentWidth, height: parentHeight } = this.config;
          const dpr = Math.min(2, window.devicePixelRatio || 1);
      
          canvas.width = parentWidth * dpr;
          canvas.height = parentHeight * dpr;
      
          canvas.style.width = `${parentWidth}px`;
          canvas.style.height = `${parentHeight}px`;
      
          canvas.dpr = dpr; // Store DPR for later use
          canvas.dataset.originalHeight = `${parentHeight}`;
      }
      
    }

    React.useEffect(() => {
        if (canvasRef.current) {
            const renderer = ChatBackgroundPatternRenderer.getInstance(options);
            renderer.setCanvasDimensions(canvasRef.current);
            renderer.renderToCanvas(canvasRef.current);

            return () => renderer.cleanup(canvasRef.current!);
        }
    }, [canvasRef, options]);

    return null;
}

const ChatBackground: React.FC<ChatBackgroundProps> = ({
    url,
    width,
    height,
    mask,
    className,
}: ChatBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const config = {
        url,
        width,
        height,
        mask,
    };

    return (
        <>
            <canvas
                width={width}
                height={height}
                className={className}
                ref={canvasRef}
            />
            <ChatBackgroundPatternRendererComponent canvasRef={canvasRef} options={config} />
        </>
    );
};

export default ChatBackground;
