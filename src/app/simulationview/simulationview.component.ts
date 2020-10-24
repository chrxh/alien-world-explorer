import { Component, Input, AfterViewInit } from '@angular/core';
import {SimulationInfo} from "../simulationinfo";

@Component({
  selector: 'app-simulationview',
  templateUrl: './simulationview.component.html',
  styleUrls: ['./simulationview.component.css']
})
export class SimulationViewComponent implements AfterViewInit {

  @Input()
  get simulationInfo() : SimulationInfo { return this._simulationInfo; };
  set simulationInfo(simulationInfo : SimulationInfo) {
    this._simulationInfo = simulationInfo;
  }

  simulationImage = "http://localhost/testimage.php";
  universeSizeX  = 1000;
  universeSizeY  = 1000;
  zoom = 4;
  scrollbarPosX = 500;
  scrollbarPosY = 500;
  scrollStepX = 50;
  scrollStepY = 100;

  constructor() { }

  ngAfterViewInit(): void {
  }

  onUpdateImage()
  {
//    var width = Math.floor(this.simulationImageId.width / this.zoom);
//    var height = Math.floor(this.simulationImageId.height / this.zoom);
//    this.simulationImage = "http://localhost/testimage.php?r=" + Math.floor(Math.random()*100000)
//      + "&width=" + width + "&height=" + height + "&zoom=" + this.zoom;
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

  private _simulationInfo : SimulationInfo;
}
