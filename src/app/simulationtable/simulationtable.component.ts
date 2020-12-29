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
    dataSource = new MatTableDataSource<SimulationInfoIntern>();
    selection = new SelectionModel(false, []);

    constructor(private _simulationDataService: SimulationDataService)
    {
    }

    private subscription: Subscription;
    ngAfterViewInit(): void
    {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.subscription = this._simulationDataService.observeSimulationInfos().subscribe(
            (simulationInfos: SimulationInfo[]) => {
                if(simulationInfos === null) {
                    return;
                }
                this.integrateData(simulationInfos);
            },
            (err) => {
            }
        );
    }

    integrateData(newSimulationInfos: SimulationInfo[]): void
    {
        if (this.isSelectionContained(newSimulationInfos)) {
            for (let i = 0; i < this.dataSource.data.length; i++) {
                Object.assign(this.dataSource.data[i], this.convertToSimulationInfoIntern(newSimulationInfos[i]));
            }
        }
        else {
            this.dataSource.data = newSimulationInfos.map(this.convertToSimulationInfoIntern);

            if (this.selection.selected.length === 0) {
                return;
            }
            const selectedRow = this.selection.selected[0];
            for (const row of this.dataSource.data) {
                if (selectedRow.id === row.id) {
                    this.selection.toggle(row);
                }
            }
        }
    }

    isSelectionContained(newSimulationInfos : SimulationInfo[]) : boolean
    {
        if (this.dataSource.data.length !== newSimulationInfos.length) {
            return false;
        }
        if (this.selection.selected.length === 0) {
            return true;
        }

        const selectedRow = this.selection.selected[0];
        let selectionIndex : number;
        for (let i = 0; i < this.dataSource.data.length; i++) {
            if (this.dataSource.data[i].id === selectedRow.id) {
                selectionIndex = i;
                break;
            }
        }

        for (let i = 0; i < newSimulationInfos.length; i++) {
            if (newSimulationInfos[i].id === selectedRow.id) {
                if(selectionIndex != i) {
                    alert("ah");
                }
                return selectionIndex == i;
            }
        }
        return false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSimulationClicked(row : SimulationInfoIntern)
    {
        if (this.selection.selected.length === 0) {
            this.selectedSimulationEvent.emit(null);
            this._simulationDataService.changeSelectedSimulation(null);
            return;
        }

        const simulationInfo = this.convertToSimulationInfo(row);
        this.selectedSimulationEvent.emit(simulationInfo);
        this._simulationDataService.changeSelectedSimulation(simulationInfo.id);
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

