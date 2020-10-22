import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationViewComponent } from './simulationview.component';

describe('SimulationViewComponent', () => {
  let component: SimulationViewComponent;
  let fixture: ComponentFixture<SimulationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
