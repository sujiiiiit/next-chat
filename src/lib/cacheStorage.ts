// cacheStorage.ts

export type CacheStorageDbName = 'cachedAssets'|'cachedFiles';

export default class CacheStorageController {
  private static STORAGES: CacheStorageController[] = [];
  private openDbPromise: Promise<Cache> | undefined;

  private useStorage = true;

  constructor(private dbName: CacheStorageDbName) {
    this.openDatabase();
    CacheStorageController.STORAGES.push(this);
  }

  private openDatabase(): Promise<Cache> {
    return this.openDbPromise ?? (this.openDbPromise = caches.open(this.dbName));
  }

  public delete(entryName: string) {
    return this.timeoutOperation((cache) => cache.delete('/' + entryName));
  }

  public deleteAll() {
    return caches.delete(this.dbName);
  }

  public get(entryName: string) {
    return this.timeoutOperation((cache) => cache.match('/' + entryName));
  }

  public save(entryName: string, response: Response) {
    return this.timeoutOperation((cache) => cache.put('/' + entryName, response));
  }

  public getFile(fileName: string, method: 'blob' | 'json' | 'text' = 'blob'): Promise<Blob | JSON | string> {
    return this.get(fileName).then((response) => {
      if (!response) {
        throw new Error('NO_ENTRY_FOUND');
      }
      return response[method]();
    });
  }

  public saveFile(fileName: string, content: string | ArrayBuffer | Blob) {
    const response = new Response(content);
    return this.save(fileName, response);
  }

  private timeoutOperation<T>(callback: (cache: Cache) => Promise<T>) {
    if (!this.useStorage) {
      return Promise.reject(new Error('STORAGE_OFFLINE'));
    }

    return new Promise<T>(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('CACHESTORAGE TIMEOUT'));
      }, 15000);

      try {
        const cache = await this.openDatabase();
        if (!cache) {
          this.useStorage = false;
          this.openDbPromise = undefined;
          throw new Error('No cache available');
        }

        const result = await callback(cache);
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        clearTimeout(timeout);
      }
    });
  }

  public static toggleStorage(enabled: boolean, clearWrite: boolean) {
    return Promise.all(this.STORAGES.map((storage) => {
      storage.useStorage = enabled;

      if (!clearWrite) {
        return;
      }

      if (!enabled) {
        return storage.deleteAll();
      }
    }));
  }
}
