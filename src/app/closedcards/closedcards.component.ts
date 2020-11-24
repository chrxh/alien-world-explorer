import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CardName } from '../cardname';

@Component({
    selector: 'app-closedcards',
    templateUrl: './closedcards.component.html',
    styleUrls: ['./closedcards.component.css']
})
export class ClosedCardsComponent implements OnInit {

    @Input()
    shownCards = new Set<string>([]);

    @Output()
    shownCardsChange = new EventEmitter<Set<string>>();

    ngOnInit(): void {
    }


}
