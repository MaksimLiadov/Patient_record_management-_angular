import { Component } from "@angular/core";

@Component({
    selector: 'recordDate',
    standalone: true,
    templateUrl: 'recordDate.component.html',
    styleUrl: './styles/recordDate.component.scss'
})
export class RecordDateComponent {
    defaultDate = new Date();
    dd = String(this.defaultDate.getDate()).padStart(2, '0');
    mm = String(this.defaultDate.getMonth() + 1).padStart(2, '0');
    yyyy = this.defaultDate.getFullYear();

    today: string = this.yyyy + '-' + this.mm + '-' + this.dd;
}