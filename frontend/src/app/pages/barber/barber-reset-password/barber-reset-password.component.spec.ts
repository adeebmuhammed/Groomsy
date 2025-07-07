import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberResetPasswordComponent } from './barber-reset-password.component';

describe('BarberResetPasswordComponent', () => {
  let component: BarberResetPasswordComponent;
  let fixture: ComponentFixture<BarberResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberResetPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
