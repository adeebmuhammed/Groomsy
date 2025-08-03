import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberBookingComponent } from './barber-booking.component';

describe('BarberBookingComponent', () => {
  let component: BarberBookingComponent;
  let fixture: ComponentFixture<BarberBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
