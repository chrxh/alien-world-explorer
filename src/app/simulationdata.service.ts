import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import { MonitorData } from './monitordata';
import { SimulationHttpService } from "./simulationhttp.service";
import {SimulationInfo, ReducedSimulationInfo} from "./simulationinfo";
import { SimulationInfoIntern } from './simulationtable/simulationinfointern';

@Injectable({
  providedIn: 'root'
})
export class SimulationDataService {

    private _selectedSimulationId$ = new BehaviorSubject<string>(null);
    private _selectedSimulationInfo$ = new BehaviorSubject<SimulationInfo>(null);

    constructor(private _simulationHttpService : SimulationHttpService)
    {
        setInterval(() => { this.updateSimulationInfo(); }, 1000);
    }
    
    changeSelectedSimulation(simulationInfo : SimulationInfo)
    {
        this._selectedSimulationId$.next(simulationInfo.id);
        this._selectedSimulationInfo$.next(simulationInfo);
    }

    observeSelectedSimulationId() : Observable<string>
    {
        return this._selectedSimulationId$.asObservable();
    }

    observeSelectedSimulationInfo() : Observable<SimulationInfo>
    {
        return this._selectedSimulationInfo$.asObservable();
    }

    getSelectedSimulationInfo() : SimulationInfo
    {
        return this._selectedSimulationInfo$.getValue();
    }

    private updateSimulationInfo()
    {
        const id = this._selectedSimulationId$.getValue();
        if (id === null) {
            return;
        }

        this._simulationHttpService.getSimulationInfoUpdate(id).subscribe(
            (result : ReducedSimulationInfo) => {
                let simInfo = this.getSelectedSimulationInfo();
                if (simInfo.id = result.id) {
                    simInfo.timestep = result.timestep;
                    this._selectedSimulationInfo$.next(simInfo);
                }
            }
        );
    }
}
