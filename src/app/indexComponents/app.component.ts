import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TimetableComponent } from "./timetable.component";
import { TimetableTitleComponent } from "./timetableTitle.component";
import { RecordDateComponent } from "./recordDate.component";
import { WorkersListComponent } from "./workersList.component";

@Component({
    selector: "my-app",
    standalone: true,
    imports: [FormsModule, TimetableComponent, RecordDateComponent, WorkersListComponent, TimetableTitleComponent],
    templateUrl: './app.component.html',
    styleUrl: './styles/app.component.scss'
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