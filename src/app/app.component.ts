import {AfterViewInit, Component, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from "@angular/cdk/collections";
import { SimulationInfo } from './simulationinfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public title = 'world explorer';

  public selectedSimulationInfo : SimulationInfo;

  ngAfterViewInit() {
  }

  setSelectedSimulation(simulationInfo)
  {
    this.selectedSimulationInfo = simulationInfo;
    alert("tes");
  }
}

