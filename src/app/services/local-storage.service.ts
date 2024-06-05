
import { IWorker, ISchedule } from "src/app/data-models/employee-time-table-struct"


export class LocalStorageService {

    public addRecordToLocaleStorage(employeeFio: string, userFio: string, date: Date, time: string, age: number, gender: string): void {
        let dateStr = this.toDateStr(date);
        let localStorageObj = this.getLocalStorageData() || {};

        localStorageObj[employeeFio] = localStorageObj[employeeFio] || {};
        localStorageObj[employeeFio][dateStr] = localStorageObj[employeeFio][dateStr] || {};
        localStorageObj[employeeFio][dateStr][userFio] = {
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

    private toDateStr(date: Date): string {

        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();

        let dateStr = dd + '.' + mm + '.' + yyyy;
        return dateStr
    }

    public saveChangesInLocalStorage(employeeFio: string, date: Date, userFio: string, userOldFioForRedact: string, gender: string, age: number, time: string): void {

        let localStorageData = this.getLocalStorageData();
        let dateStr = this.toDateStr(date);
        delete localStorageData[employeeFio][dateStr][userOldFioForRedact];
        localStorageData[employeeFio][dateStr][userFio] = {
            age: age,
            gender: gender,
            time: time
        };

        localStorage.setItem('Все записи', JSON.stringify(localStorageData));
    }

    public deleteRecordFromLocalStorage(employeeFio: string, date: Date, userFio: string): void {
        let localStorageData = this.getLocalStorageData();
        let dateStr = this.toDateStr(date);

        delete localStorageData[employeeFio][dateStr][userFio];

        localStorage.setItem('Все записи', JSON.stringify(localStorageData));
    }
}