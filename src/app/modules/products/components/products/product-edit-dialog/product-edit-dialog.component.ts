import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../../../core/services/form.service';
import { ProductsService } from '../../../../core/services/products.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-edit-dialog',
  templateUrl: './product-edit-dialog.component.html',
  styleUrls: ['./product-edit-dialog.component.scss']
})
export class ProductEditDialogComponent {
  @Input() productId!: string;
  @Input() currentPrice!: number;
  @Input() currentDiscount!: boolean;
  @Input() currentDiscountedPrice!: number;
  @Output() close = new EventEmitter<void>();
  @Output() productUpdated = new EventEmitter<void>();

  editForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formService: FormService,
    private productService: ProductsService,
    private dialogRef: MatDialogRef<ProductEditDialogComponent>
  ) {
    this.editForm = this.formService.initEditProductForm();
    //console.log('Product id: ' + this.data.productId);
  }

  ngOnInit() {
    this.editForm.patchValue({
      price: this.data.currentPrice,
      discount: this.data.currentDiscount,
      discountedPrice: this.data.currentDiscountedPrice
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const formData = this.editForm.value;
      console.log('Product id in onSubmit() ' + this.data.productId);
      this.productService
        .updateProduct(this.data.productId, formData)
        .subscribe(() => {
          this.productUpdated.emit();
          this.closeDialog();
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
