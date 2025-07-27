import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberCardComponent } from './barber-card.component';

describe('BarberCardComponent', () => {
  let component: BarberCardComponent;
  let fixture: ComponentFixture<BarberCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
