import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'workersList',
    standalone: true,
    templateUrl: 'workersList.component.html',
    styleUrl: './styles/workersList.component.scss'
})
export class WorkersListComponent {
    @Output() onEmployeeChange = new EventEmitter<string>();
    @Output() onEmployeeAddedChange = new EventEmitter<boolean>();

    checkboxChange(fio: string, isEmployeeAdded: boolean): void {
        this.onEmployeeChange.emit(fio);
        this.onEmployeeAddedChange.emit(isEmployeeAdded);
    }

}