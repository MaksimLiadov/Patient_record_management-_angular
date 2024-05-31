import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AppComponent } from "./indexComponents/app.component/app.component"

@Component({
    selector: 'router',
    standalone: true,
    imports: [RouterOutlet, AppComponent],
    template: `<router-outlet></router-outlet>`
})
export class RouterComponent {

}