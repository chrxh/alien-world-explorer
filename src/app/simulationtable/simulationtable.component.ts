import {AfterViewInit, Component, SimpleChanges, ViewChild, Output, EventEmitter} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from "@angular/cdk/collections";
import {SimulationInfoService} from "../simulationinfo.service"
import {SimulationInfo} from "../simulationinfo";

@Component({
  selector: 'app-simulation-table',
  templateUrl: './simulationtable.component.html',
  styleUrls: ['./simulationtable.component.css']
})
export class SimulationTableComponent implements AfterViewInit {

  @Output() selectedSimulationEvent = new EventEmitter<SimulationInfo>();

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

    setInterval(()=>{
      this.getSimulationInfo();
    }, 10000);
  }

  onSimulationClicked() {
    const selectedRowData = this.selection.selected;
    this.selectedSimulationEvent.emit(selectedRowData[0]);
  }

  onRefreshClicked() {
    this.getSimulationInfo();
  }
  
  getSimulationInfo(): void {
    this.simulationInfoService.getAll().subscribe(
      (result: SimulationInfo[]) => {
        this.dataSource.data = result;
      },
      (err) => {
      }
    );
  }
}

