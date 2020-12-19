import {Component, Input, Output, ViewChild, EventEmitter} from '@angular/core';
import { ClosedCardsComponent } from './closedcards/closedcards.component';
import { SimulationInfo } from './simulationinfo';
import { CardName}  from "./cardname";
import { StatisticsComponent } from './statistics/statistics.component';
import { SimulationViewComponent } from './simulationview/simulationview.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public title = 'world explorer';
    public selectedSimulationInfo : SimulationInfo = null;

    public shownCards = new Set<string>([CardName.Details, CardName.Statistics, CardName.View]);

    get closedCards() : Set<string>
    {
        return this.complement(this.shownCards);;
    }
    set closedCards(value)
    {
        this.shownCards = this.complement(value);
        this.statisticsAccess.update();
    }

    @ViewChild("closedCardsRef") closedCardsAccess : ClosedCardsComponent;
    @ViewChild("statisticsRef") statisticsAccess : StatisticsComponent;
    @ViewChild("simViewRef") simViewAccess : SimulationViewComponent;
    
    cardClosed($event : CardName)
    {
        this.shownCards.delete(CardName[$event]);
        this.statisticsAccess.update();
    }

    private complement(value : Set<string>) : Set<string>
    {
        let result = new Set<string>([CardName.Details, CardName.Parameters, CardName.Actions, CardName.Statistics, CardName.Chat, CardName.View]);
        for (let name of value) {
            result.delete(name);
        }
        return result;
    }

    onStatisticsLiveToggleChange(value : boolean)
    {
        setTimeout(() => { this.statisticsAccess.liveToggleChecked = value; }, 0);
    }

    onSimLiveToggleChange(value : boolean)
    {
        setTimeout(() => { this.simViewAccess.liveToggleChecked = value; }, 0);
    }

    onHomeButtonClicked()
    {
        window.open("https://alien-project.org");
    }
}

