import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-reset-confirmation-dialog',
  templateUrl: './password-reset-confirmation-dialog.component.html',
  styleUrls: ['./password-reset-confirmation-dialog.component.scss']
})
export class PasswordResetConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PasswordResetConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
