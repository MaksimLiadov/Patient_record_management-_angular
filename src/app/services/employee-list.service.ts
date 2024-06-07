import { Injectable } from "@angular/core";
import { IEmployee } from "../data-models/employee-struct"
import { LocalStorageService } from "./local-storage.service"

@Injectable()
export class EmployeeListService {

    private employeeArr: IEmployee[];

    constructor(private localStorageService: LocalStorageService) {
        let key: string = "employeeArr";
        this.employeeArr = this.localStorageService.get(key);
    }

    public getEmployeeArr(): IEmployee[] {
        return this.employeeArr;
    }

}