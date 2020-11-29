import { Component, Input, OnInit } from '@angular/core';
import { SimulationInfo } from "../simulationinfo";
import { SimulationService } from "../simulation.service";
import {SimulationDataService} from "../simulationdata.service";
import { MonitorData } from '../monitordata';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

    chartAvailable = false;

    constructor(private _simulationService: SimulationService, private _simulationDataService : SimulationDataService) {
    }

    ngOnInit(): void
    {
        this._simulationDataService.getSelectedSimulation().subscribe(simulationInfo => {
            this.simulationChanged(simulationInfo);
        });

    }

    private simulationChanged(simulationInfo : SimulationInfo)
    {
        this._simulationInfo = simulationInfo;
        if(this._simulationInfo !== null) {
            this.update();
        }
    }

    selectionChange($event)
    {
        this.update();
    }

    update()
    {
        this._simulationService.getMonitorDatas(this._simulationInfo.id, 0, this._simulationInfo.timestep).subscribe(
            (result : MonitorData[]) => {
                if (this.selectedEntities.length === 0) {
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
            }
        },
        vAxis: {
            title: "number",
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

    private _simulationInfo : SimulationInfo;
}
