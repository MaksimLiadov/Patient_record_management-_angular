import { Component, Output, EventEmitter } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";

@Component({
    selector: 'router',
    standalone: true,
    imports: [RouterOutlet],
    template: `<router-outlet></router-outlet>`,
})
export class RouterComponent {

}