import { Component, Input, OnInit } from '@angular/core';
import { SimulationInfo } from "../simulationinfo";
import { SimulationService } from "../simulation.service";
import { MonitorData } from '../monitordata';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

    @Input()
    get simulationInfo() : SimulationInfo 
    { 
        return this._simulationInfo; 
    };
    set simulationInfo(value : SimulationInfo) 
    {
        this._simulationInfo = value;
        if(this._simulationInfo !== null) {
            this.updateChart();
        }
    }

    chartAvailable = false;

    constructor(private _simulationService: SimulationService) {
    }

    ngOnInit(): void {
    }

    selectionChange($event)
    {
        this.updateChart();
    }

    update()
    {
        this.updateChart();
    }

    private updateChart()
    {
        this._simulationService.getMonitorDatas(this.simulationInfo.id, 0, this.simulationInfo.timestep).subscribe(
            (result : MonitorData[]) => {
                if(this.selectedEntities.length === 0) {
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
                this.chartColumnNames = this.selectedEntities;
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
