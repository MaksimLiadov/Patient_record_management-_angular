import { NgClass, NgFor } from "@angular/common";
import { Component, Input, ElementRef, ViewChild, ViewContainerRef, EmbeddedViewRef, TemplateRef, ViewEncapsulation, QueryList, ViewChildren } from "@angular/core";

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [NgFor, NgClass],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'timetable.component.html',
  styleUrl: './styles/timetable.component.scss'
})
export class TimetableComponent {
  @Input() fio: String;
  @Input() date: String;
  @Input() checked: boolean;
  @ViewChild('timeTable') timeTable: ElementRef;
  @ViewChild('tpl1') tpl: TemplateRef<any>;
  @ViewChildren('date') dateElements: QueryList<ElementRef>;

  private view: EmbeddedViewRef<Object>;
  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnChanges(changes: any): void {
    let scheduleArr: string[][] = this.fillscheduleArr(20, this.fio, this.date);

    if (changes.date) {
      this.dateElements.forEach(element => {
        element.nativeElement.innerText = this.date;
        let shedule = element.nativeElement.parentNode;
        let fio: string = element.nativeElement.parentNode.querySelector(".FIO").innerHTML
        this.updateShedule(fio, this.date);
      })
    }

    let workerData = { fio: this.fio, date: this.date, schedule: scheduleArr[0], scheduleClasses: scheduleArr[1] }
    if ((changes.checked) || (changes.fio)) {
      if (this.checked) {
        this.addWorker(workerData);
      }
      else {
        this.deleteWorker(workerData.fio);
      }
    }
  }

  private clickEvent(target: HTMLElement, fio: string) {
    let className: string = "freely";
    if (target.classList.contains(className)) {
      this.addNote(target, fio);
    }
    else {
      this.removeNote(target);
    }
  }

  private updateShedule(fio: String, date: String): void {
    let scheduleArr: string[][] = this.fillscheduleArr(20, fio, date);
    let workerData = { fio: fio, date: date, schedule: scheduleArr[0], scheduleClasses: scheduleArr[1] }
    this.deleteWorker(workerData.fio);
    this.addWorker(workerData);
  }

  private addNote(target: HTMLElement, employeeFIO: string): void {
    let userFIO: string;
    if (userFIO = prompt("Введите ваше ФИО", "Иванов Иван Иванович")) {
      let isValidated = this.checkValidation(userFIO);

      if (isValidated) {

        let curenttDate = this.date;
        let key = employeeFIO + "," + curenttDate + "," + target.innerText;
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
      let numberOfelem: number;
      let date = target.parentNode.parentNode.querySelector(".date").innerHTML;
      let fio = target.parentNode.parentNode.querySelector(".FIO").innerHTML;

      for (let i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] == target) {
          numberOfelem = i;
        }
      }

      let time = new Date();
      time.setHours(8, 0, 0);
      for (let i = 0; i < numberOfelem; i++) {
        time.setMinutes(time.getMinutes() + 10);
      }
      let hours = time.getHours().toString();
      let minuts = time.getMinutes().toString();
      if (minuts == "0") {
        minuts = "00";
      }

      target.innerHTML = (hours + ":" + minuts);
      target.classList.remove("appointment");
      target.classList.add("freely");

      let key = fio + "," + date + "," + hours + ":" + minuts;

      localStorage.removeItem(key)

      target.classList.add('freely');
      target.classList.remove('appointment');
    }
  }

  private deleteWorker(fio: String): void {
    let element = document.getElementById(`${fio}`);
    element.remove();
  }

  private addWorker(workerData): void {
    this.view = this.viewContainerRef.createEmbeddedView(this.tpl, {
      $implicit: workerData
    });
    this.view.rootNodes[0].id = workerData.fio;
    this.timeTable.nativeElement.appendChild(this.view.rootNodes[0]);
  }

  private fillscheduleArr(scheduleLenght: number, fio: String, date: String): string[][] {
    let arr: string[][] = [[], []];
    let time = new Date();
    time.setHours(8, 0, 0);
    let userFIO: string;

    for (let i = 0; i < scheduleLenght; i++) {
      let thereIsRecord: boolean = false;
      let hours: string = time.getHours().toString();
      let minuts: string = time.getMinutes().toString();
      if (minuts == "0")
        minuts = "00";
      let sheduleTime = `${hours}:${minuts}`;

      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let [keyWorkerName, keyRecordDate, keyTime] = key.split(',');

        if ((keyWorkerName == fio) && (keyRecordDate == date) && (keyTime == sheduleTime)) {
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
        arr[0].push(sheduleTime);
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