import { Component, OnInit, OnDestroy } from '@angular/core';
import {SimulationDataService} from "../simulationdata.service";
import { SimulationInfo } from '../simulationinfo';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy  {

    selectedSimulation : SimulationInfo;
    
    constructor(private _simulationDataService : SimulationDataService) { }

    private _subscription : Subscription;
    ngOnInit() : void
    {
        this._subscription = this._simulationDataService.observeSelectedSimulationId().subscribe(() => {
            this.selectedSimulation = this._simulationDataService.getSelectedSimulationInfo();
        });
    }

    ngOnDestroy() {
        
        this._subscription.unsubscribe();
    }

}
