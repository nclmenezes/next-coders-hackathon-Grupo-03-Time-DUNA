import { StorageRepositoryInterface } from "../interfaces/storage-repository.interface";

class StorageRepository implements StorageRepositoryInterface {
    insert(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    get(key: string) {
        const data = localStorage.getItem(key);
        if (!data) return ''
        return JSON.parse(data);
    }

    delete(keys: string[]) {
        keys.forEach(k => localStorage.removeItem(k));
    }

    deleteAll() {
        var allStorage = JSON.stringify(localStorage).split(',');
        allStorage.forEach((d: string) => {
            let x = d.split(':')[0].replace('"', '').replace('"', '').replace('{', '');
            localStorage.removeItem(x)
        });
    }
}

export default new StorageRepository();