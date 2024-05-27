import { NgClass, NgFor } from "@angular/common";
import { Component, Input, ElementRef, ViewChild, ViewContainerRef, EmbeddedViewRef, TemplateRef, QueryList, ViewChildren, SimpleChanges } from "@angular/core";

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: 'timetable.component.html',
  styleUrl: './styles/timetable.component.scss'
})
export class TimetableComponent {
  @Input() fio: string;
  @Input() date: Date;
  public dateStr: string;
  @Input() isEmployeeAdded: boolean;
  @ViewChild('timeTable') timeTable: ElementRef;
  @ViewChild('tpl1') tpl: TemplateRef<any>;
  @ViewChildren('date') dateElements: QueryList<ElementRef>;

  private view: EmbeddedViewRef<Object>;
  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.date) { this.setDateStr(); }

    if (changes.date && this.dateElements != undefined) {

      console.log(this.dateStr);

      this.dateElements.forEach(element => {
        element.nativeElement.innerText = this.dateStr;
        let fio: string = element.nativeElement.parentNode.querySelector(".FIO").innerHTML
        this.updateSchedule(fio, this.dateStr);
      })
    }

    if ((changes.isEmployeeAdded) || (changes.fio)) {
      let scheduleArr: string[][] = this.fillScheduleArr(20, this.fio, this.dateStr);
      let workerData = { fio: this.fio, date: this.dateStr, schedule: scheduleArr[0], scheduleClasses: scheduleArr[1] }
      if (this.isEmployeeAdded) {
        this.addWorker(workerData);
      }
      else {
        this.deleteWorker(workerData.fio);
      }
    }
  }

  private setDateStr(): void {
    console.log(this.date);

    if (typeof (this.date) === "object") {

      console.log("Date");
    }
    let dd = String(this.date.getDate()).padStart(2, '0');
    let mm = String(this.date.getMonth() + 1).padStart(2, '0');
    let yyyy = this.date.getFullYear();

    this.dateStr = dd + '.' + mm + '.' + yyyy;
  }

  public clickEvent(target: HTMLElement, fio: string): void {
    let className: string = "freely";
    if (target.classList.contains(className)) {
      this.addNote(target, fio);
    }
    else {
      this.removeNote(target);
    }
  }

  private updateSchedule(fio: String, date: String): void {
    let scheduleArr: string[][] = this.fillScheduleArr(20, fio, date);
    let workerData = { fio: fio, date: date, schedule: scheduleArr[0], scheduleClasses: scheduleArr[1] }
    this.deleteWorker(workerData.fio);
    this.addWorker(workerData);
  }

  private addNote(target: HTMLElement, employeeFIO: string): void {
    let userFIO: string;
    if (userFIO = prompt("Введите ваше ФИО", "Иванов Иван Иванович")) {
      let isValidated = this.checkValidation(userFIO);

      if (isValidated) {

        let currentDate = this.dateStr;
        let key = employeeFIO + "," + currentDate + "," + target.innerText;
        localStorage.setItem(key, userFIO)

        target.innerText = userFIO;
        target.classList.add('appointment');
        target.classList.remove('freely');
      }
      else
        alert("Введено некоректное ФИО");
    }
  }

  private removeNote(target: HTMLElement): void {
    let del = confirm("Вы хотите удалить запись?");
    if (del) {
      let parent = target.parentNode;
      let numberOfElem: number;
      let date = target.parentNode.parentNode.querySelector(".date").innerHTML;
      let fio = target.parentNode.parentNode.querySelector(".FIO").innerHTML;

      for (let i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] == target) {
          numberOfElem = i;
        }
      }

      let time = new Date();
      time.setHours(8, 0, 0);
      for (let i = 0; i < numberOfElem; i++) {
        time.setMinutes(time.getMinutes() + 10);
      }
      let hours = time.getHours().toString();
      let minutes = time.getMinutes().toString();
      if (minutes == "0") {
        minutes = "00";
      }

      target.innerHTML = (hours + ":" + minutes);
      target.classList.remove("appointment");
      target.classList.add("freely");

      let key = fio + "," + date + "," + hours + ":" + minutes;

      localStorage.removeItem(key)

      target.classList.add('freely');
      target.classList.remove('appointment');
    }
  }

  private deleteWorker(fio: String): void {
    let element = document.getElementById(`${fio}`);
    if (element) { element.remove(); }
  }

  private addWorker(workerData): void {
    this.view = this.viewContainerRef.createEmbeddedView(this.tpl, {
      $implicit: workerData
    });
    this.view.rootNodes[0].id = workerData.fio;
    this.timeTable.nativeElement.appendChild(this.view.rootNodes[0]);
  }

  private fillScheduleArr(scheduleLength: number, fio: String, date: String): string[][] {
    let arr: string[][] = [[], []];
    let time = new Date();
    time.setHours(8, 0, 0);
    let userFIO: string;

    for (let i = 0; i < scheduleLength; i++) {
      let thereIsRecord: boolean = false;
      let hours: string = time.getHours().toString();
      let minutes: string = time.getMinutes().toString();
      if (minutes == "0")
        minutes = "00";
      let scheduleTime = `${hours}:${minutes}`;

      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let [keyWorkerName, keyRecordDate, keyTime] = key.split(',');

        if ((keyWorkerName == fio) && (keyRecordDate == date) && (keyTime == scheduleTime)) {
          thereIsRecord = true;
          userFIO = localStorage.getItem(key);
          i = localStorage.length;
        }
      }
      if (thereIsRecord) {
        arr[0].push(userFIO);
        arr[1].push("appointment");
      }
      else {
        arr[0].push(scheduleTime);
        arr[1].push("freely");
      }

      time.setMinutes(time.getMinutes() + 10)
    }
    return arr
  }

  private checkValidation(fio: string): boolean {
    let isValidated = true;

    let [name, lastName, Patronymic] = fio.split(" ");

    if (!(name && lastName && Patronymic))
      isValidated = false;

    for (let i = 0; i < fio.length; i++) {
      let a = fio[i];
      if (a == "1" || a == "2" || a == "3" || a == "4" || a == "5" || a == "6" || a == "7" || a == "8" || a == "9" || a == "0"
        || a == "!" || a == "@" || a == "#" || a == "$" || a == "%" || a == "^" || a == "&" || a == "*" || a == "(") {
        isValidated = false
      }
    }

    return isValidated;
  }
}