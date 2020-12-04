import {Component, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {SimulationInfo} from "../simulationinfo";
import {SimulationHttpService} from "../simulationhttp.service";
import {SimulationDataService} from "../simulationdata.service";
import {AppConfig} from "../appconfig";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-simulationview',
    templateUrl: './simulationview.component.html',
    styleUrls: ['./simulationview.component.css']
})
export class SimulationViewComponent implements AfterViewInit, OnDestroy  {

    inactiveSimulationImageSrc  = SimulationViewComponent.InactiveImageAddress;
    isProgressSpinnerActive = false;

    simulationImageSrc = SimulationViewComponent.ImageAddress;
    scrollContentSize : number[] = [0, 0]; 
    scrollContentPos : number[] = [0, 0];
    
    simulationInfo : SimulationInfo = null;
    imageReady = false;

    mapVisible = false;
    mapElementSize = ["0%", "0%"];
    mapElementPos = ["0%", "0%"];

    private static readonly ImageAddress = AppConfig.Address + "getsimulationimage.php"; 
    private static readonly InactiveImageAddress = AppConfig.Address + "getinactivesimulationimage.php"; 
    private static readonly Zoom = 2;
    private static readonly RequestImageInterval = 1000;
    private static readonly PollingImageInterval = 300;
    private static readonly MapTimeout = 2000;

    private _taskId : string = null;
    private _imageRequested : boolean = false;

    @ViewChild('scrollAreaRef') scrollAreaAccess : ElementRef;
    @ViewChild('scrollContentRef') scrollContentAccess : ElementRef;

    constructor(private _simulationHttpService: SimulationHttpService, private _simulationDataService : SimulationDataService) { }

    private _timeout;
    onScroll($event)
    {
        this.scrollContentPos[0] = $event.target.scrollLeft;
        this.scrollContentPos[1] = $event.target.scrollTop;

        this.updateMapElement();
        this.onRequestImage();
        this.mapVisible = true;

        if (this._timeout !== null) {
            clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(()=> {
            this.mapVisible = false;
            this._timeout = null;
        }, SimulationViewComponent.MapTimeout); 
    }

    private updateMapElement()
    {
        const imageSize = [
            this.scrollAreaAccess.nativeElement.clientWidth, 
            this.scrollAreaAccess.nativeElement.clientHeight,
        ];

        let i : number;
        for(i = 0; i < 2; i++) {
            this.mapElementPos[i] = (Math.min(1, this.scrollContentPos[i] / this.scrollContentSize[i]) * 100) + "%";
            this.mapElementSize[i] = (Math.min(1, imageSize[i] / this.scrollContentSize[i]) * 100) + "%";
        }
    }

    private _timerForRequestImage;
    private _timerForPollingImage;
    private _subscription : Subscription;
    ngAfterViewInit() : void 
    {
        this._timerForRequestImage = setInterval(() => { this.onRequestImage(); }, SimulationViewComponent.RequestImageInterval);
        this._timerForPollingImage = setInterval(() => { this.onCheckIfImageAvailable(); }, SimulationViewComponent.PollingImageInterval);

        this._subscription = this._simulationDataService.observeSelectedSimulationId().subscribe(() => {
            const simInfo = this._simulationDataService.getSelectedSimulationInfo();
            this.simulationChanged(simInfo);
            this.updateMapElement();
        });
    }

    ngOnDestroy() : void
    { 
        clearInterval(this._timerForRequestImage);
        clearInterval(this._timerForPollingImage);
        this._subscription.unsubscribe();
    }

    onRequestImage()
    {
        if (this.simulationInfo == null || this._imageRequested) {
            return;
        }
        if (!this.simulationInfo.isActive) {
            return;
        }
        this._imageRequested = true;

       
        const simImageSize = [
            this.scrollAreaAccess.nativeElement.clientWidth / SimulationViewComponent.Zoom, 
            this.scrollAreaAccess.nativeElement.clientHeight / SimulationViewComponent.Zoom,
        ];
        const simulationPos = [
            this.scrollContentPos[0] / SimulationViewComponent.Zoom, 
            this.scrollContentPos[1] / SimulationViewComponent.Zoom
        ];
        this._simulationHttpService.requestSimulationImage(this.simulationInfo.id, simulationPos, simImageSize)
            .subscribe(
                (result : string) => {
                    this._taskId = result;
                },
                (err) => {
                    this._imageRequested = false;
                }
            );
    }

    setInactiveImage()
    {
        this.isProgressSpinnerActive = true;
        this.inactiveSimulationImageSrc = SimulationViewComponent.InactiveImageAddress
            + "?simulationId=" + this.simulationInfo.id;
    }

    onCheckIfImageAvailable()
    {
        if(this.simulationInfo == null || this._taskId == null) {
            return;
        }
        this._simulationHttpService.isSimulationImageAvailable(this._taskId)
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
        this.imageReady = true;
        this.simulationImageSrc = SimulationViewComponent.ImageAddress
            + "?r=" + Math.floor(Math.random()*100000)
            + "&taskId=" + taskId;
        this._imageRequested = false;
    }

    onInactiveImageLoad()
    {
        this.isProgressSpinnerActive = false;
    }

    private simulationChanged(simulationInfo : SimulationInfo)
    {
        let activeSimulationSelected : boolean = false;
        if (simulationInfo !== null) {
            this.simulationInfo = simulationInfo;

            this.scrollContentPos = [0, 0];
            this.scrollContentSize[0] = simulationInfo.worldSize[0] * SimulationViewComponent.Zoom; 
            this.scrollContentSize[1] = simulationInfo.worldSize[1] * SimulationViewComponent.Zoom;

            this._imageRequested = false;
            this._taskId = null;
            
            if (simulationInfo.isActive) {
                this.onRequestImage();
                activeSimulationSelected = true;
            }
            else {
                this.setInactiveImage();
            }
        }
        else {
            this.simulationInfo = null;
            this._imageRequested = false;
            this._taskId = null;
        }

        if (!activeSimulationSelected) {
            this.hideImage();
        }
    }

    private hideImage()
    {
        this.imageReady = false;
    }
}
