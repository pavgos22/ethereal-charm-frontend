import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrimitiveProduct } from '../../../../core/models/product.model';
import { FavouriteService } from '../../../../core/services/favourite.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../../core/models/auth.model';
import { selectAuthUser } from '../../../../auth/store/auth.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/app.reducer';
import { PriorityEditDialogComponent } from '../priority-edit-dialog/priority-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../../../../core/services/cart.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product!: PrimitiveProduct;
  @Output() editProduct = new EventEmitter<PrimitiveProduct>();
  isFavourite = false;
  isEditDialogOpen = false;
  user$: Observable<User | null> = this.store.select(selectAuthUser);

  constructor(
    private store: Store<AppState>,
    private favouriteService: FavouriteService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private cartService: CartService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    this.favouriteService.favourites$.subscribe((favourites) => {
      this.isFavourite = favourites.some((fav) => fav.uid === this.product.uid);
    });
  }

  previewProduct(event: Event) {
    event.stopPropagation();
    this.router.navigateByUrl(this.getProductDetailsUrl());
  }

  addToCart(event: Event) {
    event.stopPropagation();

    const body = {
      product: this.product.uid,
      quantity: 1
    };

    this.cartService.addProductToCart(body).subscribe({
      next: () => {
        this.notifierService.notify('success', 'Produkt dodany do koszyka!');
      },
      error: () => {
        this.notifierService.notify(
          'warning',
          'Nie udało się dodać produktu do koszyka.'
        );
      }
    });
  }

  toggleFavourite(event: Event) {
    event.stopPropagation();

    this.authService.isLoggedIn().subscribe({
      next: (response) => {
        if (response.message) {
          this.favouriteService.updateFavouritesLocally(this.product.uid);
          this.favouriteService.toggleFavourite(this.product.uid).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            next: () => {},
            error: (err) => {
              console.error('Error toggling favourite:', err);
              console.log('Current product:', this.product);
            }
          });
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Error checking login status:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  getProductDetailsUrl() {
    return `/products/${this.product.name}-${this.product.createAt.replaceAll(
      '-',
      ''
    )}`;
  }

  openEditDialog(event: Event) {
    event.stopPropagation();
    this.editProduct.emit(this.product);
  }

  closeEditDialog() {
    this.isEditDialogOpen = false;
  }

  openPriorityEditDialog(event: Event) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(PriorityEditDialogComponent, {
      width: '400px',
      data: {
        productId: this.product.uid,
        currentPriority: this.product.priority
      }
    });
  }
  onProductUpdated() {
    console.log('Product updated');
    this.closeEditDialog();
  }

  isAdmin(role: string) {
    return role === 'ADMIN';
  }
}
