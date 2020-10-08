import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'world-explorer';

  displayedColumns: string[] = ['isActive', 'isDistributed', 'simulationName', 'userName', 'worldSize', 'timestep'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

export interface PeriodicElement {
  isActive: boolean;
  isDistributed: boolean;
  simulationName: string;
  userName: string;
  worldSize: string;
  timestep: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {isActive: false, isDistributed: false, simulationName: 'genesis0', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, isDistributed: false, simulationName: 'genesis1', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, isDistributed: false, simulationName: 'genesis2', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, isDistributed: false, simulationName: 'genesis3', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, isDistributed: false, simulationName: 'genesis4', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, isDistributed: false, simulationName: 'genesis5', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, isDistributed: false, simulationName: 'genesis6', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
];

