import { Component, OnInit } from "@angular/core";
import { DatePipe } from '@angular/common';
import type { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { Router, RouterOutlet } from "@angular/router";
import { LocalStorageService } from "src/app/services/local-storage.service"

@Component({
    selector: 'echart',
    standalone: true,
    imports: [NgxEchartsDirective, RouterOutlet],
    templateUrl: './echart.component.html',
    styleUrl: './echart.component.scss',
    providers: [
        provideEcharts(),
        LocalStorageService,
        DatePipe
    ]
})
export class EchartComponent implements OnInit {

    allTimeChartOptions: EChartsOption;
    oneDayChartOptions: EChartsOption;
    weekChartOptions: EChartsOption;
    constructor(private datePipe: DatePipe, private router: Router, private localStorageService: LocalStorageService) { }

    ngOnInit(): void {
        this.fillAllTimeChart();
        this.fillOneDayChartOptions();
        this.fillWeekChartOptions();
    }

    toMain() {
        this.router.navigate([""]);
    }

    fillOneDayChartOptions() {
        let key: string = "Все записи";
        let localStorageData = this.localStorageService.get(key);
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);

        let todayStr = today.toString();

        let workersArr = [];
        let numberRecords = [];
        for (let worker in localStorageData) {
            workersArr.push(worker);
            for (let dateRecord in localStorageData[worker]) {
                if (dateRecord == todayStr) {
                    let count: number = 0;
                    for (let user in localStorageData[worker][dateRecord]) {
                        count++;
                    }
                    numberRecords.push(count);
                }
            }
        }
        this.oneDayChartOptions = {
            title: {
                text: 'График записей на сегодня'
            },
            tooltip: {},
            legend: {
                right: "0%",
                data: ['Записи']
            },
            xAxis: {
                data: workersArr
            },
            yAxis: {},
            series: [
                {
                    name: 'Записи',
                    type: 'bar',
                    data: numberRecords
                }
            ]
        };
    }

    fillWeekChartOptions() {
        let key: string = "Все записи";
        let localStorageData = this.localStorageService.get(key);

        let countDayOfWeek = {
            sunday: 0,
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0
        }

        for (let worker in localStorageData) {
            for (let dateRecord in localStorageData[worker]) {
                for (let records in localStorageData[worker][dateRecord]) {
                    const today = new Date(dateRecord);
                    const dayOfWeek = today.getDay();

                    switch (dayOfWeek) {
                        case 0:
                            countDayOfWeek.sunday += 1;
                            break;
                        case 1:
                            countDayOfWeek.monday += 1;
                            break;
                        case 2:
                            countDayOfWeek.tuesday += 1;
                            break;
                        case 3:
                            countDayOfWeek.wednesday += 1;
                            break;
                        case 4:
                            countDayOfWeek.thursday += 1;
                            break;
                        case 5:
                            countDayOfWeek.friday += 1;
                            break;
                        case 6:
                            countDayOfWeek.saturday += 1;
                            break;
                    }
                }

            }
        }

        let numberAppointment = [];
        for (let day in countDayOfWeek) {
            numberAppointment.push(countDayOfWeek[day]);
        }

        this.weekChartOptions = {
            title: {
                text: 'График записей по дням недели'
            },
            tooltip: {},
            legend: {
                right: "0%",
                data: ['Записи']
            },
            xAxis: {
                data: ['Воскресенье', 'Понедельик', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
            },
            yAxis: {},
            series: [
                {
                    name: 'Записи',
                    type: 'bar',
                    data: numberAppointment
                }
            ]
        };
    }

    fillAllTimeChart() {
        let localStorageData = this.localStorageService.get("Все записи");

        let workersArr = [];
        let numberRecords = [];
        for (let worker in localStorageData) {
            workersArr.push(worker);
            let count: number = 0;
            for (let dateRecord in localStorageData[worker]) {
                for (let user in localStorageData[worker][dateRecord]) {
                    count++;
                }
            }
            numberRecords.push(count);
        }

        this.allTimeChartOptions = {
            title: {
                text: 'График записей за все время'
            },
            tooltip: {},
            legend: {
                right: "0%",
                data: ['Записи']
            },
            xAxis: {
                data: workersArr
            },
            yAxis: {},
            series: [
                {
                    name: 'Записи',
                    type: 'bar',
                    data: numberRecords
                }
            ]
        };
    }
}