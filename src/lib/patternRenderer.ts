import indexOfAndSplice from "./indexOfAndSplice";
import deepEqual from "./deepEqual";
import { renderImageFromUrlPromise } from "./renderImageFromUrl";
import mediaSizes, { ScreenSize } from "./mediaSizes";
import IS_IMAGE_BITMAP_SUPPORTED from "./imageBitmapSupport";
import windowSize from "./windowSize";

const SCALE_PATTERN = false;
const USE_BITMAP = IS_IMAGE_BITMAP_SUPPORTED;

type ChatBackgroundPatternRendererInitOptions = {
  url: string;
  width: number;
  height: number;
  mask?: boolean;
};

export default class ChatBackgroundPatternRenderer {
  private static INSTANCES: ChatBackgroundPatternRenderer[] = [];
  private options!: ChatBackgroundPatternRendererInitOptions;
  private canvases: Set<HTMLCanvasElement>;
  private renderImageFromUrlPromise!: Promise<HTMLImageElement>;
  private image!: HTMLImageElement;
  private imageBitmap!: ImageBitmap;
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
    this.canvases.delete(canvas);

    if (!this.canvases.size) {
      indexOfAndSplice(ChatBackgroundPatternRenderer.INSTANCES, this);

      this.imageBitmap?.close();
    }
  }

  // public fillCanvas(canvas: HTMLCanvasElement) {
  //   const context = canvas.getContext('2d');
  //   const {width, height} = canvas;
  //   const source = this.imageBitmap || this.image;

  //   let imageWidth = source.width, imageHeight = source.height;
  //   const patternHeight = (500 + (windowSize.height / 2.5)) * (canvas.dpr || 1);
  //   const ratio = patternHeight / imageHeight;
  //   imageWidth *= ratio;
  //   imageHeight = patternHeight;

  //   if(this.options.mask) {
  //     if (context) context.fillStyle = '#000';
  //     if (context) context.fillRect(0, 0, width, height);
  //     if (context) context.globalCompositeOperation = 'destination-out';
  //   } else {
  //     if (context) context.globalCompositeOperation = 'source-over';
  //   }

  //   const d = (y: number) => {
  //     for(let x = 0; x < width; x += imageWidth) {
  //       if (context) context.drawImage(source, x, y, imageWidth, imageHeight);
  //     }
  //   };

  //   const centerY = (height - imageHeight) / 2;
  //   d(centerY);

  //   if(centerY > 0) {
  //     let topY = centerY;
  //     do {
  //       d(topY -= imageHeight);
  //     } while(topY >= 0);
  //   }

  //   const endY = height - 1;
  //   for(let bottomY = centerY + imageHeight; bottomY < endY; bottomY += imageHeight) {
  //     d(bottomY);
  //   }
  // }

  public fillCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    const { width, height } = canvas;
    const source = this.imageBitmap || this.image;

    let imageWidth = source.width,
      imageHeight = source.height;
    const patternHeight = (500 + windowSize.height / 2.5) * (canvas.dpr || 1);
    const ratio = patternHeight / imageHeight;
    imageWidth *= ratio;
    imageHeight = patternHeight;

    if (this.options.mask) {
      // Set the fill style and create the mask
      if (context) context.fillStyle = "#000";
      if (context) context.fillRect(0, 0, width, height);
      if (context) context.globalCompositeOperation = "destination-out";

      // Set the opacity to 0.5 when mask is true
      if (context) context.globalAlpha = 0.5;
    } else {
      if (context) context.globalCompositeOperation = "source-over";
    }

    const d = (y: number) => {
      for (let x = 0; x < width; x += imageWidth) {
        if (context) context.drawImage(source, x, y, imageWidth, imageHeight);
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

    canvas.dpr = devicePixelRatio;
    canvas.dataset.originalHeight = "" + height;
    if (mediaSizes.activeScreen === ScreenSize.large && SCALE_PATTERN)
      height *= 1.5;
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
      ...this.options,
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
}
