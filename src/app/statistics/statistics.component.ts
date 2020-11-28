import { Component, Input, OnInit } from '@angular/core';
import { SimulationInfo } from "../simulationinfo";
import { SimulationService } from "../simulation.service";
import { MonitorData } from '../monitordata';

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

    constructor(private _simulationService: SimulationService) { }

    ngOnInit(): void {
    }

    private updateChart()
    {
        this._simulationService.getMonitorDatas(this.simulationInfo.id, 0, this.simulationInfo.timestep).subscribe(
            (result : MonitorData[]) => {
                const chartData = result.map( (monitorData : MonitorData) => {
                    return [monitorData.timestep, monitorData.numClusters, monitorData.numActiveClusters];
                });
                if(chartData.length !== 0) {
                    this.chartData = chartData;
                }
            },
            (err) => {
            }
        );
    }


    chartType = 'AreaChart';
    chartData = [
    ];
    chartColumnNames = ["", "all", "active"];
    
    chartOptions = {
        title: "number of clusters",
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
            textStyle: {color: '#bbb'},
            gridlines: { 
                count: 20,
                color: '#444'
            }
        },
        explorer: { axis: 'vertical, horizontal' },
        legend: {textStyle: {color: '#bbb'}},
    };

    private _simulationInfo : SimulationInfo;
}
