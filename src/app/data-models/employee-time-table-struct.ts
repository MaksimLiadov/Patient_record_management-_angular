export interface IWorker {
    fio: string;
    date: Date;
    schedules: ISchedule[];
}

export interface ISchedule {
    age: number | null;
    gender: string;
    time: string;
    isFree: boolean;
    name: string;
}