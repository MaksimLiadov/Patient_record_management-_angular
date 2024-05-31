import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TimetableComponent } from "../time-table.component/timetable.component";
import { TimetableTitleComponent } from "../time-table-title.component/timetableTitle.component";
import { RecordDateComponent } from "../recorde-date.component/recordDate.component";
import { WorkersListComponent } from "../workers-list.component/workersList.component";

@Component({
    selector: "my-app",
    standalone: true,
    imports: [FormsModule, TimetableComponent, RecordDateComponent, WorkersListComponent, TimetableTitleComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    public fio: string;
    public isEmployeeAdded: boolean;
    public date: Date;

    public onEmployeeChange(fio: string): void {
        this.fio = fio;
    }

    public onEmployeeAddedChange(isEmployeeAdded: boolean): void {
        this.isEmployeeAdded = isEmployeeAdded;

    }

    public onDateChange(date: Date): void {
        this.date = date;
    }
}