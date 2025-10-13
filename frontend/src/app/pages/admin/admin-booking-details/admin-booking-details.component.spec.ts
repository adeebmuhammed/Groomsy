import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingDetailsComponent } from './admin-booking-details.component';

describe('AdminBookingDetailsComponent', () => {
  let component: AdminBookingDetailsComponent;
  let fixture: ComponentFixture<AdminBookingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
