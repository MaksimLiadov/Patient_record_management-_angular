import { Component, AfterContentInit } from "@angular/core";

@Component({
    selector: 'recordDate',
    standalone: true,
    templateUrl: 'recordDate.component.html',
    styleUrl: './styles/recordDate.component.scss'
})
export class RecordDateComponent implements AfterContentInit {
    today: string;

    ngAfterContentInit() {
        let defaultDate = new Date();
        let dd = String(defaultDate.getDate()).padStart(2, '0');
        let mm = String(defaultDate.getMonth() + 1).padStart(2, '0');
        let yyyy = defaultDate.getFullYear();

        this.today = yyyy + '-' + mm + '-' + dd;
    }

}