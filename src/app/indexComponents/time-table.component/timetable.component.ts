import { NgClass, NgFor, DatePipe } from "@angular/common";
import { Component, Input, SimpleChanges, ViewChildren, QueryList, ElementRef, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LocalStorageService } from "src/app/services/local-storage.service"
import { EmployeeRecordsDataService } from "src/app/services/employee-records-data.service"
import { EmployeeListService } from "src/app/services/employee-list.service"
import { IWorker } from "src/app/data-models/employee-time-table-struct"
import { IAppointmentDialogData } from "src/app/data-models/dialog-data-sctruct"
import { IRecord } from "src/app/data-models/record-data-struct"
import { IEmployeeRecordsObj } from "src/app/data-models/employee-records-obj-struct"
import { IEmployee } from "src/app/data-models/employee-struct"
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogContent } from "../appointment-dialog.component/appointment-dialog.component"

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [ToastModule, RippleModule, NgFor, InputTextModule, DropdownModule, NgClass, DatePipe, DialogModule, DynamicDialogModule, FormsModule, ButtonModule, InputNumberModule],
  providers: [LocalStorageService, EmployeeRecordsDataService, MessageService, DialogService, EmployeeListService],
  templateUrl: 'timetable.component.html',
  styleUrl: './timetable.component.scss'
})
export class TimetableComponent implements OnInit {
  @Input() fio: string;
  @Input() date: Date;
  @Input() isEmployeeAdded: boolean;
  @ViewChildren('date') dateElements: QueryList<ElementRef>;

  constructor(private localStorageService: LocalStorageService, private employeeDataService: EmployeeRecordsDataService, public dialogService: DialogService) { }

  ref: DynamicDialogRef | undefined;

  public userFioForRedact: string;
  public userOldFioForRedact: string;
  public ageForRedact: number;
  public genderForRedact: string;

  public userFio: string = '';
  public age: number = null;
  public gender: string = '';

  public employeeTimeTableArr: IWorker[] = [];
  public genders: string[] = ["Женский", "Мужской"]

  ngOnInit(): void {
    // let employeeArr: IEmployee[] = [{ name: "Работник 1", isAdded: false }, { name: "Работник 2", isAdded: false },
    // { name: "Работник 3", isAdded: false }, { name: "Работник 4", isAdded: false }, { name: "Работник 5", isAdded: false },]
    // this.localStorageService.addToLocaleStorage("employeeArr", employeeArr);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.date && this.dateElements != undefined) {
      this.dateChange(this.date);
    }
    if ((changes.isEmployeeAdded) || (changes.fio)) {
      if (this.isEmployeeAdded) {
        let schedule = this.employeeDataService.getISchedule(this.fio, this.date);

        this.employeeDataService.addEmployeeTimeTable(this.fio, this.date, schedule);
        this.employeeTimeTableArr = this.employeeDataService.getEmployeeTimeTableArr();
      }
      else {
        this.employeeDataService.removeEmployeeTimeTable(this.fio);
        this.employeeTimeTableArr = this.employeeDataService.getEmployeeTimeTableArr();
      }
    }
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
      this.ref.destroy();
    }
  }

  public showDynamicDialog(employeeFio: string, recordingTime: string): void {
    this.employeeTimeTableArr = this.employeeDataService.getEmployeeTimeTableArr();

    for (let i = 0; i < this.employeeTimeTableArr.length; i++) {
      if (this.employeeTimeTableArr[i].fio == employeeFio) {
        for (let schedule of this.employeeTimeTableArr[i].schedules) {
          if (schedule.time == recordingTime) {
            if (schedule.isFree) {
              this.showAppointmentDialog(employeeFio, recordingTime);
            }
            else {
              this.userFioForRedact = schedule.name;
              this.userOldFioForRedact = schedule.name;
              this.ageForRedact = schedule.age;
              this.genderForRedact = schedule.gender;
              this.showAppointmentDialog(employeeFio, recordingTime);
              this.userFioForRedact = "";
              this.userOldFioForRedact = "";
              this.ageForRedact = null;
              this.genderForRedact = "";
            }
          }

        }
      }
    }
  }

  public showAppointmentDialog(employeeFio: string, recordingTime: string): void {
    this.ref = this.dialogService.open(DynamicDialogContent, {
      data: {
        employeeFio: employeeFio,
        recordingTime: recordingTime,
        userFio: this.userFioForRedact,
        userAge: this.ageForRedact,
        userGender: this.genderForRedact
      },
      header: 'Запись на прием',
      width: '22vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });

    this.ref.onClose.subscribe((data: IAppointmentDialogData) => {

      if (data) {
        switch (data.buttonType) {
          case "appointment":
            this.addRecord(data, employeeFio, recordingTime);
            break;
          case "saveChanges":
            this.saveChanges(data, employeeFio, recordingTime);
            break;
          case "delete":
            this.deleteRecord(data, employeeFio, recordingTime);
            break;
          default:
            this.ref.destroy();
            break;
        }
      }
      else {
        this.ref.destroy();
      }

    });
  }

  private addRecord(data: IAppointmentDialogData, employeeFio: string, recordingTime: string): void {
    let record: IRecord = {
      employeeFio: employeeFio,
      userFio: data.userFio,
      date: this.date,
      recordingTime: recordingTime,
      userAge: data.userAge,
      userGender: data.userGender
    }

    let employeeRecordsObj: IEmployeeRecordsObj = this.employeeDataService.getEmployeeAllRecordsObj(record);
    this.localStorageService.addToLocaleStorage("Все записи", employeeRecordsObj);

    let iWorker: IWorker = this.employeeTimeTableArr.find(worker => worker.fio === employeeFio);
    for (let worker of this.employeeTimeTableArr) {
      if (worker == iWorker) {
        for (let schedule of worker.schedules) {
          if (schedule.time == recordingTime) {
            schedule.name = data.userFio;
            schedule.isFree = false;
            schedule.age = data.userAge;
            schedule.gender = data.userGender;
            this.ref.destroy();
          }
        }
      }
    }
  }

  private saveChanges(data: IAppointmentDialogData, employeeFio: string, recordingTime: string) {
    let record: IRecord = {
      employeeFio: employeeFio,
      userFio: data.userFio,
      date: this.date,
      recordingTime: recordingTime,
      userAge: data.userAge,
      userGender: data.userGender
    }

    let changedEmployeeAllRecordsObj: IEmployeeRecordsObj = this.employeeDataService.getChangedEmployeeAllRecordsObj(record, this.userOldFioForRedact);
    this.localStorageService.addToLocaleStorage("Все записи", changedEmployeeAllRecordsObj)

    let iWorker: IWorker = this.employeeTimeTableArr.find(worker => worker.fio === employeeFio);
    for (let worker of this.employeeTimeTableArr) {
      if (worker == iWorker) {
        for (let schedule of worker.schedules) {
          if (schedule.time == recordingTime) {
            schedule.name = data.userFio;
            schedule.age = data.userAge;
            schedule.gender = data.userGender;
          }
        }
      }
    }
  }

  private deleteRecord(data: IAppointmentDialogData, employeeFio: string, recordingTime: string): void {
    let employeeRecordsObj: IEmployeeRecordsObj = this.employeeDataService.deleteEmployeeRecord(employeeFio, this.date, data.userFio);
    this.localStorageService.addToLocaleStorage("Все записи", employeeRecordsObj);

    let iWorker: IWorker = this.employeeTimeTableArr.find(worker => worker.fio === employeeFio);
    for (let worker of this.employeeTimeTableArr) {
      if (worker == iWorker) {
        for (let schedule of worker.schedules) {
          if (schedule.time == recordingTime) {
            schedule.name = "";
            schedule.age = null;
            schedule.gender = "";
            schedule.isFree = true;
          }
        }
      }
    }
  }

  public dateChange(date: Date): void {
    this.employeeTimeTableArr.forEach(timeTable => {
      timeTable.date = date;
      timeTable.schedules = this.employeeDataService.getISchedule(timeTable.fio, this.date);
    });
  }
}