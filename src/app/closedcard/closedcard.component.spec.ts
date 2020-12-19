import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedCardComponent } from './closedcard.component';

describe('ClosedCardComponent', () => {
  let component: ClosedCardComponent;
  let fixture: ComponentFixture<ClosedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
