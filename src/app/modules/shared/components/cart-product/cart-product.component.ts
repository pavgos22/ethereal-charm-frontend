import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartProduct } from '../../../core/models/cart.module';
import { CartService } from '../../../core/services/cart.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent {
  @Input() cartProduct!: CartProduct;
  @Input() cartView = true;
  @Output() deleteProductUuid = new EventEmitter<string>();

  constructor(
    private cartService: CartService,
    private notifierService: NotifierService
  ) {}

  deleteProductFromCart() {
    this.cartService.deleteProductFromCart(this.cartProduct.uuid).subscribe({
      next: () => {
        this.notifierService.notify(
          'success',
          'Poprawnie usunięto produkt z koszyka.'
        );
        this.deleteProductUuid.emit(this.cartProduct.uuid);
      },
      error: (err) => {
        this.notifierService.notify(
          'warning',
          'Nie udało się usunąć produktu z koszyka. Spróbuj ponownie.'
        );
      }
    });
  }
}
