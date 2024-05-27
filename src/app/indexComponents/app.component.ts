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
    public checked: boolean;
    public date: string;
    public condition: boolean = true;

    public onCheckboxChange(fio: string): void {
        this.fio = fio;
    }

    public onCheckedChange(checked: boolean): void {
        this.checked = checked
    }

    public onDateChange(date: string): void {
        this.date = date;
    }
}