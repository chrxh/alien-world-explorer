import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {SimulationInfo} from "../simulationinfo";

@Component({
  selector: 'app-simulationview',
  templateUrl: './simulationview.component.html',
  styleUrls: ['./simulationview.component.css']
})
export class SimulationViewComponent implements AfterViewInit {

  simulationImage = "http://localhost/testimage.php";
  zoom = 4;
  scrollbarSizeX = 0;
  scrollbarSizeY = 0;
  scrollbarPosX = 500;
  scrollbarPosY = 500;
  scrollbarStepX = 50;
  scrollbarStepY = 100;

  @ViewChild('simulationImageRef') simulationImageAccess: ElementRef;

  @Input()
  get simulationInfo() : SimulationInfo { return this._simulationInfo; };
  set simulationInfo(simulationInfo : SimulationInfo) {
    this._simulationInfo = simulationInfo;
    this.scrollbarSizeX = simulationInfo.worldSize[0];
    this.scrollbarSizeY = simulationInfo.worldSize[1];

    this.scrollbarPosX = simulationInfo.worldSize[0] / 2;
    this.scrollbarPosY = simulationInfo.worldSize[1] / 2;
  }

  constructor() { }

  ngAfterViewInit(): void {
    setInterval(()=>{
      this.onUpdateImage();
    }, 1000);

  }

  onUpdateImage()
  {
    if(this._simulationInfo != null) {
      var width = Math.floor(this.simulationImageAccess.nativeElement.width / this.zoom);
      var height = Math.floor(this.simulationImageAccess.nativeElement.height / this.zoom);
      this.simulationImage = "http://localhost/testimage.php?r=" + Math.floor(Math.random()*100000)
        + "&width=" + width + "&height=" + height + "&zoom=" + this.zoom;
    }
  }

  onLeftClicked() {
    if(this.scrollbarPosX - this.scrollbarStepX >= 0) {
      this.scrollbarPosX -= this.scrollbarStepX;
      this.onUpdateImage();
    }
  }

  onRightClicked() {
    if(this.scrollbarPosX + this.scrollbarStepX <= this._simulationInfo.worldSize[0]) {
      this.scrollbarPosX += this.scrollbarStepX;
      this.onUpdateImage();
    }
  }

  onTopClicked() {
    if(this.scrollbarPosY - this.scrollbarStepY >= 0) {
      this.scrollbarPosY -= this.scrollbarStepY;
      this.onUpdateImage();
    }
  }

  onDownClicked() {
    if(this.scrollbarPosY + this.scrollbarStepY <= this._simulationInfo.worldSize[1]) {
      this.scrollbarPosY += this.scrollbarStepY;
      this.onUpdateImage();
    }
  }

  private _simulationInfo : SimulationInfo;
}
