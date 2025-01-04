import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetConfirmationDialogComponent } from './password-reset-confirmation-dialog.component';

describe('PasswordResetConfirmationDialogComponent', () => {
  let component: PasswordResetConfirmationDialogComponent;
  let fixture: ComponentFixture<PasswordResetConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetConfirmationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordResetConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
