import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { CartService } from '../../../../core/services/cart.service';
import { PostCartBody } from '../../../../core/models/cart.module';
import { NotifierService } from 'angular-notifier';
import { CategoriesService } from '../../../../core/services/categories.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  quantityControl = new FormControl(1);
  product: Product | null = null;
  htmlContent: null | SafeHtml = null;
  parameters: { [key: string]: string } | null = null;
  categoryName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private sanitizer: DomSanitizer,
    private cartService: CartService,
    private notifierService: NotifierService,
    private categoriesService: CategoriesService
  ) {}
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((paramMap) => {
          const [name, date] = (paramMap.get('id') as string).split('-');
          return this.productsService.getProduct(name, date);
        })
      )
      .subscribe({
        next: (product) => {
          this.product = { ...product };
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(
            product.descHtml
          );
          this.parameters = product.parameters;

          this.categoriesService.getCategories().subscribe((categories) => {
            const found = categories.find(
              (cat) => String(cat.shortId) === product.categoryDTO.shortId
            );
            this.categoryName = found ? found.name : 'Unknown';
          });
        },
        error: (err) => {
          console.error('Error fetching product details:', err);
        }
      });
  }

  logParameter(parameter: { key: string; value: string }) {
    if (!parameter || !parameter.key || !parameter.value) {
      console.log('Parameter is null:', parameter);
      return;
    }
    console.log(`Key: ${parameter.key}, Value: ${parameter.value}`);
  }

  addToCart() {
    console.log(this.quantityControl.value);
    const body: PostCartBody = {
      product: this.product!.uid,
      quantity: Number(this.quantityControl.value)
    };
    this.cartService.addProductToCart(body).subscribe({
      next: () => {
        this.notifierService.notify(
          'success',
          'Poprawnie dodano produkty do koszyka.'
        );
      },
      error: () => {
        this.notifierService.notify(
          'warning',
          'Nie udało się dodać produktu do koszyka. Spróbuj ponownie.'
        );
      }
    });
  }
}
