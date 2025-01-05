// File: framesCache.ts

export type FramesCacheMap = Map<number, Uint8ClampedArray>;
export type FramesCacheMapNew = Map<number, HTMLCanvasElement | ImageBitmap>;
export type FramesCacheMapURLs = Map<number, string>;

export type FramesCacheItem = {
  frames: FramesCacheMap,
  framesNew: FramesCacheMapNew,
  framesURLs: FramesCacheMapURLs,
  clearCache: () => void,
  counter: number
};

export class FramesCache {
  private cache: Map<string, FramesCacheItem>;

  constructor() {
    this.cache = new Map();
  }

  public static createCache(): FramesCacheItem {
    const cache: FramesCacheItem = {
      frames: new Map(),
      framesNew: new Map(),
      framesURLs: new Map(),
      clearCache: () => {
        cache.framesNew.forEach((value) => {
          (value as ImageBitmap).close?.();
        });
        cache.frames.clear();
        cache.framesNew.clear();
        cache.framesURLs.clear();
      },
      counter: 0
    };

    return cache;
  }

  public getCache(name: string) {
    let cache = this.cache.get(name);
    if (!cache) {
      this.cache.set(name, cache = FramesCache.createCache());
    }
    ++cache.counter;
    return cache;
  }

  public releaseCache(name: string) {
    const cache = this.cache.get(name);
    if (cache && !--cache.counter) {
      this.cache.delete(name);
    }
  }
}