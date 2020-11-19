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
            this.scrollbarSize[0] = simulationInfo.worldSize[0];
            this.scrollbarSize[1] = simulationInfo.worldSize[1];

            const imageSize = this.getImageSize();
            this.scrollbarSize[0] -= imageSize[0];
            this.scrollbarSize[1] -= imageSize[1];
    
            this.scrollbarPos[0] = this.scrollbarSize[0] / 2;
            this.scrollbarPos[1] = this.scrollbarSize[1] / 2;
            this.scrollbarStep[0] = this.scrollbarSize[0] / 20;
            this.scrollbarStep[1] = this.scrollbarSize[1] / 20;

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
        const imageSize = this.getImageSize();
        this.simulationService.requestSimulationImage(this.simulationInfo.id, [this.scrollbarPos[0], this.scrollbarPos[1]], [imageSize[0], imageSize[1]])
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
        if(this.scrollbarPos[0] - this.scrollbarStep[0] >= 0) {
        this.scrollbarPos[0] -= this.scrollbarStep[0];
        this.onRequestImage();
        }
    }

    onRightClicked()
    {
        if(this.scrollbarPos[0] + this.scrollbarStep[0] <= this._simulationInfo.worldSize[0]) {
        this.scrollbarPos[0] += this.scrollbarStep[0];
        this.onRequestImage();
        }
    }

    onTopClicked() 
    {
        if(this.scrollbarPos[1] - this.scrollbarStep[1] >= 0) {
        this.scrollbarPos[1] -= this.scrollbarStep[1];
        this.onRequestImage();
        }
    }

    onDownClicked() 
    {
        if(this.scrollbarPos[1] + this.scrollbarStep[1] <= this._simulationInfo.worldSize[1]) {
        this.scrollbarPos[1] += this.scrollbarStep[1];
        this.onRequestImage();
        }
    }

    public simulationImageSrc = this.SERVER_ADDRESS;
    public scrollbarSize : number[] = [0, 0];
    public scrollbarPos : number[] = [0, 0];
    public scrollbarStep : number[] = [0, 0];
    public SimulationScrollbarYheight = 300;

    private getImageSize() : number[]
    {
        return [
            Math.floor(this.simulationImageAccess.nativeElement.width) / this.ZOOM, 
            Math.floor(this.simulationImageAccess.nativeElement.height) / this.ZOOM
        ];
    }
    private _simulationInfo : SimulationInfo = null;
    private _taskId : string = null;
    private _imageRequested : boolean = false;
}
