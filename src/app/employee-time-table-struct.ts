export interface IWorker {
    fio: string;
    date: Date;
    schedules: ISchedule[];
}

export interface ISchedule {
    time: string;
    isFree: boolean;
}