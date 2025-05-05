import { Component, OnInit } from '@angular/core';
import { PrimitiveProduct } from '../../../core/models/product.model';
import { ProductsService } from '../../../core/services/products.service';

const CATEGORY_IDS = {
  naszyjniki: '3b2cc0253e59',
  bransoletki: '6f1d02c86878',
  pierscionki: '7a3af5263a1d'
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
