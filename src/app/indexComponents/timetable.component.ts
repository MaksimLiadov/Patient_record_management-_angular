import { NgClass, NgFor, DatePipe } from "@angular/common";
import { Component, Input, SimpleChanges, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LocalStorageService } from "src/app/local-storage.service"
import { IWorker } from "src/app/employee-time-table-struct"
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [NgFor, InputTextModule, DropdownModule, NgClass, DatePipe, DialogModule, FormsModule, ButtonModule, InputNumberModule],
  providers: [LocalStorageService],
  templateUrl: 'timetable.component.html',
  styleUrl: './styles/timetable.component.scss'
})
export class TimetableComponent {
  @Input() fio: string;
  @Input() date: Date;
  @Input() isEmployeeAdded: boolean;
  @ViewChildren('date') dateElements: QueryList<ElementRef>;

  constructor(private localStorageService: LocalStorageService) { }

  public employeeFio: string = "";
  public recordingTime: string = "";

  public visibleMakeAppointment: boolean = false;
  public visibleRedactAppointment: boolean = false;

  public userFioForRedact: string;
  public userOldFioForRedact: string;
  public ageForRedact: number;
  public genderForRedact: string;

  public userFio: string = '';
  public age: number;
  public gender: string;

  public employeeTimeTableArr: IWorker[] = [];
  public genders: string[] = ["Женский", "Мужской"]

  ngOnChanges(changes: SimpleChanges) {

    if (changes.date && this.dateElements != undefined) {
      this.dateChange(this.date);
    }

    if ((changes.isEmployeeAdded) || (changes.fio)) {
      if (this.isEmployeeAdded) {
        let schedule = this.localStorageService.getISchedule(this.fio, this.date);

        this.localStorageService.addEmployeeTimeTable(this.fio, this.date, schedule);
        this.employeeTimeTableArr = this.localStorageService.getEmployeeTimeTableArr();
      }
      else {
        this.localStorageService.removeEmployeeTimeTable(this.fio);
        this.employeeTimeTableArr = this.localStorageService.getEmployeeTimeTableArr();
      }
    }
  }

  public showDialog(employeeFio: string, recordingTime: string): void {
    for (let i = 0; i < this.employeeTimeTableArr.length; i++) {
      if (this.employeeTimeTableArr[i].fio == employeeFio) {
        for (let schedule of this.employeeTimeTableArr[i].schedules) {
          if (schedule.time == recordingTime) {
            if (schedule.isFree) {
              this.employeeFio = employeeFio;
              this.recordingTime = recordingTime;
              this.visibleMakeAppointment = true;
            }
            else {
              this.employeeFio = employeeFio;
              this.recordingTime = recordingTime;
              this.userFioForRedact = schedule.name;
              this.userOldFioForRedact = schedule.name;
              this.ageForRedact = schedule.age;
              this.genderForRedact = schedule.gender;
              this.visibleRedactAppointment = true;
            }
          }

        }
      }
    }
  }

  public saveAppointment(): void {
    this.visibleMakeAppointment = false;

    let iWorker: IWorker = this.employeeTimeTableArr.find(worker => worker.fio === this.employeeFio);

    for (let worker of this.employeeTimeTableArr) {
      if (worker == iWorker) {
        for (let schedule of worker.schedules) {
          if (schedule.time == this.recordingTime) {
            schedule.name = this.userFio;
            schedule.isFree = false;
            this.localStorageService.addRecordToLocaleStorage(this.employeeFio, this.userFio, this.date, this.recordingTime, this.age, this.gender);
          }
        }
      }
    }
  }

  public saveChanges(): void {
    this.visibleRedactAppointment = false;
    this.localStorageService.saveChangesInLocalStorage(this.employeeFio, this.date, this.userFioForRedact, this.userOldFioForRedact, this.genderForRedact, this.ageForRedact, this.recordingTime);
    let iWorker: IWorker = this.employeeTimeTableArr.find(worker => worker.fio === this.employeeFio);

    for (let worker of this.employeeTimeTableArr) {
      if (worker == iWorker) {
        for (let schedule of worker.schedules) {
          if (schedule.time == this.recordingTime) {
            schedule.name = this.userFioForRedact;
            schedule.age = this.ageForRedact;
            schedule.gender = this.genderForRedact;
          }
        }
      }
    }
  }

  public deleteAppointment(): void {
    this.visibleRedactAppointment = false;
    this.localStorageService.deletRecordFromLocalStorage(this.employeeFio, this.date, this.userFioForRedact);
    let iWorker: IWorker = this.employeeTimeTableArr.find(worker => worker.fio === this.employeeFio);

    for (let worker of this.employeeTimeTableArr) {
      if (worker == iWorker) {
        for (let schedule of worker.schedules) {
          if (schedule.time == this.recordingTime) {
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
      timeTable.schedules = this.localStorageService.getISchedule(timeTable.fio, this.date);
    });
  }

}