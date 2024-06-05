import { NgClass, NgFor, DatePipe } from "@angular/common";
import { Component, Input, SimpleChanges, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LocalStorageService } from "src/app/services/local-storage.service"
import { EmployeeDataService } from "src/app/services/employee-data.service"
import { IWorker } from "src/app/data-models/employee-time-table-struct"
import { IDialogData } from "src/app/data-models/dialog-data-sctruct"
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogContent } from "../dialog.component/dialog.component"
import { EditDynamicDialogContent } from "../edit-dialog.component/edit-dialog.component"

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [ToastModule, RippleModule, NgFor, InputTextModule, DropdownModule, NgClass, DatePipe, DialogModule, DynamicDialogModule, FormsModule, ButtonModule, InputNumberModule],
  providers: [LocalStorageService, EmployeeDataService, MessageService, DialogService],
  templateUrl: 'timetable.component.html',
  styleUrl: './timetable.component.scss'
})
export class TimetableComponent {
  @Input() fio: string;
  @Input() date: Date;
  @Input() isEmployeeAdded: boolean;
  @ViewChildren('date') dateElements: QueryList<ElementRef>;

  constructor(private localStorageService: LocalStorageService, private employeeDataService: EmployeeDataService, private messageService: MessageService, public dialogService: DialogService) { }

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.date) {
      console.log("dateChange " + this.date);

    }
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
              this.showEditDialog(employeeFio, recordingTime);
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
        recordingTime: recordingTime
      },
      header: 'Запись на прием',
      width: '22vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });

    this.ref.onClose.subscribe((data: IDialogData) => {
      if (data) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Вы записались.' });
        let iWorker: IWorker = this.employeeTimeTableArr.find(worker => worker.fio === employeeFio);
        for (let worker of this.employeeTimeTableArr) {
          if (worker == iWorker) {
            for (let schedule of worker.schedules) {
              if (schedule.time == recordingTime) {
                schedule.name = data.userFio;
                schedule.isFree = false;
                schedule.age = data.userAge;
                schedule.gender = data.userGender;
                this.localStorageService.addRecordToLocaleStorage(employeeFio, data.userFio, this.date, recordingTime, data.userAge, data.userGender);
              }
            }
          }
        }
      }
    });
  }

  public showEditDialog(employeeFio: string, recordingTime: string): void {

    this.ref = this.dialogService.open(EditDynamicDialogContent, {
      data: {
        employeeFio: employeeFio,
        recordingTime: recordingTime,
        userFioForRedact: this.userFioForRedact,
        ageForRedact: this.ageForRedact,
        genderForRedact: this.genderForRedact
      },
      header: 'Запись на прием',
      width: '22vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data.buttonType == 'Save') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Вы изменили данные.' });
        this.localStorageService.saveChangesInLocalStorage(employeeFio, this.date, data.userFio, this.userOldFioForRedact, data.userGender, data.userAge, recordingTime);
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
      else {
        this.localStorageService.deleteRecordFromLocalStorage(employeeFio, this.date, this.userFioForRedact);
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
    });
  }

  public dateChange(date: Date): void {
    this.employeeTimeTableArr.forEach(timeTable => {
      timeTable.date = date;
      timeTable.schedules = this.employeeDataService.getISchedule(timeTable.fio, this.date);
    });
  }
}