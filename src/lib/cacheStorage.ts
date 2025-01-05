export type CacheStorageDbName = 'cachedFiles' | 'cachedStreamChunks' | 'cachedAssets';

export default class CacheStorageController {
  private openDbPromise: Promise<Cache> | undefined;
  private useStorage = true;

  constructor(private dbName: CacheStorageDbName) {
    if ('caches' in window) {
      this.openDatabase();
    } else {
      this.useStorage = false;
      console.error('Cache Storage API is not supported in this browser.');
    }
  }

  private openDatabase(): Promise<Cache> {
    return this.openDbPromise ?? (this.openDbPromise = caches.open(this.dbName));
  }

  public delete(entryName: string) {
    if (!this.useStorage) {
      return Promise.reject(new Error('STORAGE_OFFLINE'));
    }

    return this.timeoutOperation((cache) => cache.delete('/' + entryName));
  }

  public deleteAll() {
    if (!this.useStorage) {
      return Promise.reject(new Error('STORAGE_OFFLINE'));
    }

    return caches.delete(this.dbName);
  }

  public get(entryName: string) {
    if (!this.useStorage) {
      return Promise.reject(new Error('STORAGE_OFFLINE'));
    }

    return this.timeoutOperation((cache) => cache.match('/' + entryName));
  }

  public save(entryName: string, response: Response) {
    if (!this.useStorage) {
      return Promise.reject(new Error('STORAGE_OFFLINE'));
    }

    return this.timeoutOperation((cache) => cache.put('/' + entryName, response));
  }

  private timeoutOperation<T>(callback: (cache: Cache) => Promise<T>) {
    if (!this.useStorage) {
      return Promise.reject(new Error('STORAGE_OFFLINE'));
    }

    return new Promise<T>(async (resolve, reject) => {
      let rejected = false;
      const timeout = setTimeout(() => {
        reject();
        rejected = true;
      }, 15000);

      try {
        const cache = await this.openDatabase();
        if (!cache) {
          this.useStorage = false;
          this.openDbPromise = undefined;
          throw new Error('No cache available');
        }

        const res = await callback(cache);
        if (!rejected) resolve(res);
      } catch (err) {
        reject(err);
      }

      clearTimeout(timeout);
    });
  }
}