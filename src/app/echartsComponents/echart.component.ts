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
        let localStorageData = this.localStorageService.getLocalStorageData();
        const today = new Date();
        const formattedToday = this.datePipe.transform(today, 'dd.MM.yyyy');

        let workersArr = [];
        let numberRecords = [];
        for (let worker in localStorageData) {
            workersArr.push(worker);
            for (let dateRecord in localStorageData[worker]) {
                if (dateRecord == formattedToday) {
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
        let localStorageData = this.localStorageService.getLocalStorageData();

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

                const [day, month, year] = dateRecord.split(".").map(Number);
                const today = new Date(year, month - 1, day);
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
        let localStorageData = this.localStorageService.getLocalStorageData();

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