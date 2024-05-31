export interface IWorker {
    fio: string;
    date: Date;
    schedules: ISchedule[];
}

export interface ISchedule {
    age: number;
    gender: string;
    time: string;
    isFree: boolean;
    name: string;
}