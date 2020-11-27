import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SimulationInfo } from './simulationinfo';
import { MonitorData } from './monitordata';

import {AppConfig} from "./appconfig";

@Injectable({
    providedIn: 'root'
})
export class SimulationService {
    public simulationInfos: SimulationInfo[];

    constructor(private http: HttpClient) { }

    getSimulationInfos(): Observable<SimulationInfo[]> {
        if (!this.simulationInfoRequested) {
            this.simulationInfoRequested = true;
            return this.http.get<SimulationInfo[]>(`${AppConfig.Address}getsimulationinfos`).pipe(
                map(result => {
                this.simulationInfoRequested = false;
                this.simulationInfos = result['data'];
                return this.simulationInfos;
            }),
            catchError(this.handleError));
        }
        else {
            return of(this.simulationInfos);
        }
    }

    getMonitorDatas(simulationId : string, timestepFrom : number, timestepTo : number) : Observable<MonitorData[]>
    {
        const address = AppConfig.Address
            + "getmonitordata"
            + "?simulationId=" + simulationId
            + "&timestepFrom=" + timestepFrom
            + "&timestepTo=" + timestepTo;

        return this.http.get<MonitorData[]>(address).pipe(
            map(result => {
            return result['data'];
        },
        catchError(this.handleError)));
    }

    requestSimulationImage(simulationId : string, pos : number[], size : number[]): Observable<string> {
        const address = AppConfig.Address
            + "requestsimulationimage"
            + "?simulationId=" + simulationId
            + "&posX=" + pos[0]
            + "&posY=" + pos[1]
            + "&sizeX=" + size[0]
            + "&sizeY=" + size[1];

        return this.http.get<string>(address).pipe(
            map(result => {
                return result['data'];
            }),
            catchError(this.handleError)
        );
    }

    isSimulationImageAvailable(taskId : string): Observable<boolean> {
        const address = AppConfig.Address
            + "issimulationimageavailable"
            + "?taskId=" + taskId;

        return this.http.get<boolean>(address).pipe(
            map(result => {
                return result['data'];
            }),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.log(error);

        // return an observable with a user friendly message
        return throwError('Error! something went wrong.' + error.message);
    }

    private simulationInfoRequested = false;
}
