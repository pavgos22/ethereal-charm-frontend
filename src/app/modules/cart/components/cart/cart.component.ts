import { Component, OnInit } from '@angular/core';
import { CartProduct, GetCartResponse } from '../../../core/models/cart.module';
import { CartService } from '../../../core/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  summaryPrice = 0;
  errorMessage: string | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cartService.getCartProducts().subscribe({
      next: (resp) => {
        if (resp.body !== null) {
          const cartResponse = resp.body as GetCartResponse;
          this.cartProducts = [...cartResponse.cartProducts];
          this.summaryPrice = cartResponse.summaryPrice;
        }
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  deleteProduct(uuid: string) {
    this.cartProducts = this.cartProducts.filter(
      (product) => product.uuid !== uuid
    );
  }

  navigateToCreateOrder() {
    this.router.navigate(['zamow'], {
      relativeTo: this.route,
      state: { summaryPrice: this.summaryPrice }
    });
  }
}
