import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberSigninComponent } from './barber-signin.component';

describe('BarberSigninComponent', () => {
  let component: BarberSigninComponent;
  let fixture: ComponentFixture<BarberSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberSigninComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
