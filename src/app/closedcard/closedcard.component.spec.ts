import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedcardComponent } from './closedcard.component';

describe('ClosedcardComponent', () => {
  let component: ClosedcardComponent;
  let fixture: ComponentFixture<ClosedcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
