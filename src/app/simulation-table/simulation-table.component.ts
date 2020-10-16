import {AfterViewInit, Component, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from "@angular/cdk/collections";

import '../vector2d';

@Component({
  selector: 'app-simulation-table',
  templateUrl: './simulation-table.component.html',
  styleUrls: ['./simulation-table.component.css']
})
export class SimulationTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['isActive', 'simulationName', 'userName', 'worldSize', 'timestep'];
  dataSource = new MatTableDataSource(TestData);
  selection = new SelectionModel(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSimulationClicked(row : number) {
  }
}

export interface SimulationData {
  isActive: boolean;
  simulationName: string;
  userName: string;
  worldSize: Vector2d;
  timestep: number;
}

const TestData: SimulationData[] = [
  {isActive: false, simulationName: 'genesis0', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis1', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis2', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis3', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis4', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis5', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis6', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis7', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis8', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis9', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis10', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis11', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
  {isActive: false, simulationName: 'genesis12', userName: 'alien', worldSize: {x: 40000, y: 1000}, timestep: 1000000},
];

