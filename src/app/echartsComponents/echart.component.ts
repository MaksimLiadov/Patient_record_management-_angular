import { Component, OnInit } from "@angular/core";
import type { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { Router, RouterOutlet } from "@angular/router";

@Component({
    selector: 'echart',
    standalone: true,
    imports: [NgxEchartsDirective, RouterOutlet],
    templateUrl: 'echart.component.html',
    styleUrl: './echartsStyles/echart.component.scss',
    providers: [
        provideEcharts(),
    ]
})
export class EchartComponent implements OnInit {

    allTimeChartOptions: EChartsOption;
    oneDayChartOptions: EChartsOption;
    weekChartOptions: EChartsOption;
    constructor(private router: Router) { }

    ngOnInit(): void {
        this.fillAllTimeChart();
        this.filloneDayChartOptions();
        this.fillweekChartOptions();
    }


    toMain() {
        this.router.navigate([""]);
    }

    fillweekChartOptions() {
        let DayOfWeek = this.getDayOfWeek();

        let numberAppointment = [];
        for (let day in DayOfWeek) {
            numberAppointment.push(DayOfWeek[day]);
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

    filloneDayChartOptions() {
        let mapOneDay = this.getOneDayMap();

        let workersArr = [];
        for (let worker of mapOneDay.keys()) {
            workersArr.push(worker);
        }

        let numberRecords = [];
        for (let count of mapOneDay.values()) {
            numberRecords.push(count);
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

    fillAllTimeChart() {
        let AllTimeMap = this.getAllTimeMap();

        let employeeArray = [];
        for (let employee of AllTimeMap.keys()) {
            employeeArray.push(employee);
        }

        let numberRecords = [];
        for (let count of AllTimeMap.values()) {
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
                data: employeeArray
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

    private getAllTimeMap(): Map<any, any> {
        let mapAllTime = new Map();

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let [keyWorkerName, keyRecordDate, keyTime] = key.split(',');

            if (mapAllTime.has(keyWorkerName)) {
                mapAllTime.set(keyWorkerName, mapAllTime.get(keyWorkerName) + 1);
            }
            else {
                mapAllTime.set(keyWorkerName, 1);
            }
        }
        return mapAllTime
    }

    private getOneDayMap(): Map<any, any> {
        let mapOneDay = new Map();

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let [keyWorkerName, keyRecordDate, keyTime] = key.split(',');

            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();

            let todayStr = dd + '.' + mm + '.' + yyyy;

            if (keyRecordDate == todayStr) {
                if (mapOneDay.has(keyWorkerName)) {
                    mapOneDay.set(keyWorkerName, mapOneDay.get(keyWorkerName) + 1);
                }
                else {
                    mapOneDay.set(keyWorkerName, 1);
                }
            }
        }
        return mapOneDay
    }

    getDayOfWeek(): object {
        let countDayOfWeek = {
            sunday: 0,
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0
        }

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let [keyWorkerName, keyRecordDate, keyTime] = key.split(',');
            let date = new Date(Date.parse(keyRecordDate.replace(/(\d+)\.(\d+)\.(\d+)/, '$3-$2-$1')));


            let dayOfWeek = date.getDay();

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

        return countDayOfWeek
    }
}