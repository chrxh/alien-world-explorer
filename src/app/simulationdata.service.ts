import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { SimulationHttpService } from './simulationhttp.service';
import {SimulationInfo} from './simulationinfo';

@Injectable({
  providedIn: 'root'
})
export class SimulationDataService {

    private simulationInfos$ = new BehaviorSubject<SimulationInfo[]>(null);
    private selectedSimulationInfo$ = new BehaviorSubject<SimulationInfo>(null);
    private selectedSimulationId: string;

    observeSimulationInfos(): Observable<SimulationInfo[]>
    {
        return this.simulationInfos$.asObservable();
    }

    observeSelectedSimulationInfo(): Observable<SimulationInfo>
    {
        return this.selectedSimulationInfo$.asObservable();
    }

    getSelectedSimulationInfo(): SimulationInfo
    {
        return this.selectedSimulationInfo$.getValue();
    }

    constructor(private simulationHttpService: SimulationHttpService)
    {
        this.updateSimulationInfos();
        setInterval(() => { this.updateSimulationInfos(); }, 1000);
    }

    private updateSimulationInfos(): void
    {
        this.simulationHttpService.getSimulationInfos().subscribe(
            (simInfos: SimulationInfo[]) => {
                this.simulationInfos$.next(simInfos);
                this.updateSelectedSimulationInfo();
            }
        );
    }

    changeSelectedSimulation(id: string): void
    {
        this.selectedSimulationId = id;
        this.updateSelectedSimulationInfo();
    }

    private updateSelectedSimulationInfo(): void
    {
        if (this.selectedSimulationId !== null) {
            const simInfos = this.simulationInfos$.getValue();
            for (const simInfo of simInfos) {
                if (simInfo.id === this.selectedSimulationId) {
                    this.selectedSimulationInfo$.next(simInfo);
                }
            }
        }
    }
}
