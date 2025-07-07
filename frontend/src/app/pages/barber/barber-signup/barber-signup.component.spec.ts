import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberSignupComponent } from './barber-signup.component';

describe('BarberSignupComponent', () => {
  let component: BarberSignupComponent;
  let fixture: ComponentFixture<BarberSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
