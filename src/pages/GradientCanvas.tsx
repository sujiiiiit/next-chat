import React, { useRef, useEffect, useState } from "react";
import { hexToRgb } from "@/lib/color";

interface GradientCanvasProps {
  colors: string;
  className: string;
  width?: number;
  height?: number;
}

const GradientCanvas: React.FC<GradientCanvasProps> = ({
  colors,
  className,
  width = 300,
  height = width,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gradientRenderer, setGradientRenderer] =
    useState<GradientRenderer | null>(null);

  useEffect(() => {
    const renderer = new GradientRenderer(width, height);
    setGradientRenderer(renderer);

    return () => renderer.cleanup();
  }, [width, height]);

  useEffect(() => {
    if (gradientRenderer && canvasRef.current) {
      gradientRenderer.init(canvasRef.current, colors);
    }
  }, [gradientRenderer, colors]);

  return (
    <canvas
      ref={canvasRef}
      data-colors={colors}
      className={className}
      width={width}
      height={height}
    ></canvas>
  );
};

type Point = { x: number; y: number };

class GradientRenderer {
  private _width: number;
  private _height: number;
  private _phase = 0;
  private _tail = 0;
  private _tails = 90;
  private _frames: ImageData[] = [];
  private _colors: { r: number; g: number; b: number }[] = [];
  private _positions: Point[] = [
    { x: 0.8, y: 0.1 },
    { x: 0.6, y: 0.2 },
    { x: 0.35, y: 0.25 },
    { x: 0.25, y: 0.6 },
    { x: 0.2, y: 0.9 },
    { x: 0.4, y: 0.8 },
    { x: 0.65, y: 0.75 },
    { x: 0.75, y: 0.4 },
  ];
  private _phases = this._positions.length;
  private _canvas: HTMLCanvasElement | null = null;
  private _ctx: CanvasRenderingContext2D | null = null;
  private _hc: HTMLCanvasElement | null = null;
  private _hctx: CanvasRenderingContext2D | null = null;
  private _curve: number[];
  private _incrementalCurve: number[];

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;

    // Precompute curve
    const baseCurve = [
      0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      13, 14, 15, 16, 17, 18, 18.3, 18.6, 18.9, 19.2, 19.5, 19.8, 20.1, 20.4,
      20.7, 21.0, 21.3, 21.6, 21.9, 22.2, 22.5, 22.8, 23.1, 23.4, 23.7, 24.0,
      24.3, 24.6, 24.9, 25.2, 25.5, 25.8, 26.1, 26.3, 26.4, 26.5, 26.6, 26.7,
      26.8, 26.9, 27,
    ];
    const diff = this._tails / baseCurve[baseCurve.length - 1];
    this._curve = baseCurve.map((v) => v * diff);
    this._incrementalCurve = this._curve.map(
      (v, i, arr) => v - (arr[i - 1] ?? 0)
    );
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = hexToRgb(hex);
    return { r: result[0], g: result[1], b: result[2] };
  }

  private drawGradient(positions: Point[]) {
    if (!this._ctx || !this._hctx) throw new Error("Context not initialized");
    const id = this.getGradientImageData(positions);
    this._hctx.putImageData(id, 0, 0);
    this._ctx.drawImage(this._hc!, 0, 0, this._width, this._height);
  }

  private getGradientImageData(
    positions: Point[],
    phase = this._phase,
    progress = 1 - this._tail / this._tails
  ) {
    if (!this._hctx) {
      throw new Error("Context is not initialized");
    }
    const id = this._hctx.createImageData(this._width, this._height);
    const pixels = id.data;
    const colorsLength = this._colors.length;

    const positionsForPhase = (phase: number) => {
      const result: typeof positions = [];
      for (let i = 0; i != 4; ++i) {
        result[i] = {
          ...this._positions[(phase + i * 2) % this._positions.length],
        };
        result[i].y = 1.0 - result[i].y;
      }
      return result;
    };

    const previousPhase = (phase + 1) % this._positions.length;
    const previous = positionsForPhase(previousPhase);
    const current = positionsForPhase(phase);

    let offset = 0;
    for (let y = 0; y < this._height; ++y) {
      const directPixelY = y / this._height;
      const centerDistanceY = directPixelY - 0.5;
      const centerDistanceY2 = centerDistanceY * centerDistanceY;
      for (let x = 0; x < this._width; ++x) {
        const directPixelX = x / this._width;
        const centerDistanceX = directPixelX - 0.5;
        const centerDistance = Math.sqrt(
          centerDistanceX * centerDistanceX + centerDistanceY2
        );

        const swirlFactor = 0.35 * centerDistance;
        const theta = swirlFactor * swirlFactor * 0.8 * 8.0;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        const pixelX = Math.max(
          0.0,
          Math.min(
            1.0,
            0.5 + centerDistanceX * cosTheta - centerDistanceY * sinTheta
          )
        );
        const pixelY = Math.max(
          0.0,
          Math.min(
            1.0,
            0.5 + centerDistanceX * sinTheta + centerDistanceY * cosTheta
          )
        );

        let distanceSum = 0.0;
        let r = 0.0;
        let g = 0.0;
        let b = 0.0;
        for (let i = 0; i < colorsLength; ++i) {
          const colorX =
            previous[i].x + (current[i].x - previous[i].x) * progress;
          const colorY =
            previous[i].y + (current[i].y - previous[i].y) * progress;

          const distanceX = pixelX - colorX;
          const distanceY = pixelY - colorY;

          let distance = Math.max(
            0.0,
            0.9 - Math.sqrt(distanceX * distanceX + distanceY * distanceY)
          );
          distance = distance * distance * distance * distance;
          distanceSum += distance;

          r += distance * this._colors[i].r;
          g += distance * this._colors[i].g;
          b += distance * this._colors[i].b;
        }

        pixels[offset++] = r / distanceSum;
        pixels[offset++] = g / distanceSum;
        pixels[offset++] = b / distanceSum;
        pixels[offset++] = 0xff;
      }
    }
    return id;
  }

  public init(el: HTMLCanvasElement, colors: string) {
    this._canvas = el;
    this._ctx = el.getContext("2d", { alpha: false });
    this._colors = colors.split(",").map(this.hexToRgb);

    if (!this._hc) {
      this._hc = document.createElement("canvas");
      this._hc.width = this._width;
      this._hc.height = this._height;
      this._hctx = this._hc.getContext("2d", { alpha: false });
    }
    this.update();
  }

  public cleanup() {
    this._frames = [];
    this._phase = 0;
    this._tail = 0;
  }

  public update() {
    if (this._colors.length < 2 && this._ctx) {
      const { r, g, b } = this._colors[0];
      this._ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      this._ctx.fillRect(0, 0, this._width, this._height);
      return;
    }
    const position = this.curPosition(this._phase, this._tail);
    this.drawGradient(position);
  }

  private curPosition(phase: number, tail: number): Point[] {
    // Position calculation logic...
    return [];
  }
}

export default GradientCanvas;
