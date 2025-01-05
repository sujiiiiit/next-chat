// File: indexedDbUtil.ts

export class IndexedDbUtil {
    private db!: IDBDatabase;
  
    constructor(private dbName: string, private storeName: string) {
      this.openDatabase();
    }
  
    private openDatabase() {
      const request = indexedDB.open(this.dbName, 1);
  
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        if (!this.db.objectStoreNames.contains(this.storeName)) {
          this.db.createObjectStore(this.storeName, { keyPath: "key" });
        }
      };
  
      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
      };
  
      request.onerror = (event: Event) => {
        console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error);
      };
    }
  
    public add(key: string, value: Blob) {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ key, value });
  
      request.onerror = (event: Event) => {
        console.error("IndexedDB add error:", (event.target as IDBRequest).error);
      };
    }
  
    public get(key: string): Promise<Blob | undefined> {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
  
        request.onsuccess = (event: Event) => {
          const result = (event.target as IDBRequest).result;
          resolve(result ? result.value : undefined);
        };
  
        request.onerror = (event: Event) => {
          console.error("IndexedDB get error:", (event.target as IDBRequest).error);
          reject((event.target as IDBRequest).error);
        };
      });
    }
  
    public delete(key: string) {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);
  
      request.onerror = (event: Event) => {
        console.error("IndexedDB delete error:", (event.target as IDBRequest).error);
      };
    }
  }