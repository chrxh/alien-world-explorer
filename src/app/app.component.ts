import {Component, Input, Output, ViewChild} from '@angular/core';
import { ClosedCardsComponent } from './closedcards/closedcards.component';
import { SimulationInfo } from './simulationinfo';
import { CardName}  from "./cardname";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public title = 'world explorer';
    public selectedSimulationInfo : SimulationInfo = null;

    public shownCards = new Set<string>([CardName.Description, CardName.Actions, CardName.Statistics]);
    
    get closedCards()
    {
        var result = new Set<string>([CardName.Description, CardName.Actions, CardName.Statistics]);
        for (let card of this.shownCards) {
            result.delete(card);
        }
        return result;
    }
    set closedCards(value)
    {
        var result = new Set<string>([CardName.Description, CardName.Actions, CardName.Statistics]);
        for (let card of value) {
            result.delete(card);
        }
        this.shownCards = result;
    }

    @ViewChild("closedCardsRef") closedCardsAccess : ClosedCardsComponent;

    cardClosed($event : CardName)
    {
        this.shownCards.delete(CardName[$event]);
    }

}

