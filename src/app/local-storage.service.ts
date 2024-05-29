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

    public dateChange(date: Date): void {
        this.employeeTimeTableArr.forEach(timeTable => {
            timeTable.date = date;

        });
    }

    public getLocalStorageData(): object {
        let LocalStorageObj = JSON.parse(localStorage.getItem("Все работники"));
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
                for (let obj of localStorageData[worker]) {
                    if (obj.date == dateStr) {
                        isFullFree = false;
                        let time = new Date();
                        time.setHours(8, 0, 0);
                        let schedule: ISchedule = { time: "", isFree: true }
                        for (let i = 0; i < 20; i++) {
                            let hours: string = time.getHours().toString();
                            let minutes: string = time.getMinutes().toString();

                            if (minutes == "0")
                                minutes = "00";

                            let scheduleTime = `${hours}:${minutes}`;

                            let isFree: boolean = true;

                            for (let timeRecord of obj.time) {
                                if (scheduleTime == timeRecord) {
                                    isFree = false
                                }
                            }
                            schedule = { time: scheduleTime, isFree: isFree }

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
            let schedule: ISchedule = { time: scheduleTime, isFree: true };
            scheduleArr.push(schedule);

            time.setMinutes(time.getMinutes() + 10)

        }
        return scheduleArr
    }

    public addNote
}