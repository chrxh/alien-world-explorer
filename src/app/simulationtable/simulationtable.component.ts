import {AfterViewInit, Component, ViewChild, Output, EventEmitter, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from "@angular/cdk/collections";
import {SimulationHttpService} from "../simulationhttp.service"
import {SimulationDataService} from "../simulationdata.service";
import {SimulationInfo} from "../simulationinfo";
import {SimulationInfoIntern, ActivityState} from "./simulationinfointern";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-simulation-table',
    templateUrl: './simulationtable.component.html',
    styleUrls: ['./simulationtable.component.css']
})
export class SimulationTableComponent implements AfterViewInit, OnDestroy {

    @Output() selectedSimulationEvent = new EventEmitter<SimulationInfo>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['simulationName', 'activityState', 'userName', 'worldSize', 'timestep', 'lastUpdate'];
    dataSource = new MatTableDataSource();
    selection = new SelectionModel(false, []);
    private selectedRow? : SimulationInfoIntern = null;

    constructor(private _simulationHttpService : SimulationHttpService, private _simulationDataService : SimulationDataService)
    {
    }

    private _subscription: Subscription;
    ngAfterViewInit()
    {
        this._subscription = this._simulationDataService.observeSelectedSimulationInfo().subscribe((simInfo : SimulationInfo) => {
            if (this.selectedRow !== null) {
                Object.assign(this.selectedRow, this.convertToSimulationInfoIntern(simInfo));
            }
        });

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.requestSimulationInfo();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    onSimulationClicked()
    {
        if (this.selection.selected.length === 0) {
            this.selectedRow = null;    
            this.selectedSimulationEvent.emit(null);
            this._simulationDataService.changeSelectedSimulation(null);
            return;
        }

        this.selectedRow = this.selection.selected[0];

        if (this.selectedRow.activityState === ActivityState.Active) {
            this.selectedRow.activityState = ActivityState.Streaming;
        }

        const simulationInfo = this.convertToSimulationInfo(this.selectedRow);
        this.selectedSimulationEvent.emit(simulationInfo);
        this._simulationDataService.changeSelectedSimulation(simulationInfo);
    }

    onRefreshClicked()
    {
        this.requestSimulationInfo();
    }
    
    requestSimulationInfo(): void
    {
        this._simulationHttpService.getSimulationInfos().subscribe(
            (simulationInfos: SimulationInfo[]) => {
                const result : SimulationInfoIntern[] = 
                this.dataSource.data = simulationInfos.map(this.convertToSimulationInfoIntern);
            },
            (err) => {
            }
        );
    }

    private convertToSimulationInfoIntern(simInfo : SimulationInfo) : SimulationInfoIntern
    {
        const activityStateCalculated : ActivityState = simInfo.isActive ? ActivityState.Active : ActivityState.Inactive;
        return {
            id : simInfo.id,
            activityState : activityStateCalculated,
            simulationName: simInfo.simulationName,
            userName: simInfo.userName,
            worldSize: simInfo.worldSize,
            timestep: simInfo.timestep,
            description: simInfo.description,
            numBlocks: simInfo.numBlocks,
            numThreadsPerBlock: simInfo.numThreadsPerBlock,
            lastUpdate: simInfo.lastUpdate
        };
    }

    private convertToSimulationInfo(simInfoIntern : SimulationInfoIntern) : SimulationInfo
    {
        const isActive = simInfoIntern.activityState !== ActivityState.Inactive;
        return {
            id : simInfoIntern.id,
            isActive : isActive,
            simulationName: simInfoIntern.simulationName,
            userName: simInfoIntern.userName,
            worldSize: simInfoIntern.worldSize,
            timestep: simInfoIntern.timestep,
            description: simInfoIntern.description,
            numBlocks: simInfoIntern.numBlocks,
            numThreadsPerBlock: simInfoIntern.numThreadsPerBlock,
            lastUpdate: simInfoIntern.lastUpdate
        };
    }
}

