import { provideRouter, Routes } from "@angular/router";
import { ApplicationConfig } from "@angular/core";

import { EchartComponent } from "./echartsComponents/echart.component";
import { AppComponent } from "./indexComponents/app.component";

const appRoutes: Routes = [
    { path: "echarts", component: EchartComponent },
    { path: "main", component: AppComponent },
    { path: "", component: AppComponent }
];

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(appRoutes)]
};