export class LocalStorageService {

    public add<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public get<T>(key: string): T | null {
        let LocalStorageObj = JSON.parse(localStorage.getItem(key));
        return LocalStorageObj as T
    }

}