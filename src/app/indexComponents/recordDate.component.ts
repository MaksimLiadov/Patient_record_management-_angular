import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'recordDate',
    standalone: true,
    imports: [FormsModule, DatePipe],
    templateUrl: 'recordDate.component.html',
    styleUrl: './styles/recordDate.component.scss'
})
export class RecordDateComponent implements OnInit {
    public currentDate: Date;

    @Output() onDateChange = new EventEmitter<Date>();

    public dateChange(dateStr: string): void {
        const date = new Date(dateStr);
        this.onDateChange.emit(date);
    }

    ngOnInit() {
        let defaultDate = new Date();
        this.currentDate = defaultDate;
        this.onDateChange.emit(defaultDate);
    }

}