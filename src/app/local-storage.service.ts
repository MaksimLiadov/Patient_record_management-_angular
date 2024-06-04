import { IWorker, ISchedule } from "./employee-time-table-struct"

export class LocalStorageService {

    private employeeTimeTableArr: IWorker[] = [];

    public getEmployeeTimeTableArr(): IWorker[] {
        return this.employeeTimeTableArr;
    }

    public addEmployeeTimeTable(fio: string, date: Date, schedules: ISchedule[]): void {
        let employeeTimeTable: IWorker = { fio: fio, date: date, schedules: schedules };
        this.employeeTimeTableArr.push(employeeTimeTable);
    }

    public removeEmployeeTimeTable(fio: string): void {

        for (let i = 0; i < this.employeeTimeTableArr.length; i++) {
            if (this.employeeTimeTableArr[i].fio == fio) {
                this.employeeTimeTableArr.splice(i, 1)
            }
        }
    }
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
    public getISchedule(fio: string, date: Date): ISchedule[] {
        let dateStr = this.toDateStr(date);
        let scheduleArr: ISchedule[] = [];
        let localStorageData = this.getLocalStorageData();
        let isFullFree: boolean = true;

        for (let worker in localStorageData) {
            if (worker == fio) {
                for (let recordingDate in localStorageData[worker]) {
                    if (recordingDate == dateStr) {
                        isFullFree = false;
                        let time = new Date();
                        time.setHours(8, 0, 0);

                        for (let i = 0; i < 20; i++) {
                            let hours: string = time.getHours().toString();
                            let minutes: string = time.getMinutes().toString();

                            if (minutes == "0")
                                minutes = "00";

                            let scheduleTime = `${hours}:${minutes}`;

                            let isFree: boolean = true;
                            let name: string = ""
                            let age: number = null;
                            let gender: string = "";

                            for (let user in localStorageData[worker][recordingDate]) {
                                if (localStorageData[worker][recordingDate][user].time == scheduleTime) {
                                    isFree = false;
                                    name = user;
                                    age = localStorageData[worker][recordingDate][user].age;
                                    gender = localStorageData[worker][recordingDate][user].gender;
                                }
                            }
                            let schedule: ISchedule = { time: scheduleTime, isFree: isFree, name: name, age: age, gender: gender }
                            scheduleArr.push(schedule);

                            time.setMinutes(time.getMinutes() + 10)

                        }
                    }
                }

            }
        }


        if (isFullFree) {
            scheduleArr = this.fillFreeScheduleArr();
        }

        return scheduleArr
    }

    private fillFreeScheduleArr(): ISchedule[] {
        let scheduleArr: ISchedule[] = [];
        let time = new Date();
        time.setHours(8, 0, 0);


        for (let i = 0; i < 20; i++) {
            let hours: string = time.getHours().toString();
            let minutes: string = time.getMinutes().toString();

            if (minutes == "0")
                minutes = "00";

            let scheduleTime = `${hours}:${minutes}`;
            let schedule: ISchedule = { time: scheduleTime, isFree: true, name: "", age: null, gender: "" };
            scheduleArr.push(schedule);

            time.setMinutes(time.getMinutes() + 10)

        }
        return scheduleArr
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