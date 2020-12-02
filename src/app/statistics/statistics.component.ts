import { Component, OnInit } from '@angular/core';
import { SimulationHttpService } from "../simulationhttp.service";
import {SimulationDataService} from "../simulationdata.service";
import { MonitorData } from '../monitordata';
import { SimulationInfo } from '../simulationinfo';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit{

    chartAvailable = false;


    constructor(private _simulationHttpService: SimulationHttpService, private _simulationDataService : SimulationDataService) {
    }

    ngOnInit()
    {
        this._simulationDataService.observeSelectedSimulationInfo().subscribe((simInfo : SimulationInfo) => { this.update(); });
    }

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
        this._simulationHttpService.getMonitorDatas(simInfo.id, simInfo.timestep - 50000).subscribe(
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
            }
        );
    }

    //selection data
    entities: any[] = [
        "cells",
        "particles",
        "clusters",
        "active clusters",
        "tokens"
    ];
    selectedEntities = [this.entities[2], this.entities[3]];


    //chart data
    chartType = 'AreaChart';
    chartData = [
    ];
    chartColumnNames = [];
    
    chartOptions = {
        titleTextStyle: { color: '#FFF' },
        backgroundColor: '#272727',
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

