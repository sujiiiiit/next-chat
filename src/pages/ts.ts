import indexOfAndSplice from "@/lib/indexOfAndSplice";
import deepEqual from "@/lib/deepEqual";
import { renderImageFromUrlPromise } from "@/lib/renderImageFromUrl";
import mediaSizes, { ScreenSize } from "@/lib/mediaSizes";
import IS_IMAGE_BITMAP_SUPPORTED from "@/lib/imageBitmapSupport";
import windowSize from "@/lib/windowSize";
import React from "react";

const SCALE_PATTERN = false;
const USE_BITMAP = IS_IMAGE_BITMAP_SUPPORTED;

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

export default function ChatBackgroundPatternRendererComponent({
    canvasRef,
    options,
}: Props) {
    class ChatBackgroundPatternRenderer {
        private static INSTANCES: ChatBackgroundPatternRenderer[] = [];
        private options!: ChatBackgroundPatternRendererInitOptions;
        private renderImageFromUrlPromise!: Promise<HTMLImageElement>;
        private image!: HTMLImageElement;
        private imageBitmap!: ImageBitmap;

        constructor() {
            this.options = options;
        }

        public static getInstance(
            options: ChatBackgroundPatternRendererInitOptions
        ) {
            let instance = this.INSTANCES.find((instance) => {
                return deepEqual(instance.options, options);
            });

            if (!instance) {
                instance = new ChatBackgroundPatternRenderer();
                instance.init(options);
                this.INSTANCES.push(instance);
            }

            return instance;
        }

        public init(options: ChatBackgroundPatternRendererInitOptions) {
            this.options = options;
        }

        public async renderToCanvas(canvas: HTMLCanvasElement) {
            return this.renderImageFromUrl(this.options.url).then(() => {
                return this.fillCanvas(canvas);
            });
        }

        public renderImageFromUrl(url: string) {
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

            if (this.options.mask) {
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

            if (this.options.mask) {
                if (context) context.globalAlpha = 0.3;
            } else {
                if (context) context.globalAlpha = 1.0;
            }
        }

        public setCanvasDimensions(canvas: HTMLCanvasElement) {
            const devicePixelRatio = Math.min(2, window.devicePixelRatio);
            const width = this.options.width * devicePixelRatio;
            let height = this.options.height * devicePixelRatio;
            console.log(`Set canvas dimensions width: ${width}, height: ${height}`);

            canvas.dpr = devicePixelRatio;
            canvas.dataset.originalHeight = "" + height;
            if (mediaSizes.activeScreen === ScreenSize.large && SCALE_PATTERN)
                height *= 1.5;
            canvas.width = width;
            canvas.height = height;
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
