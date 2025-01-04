import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimitiveProduct } from '../../../core/models/product.model';
import { FavouriteService } from '../../../core/services/favourite.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductEditDialogComponent } from '../../../products/components/products/product-edit-dialog/product-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit, OnDestroy {
  favouriteProducts: PrimitiveProduct[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private favouriteService: FavouriteService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.favouriteService.fetchFavourites();

    this.favouriteService.favourites$
      .pipe(takeUntil(this.destroy$))
      .subscribe((products) => {
        this.favouriteProducts = products;
      });
  }

  openEditDialog(product: PrimitiveProduct): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '400px',
      data: {
        productId: product.uid,
        currentPrice: product.price,
        currentDiscount: product.discount,
        currentDiscountedPrice: product.discountedPrice
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Product updated');
        this.refreshFavourites();
      }
    });
  }

  refreshFavourites(): void {
    this.favouriteService.fetchFavourites();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
