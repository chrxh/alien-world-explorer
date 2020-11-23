import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'app-closedcards',
    templateUrl: './closedcards.component.html',
    styleUrls: ['./closedcards.component.css']
})
export class ClosedcardsComponent implements OnInit {

    @Input()
    get cardNames()
    {
        return this._cardNames;
    } 
    set cardNames(value : string[])
    {
        this._cardNames = this._cardNames;
    }

    @Output()
    cardNamesEvent = new EventEmitter<string[]>();

    ngOnInit(): void {
    }

    private _cardNames : string[] = ["Test1", "Test2", "Test3"];

}
