import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBarberComponent } from './user-barber.component';

describe('UserBarberComponent', () => {
  let component: UserBarberComponent;
  let fixture: ComponentFixture<UserBarberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBarberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBarberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
