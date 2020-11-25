import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CardName } from '../cardname';

@Component({
  selector: 'app-closedcard',
  templateUrl: './closedcard.component.html',
  styleUrls: ['./closedcard.component.css']
})
export class ClosedCardComponent implements OnInit {

    @Input()
    cardName : CardName;

    @Output()
    cardClicked = new EventEmitter<string>();

    ngOnInit(): void {
    }

    buttonClicked()
    {
        this.cardClicked.emit(CardName[this.cardName]);
    }
  
}
