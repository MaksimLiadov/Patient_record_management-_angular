import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'workersList',
    standalone: true,
    templateUrl: 'workersList.component.html',
    styleUrl: './styles/workersList.component.scss'
})
export class WorkersListComponent {
    @Output() onCheckboxChange = new EventEmitter<String>();
    @Output() onCheckedChange = new EventEmitter<boolean>();

    checkboxChange(fio: String, checked: boolean): void {
        this.onCheckboxChange.emit(fio);
        this.onCheckedChange.emit(checked);
    }

}