export const IS_BETA = true;
export const DEBUG = IS_BETA; /*  && false */
const ctx: any = typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {};
export const MOUNT_CLASS_TO: any = DEBUG || true /*  && false */ ? ctx : {};
export default DEBUG;
