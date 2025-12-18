export interface StorageRepositoryInterface {
    insert: (key: string, data: any) => void;
    get: (key: string) => any;
    delete: (keys: string[]) => void;
};