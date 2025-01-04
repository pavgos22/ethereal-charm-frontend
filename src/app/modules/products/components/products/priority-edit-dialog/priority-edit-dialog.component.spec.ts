import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityEditDialogComponent } from './priority-edit-dialog.component';

describe('PriorityEditDialogComponent', () => {
  let component: PriorityEditDialogComponent;
  let fixture: ComponentFixture<PriorityEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
