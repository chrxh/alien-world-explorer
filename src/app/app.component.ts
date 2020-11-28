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

    public shownCards = new Set<string>([CardName.Details, CardName.Actions, CardName.Statistics]);
    
    get closedCards() : Set<string>
    {
        return this.complement(this.shownCards);;
    }
    set closedCards(value)
    {
        this.shownCards = this.complement(value);
    }

    @ViewChild("closedCardsRef") closedCardsAccess : ClosedCardsComponent;

    cardClosed($event : CardName)
    {
        this.shownCards.delete(CardName[$event]);
    }

    private complement(value : Set<string>) : Set<string>
    {
        let result = new Set<string>([CardName.Details, CardName.Parameters, CardName.Actions, CardName.Statistics, CardName.Chat]);
        for (let name of value) {
            result.delete(name);
        }
        return result;
    }
}

