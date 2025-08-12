import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBookingConfirmationComponent } from './user-booking-confirmation.component';

describe('UserBookingConfirmationComponent', () => {
  let component: UserBookingConfirmationComponent;
  let fixture: ComponentFixture<UserBookingConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBookingConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBookingConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
