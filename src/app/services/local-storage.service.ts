export class LocalStorageService {

    public addRecordToLocaleStorage(employeeFio: string, userFio: string, date: Date, time: string, age: number, gender: string): void {
        let localStorageObj = this.getLocalStorageData() || {};

        localStorageObj[employeeFio] = localStorageObj[employeeFio] || {};
        localStorageObj[employeeFio][date] = localStorageObj[employeeFio][date] || {};
        localStorageObj[employeeFio][date][userFio] = {
            time: time,
            age: age,
            gender: gender
        };

        localStorage.setItem('Все записи', JSON.stringify(localStorageObj));
    }

    public getLocalStorageData(): object {
        let LocalStorageObj = JSON.parse(localStorage.getItem("Все записи"));
        return LocalStorageObj
    }

    public saveChangesInLocalStorage(employeeFio: string, date: Date, userFio: string, userOldFioForRedact: string, gender: string, age: number, time: string): void {

        let localStorageData = this.getLocalStorageData();
        delete localStorageData[employeeFio][date][userOldFioForRedact];
        localStorageData[employeeFio][date][userFio] = {
            age: age,
            gender: gender,
            time: time
        };

        localStorage.setItem('Все записи', JSON.stringify(localStorageData));
    }

    public deleteRecordFromLocalStorage(employeeFio: string, date: Date, userFio: string): void {
        let localStorageData = this.getLocalStorageData();

        delete localStorageData[employeeFio][date][userFio];

        localStorage.setItem('Все записи', JSON.stringify(localStorageData));
    }
}