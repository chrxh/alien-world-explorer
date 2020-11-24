import { Component, Input, OnInit } from '@angular/core';
import { CardName } from '../cardname';

@Component({
  selector: 'app-closedcard',
  templateUrl: './closedcard.component.html',
  styleUrls: ['./closedcard.component.css']
})
export class ClosedCardComponent implements OnInit {

    @Input()
    cardName : CardName;

    ngOnInit(): void {
    }
  
}
