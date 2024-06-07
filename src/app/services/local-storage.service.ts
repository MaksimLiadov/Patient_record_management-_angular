export class LocalStorageService {

    public add(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public get(key: string): any {
        let LocalStorageObj = JSON.parse(localStorage.getItem(key));
        return LocalStorageObj
    }

}