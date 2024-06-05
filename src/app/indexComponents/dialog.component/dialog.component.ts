import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    providers: [DialogService, MessageService],
    standalone: true,
    imports: [TableModule, ButtonModule, FormsModule, InputTextModule, InputNumberModule, DropdownModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DynamicDialogContent implements OnInit {
    constructor(private dialogService: DialogService, private dialogRef: DynamicDialogRef, private config: DynamicDialogConfig) { };

    public userFio: string = "";
    public userAge: number = null;
    public userGender: string = "";

    public employeeFio: string;
    public recordingTime: string;
    public genders: string[] = ["Женский", "Мужской"]

    ngOnInit(): void {
        this.employeeFio = this.config.data.employeeFio;
        this.recordingTime = this.config.data.recordingTime;
    }

    public closeDialog() {
        this.dialogRef.close();
    }

    public saveAppointment(data) {
        this.dialogRef.close(data);
    }
}