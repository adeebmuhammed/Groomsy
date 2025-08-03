import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotTableModalComponent } from './slot-table-modal.component';

describe('SlotTableModalComponent', () => {
  let component: SlotTableModalComponent;
  let fixture: ComponentFixture<SlotTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotTableModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
