class WindowSize {
  private _width: number = 0;
  private _height: number = 0;

  constructor() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  private updateDimensions() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

const windowSize = new WindowSize();
export default windowSize;