import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { NgClass, NgFor } from "@angular/common";
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { EmployeeListService } from "src/app/services/employee-list.service"
import { LocalStorageService } from "src/app/services/local-storage.service"
import { IEmployee } from "src/app/data-models/employee-struct"

@Component({
    selector: 'workersList',
    imports: [NgClass, NgFor, CheckboxModule, FormsModule],
    providers: [EmployeeListService, LocalStorageService],
    standalone: true,
    templateUrl: './workersList.component.html',
    styleUrl: './workersList.component.scss'
})
export class WorkersListComponent implements OnInit {
    @Output() onEmployeeChange = new EventEmitter<string>();
    @Output() onEmployeeAddedChange = new EventEmitter<boolean>();

    constructor(private employeeListService: EmployeeListService) { }

    public workersObjArr: IEmployee[];

    ngOnInit(): void {
        this.workersObjArr = this.employeeListService.getEmployeeArr();

    }

    checkboxChange(fio: string, isEmployeeAdded: boolean): void {
        this.onEmployeeChange.emit(fio);
        this.onEmployeeAddedChange.emit(isEmployeeAdded);
    }

}