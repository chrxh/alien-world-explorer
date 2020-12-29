import {Component, Input, Output, ViewChild, EventEmitter, AfterViewInit} from '@angular/core';
import { ClosedCardsComponent } from './closedcards/closedcards.component';
import { SimulationInfo } from './simulationinfo';
import { CardName} from './cardname';
import { StatisticsComponent } from './statistics/statistics.component';
import { SimulationViewComponent } from './simulationview/simulationview.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    public title = 'world explorer';
    public selectedSimulationInfo: SimulationInfo = null;

    public shownCards = new Set<string>([CardName.Details, CardName.Statistics, CardName.View]);

    get closedCards(): Set<string>
    {
        return this.complement(this.shownCards);
    }
    set closedCards(value)
    {
        this.shownCards = this.complement(value);
        this.statisticsAccess.update();
    }

    @ViewChild('closedCardsRef') closedCardsAccess: ClosedCardsComponent;
    @ViewChild('statisticsRef') statisticsAccess: StatisticsComponent;
    @ViewChild('simViewRef') simViewAccess: SimulationViewComponent;

    constructor(private snackBar: MatSnackBar) {}

    ngAfterViewInit(): void
    {
        this.snackBar.open('Please select a simulation to connect.', null, {
            duration: 4000,
            panelClass: ['WelcomeMessage'],
            verticalPosition: 'top'
        });
    }

    cardClosed($event: CardName): void
    {
        this.shownCards.delete(CardName[$event]);
        this.statisticsAccess.update();
    }

    private complement(value: Set<string>): Set<string>
    {
        const result = new Set<string>([CardName.Details, CardName.Parameters, CardName.Actions, CardName.Statistics,
          CardName.Chat, CardName.View]);
        for (const name of value) {
            result.delete(name);
        }
        return result;
    }

    onStatisticsLiveToggleChange(value: boolean): void
    {
        setTimeout(() => { this.statisticsAccess.liveToggleChecked = value; }, 0);
    }

    onSimLiveToggleChange(value: boolean): void
    {
        setTimeout(() => { this.simViewAccess.liveToggleChecked = value; }, 0);
    }

    onHomeButtonClicked(): void
    {
        window.open('https://alien-project.org');
    }
}

