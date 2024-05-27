import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { Router, RouterOutlet } from "@angular/router";
import { TimetableComponent } from "./timetable.component";
import { TimetableTitleComponent } from "./timetableTitle.component";
import { RecordDateComponent } from "./recordDate.component";
import { WorkersListComponent } from "./workersList.component";

@Component({
    selector: "my-app",
    standalone: true,
    imports: [NgIf, RouterOutlet, FormsModule, TimetableComponent, RecordDateComponent, WorkersListComponent, TimetableTitleComponent],
    templateUrl: './app.component.html',
    styleUrl: './styles/app.component.scss'
})
export class AppComponent implements OnInit {
    fio: String;
    checked: boolean;
    date: String;
    condition: boolean = true;

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.router.navigate(["/main"]);
    }

    onCheckboxChange(fio: String) {
        this.fio = fio;
    }

    onCheckedChange(checked: boolean) {
        this.checked = checked
    }

    onDateChange(date: String) {
        this.date = date;
    }
}