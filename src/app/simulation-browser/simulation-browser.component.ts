import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-simulation-browser',
  templateUrl: './simulation-browser.component.html',
  styleUrls: ['./simulation-browser.component.css']
})
export class SimulationBrowserComponent implements AfterViewInit {

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

  onSimulationClicked(row) {
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

}
