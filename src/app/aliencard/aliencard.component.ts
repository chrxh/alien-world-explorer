import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-aliencard',
    templateUrl: './aliencard.component.html',
    styleUrls: ['./aliencard.component.css']
})
export class AlienCardComponent {

    @Input()
    title : string;

}
