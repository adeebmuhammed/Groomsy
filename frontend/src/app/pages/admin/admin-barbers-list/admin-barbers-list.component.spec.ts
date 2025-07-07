import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBarbersListComponent } from './admin-barbers-list.component';

describe('AdminBarbersListComponent', () => {
  let component: AdminBarbersListComponent;
  let fixture: ComponentFixture<AdminBarbersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBarbersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBarbersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
