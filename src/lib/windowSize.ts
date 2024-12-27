class WindowSize {
  private _width: number = 0;
  private _height: number = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this.updateDimensions();
      window.addEventListener("resize", this.updateDimensions.bind(this));
    }
  }

  private updateDimensions() {
    if (typeof window !== "undefined") {
      this._width = window.innerWidth;
      this._height = window.innerHeight;
    }
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  // Cleanup method to remove event listener if needed
  public destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.updateDimensions.bind(this));
    }
  }
}

let windowSize: WindowSize = new WindowSize();

if (typeof window === "undefined") {
  windowSize = null as unknown as WindowSize;
}

export default windowSize;
