export class SaveDataBase {
    constructor(world_name) {
        this.dbName = world_name;
        this.dbVersion = 11;
        this.db = null;
    }
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                
                if (!this.db.objectStoreNames.contains('info')) {
                    this.db.createObjectStore('info', { keyPath: 'key' });
                }
                if (!this.db.objectStoreNames.contains('hexData')) {
                    this.db.createObjectStore('hexData', { keyPath: 'key' });
                }
                if (!this.db.objectStoreNames.contains('inventorys-data')) {
                    this.db.createObjectStore('inventorys-data', { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject(`IndexedDB error: ${event.target.error}`);
            };
        });
    }

    async getItem(collectionName, key) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([collectionName], 'readonly');
            const store = transaction.objectStore(collectionName);
            const request = store.get(key);
            request.onsuccess = () => {
                resolve(request.result ? request.result.value : undefined);
            };
            transaction.oncomplete = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(`Error getting item: ${event.target.error}`);
            };
        });
    }

    async setItem(collectionName, key, value) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([collectionName], 'readwrite');
            const store = transaction.objectStore(collectionName);
            const request = store.put({ key, value });
            request.onerror = (event) => {
                reject(`Error setting item: ${event.target.error}`);
            };
            transaction.oncomplete = () => {
                resolve();
            };
            transaction.onerror = (event) => {
                reject(`Transaction error: ${event.target.error}`);
            };
        });
    }
    
    async getAllKeys(collectionName) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([collectionName], 'readonly');
            const store = transaction.objectStore(collectionName);
            const request = store.getAllKeys();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(`Error getting all keys: ${event.target.error}`);
            };
        });
    }
}