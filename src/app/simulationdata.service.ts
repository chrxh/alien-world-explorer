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

    private _simulationInfos$ = new BehaviorSubject<SimulationInfo[]>(null);
    private _selectedSimulationInfo$ = new BehaviorSubject<SimulationInfo>(null);
    private _selectedSimulationId : string;

    observeSimulationInfos() : Observable<SimulationInfo[]>
    {
        return this._simulationInfos$.asObservable();
    }

    observeSelectedSimulationInfo() : Observable<SimulationInfo>
    {
        return this._selectedSimulationInfo$.asObservable();
    }

    getSelectedSimulationInfo() : SimulationInfo
    {
        return this._selectedSimulationInfo$.getValue();
    }

    constructor(private _simulationHttpService : SimulationHttpService)
    {
        setInterval(() => { this.updateSimulationInfos(); }, 1000);
    }

    private updateSimulationInfos()
    {
        this._simulationHttpService.getSimulationInfos().subscribe(
            (simInfos : SimulationInfo[]) => {
                this._simulationInfos$.next(simInfos);
                this.updateSelectedSimulationInfo();
            }
        );
    }

    changeSelectedSimulation(id : string)
    {
        this._selectedSimulationId = id;
        this.updateSelectedSimulationInfo();
    }

    private updateSelectedSimulationInfo()
    {
        if (this._selectedSimulationId !== null) {
            const simInfos = this._simulationInfos$.getValue();
            for (const simInfo of simInfos) {
                if (simInfo.id == this._selectedSimulationId) {
                    this._selectedSimulationInfo$.next(simInfo);
                }
            }
        }
    }
}
