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
    templateUrl: './edit-dialog.component.html',
    styleUrl: './edit-dialog.component.scss'
})
export class EditDynamicDialogContent implements OnInit {
    constructor(private dialogService: DialogService, private dialogRef: DynamicDialogRef, private config: DynamicDialogConfig) { };

    public userFioForRedact: string;
    public ageForRedact: number;
    public genderForRedact: string;

    public employeeFio: string;
    public recordingTime: string;
    public genders: string[] = ["Женский", "Мужской"]

    ngOnInit(): void {
        this.employeeFio = this.config.data.employeeFio;
        this.recordingTime = this.config.data.recordingTime;

        this.userFioForRedact = this.config.data.userFioForRedact;
        this.ageForRedact = this.config.data.ageForRedact;
        this.genderForRedact = this.config.data.genderForRedact;
    }

    closeDialog() {
        this.dialogRef.close();
    }

    saveChanges(data) {
        this.dialogRef.close(data);
    }
}