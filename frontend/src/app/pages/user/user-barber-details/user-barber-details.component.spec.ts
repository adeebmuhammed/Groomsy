import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBarberDetailsComponent } from './user-barber-details.component';

describe('UserBarberDetailsComponent', () => {
  let component: UserBarberDetailsComponent;
  let fixture: ComponentFixture<UserBarberDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBarberDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBarberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
