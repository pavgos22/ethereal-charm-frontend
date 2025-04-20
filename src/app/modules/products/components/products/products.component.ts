import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { PrimitiveProduct } from '../../../core/models/product.model';
import { MatPaginator } from '@angular/material/paginator';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subscription,
  switchMap
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FavouriteService } from '../../../core/services/favourite.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductEditDialogComponent } from './product-edit-dialog/product-edit-dialog.component';
import { PriorityEditDialogComponent } from './priority-edit-dialog/priority-edit-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
  //encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  products: PrimitiveProduct[] = [];
  totalCount = 0;
  errorMessage: string | null = null;
  sub = new Subscription();

  searchControl = new FormControl<string>('');
  sortControl = new FormControl<string>('priority');
  orderControl = new FormControl<string>('desc');
  filteredOptions!: Observable<PrimitiveProduct[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productsService: ProductsService,
    private favouriteService: FavouriteService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.favouriteService.fetchFavourites();

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => this.productsService.getProducts(1, 10, value)),
      map(({ products }) => {
        return [...products];
      })
    );
  }

  ngAfterViewInit(): void {
    const inputs = document.querySelectorAll<
      HTMLInputElement | HTMLSelectElement
    >('.input-field');

    inputs.forEach((inp) => {
      const setActive = () => {
        if (inp.value) {
          inp.classList.add('active');
        } else {
          inp.classList.remove('active');
        }
      };

      setActive();

      inp.addEventListener('focus', () => inp.classList.add('active'));

      inp.addEventListener('blur', () => setActive());
    });

    this.route.queryParamMap
      .pipe(
        switchMap((queryMap) => {
          const pageIndex = queryMap.get('page')
            ? Number(queryMap.get('page'))
            : 1;
          const itemsPerPage = queryMap.get('limit')
            ? Number(queryMap.get('limit'))
            : this.paginator.pageSize;

          const productName = queryMap.get('name')
            ? queryMap.get('name')
            : null;

          const sortElement = queryMap.get('sort_by')
            ? queryMap.get('sort_by')
            : null;

          const order = queryMap.get('sort') ? queryMap.get('sort') : null;

          const category = queryMap.get('category')
            ? queryMap.get('category')
            : null;

          return this.productsService.getProducts(
            pageIndex,
            itemsPerPage,
            productName,
            sortElement,
            order,
            category
          );
        }),
        map(({ products, totalCount }) => {
          this.totalCount = totalCount;
          this.products = [...products];
        })
      )
      .subscribe({
        error: (err) => {
          this.errorMessage = err;
        }
      });

    this.sub.add(
      this.paginator.page.subscribe({
        next: () => {
          this.navigateToSearchedParams();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  searchProducts() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;

    this.navigateToSearchedParams();
  }

  navigateToSearchedParams() {
    const queryParams: { [key: string]: string | number } = {
      page: this.paginator.pageIndex + 1,
      limit: this.paginator.pageSize
    };

    const category = this.route.snapshot.queryParamMap.get('category');

    if (category) {
      queryParams['category'] = category;
    }

    if (this.searchControl.value) {
      queryParams['name'] = this.searchControl.value;
    }

    if (this.sortControl.value) {
      queryParams['sort_by'] = this.sortControl.value;
    }

    if (this.orderControl.value) {
      queryParams['sort'] = this.orderControl.value;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams
    });
  }

  openEditDialog(product: PrimitiveProduct): void {
    console.log('Product: ', product);
    console.log('Product uid: ', product.uid);
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
        this.refreshProducts();
      }
    });
  }

  openPriorityEditDialog(product: PrimitiveProduct): void {
    const dialogRef = this.dialog.open(PriorityEditDialogComponent, {
      width: '400px',
      data: {
        productId: product.uid,
        currentPriority: product.priority
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshProducts();
      }
    });
  }

  refreshProducts(): void {
    this.productsService.getProducts(1, 10).subscribe({
      next: ({ products, totalCount }) => {
        console.log('Products from API: ', products);
        this.products = [...products];
        this.totalCount = totalCount;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
}
