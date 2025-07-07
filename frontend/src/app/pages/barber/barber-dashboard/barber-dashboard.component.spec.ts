import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberDashboardComponent } from './barber-dashboard.component';

describe('BarberDashboardComponent', () => {
  let component: BarberDashboardComponent;
  let fixture: ComponentFixture<BarberDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
