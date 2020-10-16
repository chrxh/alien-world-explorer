import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationBrowserComponent } from './simulation-browser.component';

describe('SimulationBrowserComponent', () => {
  let component: SimulationBrowserComponent;
  let fixture: ComponentFixture<SimulationBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationBrowserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
