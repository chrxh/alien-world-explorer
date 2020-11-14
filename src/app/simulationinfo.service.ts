import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SimulationInfo } from './simulationinfo';

@Injectable({
  providedIn: 'root'
})
export class SimulationInfoService {
  public simulationInfos: SimulationInfo[];

  constructor(private http: HttpClient) { }

  getSimulationInfos(): Observable<SimulationInfo[]> {
    if (!this.dataRequested) {
      this.dataRequested = true;
      return this.http.get<SimulationInfo[]>(`${this.baseUrl}getsimulation`).pipe(
        map(result => {
          this.dataRequested = false;
          this.simulationInfos = result['data'];
          return this.simulationInfos;
        }),
        catchError(this.handleError));
    }
    else {
      return of(this.simulationInfos);
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.' + error.message);
  }

  private baseUrl = 'http://localhost/api/frontend/';
  private dataRequested = false;
}
