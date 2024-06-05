import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { NgClass, NgFor } from "@angular/common";
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { IEmployee } from "src/app/data-models/employee-struct"

@Component({
    selector: 'workersList',
    imports: [NgClass, NgFor, CheckboxModule, FormsModule],
    standalone: true,
    templateUrl: './workersList.component.html',
    styleUrl: './workersList.component.scss'
})
export class WorkersListComponent implements OnInit {
    @Output() onEmployeeChange = new EventEmitter<string>();
    @Output() onEmployeeAddedChange = new EventEmitter<boolean>();

    public workersArr: string[] = ["Работник 1", "Работник 2", "Работник 3", "Работник 4", "Работник 5", "Работник 6", "Работник 7"]
    public workersObjArr: IEmployee[] = [];

    ngOnInit(): void {
        for (let worker of this.workersArr) {
            this.workersObjArr.push({ name: worker, isAdded: false });
        }

    }

    checkboxChange(fio: string, isEmployeeAdded: boolean): void {
        this.onEmployeeChange.emit(fio);
        this.onEmployeeAddedChange.emit(isEmployeeAdded);
    }

}