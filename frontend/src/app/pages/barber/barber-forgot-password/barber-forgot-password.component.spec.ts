import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberForgotPasswordComponent } from './barber-forgot-password.component';

describe('BarberForgotPasswordComponent', () => {
  let component: BarberForgotPasswordComponent;
  let fixture: ComponentFixture<BarberForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
