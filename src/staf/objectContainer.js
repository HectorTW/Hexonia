export class ObjectContainer {
    constructor(nextId) {
        this.objects = new Map();
        this.nextId = nextId;
    }
    getFreeId() {
        while (this.objects.has(this.nextId)) {
            this.nextId++;
        }
        return this.nextId;
    }
    addObject(id, object) {
        if (this.objects.has(id)) {
            console.log(id)
            console.warn(`Объект с ID ${id} уже существует`);
            return false;
        }
        
        if (object === undefined || object === null) {
            console.warn('Нельзя добавить пустой объект');
            return false;
        }

        this.objects.set(id, object);
        
        // Обновляем nextId если нужно
        if (id >= this.nextId) {
            this.nextId = id + 1;
        }
        
        return true;
    }
    removeObject(id) {
        if (!this.objects.has(id)) {
            console.warn(`Объект с ID ${id} не найден`);
            return false;
        }

        this.objects.delete(id);
        
        // Обновляем nextId если удаленный ID меньше текущего nextId
        if (id < this.nextId) {
            this.nextId = id;
        }
        
        return true;
    }
    getObject(id) {
        return this.objects.get(id);
    }
    hasObject(id) {
        return this.objects.has(id);
    }
    getAllObjects() {
        return Array.from(this.objects.entries()).map(([id, object]) => ({ id, object }));
    }
    getSize() {
        return this.objects.size;
    }
    clear() {
        this.objects.clear();
        this.nextId = 1;
    }
    getAllIds() {
        return Array.from(this.objects.keys());
    }
}