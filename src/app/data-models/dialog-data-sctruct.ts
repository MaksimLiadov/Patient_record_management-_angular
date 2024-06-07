export interface IAppointmentDialogData {
    userFio: string;
    userAge?: number,
    userGender?: string,
    buttonType: ButtonType
}

export enum ButtonType {
    add = "add",
    change = "change",
    delete = "delete",
    close = "close"
}