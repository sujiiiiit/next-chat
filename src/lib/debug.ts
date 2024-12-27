export const IS_BETA = true;
export const DEBUG = IS_BETA; /*  && false */
type WorkerGlobalScope = typeof globalThis;
const ctx: Window | WorkerGlobalScope = typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {} as WorkerGlobalScope;
export const MOUNT_CLASS_TO: Window | WorkerGlobalScope = DEBUG || true ? ctx : {} as WorkerGlobalScope;
export default DEBUG;
