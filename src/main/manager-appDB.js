class AppDataBase {
    constructor(dbVersion = 100) {
        this.dbName = "application";
        this.dbVersion = dbVersion;
        this.db = null;

        this.initDB();
    }

    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                
                // Создаем коллекции, если они не существуют
                if (!this.db.objectStoreNames.contains('worldList')) {
                    this.db.createObjectStore('worldList', { keyPath: 'key' });
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

            request.onerror = (event) => {
                reject(`Error getting item: ${event.target.error}`);
            };
        });
    }

    async removeItem(collectionName, key) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([collectionName], 'readwrite');
            const store = transaction.objectStore(collectionName);
            const request = store.delete(key);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(`Error removing item: ${event.target.error}`);
            };
        });
    }

    async setItem(collectionName, key, value) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([collectionName], 'readwrite');
            const store = transaction.objectStore(collectionName);
            const request = store.put({ key, value });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(`Error setting item: ${event.target.error}`);
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

export const APP_DB_MANAGER = new AppDataBase();


