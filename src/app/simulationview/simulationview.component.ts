import {Component, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {SimulationInfo} from "../simulationinfo";
import {SimulationService} from "../simulation.service";
import {SimulationDataService} from "../simulationdata.service";
import {AppConfig} from "../appconfig";

@Component({
    selector: 'app-simulationview',
    templateUrl: './simulationview.component.html',
    styleUrls: ['./simulationview.component.css']
})
export class SimulationViewComponent implements AfterViewInit, OnDestroy  {

    public simulationImageSrc = SimulationViewComponent.ImageAddress;
    public scrollContentSize : number[] = [0, 0]; 
    public scrollContentPos : number[] = [0, 0];
    public imageVisible : boolean = false;

    private static readonly ImageAddress = AppConfig.Address + "getsimulationimage.php"; 
    private static readonly Zoom = 2;
    private static readonly RequestImageInterval = 1000;
    private static readonly PollingImageInterval = 300;

    private _simulationInfo : SimulationInfo = null;
    private _taskId : string = null;
    private _imageRequested : boolean = false;

    @ViewChild('scrollAreaRef') scrollAreaAccess : ElementRef;
    @ViewChild('scrollContentRef') scrollContentAccess : ElementRef;

    constructor(private _simulationService: SimulationService, private _simulationDataService : SimulationDataService) { }

    onScroll($event) {
        this.scrollContentPos[0] = $event.target.scrollLeft;
        this.scrollContentPos[1] = $event.target.scrollTop;
        this.onRequestImage();
    }

    private timerForRequestImage;
    private timerForPollingImage;
    ngAfterViewInit() : void 
    {
        this.timerForRequestImage = setInterval(()=>{
              this.onRequestImage();
            }, SimulationViewComponent.RequestImageInterval);
        this.timerForPollingImage = setInterval(()=>{
                this.onCheckIfImageAvailable();
            }, SimulationViewComponent.PollingImageInterval);

        this._simulationDataService.getSelectedSimulation().subscribe(simulationInfo => {
            this.simulationChanged(simulationInfo);
        });
    }

    ngOnDestroy() : void
    { 
        clearInterval(this.timerForRequestImage);
        clearInterval(this.timerForPollingImage);
    }

    onRequestImage()
    {
        if(this._simulationInfo == null || this._imageRequested) {
            return;
        }
        this._imageRequested = true;

       
        const imageSize = [
            this.scrollAreaAccess.nativeElement.clientWidth / SimulationViewComponent.Zoom, 
            this.scrollAreaAccess.nativeElement.clientHeight / SimulationViewComponent.Zoom,
        ];
        const simulationPos = [
            this.scrollContentPos[0] / SimulationViewComponent.Zoom, 
            this.scrollContentPos[1] / SimulationViewComponent.Zoom
        ];
        this._simulationService.requestSimulationImage(this._simulationInfo.id, simulationPos, imageSize)
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
        this._simulationService.isSimulationImageAvailable(this._taskId)
            .subscribe(
                (result : boolean) => {
                    if (result) {
                        const taskId = this._taskId;
                        this._taskId = null;
                        this.onGetSimulationImage(taskId);
                    }
                },
                (err) => {
                }
            );
    }

    onGetSimulationImage(taskId : string)
    {
        this.imageVisible = true;
        this.simulationImageSrc = SimulationViewComponent.ImageAddress
            + "?r=" + Math.floor(Math.random()*100000)
            + "&taskId=" + taskId;
        this._imageRequested = false;
    }

    onImageLoad()
    {
    }

    private simulationChanged(simulationInfo : SimulationInfo)
    {
        var activeSimulationSelected : boolean = false;
        if (simulationInfo !== null) {
            this._simulationInfo = simulationInfo;

            this.scrollContentSize[0] = simulationInfo.worldSize[0] * SimulationViewComponent.Zoom; 
            this.scrollContentSize[1] = simulationInfo.worldSize[1] * SimulationViewComponent.Zoom;

            this._imageRequested = false;
            this._taskId = null;

            this.onRequestImage();

            if (simulationInfo.isActive) {
                activeSimulationSelected = true;
            }
        }
        else {
            this._simulationInfo = null;
            this._imageRequested = false;
            this._taskId = null;
        }

        if (!activeSimulationSelected) {
            this.hideImage();
        }
    }

    private hideImage()
    {
        this.imageVisible = false;
        this.scrollContentSize = [0, 0];
    }
}
