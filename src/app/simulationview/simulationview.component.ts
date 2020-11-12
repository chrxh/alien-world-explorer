import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {SimulationInfo} from "../simulationinfo";

@Component({
  selector: 'app-simulationview',
  templateUrl: './simulationview.component.html',
  styleUrls: ['./simulationview.component.css']
})
export class SimulationViewComponent implements AfterViewInit {

  public simulationImageSrc = "http://localhost/api/getsimulationimage.php";
  public scrollbarSizeX = 0;
  public scrollbarSizeY = 0;
  public scrollbarPosX = 500;
  public scrollbarPosY = 500;
  public scrollbarStepX = 50;
  public scrollbarStepY = 100;
  public SimulationScrollbarYheight = 300;

  private zoom = 4;


  @ViewChild('simulationImageRef') simulationImageAccess: ElementRef;
  @ViewChild('simulationScrollbarYRef') simulationScrollbarYaccess: ElementRef;
  
  @Input()
  get simulationInfo() : SimulationInfo { return this._simulationInfo; };
  set simulationInfo(simulationInfo : SimulationInfo) {
    this._simulationInfo = simulationInfo;
    this.scrollbarSizeX = simulationInfo.worldSize[0];
    this.scrollbarSizeY = simulationInfo.worldSize[1];

    this.scrollbarPosX = simulationInfo.worldSize[0] / 2;
    this.scrollbarPosY = simulationInfo.worldSize[1] / 2;

    this.onUpdateImage();
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
      var width = Math.floor(this.simulationImageAccess.nativeElement.width) / this.zoom;
      var height = Math.floor(this.simulationImageAccess.nativeElement.height) / this.zoom;
      this.simulationImageSrc = "http://localhost/api/getsimulationimage.php"
        + "?r=" + Math.floor(Math.random()*100000)
        + "&simulationId=" + this.simulationInfo.id
        + "&posX=" + this.scrollbarPosX
        + "&posY=" + this.scrollbarPosY
        + "&sizeX=" + width
        + "&sizeY=" + height;
    }
  }

  onImageLoad()
  {
    var height = Math.floor(this.simulationImageAccess.nativeElement.height);
    this.SimulationScrollbarYheight = height + 45;
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
