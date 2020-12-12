import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
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
    liveToggleChecked = true;

    @Output()
    cardClosedChange = new EventEmitter<CardName>();

    constructor(private _simulationDataService : SimulationDataService)
    {
    }

    private _subscription: Subscription;
    ngAfterViewInit()
    {
        this._subscription = this._simulationDataService.observeSelectedSimulationInfo().subscribe((simInfo : SimulationInfo) => {
            this.liveToggleEnabled = simInfo.isActive;
            this.liveToggleChecked = simInfo.isActive;
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }


    closeButtonClicked()
    {
        this.cardClosedChange.emit(this.cardName);
    }
}
