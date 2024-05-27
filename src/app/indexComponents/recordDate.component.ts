import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'recordDate',
    standalone: true,
    imports: [FormsModule],
    templateUrl: 'recordDate.component.html',
    styleUrl: './styles/recordDate.component.scss'
})
export class RecordDateComponent implements OnInit {
    public currentDate: string;

    @Output() onDateChange = new EventEmitter<String>();

    public dateChange(date: string): void {
        const changedDate = new Date(Date.parse(date));
        const formattedDate = changedDate.toLocaleDateString('ru-RU');
        this.onDateChange.emit(formattedDate);
    }

    ngOnInit() {
        let defaultDate = new Date();
        let dd = String(defaultDate.getDate()).padStart(2, '0');
        let mm = String(defaultDate.getMonth() + 1).padStart(2, '0');
        let yyyy = defaultDate.getFullYear();

        let today = dd + '.' + mm + '.' + yyyy;
        this.currentDate = yyyy + '-' + mm + '-' + dd;

        this.onDateChange.emit(today);
    }

}