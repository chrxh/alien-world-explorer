import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SimulationHttpService } from "../simulationhttp.service";
import {SimulationDataService} from "../simulationdata.service";
import { MonitorData } from '../monitordata';
import { SimulationInfo } from '../simulationinfo';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnDestroy {

    @Input()
    liveToggleChecked : boolean = false;

    constructor(private _simulationHttpService: SimulationHttpService, private _simulationDataService : SimulationDataService) {
    }

    private _lastSimulationId : string;
    private _lastActivity : boolean;
    ngOnInit()
    {
        this._subscriptionSimInfo = this._simulationDataService.observeSelectedSimulationInfo().subscribe((simInfo : SimulationInfo) => {
            if (this.liveToggleChecked) {
                this.update();
            }
            else {
                if (this._lastSimulationId === null || this._lastSimulationId != simInfo.id || this._lastActivity != simInfo.isActive) {
                    this.update();
                }
                this._lastSimulationId = simInfo.id;
                this._lastActivity = simInfo.isActive;
            }
        });
    }

    ngOnDestroy() : void
    { 
        this._subscriptionSimInfo.unsubscribe();
    }
    private _subscriptionSimInfo : Subscription;


    selectionChange($event)
    {
        this.update();
    }

    update()
    {
        const simInfo = this._simulationDataService.getSelectedSimulationInfo();
        if (simInfo === null) {
            return;
        }
        this._simulationHttpService.getStatistics(simInfo.id, simInfo.timestep - this.lastTimesteps).subscribe(
            (result : MonitorData[]) => {

                if (this.selectedEntities.length === 0 || result.length === 0) {
                    this.chartAvailable = false;
                    return;
                }
                const chartData = result.map( (monitorData : MonitorData) => {
                    let data = this.selectedEntities.map( (selectedEntity : string) => {
                        if(selectedEntity === this.entities[0]) {
                            return monitorData.numCells;
                        }
                        if(selectedEntity === this.entities[1]) {
                            return monitorData.numParticles;
                        }
                        if(selectedEntity === this.entities[2]) {
                            return monitorData.numClusters;
                        }
                        if(selectedEntity === this.entities[3]) {
                            return monitorData.numActiveClusters;
                        }
                        if(selectedEntity === this.entities[4]) {
                            return monitorData.numTokens;
                        }
                        return 0;
                    });
                    data.unshift(monitorData.timestep);
                    return data;
                });
                this.chartAvailable = chartData.length > 0;
                this.chartData = chartData;
                this.chartColumnNames = [...this.selectedEntities];
                this.chartColumnNames.unshift("");
            },
            (err) => {
                this.chartAvailable = false;
            }
        );
    }

    //selection data
    entities: any[] = [
        "Cells",
        "Particles",
        "Clusters",
        "Active clusters",
        "Tokens"
    ];
    selectedEntities = [this.entities[2], this.entities[3]];

    //input data
    get lastTimesteps() : number
    {
        return this._lastTimesteps;
    }
    set lastTimesteps(value : number)
    {
        this._lastTimesteps = value;
        this.update();
    }
    _lastTimesteps = 50000;

    //chart data
    chartAvailable = false;
    chartType = 'AreaChart';
    chartData = [
    ];
    chartColumnNames = [];
    
    chartOptions = {
        titleTextStyle: { color: '#FFF' },
        backgroundColor: '#000027',
        chartArea: {
            width: "60%"
        },
        hAxis: {
            title: "time steps",
            titleTextStyle: { color: '#bbb'},
            textStyle: {color: '#bbb'},
            gridlines: { 
                count: 20,
                color: '#444'
            },
        },
        vAxis: {
            title: "quantity",
            titleTextStyle: { color: '#bbb'},
            textStyle: {color: '#bbb'},
            gridlines: { 
                count: 20,
                color: '#444'
            }
        },
        explorer: { axis: 'vertical, horizontal' },
        legend: {textStyle: {color: '#bbb'}},
    };

    chartResize = true;
}

