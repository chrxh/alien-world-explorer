import {AfterViewInit, Component, SimpleChanges, ViewChild, Output, EventEmitter} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from "@angular/cdk/collections";
import {SimulationInfoService} from "../simulationinfo.service"
import {SimulationInfo} from "../simulationinfo";

@Component({
  selector: 'app-simulation-table',
  templateUrl: './simulation-table.component.html',
  styleUrls: ['./simulation-table.component.css']
})
export class SimulationTableComponent implements AfterViewInit {

  @Output() selectedSimulationIdEvent = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['isActive', 'simulationName', 'userName', 'worldSize', 'timestep'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(false, []);

  constructor(private simulationInfoService: SimulationInfoService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getSimulationInfo();
  }

  onSimulationClicked() {
    const selectedRowData = this.selection.selected;
    this.selectedSimulationIdEvent.emit(selectedRowData[0].id);
  }
  
  getSimulationInfo(): void {
    this.simulationInfoService.getAll().subscribe(
      (result: SimulationInfo[]) => {
//        this.dataSource.data = [{isActive: false, simulationName: 'genesis0', userName: 'alien', worldSize: [40000, 1000], timestep: 1000000}];
        this.dataSource.data = result;
      },
      (err) => {
      }
    );
  }
}

