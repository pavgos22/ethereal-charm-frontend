import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../../../core/services/form.service';
import { ProductsService } from '../../../../core/services/products.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-priority-edit-dialog',
  templateUrl: './priority-edit-dialog.component.html',
  styleUrls: ['./priority-edit-dialog.component.scss']
})
export class PriorityEditDialogComponent {
  @Input() productId!: string;
  @Input() currentPriority!: number;
  @Output() close = new EventEmitter<void>();
  @Output() productUpdated = new EventEmitter<void>();

  editForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formService: FormService,
    private productService: ProductsService,
    private dialogRef: MatDialogRef<PriorityEditDialogComponent>
  ) {
    this.editForm = this.formService.initPriorityEditForm();
  }

  ngOnInit() {
    this.editForm.patchValue({
      priority: this.data.currentPriority
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const formData = this.editForm.value;
      this.productService
        .updatePriority(this.data.productId, formData.priority)
        .subscribe({
          next: () => {
            this.productUpdated.emit();
            this.closeDialog();
          },
          error: (err) => {
            console.log(`Calling /priority with data:`, {
              uuid: this.data.productId,
              priority: this.editForm.value.priority
            });
          }
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
