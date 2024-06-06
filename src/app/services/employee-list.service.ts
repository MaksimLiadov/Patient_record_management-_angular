import { Injectable } from "@angular/core";
import { IEmployee } from "../data-models/employee-struct"
import { LocalStorageService } from "./local-storage.service"

@Injectable()
export class EmployeeListService {

    private employeeArr: IEmployee[];

    constructor(private localStorageService: LocalStorageService) {
        this.employeeArr = this.localStorageService.getLocalStorageData("employeeArr");
    }

    public getEmployeeArr(): IEmployee[] {
        return this.employeeArr;
    }

}