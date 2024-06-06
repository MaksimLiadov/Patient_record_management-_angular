export interface IEmployeeRecordsObj {
    [employeeFio: string]: {
        [date: string]: {
            [userFio: string]: {
                time: string;
                age: number;
                gender: string;
            };
        };
    };
}