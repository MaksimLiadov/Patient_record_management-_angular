import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";

@Component({
    selector: 'timetableTitle',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: 'timetableTitle.component.html',
    styleUrl: './styles/timetableTitle.component.scss'
})
export class TimetableTitleComponent {

    constructor(private router: Router) { }
    toEcharts(): void {
        this.router.navigate(["/echarts"]);
    }
}