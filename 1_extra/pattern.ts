/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

import indexOfAndSplice from "./indexOfAndSplice";
import deepEqual from "./deepEqual";
import { renderImageFromUrlPromise } from "./renderImageFromUrl";

const SCALE_PATTERN = false;

type ChatBackgroundPatternRendererInitOptions = {
  url: string;
  width: number;
  height: number;
  mask?: boolean;
  dpr: number;
};
const dpr = window.devicePixelRatio;
export default class ChatBackgroundPatternRenderer {
  private static INSTANCES: ChatBackgroundPatternRenderer[] = [];

  private options?: ChatBackgroundPatternRendererInitOptions;
  private canvases: Set<HTMLCanvasElement>;

  private renderImageFromUrlPromise?: Promise<HTMLImageElement>;
  private image?: HTMLImageElement;
  private imageBitmap?: ImageBitmap;

  constructor() {
    this.canvases = new Set();
  }

  public static getInstance(options: ChatBackgroundPatternRendererInitOptions) {
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
    // return this.createCanvasPattern(canvas).then(() => {
    // return this.fillCanvas(canvas);
    // });

    return this.renderImageFromUrl(this.options!.url).then(() => {
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
    ).then(async () => {
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
    this.canvases.delete(canvas);

    if (!this.canvases.size) {
      indexOfAndSplice(ChatBackgroundPatternRenderer.INSTANCES, this);

      this.imageBitmap?.close();
    }
  }

  public fillCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    const { width, height } = canvas;

    const source = this.imageBitmap || this.image;

    let imageWidth = source?.width,
      imageHeight = source?.height;
    const patternHeight = (500 + window.innerHeight / 2.5) * dpr;
    const ratio = patternHeight / (imageHeight || 1);
    imageWidth = (imageWidth || 0) * ratio;
    imageHeight = patternHeight;

    if (this.options?.mask) {
      context!.fillStyle = "#000";
      context!.fillRect(0, 0, width, height);
      context!.globalCompositeOperation = "destination-out";
    } else {
      context!.globalCompositeOperation = "source-over";
    }

    const d = (y: number) => {
      for (let x = 0; x < width; x += (imageWidth || 0)) {
        context!.drawImage(source as CanvasImageSource, x, y, imageWidth, imageHeight);
      }
    };

    const centerY = (height - imageHeight) / 2;
    d(centerY);

    if (centerY > 0) {
      let topY = centerY;
      do {
        d((topY -= imageHeight));
      } while (topY >= 0);
    }

    const endY = height - 1;
    for (
      let bottomY = centerY + imageHeight;
      bottomY < endY;
      bottomY += imageHeight
    ) {
      d(bottomY);
    }
  }

  public setCanvasDimensions(canvas: HTMLCanvasElement) {
    const devicePixelRatio = Math.min(2, window.devicePixelRatio);
    const width = this.options!.width * devicePixelRatio;
    let height = this.options!.height * devicePixelRatio;

    (canvas as any).dpr = devicePixelRatio;
    canvas.dataset.originalHeight = "" + height;
    if (window.innerWidth >= 1024 && SCALE_PATTERN) height *= 1.5;
    canvas.width = width;
    canvas.height = height;
  }

  public createCanvas() {
    const canvas = document.createElement("canvas");
    this.canvases.add(canvas);
    this.setCanvasDimensions(canvas);
    return canvas;
  }

  public resize(width: number, height: number) {
    this.init({
      ...this.options!,
      width,
      height,
    });

    const promises: Promise<any>[] = [];
    for (const canvas of this.canvases) {
      this.setCanvasDimensions(canvas);
      promises.push(this.renderToCanvas(canvas));
    }

    return Promise.all(promises);
  }

  public static resizeInstances(width: number, height: number) {
    return Promise.all(
      this.INSTANCES.map((instance) => instance.resize(width, height))
    );
  }

  /* public setResizeMode(resizing: boolean) {
    const canvases = Array.from(this.canvases);
    const canvas = canvases[canvases.length - 1];
    canvas.style.display = resizing ? 'none' : '';
    const img = this.img;
    img.style.display = resizing ? '' : 'none';

    return {img, canvas};
  } */
}
