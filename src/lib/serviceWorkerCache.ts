// File: serviceWorkerCache.ts
/// <reference lib="webworker" />

const CACHE_ASSETS_NAME = 'cachedAssets';

function isCorrectResponse(response: Response) {
  return response.ok && response.status === 200;
}

function timeoutRace<T extends Promise<any>>(promise: T) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(reject, 10000))
  ]);
}

export async function requestCache(event: FetchEvent) {
  try {
    const cache = await timeoutRace(caches.open(CACHE_ASSETS_NAME)) as Cache;
    const file = await timeoutRace(cache.match(event.request, { ignoreVary: true }));

    if (file instanceof Response && isCorrectResponse(file)) {
      return file;
    }

    const response = await fetch(event.request);
    if (isCorrectResponse(response)) {
      cache.put(event.request, response.clone());
    }
    return response;
  } catch {
    return fetch(event.request);
  }
}