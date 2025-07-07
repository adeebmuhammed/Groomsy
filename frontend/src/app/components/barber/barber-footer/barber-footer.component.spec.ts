import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberFooterComponent } from './barber-footer.component';

describe('BarberFooterComponent', () => {
  let component: BarberFooterComponent;
  let fixture: ComponentFixture<BarberFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
