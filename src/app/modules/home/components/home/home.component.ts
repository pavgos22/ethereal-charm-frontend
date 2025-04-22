import { Component, OnInit } from '@angular/core';
import { PrimitiveProduct } from '../../../core/models/product.model';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: PrimitiveProduct[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts(1, 100).subscribe({
      next: ({ products }) => {
        this.products = [...products];
      },
      error: (err) => {
        console.error('Error fetching products in HomeComponent:', err);
      }
    });
  }
}
