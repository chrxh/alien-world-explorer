import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CardName} from "../cardname";

@Component({
    selector: 'app-aliencard',
    templateUrl: './aliencard.component.html',
    styleUrls: ['./aliencard.component.css']
})
export class AlienCardComponent {

    @Input()
    cardName : CardName;

    @Output()
    cardClosedChange = new EventEmitter<CardName>();


    closeButtonClicked()
    {
        this.cardClosedChange.emit(this.cardName);
    }
}
