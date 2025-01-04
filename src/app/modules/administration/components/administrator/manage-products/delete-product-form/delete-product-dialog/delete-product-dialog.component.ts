import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from '../../../../../../core/services/products.service';
import { Product } from '../../../../../../core/models/product.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-delete-product-dialog',
  templateUrl: './delete-product-dialog.component.html',
  styleUrls: ['./delete-product-dialog.component.scss']
})
export class DeleteProductDialogComponent implements OnInit {
  product: Product | null = null;
  errorMessage: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { name: string; date: string },
    private productsService: ProductsService,
    private dialogRef: MatDialogRef<DeleteProductDialogComponent>,
    private notifierService: NotifierService
  ) {}
  ngOnInit(): void {
    this.productsService.getProduct(this.data.name, this.data.date).subscribe({
      next: (product) => {
        this.product = { ...product };
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  deleteProduct() {
    if (this.product) {
      this.productsService.deleteProduct(this.product.uid).subscribe({
        next: () => {
          this.notifierService.notify('success', 'Poprawnie usunięto produkt.');
          this.dialogRef.close();
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }
}
