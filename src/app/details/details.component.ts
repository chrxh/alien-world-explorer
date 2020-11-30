import { Component, Input, OnInit } from '@angular/core';
import {SimulationDataService} from "../simulationdata.service";
import { SimulationInfo } from '../simulationinfo';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

    selectedSimulation : SimulationInfo;
    
    constructor(private _simulationDataService : SimulationDataService) { }

    ngOnInit(): void {
        this._simulationDataService.getSelectedSimulation().subscribe(value => {
            this.selectedSimulation = value;
        });
    }

}
