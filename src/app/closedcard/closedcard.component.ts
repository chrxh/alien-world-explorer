import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-closedcard',
  templateUrl: './closedcard.component.html',
  styleUrls: ['./closedcard.component.css']
})
export class ClosedcardComponent implements OnInit {

    @Input()
    title : string;

    ngOnInit(): void {
    }
  
}
