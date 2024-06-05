import { Component, OnInit, Output, EventEmitter, DoCheck } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'recordDate',
    standalone: true,
    imports: [FormsModule, DatePipe, CalendarModule],
    templateUrl: './recordDate.component.html',
    styleUrl: './recordDate.component.scss'
})
export class RecordDateComponent implements OnInit, DoCheck {
    public currentDate: Date;

    @Output() onDateChange = new EventEmitter<Date>();

    ngDoCheck(): void {
        this.onDateChange.emit(this.currentDate);
    }

    ngOnInit() {
        let defaultDate = new Date();
        defaultDate.setHours(0);
        defaultDate.setMinutes(0);
        defaultDate.setSeconds(0);
        this.currentDate = defaultDate;
        this.onDateChange.emit(defaultDate);
    }

}