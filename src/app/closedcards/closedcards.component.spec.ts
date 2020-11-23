import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedcardsComponent } from './closedcards.component';

describe('ClosedcardsComponent', () => {
  let component: ClosedcardsComponent;
  let fixture: ComponentFixture<ClosedcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedcardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
