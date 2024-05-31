import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { ButtonModule } from 'primeng/button';


@Component({
    selector: 'timetableTitle',
    standalone: true,
    imports: [RouterOutlet, ButtonModule],
    templateUrl: './timetableTitle.component.html',
    styleUrl: './timetableTitle.component.scss'
})
export class TimetableTitleComponent {

    constructor(private router: Router) { }
    toEcharts(): void {
        this.router.navigate(["/echarts"]);
    }
}