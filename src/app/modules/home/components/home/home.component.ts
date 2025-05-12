import { Component, OnInit } from '@angular/core';
import { PrimitiveProduct } from '../../../core/models/product.model';
import { ProductsService } from '../../../core/services/products.service';

const CATEGORY_IDS = {
  naszyjniki: '69d0414db921',
  kolczyki: '4d2d8f831e36',
  pierscionki: '7f043dd63c99'
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
