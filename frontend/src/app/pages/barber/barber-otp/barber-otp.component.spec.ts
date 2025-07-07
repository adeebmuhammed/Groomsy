import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberOtpComponent } from './barber-otp.component';

describe('BarberOtpComponent', () => {
  let component: BarberOtpComponent;
  let fixture: ComponentFixture<BarberOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
