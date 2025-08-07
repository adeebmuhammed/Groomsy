import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberUnavailabilityComponent } from './barber-unavailability.component';

describe('BarberUnavailabilityComponent', () => {
  let component: BarberUnavailabilityComponent;
  let fixture: ComponentFixture<BarberUnavailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberUnavailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberUnavailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
