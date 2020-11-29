import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {SimulationInfo} from "./simulationinfo";

@Injectable({
  providedIn: 'root'
})
export class SimulationDataService {

    private selectedSimulation$ = new BehaviorSubject<SimulationInfo>(null);

    changeSelectedSimulation(value : SimulationInfo) {
        this.selectedSimulation$.next(value);
    }

    getSelectedSimulation() : Observable<SimulationInfo> {
        return this.selectedSimulation$.asObservable();
    }
}
