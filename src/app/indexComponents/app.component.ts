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
}
