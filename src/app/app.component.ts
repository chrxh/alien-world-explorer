import {Component} from '@angular/core';
import { SimulationInfo } from './simulationinfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'world explorer';

  public selectedSimulationInfo : SimulationInfo = null;
}

