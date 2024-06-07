export class LocalStorageService {

    public addToLocaleStorage(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public getLocalStorageData(key: string): any {
        let LocalStorageObj = JSON.parse(localStorage.getItem(key));
        return LocalStorageObj
    }

}