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
  simulationImage:any = "assets/test.png";

  displayedColumns: string[] = ['isActive', 'simulationName', 'userName', 'worldSize', 'timestep'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
}

export interface PeriodicElement {
  isActive: boolean;
  simulationName: string;
  userName: string;
  worldSize: string;
  timestep: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {isActive: false, simulationName: 'genesis0', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis1', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis2', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis3', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis4', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis5', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis6', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis7', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis8', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis9', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis10', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
  {isActive: false, simulationName: 'genesis11', userName: 'alien', worldSize: '40,000 x 1,000', timestep: '1,000,000'},
];

