import { Component, Input, ElementRef, ViewChild, ViewContainerRef, EmbeddedViewRef, TemplateRef, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'timetable',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'timetable.component.html',
  styleUrl: './styles/timetable.component.scss'
})
export class TimetableComponent {
  @Input() fio: String;
  @Input() checked: boolean;
  @ViewChild('timeTable') timeTable: ElementRef;
  @ViewChild('tpl1') tpl: TemplateRef<any>;

  private view: EmbeddedViewRef<Object>;
  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnChanges(changes: any): void {
    if ((changes.checked) || (changes.fio)) {
      if (this.checked) {
        this.addWorker();
      }
      else {
        this.deleteWorker();
      }

    }
  }

  private deleteWorker(): void {
    console.log("del" + this.fio);
  }

  private addWorker(): void {
    this.view = this.viewContainerRef.createEmbeddedView(this.tpl);
    this.timeTable.nativeElement.appendChild(this.view.rootNodes[0]);
  }
}