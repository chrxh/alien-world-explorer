import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-aliencard',
    templateUrl: './aliencard.component.html',
    styleUrls: ['./aliencard.component.css']
})
export class AlienCardComponent implements OnInit {

    @Input()
    title : string;

    constructor() { }

    ngOnInit(): void {
    }

}
