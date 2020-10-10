import {AfterViewInit, Component, SimpleChanges, ViewChild} from '@angular/core';
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
  title = 'world explorer';
  simulationImage = "http://localhost/testimage.php";
  universeSizeX  = 1000;
  universeSizeY  = 1000;
  scrollbarPosX = 500;
  scrollbarPosY = 500;
  scrollStepX = 50;
  scrollStepY = 100;

  displayedColumns: string[] = ['isActive', 'simulationName', 'userName', 'worldSize', 'timestep'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<SimulationData>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onUpdateImage()
  {
    this.simulationImage = "http://localhost/testimage.php?r=" + Math.floor(Math.random()*10000);
  }

  onLeftClick() {
    if(this.scrollbarPosX - this.scrollStepX >= 0) {
      this.scrollbarPosX -= this.scrollStepX;
      this.onUpdateImage();
    }
  }

  onRightClick() {
    if(this.scrollbarPosX + this.scrollStepX <= this.universeSizeX) {
      this.scrollbarPosX += this.scrollStepX;
      this.onUpdateImage();
    }
  }

  onTopClick() {
    if(this.scrollbarPosY - this.scrollStepY >= 0) {
      this.scrollbarPosY -= this.scrollStepY;
      this.onUpdateImage();
    }
  }

  onDownClick() {
    if(this.scrollbarPosY + this.scrollStepY <= this.universeSizeY) {
      this.scrollbarPosY += this.scrollStepY;
      this.onUpdateImage();
    }
  }
}

export interface SimulationData {
  isActive: boolean;
  simulationName: string;
  userName: string;
  worldSize: string;
  timestep: string;
}

const ELEMENT_DATA: SimulationData[] = [
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

