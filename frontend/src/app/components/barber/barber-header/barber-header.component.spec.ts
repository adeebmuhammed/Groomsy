import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberHeaderComponent } from './barber-header.component';

describe('BarberHeaderComponent', () => {
  let component: BarberHeaderComponent;
  let fixture: ComponentFixture<BarberHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
