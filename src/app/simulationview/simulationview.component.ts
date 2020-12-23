import {Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, Input} from '@angular/core';
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
    
    simulationInfo : SimulationInfo = null;

    mapElementSize = ["0%", "0%"];
    mapElementPos = ["0%", "0%"];
    zoomInEnabled = true;
    zoomOutEnabled = true;
    imageWidth = 1;

    private static readonly ImageAddress = AppConfig.Address + "getsimulationimage.php"; 
    private static readonly InactiveImageAddress = AppConfig.Address + "getinactivesimulationimage.php"; 
    private static readonly RequestImageInterval = 1000;
    private static readonly PollingImageInterval = 300;

    private _taskId : string = null;
    private _imageRequested : boolean = false;
    private _zoom = 2;

    @ViewChild('scrollAreaRef') scrollAreaAccess : ElementRef;
    @ViewChild('scrollContentRef') scrollContentAccess : ElementRef;

    @Input()
    get liveToggleChecked()
    {
        return this._liveToggleChecked;
    }
    set liveToggleChecked(value : boolean)
    {
        this._liveToggleChecked = value;
        this.simulationChanged(this._simulationDataService.getSelectedSimulationInfo());
    }
    private _liveToggleChecked : boolean = false;

    constructor(private _simulationHttpService: SimulationHttpService, private _simulationDataService : SimulationDataService) { }

    private _timerForRequestImage;
    private _timerForPollingImage;
    private _subscription : Subscription;
    private _currentSimulationId : string;
    private _currentActivity : boolean;
    ngAfterViewInit() : void 
    {
        this._timerForRequestImage = setInterval(() => { this.onRequestImage(); }, SimulationViewComponent.RequestImageInterval);
        this._timerForPollingImage = setInterval(() => { this.onCheckIfImageAvailable(); }, SimulationViewComponent.PollingImageInterval);

        this._subscription = this._simulationDataService.observeSelectedSimulationInfo().subscribe((simInfo) => {
            if (this._currentSimulationId != simInfo.id || this._currentActivity != simInfo.isActive) {
                this._currentSimulationId = simInfo.id;
                this._currentActivity = simInfo.isActive;
                this.simulationChanged(simInfo);
                this.updateMapElement();

            }
        });
    }

    ngOnDestroy() : void
    { 
        clearInterval(this._timerForRequestImage);
        clearInterval(this._timerForPollingImage);
        this._subscription.unsubscribe();
    }

    onScroll($event)
    {
        this.updateMapElement();
        this.onRequestImage();

    }

    private updateMapElement()
    {
        const worldSize = this.simulationInfo.worldSize;
        const simFractionSize = this.getWorldFractionSize();
        const simFractionPos = this.getWorldFractionPos();

        let i : number;
        for(i = 0; i < 2; i++) {
            this.mapElementPos[i] = (Math.min(1, simFractionPos[i] / worldSize[i]) * 100) + "%";
            this.mapElementSize[i] = (Math.min(1, simFractionSize[i] / worldSize[i]) * 100) + "%";
        }
    }

    onRequestImage()
    {
        if (this.simulationInfo == null || this._imageRequested) {
            return;
        }
        if (!this.liveToggleChecked) {
            return;
        }
        this._imageRequested = true;

        let simImageSize = this.getTruncatedWorldFractionSize();
        this.imageWidth = simImageSize[0] * this._zoom;

        const simulationPos = this.getWorldFractionPos();
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
                        this.setSimulationImage(taskId);
                    }
                },
                (err) => {
                }
            );
    }

    onZoomInButtonClicked()
    {
        const worldFractionPos = this.getWorldFractionPos();
        const worldFractionSize = this.getWorldFractionSize();
        this._zoom *= 2;
        this.updateScrollContentSize();
        this.updateMapElement();
        if (this._zoom > 1.1) {
            this.zoomOutEnabled = true;
        }

        const worldFractionPosAfterZoom = [
            worldFractionPos[0] + worldFractionSize[0] / 4, 
            worldFractionPos[1] + worldFractionSize[1] / 4
        ];
        setTimeout(() => { this.setWorldFractionPos(worldFractionPosAfterZoom);}, 0);
    }

    onZoomOutButtonClicked()
    {
        const worldFractionPos = this.getWorldFractionPos();
        const worldFractionSize = this.getWorldFractionSize();
        this._zoom /= 2;
        this.updateScrollContentSize();
        this.updateMapElement();
        if (this._zoom < 1.1) {
            this.zoomOutEnabled = false;
        }

        const worldFractionPosAfterZoom = [
            worldFractionPos[0] - worldFractionSize[0] / 2, 
            worldFractionPos[1] - worldFractionSize[1] / 2
        ];
        setTimeout(() => { this.setWorldFractionPos(worldFractionPosAfterZoom);}, 0);
    }

    private getWorldFractionSize() : number[]
    {
        return [
            this.scrollAreaAccess.nativeElement.clientWidth / this._zoom, 
            this.scrollAreaAccess.nativeElement.clientHeight / this._zoom
        ];
    }

    private getTruncatedWorldFractionSize() : number[]
    {
        let worldFractionSize = this.getWorldFractionSize();
        return [
            Math.min(worldFractionSize[0], this.simulationInfo.worldSize[0]),
            Math.min(worldFractionSize[1], this.simulationInfo.worldSize[1])
        ];
    }

    private getWorldFractionPos() : number[]
    {
        return [
            this.scrollAreaAccess.nativeElement.scrollLeft / this._zoom, 
            this.scrollAreaAccess.nativeElement.scrollTop / this._zoom
        ];
    }

    private setWorldFractionPos(value : number[])
    {
        this.scrollAreaAccess.nativeElement.scrollLeft  = value[0] * this._zoom;
        this.scrollAreaAccess.nativeElement.scrollTop = value[1] * this._zoom;
    }

    setSimulationImage(taskId : string)
    {
        if (taskId === null) {
            alert("image request failed: " + taskId);
        }
        this.simulationImageSrc = SimulationViewComponent.ImageAddress
            + "?r=" + Math.floor(Math.random()*100000)
            + "&taskId=" + taskId;
        this._imageRequested = false;
    }

    private simulationChanged(simulationInfo : SimulationInfo)
    {
        this.isProgressSpinnerActive = false;
        if (simulationInfo !== null) {
            this.simulationInfo = simulationInfo;

//            this.scrollContentPos = [0, 0];
            this.updateScrollContentSize();

            this._imageRequested = false;
            this._taskId = null;
            
            if (this.liveToggleChecked) {
                this.onRequestImage();
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
    }

    private updateScrollContentSize()
    {
        this.scrollContentSize[0] = this.simulationInfo.worldSize[0] * this._zoom; 
        this.scrollContentSize[1] = this.simulationInfo.worldSize[1] * this._zoom;
    }

    setInactiveImage()
    {
        this.isProgressSpinnerActive = true;
        this.inactiveSimulationImageSrc = SimulationViewComponent.InactiveImageAddress
            + "?simulationId=" + this.simulationInfo.id;
    }

    onInactiveImageLoad()
    {
        setTimeout(() => {this.isProgressSpinnerActive = false;}, 0);
    }
}
