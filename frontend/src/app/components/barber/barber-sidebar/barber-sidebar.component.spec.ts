import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberSidebarComponent } from './barber-sidebar.component';

describe('BarberSidebarComponent', () => {
  let component: BarberSidebarComponent;
  let fixture: ComponentFixture<BarberSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
