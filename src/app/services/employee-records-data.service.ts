import { Injectable } from "@angular/core";
import { IWorker, ISchedule } from "../data-models/employee-time-table-struct"
import { LocalStorageService } from "./local-storage.service"
import { IRecord } from "src/app/data-models/record-data-struct"
import { IEmployeeRecordsObj } from "src/app/data-models/employee-records-obj-struct"

@Injectable()
export class EmployeeRecordsDataService {

    private employeeTimeTableArr: IWorker[] = [];
    private readonly key: string = "Все записи";

    constructor(private localStorageService: LocalStorageService) { }

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

    public add(record: IRecord): void {
        let employeeRecordsObj: IEmployeeRecordsObj = this.localStorageService.get<IEmployeeRecordsObj>(this.key) || {};

        employeeRecordsObj[record.employeeFio] = employeeRecordsObj[record.employeeFio] || {};
        employeeRecordsObj[record.employeeFio][record.date.toString()] = employeeRecordsObj[record.employeeFio][record.date.toString()] || {};
        employeeRecordsObj[record.employeeFio][record.date.toString()][record.userFio] = {
            time: record.recordingTime,
            age: record.userAge,
            gender: record.userGender
        };

        this.localStorageService.add<IEmployeeRecordsObj>(this.key, employeeRecordsObj);
    }

    public change(record: IRecord, userOldFioForRedact: string): void {
        let employeeRecordsObj: IEmployeeRecordsObj = this.localStorageService.get<IEmployeeRecordsObj>(this.key);
        delete employeeRecordsObj[record.employeeFio][record.date.toString()][userOldFioForRedact];
        employeeRecordsObj[record.employeeFio][record.date.toString()][record.userFio] = {
            age: record.userAge,
            gender: record.userGender,
            time: record.recordingTime
        };

        this.localStorageService.add<IEmployeeRecordsObj>(this.key, employeeRecordsObj)
    }

    public delete(employeeFio: string, date: Date, userFio: string): void {
        let employeeRecordsObj: IEmployeeRecordsObj = this.localStorageService.get<IEmployeeRecordsObj>(this.key);
        delete employeeRecordsObj[employeeFio][date.toString()][userFio];

        this.localStorageService.add<IEmployeeRecordsObj>(this.key, employeeRecordsObj);
    }

    public getISchedule(fio: string, date: Date): ISchedule[] {
        let dateStr = date.toString();
        let scheduleArr: ISchedule[] = [];;
        let localStorageData = this.localStorageService.get<IEmployeeRecordsObj>(this.key);
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
}