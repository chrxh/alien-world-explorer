import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import {CdkTableModule} from "@angular/cdk/table";
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {NumberArrayRenderer} from './numberarrayrenderer.pipe';
import { HttpClientModule } from '@angular/common/http';
import { SimulationTableComponent } from './simulationtable/simulationtable.component';
import { SimulationViewComponent } from './simulationview/simulationview.component';
import { AlienCardComponent } from './aliencard/aliencard.component';
import { ClosedCardsComponent } from './closedcards/closedcards.component';
import { ClosedCardComponent } from './closedcard/closedcard.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { StatisticsComponent } from './statistics/statistics.component';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
    declarations: [
        AppComponent,
        NumberArrayRenderer,
        SimulationTableComponent,
        SimulationViewComponent,
        AlienCardComponent,
        ClosedCardsComponent,
        ClosedCardComponent,
        StatisticsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MatToolbarModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatCardModule,
        MatSortModule,
        MatDividerModule,
        CdkTableModule,
        MatButtonModule,
        MatIconModule,
        MatSliderModule,
        GoogleChartsModule,
        MatSelectModule,
        MatSlideToggleModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
