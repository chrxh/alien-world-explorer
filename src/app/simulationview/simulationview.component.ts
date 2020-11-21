import {Component, Input, AfterViewInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import {SimulationInfo} from "../simulationinfo";
import {SimulationService} from "../simulation.service"

@Component({
    selector: 'app-simulationview',
    templateUrl: './simulationview.component.html',
    styleUrls: ['./simulationview.component.css']
})
export class SimulationViewComponent implements AfterViewInit {

    @ViewChild('scrollAreaRef') scrollAreaAccess : ElementRef;
    @ViewChild('scrollContentRef') scrollContentAccess : ElementRef;
    
    @Input()
    get simulationInfo() : SimulationInfo 
    { 
        return this._simulationInfo; 
    };
    set simulationInfo(simulationInfo : SimulationInfo) 
    {
        var activeSimulationSelected : boolean = false;
        if (simulationInfo !== null) {
            this._simulationInfo = simulationInfo;

            this.scrollContentSize[0] = simulationInfo.worldSize[0] * this.ZOOM; 
            this.scrollContentSize[1] = simulationInfo.worldSize[1] * this.ZOOM;

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
            this.simulationImageSrc = this.SERVER_ADDRESS;
        }
    }

    constructor(private simulationService: SimulationService) { }

    onScroll($event) {
        this.scrollContentPos[0] = $event.target.scrollLeft;
        this.scrollContentPos[1] = $event.target.scrollTop;
        this.onRequestImage();
    }

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
        
        const imageSize = [
            this.scrollAreaAccess.nativeElement.clientWidth / this.ZOOM, 
            this.scrollAreaAccess.nativeElement.clientHeight / this.ZOOM,
        ];
        const simulationPos = [
            this.scrollContentPos[0] / this.ZOOM, 
            this.scrollContentPos[1] / this.ZOOM
        ];
        this.simulationService.requestSimulationImage(this.simulationInfo.id, simulationPos, imageSize)
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
        this.simulationImageSrc = this.SERVER_ADDRESS
            + "?r=" + Math.floor(Math.random()*100000)
            + "&taskId=" + taskId;
    }

    onImageLoad()
    {
        this._imageRequested = false;
    }

    private readonly SERVER_ADDRESS = "http://localhost/api/getsimulationimage.php"; 
    private readonly ZOOM = 2;
    private readonly REQUEST_IMAGE_INTERVAL = 1000;
    private readonly POLLING_IMAGE_INTERVAL = 300;

    private _simulationInfo : SimulationInfo = null;
    private _taskId : string = null;
    private _imageRequested : boolean = false;

    public simulationImageSrc = this.SERVER_ADDRESS;
    public scrollContentSize : number[] = [2800, 1200]; 
    public scrollContentPos : number[] = [0, 0];
}
