import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-delete-confirmation-dialog',
  templateUrl: './account-delete-confirmation-dialog.component.html',
  styleUrls: ['./account-delete-confirmation-dialog.component.scss']
})
export class AccountDeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AccountDeleteConfirmationDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
