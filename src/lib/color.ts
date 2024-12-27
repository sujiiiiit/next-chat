export type ColorHsla = {
  h: number;
  s: number;
  l: number;
  a: number;
};

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export type ColorRgba = [number, number, number, number];
export type ColorRgb = [number, number, number];

export function hexaToRgba(hexa: string): ColorRgba {
  const arr: ColorRgba = [] as unknown as ColorRgba;
  const offset = hexa[0] === "#" ? 1 : 0;

  // Handle shorthand hex (e.g., #rgb)
  if (hexa.length === 5 + offset) {
    hexa = (offset ? "#" : "") + "0" + hexa.slice(offset);
  }

  // Process hex values
  if (hexa.length === 3 + offset) {
    // Shortened hex, e.g., #rgb
    for (let i = offset; i < hexa.length; ++i) {
      arr.push(parseInt(hexa[i] + hexa[i], 16));
    }
    arr.push(255); // Default alpha for shorthand is 255 (fully opaque)
  } else if (hexa.length === 4 + offset) {
    // Shortened hex with alpha, e.g., #rgba
    for (let i = offset; i < hexa.length - 1; ++i) {
      arr.push(parseInt(hexa[i] + hexa[i], 16));
    }
    arr.push(parseInt(hexa[hexa.length - 1], 16) * 17); // Adjust for [0-15] range
  } else {
    // Full 6-character hex, e.g., #rrggbb or #rrggbbaa
    for (let i = offset; i < hexa.length; i += 2) {
      arr.push(parseInt(hexa.slice(i, i + 2), 16));
    }
    if (arr.length === 3 + offset) {
      arr.push(255); // Default alpha for full hex is 255 (fully opaque)
    }
  }

  return arr;
}

export function hexToRgb(hex: string): ColorRgb {
  // Remove the alpha channel if it exists and return RGB
  const rgba = hexaToRgba(hex.slice(0, 7)); // Grab the first 7 characters (#rrggbb)
  return rgba.slice(0, 3) as ColorRgb; // Return just the RGB part
}
