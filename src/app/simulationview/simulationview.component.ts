import {Component, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {SimulationInfo} from "../simulationinfo";
import {SimulationInfoService} from "../simulationinfo.service"

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

    private zoom = 2;
    private taskId;


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

        this.onRequestImage();
    }

    constructor(private simulationInfoService: SimulationInfoService) { }

    ngAfterViewInit(): void {
        setInterval(()=>{
//              this.onRequestImage();
            }, 1000);

        setInterval(()=>{
                this.onCheckIfImageAvailable();
            }, 1000);
    }

    onRequestImage()
    {
        if(this._simulationInfo == null) {
            return;
        }
        var width = Math.floor(this.simulationImageAccess.nativeElement.width) / this.zoom;
        var height = Math.floor(this.simulationImageAccess.nativeElement.height) / this.zoom;
        this.simulationInfoService.requestSimulationImage(this.simulationInfo.id, [this.scrollbarPosX, this.scrollbarPosY], [width, height])
            .subscribe(
                (result : string) => {
                    this.taskId = result;
                },
                (err) => {}
            );
    }

    onCheckIfImageAvailable()
    {
        if(this._simulationInfo == null || this.taskId == null) {
            return;
        }
        this.simulationInfoService.isSimulationImageAvailable(this.taskId)
            .subscribe(
                (result : boolean) => {
                    if (result) {
                        this.onGetSimulationImage();
                    }
                },
                (err) => {
                }
            );
    }

    onGetSimulationImage()
    {
        if(this._simulationInfo == null || this.taskId == null) {
            return;
        }
        this.simulationImageSrc = "http://localhost/api/getsimulationimage.php"
            + "?r=" + Math.floor(Math.random()*100000)
            + "&taskId=" + this.taskId;
        this.taskId = null;
    }

  onImageLoad()
  {
    var height = Math.floor(this.simulationImageAccess.nativeElement.height);
    this.SimulationScrollbarYheight = height + 45;
  }

  onLeftClicked() {
    if(this.scrollbarPosX - this.scrollbarStepX >= 0) {
      this.scrollbarPosX -= this.scrollbarStepX;
      this.onRequestImage();
    }
  }

  onRightClicked() {
    if(this.scrollbarPosX + this.scrollbarStepX <= this._simulationInfo.worldSize[0]) {
      this.scrollbarPosX += this.scrollbarStepX;
      this.onRequestImage();
    }
  }

  onTopClicked() {
    if(this.scrollbarPosY - this.scrollbarStepY >= 0) {
      this.scrollbarPosY -= this.scrollbarStepY;
      this.onRequestImage();
    }
  }

  onDownClicked() {
    if(this.scrollbarPosY + this.scrollbarStepY <= this._simulationInfo.worldSize[1]) {
      this.scrollbarPosY += this.scrollbarStepY;
      this.onRequestImage();
    }
  }

  private _simulationInfo : SimulationInfo;
}
