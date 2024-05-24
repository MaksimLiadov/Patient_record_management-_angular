// import { bootstrapApplication } from "@angular/platform-browser";
// import { AppComponent } from "./app/indexComponents/app.component";
// bootstrapApplication(AppComponent).catch(e => console.error(e));
import { bootstrapApplication } from "@angular/platform-browser";
//import { AppComponent } from "./app/indexComponents/app.component";
import { RouterComponent } from "./app/routerOutlet.component";
import { appConfig } from "./app/app.config";
//bootstrapApplication(AppComponent, appConfig);
bootstrapApplication(RouterComponent, appConfig);