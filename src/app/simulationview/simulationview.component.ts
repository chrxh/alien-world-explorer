import {Component, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {SimulationInfo} from "../simulationinfo";
import {SimulationService} from "../simulation.service"

@Component({
    selector: 'app-simulationview',
    templateUrl: './simulationview.component.html',
    styleUrls: ['./simulationview.component.css']
})
export class SimulationViewComponent implements AfterViewInit {

    private readonly SERVER_ADDRESS = "http://localhost/api/getsimulationimage.php"; 
    private readonly ZOOM = 2;
    private readonly REQUEST_IMAGE_INTERVAL = 1000;
    private readonly POLLING_IMAGE_INTERVAL = 300;


    @ViewChild('simulationImageRef') simulationImageAccess : ElementRef;
    @ViewChild('simulationScrollbarYRef') simulationScrollbarYaccess : ElementRef;
    
    @Input()
    get simulationInfo() : SimulationInfo 
    { 
        return this._simulationInfo; 
    };
    set simulationInfo(simulationInfo : SimulationInfo) 
    {
        if (simulationInfo !== null) {
            this._simulationInfo = simulationInfo;
            this.scrollbarSizeX = simulationInfo.worldSize[0];
            this.scrollbarSizeY = simulationInfo.worldSize[1];

            this.scrollbarPosX = simulationInfo.worldSize[0] / 2;
            this.scrollbarPosY = simulationInfo.worldSize[1] / 2;

            this._imageRequested = false;
            this._taskId = null;

            this.onRequestImage();
        }
        else {
            this._simulationInfo = null;
            this._imageRequested = false;
            this._taskId = null;
        }
    }

    constructor(private simulationService: SimulationService) { }

    ngAfterViewInit(): void 
    {
        setInterval(()=>{
              this.onRequestImage();
            }, this.REQUEST_IMAGE_INTERVAL);

        setInterval(()=>{
                this.onCheckIfImageAvailable();
            }, this.POLLING_IMAGE_INTERVAL);
    }

    onRequestImage()
    {
        if(this._simulationInfo == null || this._imageRequested) {
            return;
        }
        this._imageRequested = true;
        var width = Math.floor(this.simulationImageAccess.nativeElement.width) / this.ZOOM;
        var height = Math.floor(this.simulationImageAccess.nativeElement.height) / this.ZOOM;
        this.simulationService.requestSimulationImage(this.simulationInfo.id, [this.scrollbarPosX, this.scrollbarPosY], [width, height])
            .subscribe(
                (result : string) => {
                    this._taskId = result;
                },
                (err) => {
                    this._imageRequested = false;
                }
            );
    }

    onCheckIfImageAvailable()
    {
        if(this._simulationInfo == null || this._taskId == null) {
            return;
        }
        this.simulationService.isSimulationImageAvailable(this._taskId)
            .subscribe(
                (result : boolean) => {
                    if (result) {
                        this.onGetSimulationImage();
                        this._taskId = null;
                    }
                },
                (err) => {
                }
            );
    }

    onGetSimulationImage()
    {
        this.simulationImageSrc = this.SERVER_ADDRESS
            + "?r=" + Math.floor(Math.random()*100000)
            + "&taskId=" + this._taskId;
    }

    onImageLoad()
    {
        var height = Math.floor(this.simulationImageAccess.nativeElement.height);
        this.SimulationScrollbarYheight = height + 45;
        this._imageRequested = false;
    }

    onLeftClicked()
    {
        if(this.scrollbarPosX - this.scrollbarStepX >= 0) {
        this.scrollbarPosX -= this.scrollbarStepX;
        this.onRequestImage();
        }
    }

    onRightClicked()
    {
        if(this.scrollbarPosX + this.scrollbarStepX <= this._simulationInfo.worldSize[0]) {
        this.scrollbarPosX += this.scrollbarStepX;
        this.onRequestImage();
        }
    }

    onTopClicked() 
    {
        if(this.scrollbarPosY - this.scrollbarStepY >= 0) {
        this.scrollbarPosY -= this.scrollbarStepY;
        this.onRequestImage();
        }
    }

    onDownClicked() 
    {
        if(this.scrollbarPosY + this.scrollbarStepY <= this._simulationInfo.worldSize[1]) {
        this.scrollbarPosY += this.scrollbarStepY;
        this.onRequestImage();
        }
    }

    public simulationImageSrc = this.SERVER_ADDRESS;
    public scrollbarSizeX = 0;
    public scrollbarSizeY = 0;
    public scrollbarPosX = 500;
    public scrollbarPosY = 500;
    public scrollbarStepX = 50;
    public scrollbarStepY = 100;
    public SimulationScrollbarYheight = 300;

    private _simulationInfo : SimulationInfo = null;
    private _taskId : string = null;
    private _imageRequested : boolean = false;
}
