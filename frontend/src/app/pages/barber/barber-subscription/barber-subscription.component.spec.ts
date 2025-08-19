import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberSubscriptionComponent } from './barber-subscription.component';

describe('BarberSubscriptionComponent', () => {
  let component: BarberSubscriptionComponent;
  let fixture: ComponentFixture<BarberSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberSubscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
