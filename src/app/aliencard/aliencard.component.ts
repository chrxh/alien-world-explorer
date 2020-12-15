import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef, Directive, HostListener, ContentChild } from '@angular/core';
import {MatSlideToggleChange, MatSlideToggle} from '@angular/material/slide-toggle';
import { SimulationDataService } from "../simulationdata.service";
import { CardName } from "../cardname";
import { Subscription } from 'rxjs';
import { SimulationInfo } from "../simulationinfo";

 
@Component({
    selector: 'app-aliencard',
    templateUrl: './aliencard.component.html',
    styleUrls: ['./aliencard.component.css']
})
export class AlienCardComponent implements AfterViewInit, OnDestroy {

    @Input()
    cardName : CardName;

    @Input()
    liveToggleVisible = false;
    liveToggleEnabled = false;

    @Output()
    cardClosedChange = new EventEmitter<CardName>();

    @Output()
    liveToggleChange = new EventEmitter<boolean>();

    @ViewChild('liveToggleRef') liveToggleAccess : MatSlideToggle;

    constructor(private _simulationDataService : SimulationDataService)
    {
    }

    private _subscription: Subscription;
    ngAfterViewInit()
    {
        this._subscription = this._simulationDataService.observeSelectedSimulationId().subscribe(() => {
            const simInfo = this._simulationDataService.getSelectedSimulationInfo();
            this.liveToggleEnabled = simInfo.isActive;
            this.liveToggleAccess.checked = simInfo.isActive;
            this.liveToggleChange.emit(simInfo.isActive);
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    onLiveToggleChange($event: MatSlideToggleChange)
    {
        this.liveToggleChange.emit($event.checked);
    }

    closeButtonClicked()
    {
        this.cardClosedChange.emit(this.cardName);
    }
}
