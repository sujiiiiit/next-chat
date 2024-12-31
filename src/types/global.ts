declare global {
  interface HTMLCanvasElement {
    dpr?: number; // Add your custom attribute here
  }
  interface HTMLMediaElement {
    isSeeking?: boolean;
    ignoreLeak?: boolean;
  }
  interface Window {
    MOUNT_CLASS_TO: HTMLElement;
  }
  type MTMimeType =
    | "video/quicktime"
    | "image/gif"
    | "image/jpeg"
    | "application/pdf"
    | "video/mp4"
    | "image/webp"
    | "audio/mpeg"
    | "audio/ogg"
    | "application/octet-stream"
    | "application/x-tgsticker"
    | "video/webm"
    | "image/svg+xml"
    | "image/png"
    | "application/json"
    | "application/x-tgwallpattern"
    | "audio/wav"
    | "image/avif"
    | "image/jxl"
    | "image/bmp";
  type DocId = string | number;

  type EventListenerListeners = {

    [event: string]: (...args: unknown[]) => unknown;
  
  };
}

export {};
