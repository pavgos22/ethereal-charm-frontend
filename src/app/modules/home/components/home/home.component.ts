import { Component, OnInit } from '@angular/core';
import { PrimitiveProduct } from '../../../core/models/product.model';
import { ProductsService } from '../../../core/services/products.service';

const CATEGORY_IDS = {
  naszyjniki: '59c47a435e5a',
  bransoletki: '7637a3d2050d',
  pierscionki: 'cf873d7ea0bf'
} as const;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  readonly categoryIds = CATEGORY_IDS;
  products: PrimitiveProduct[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts(1, 100).subscribe({
      next: ({ products }) => {
        this.products = products.filter((product) => product.discount);
      },
      error: (err) => {
        console.error('Error fetching products in HomeComponent:', err);
      }
    });
  }
}
