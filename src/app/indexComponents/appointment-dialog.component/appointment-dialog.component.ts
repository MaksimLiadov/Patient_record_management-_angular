import { Component, OnInit } from '@angular/core';
import { NgIf } from "@angular/common";
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    standalone: true,
    imports: [TableModule, ButtonModule, FormsModule, InputTextModule, InputNumberModule, DropdownModule, NgIf],
    templateUrl: './appointment-dialog.component.html',
    styleUrl: './appointment-dialog.component.scss'
})
export class DynamicDialogContent implements OnInit {
    constructor(private dialogRef: DynamicDialogRef, private config: DynamicDialogConfig) { };

    public userFio: string = "";
    public userAge: number = null;
    public userGender: string = "";
    public isEdit: boolean = false;

    public employeeFio: string;
    public recordingTime: string;
    public genders: string[] = ["Женский", "Мужской"]

    ngOnInit(): void {
        this.employeeFio = this.config.data.employeeFio;
        this.recordingTime = this.config.data.recordingTime;

        this.userFio = this.config.data.userFio;
        this.userAge = this.config.data.userAge;
        this.userGender = this.config.data.userGender;
        if (this.userFio != undefined && this.userFio != "") this.isEdit = true;
    }

    public closeDialog() {
        this.dialogRef.close();
        this.dialogRef.destroy();
    }

    public saveAppointment(data) {
        this.dialogRef.close(data);
        this.dialogRef.destroy();
    }

    public deleteRecord(data) {
        this.dialogRef.close(data);
        this.dialogRef.destroy();
    }

    public saveChanges(data) {
        this.dialogRef.close(data);
        this.dialogRef.destroy();
    }
}