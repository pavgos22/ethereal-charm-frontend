import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import * as AuthActions from '../../../auth/store/auth.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/auth.model';
import { selectAuthUser } from '../../../auth/store/auth.selectors';
import { Category } from '../../models/categories.model';
import { CategoriesService } from '../../services/categories.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<User | null> = this.store.select(selectAuthUser);
  cartTotalCount$: BehaviorSubject<number> = this.cartService.totalCount$;

  categories: Category[] = [
    { name: 'meble', shortId: 12345678 },
    { name: 'kuchenne', shortId: 22345678 }
  ];

  constructor(
    private store: Store<AppState>,
    private categoriesService: CategoriesService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories = [...categories];
      }
    });
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  navigateToCategory(category: Category) {
    this.router.navigate(['/products'], {
      queryParams: {
        category: category.shortId
      }
    });
  }

  isAdmin(role: string) {
    return role === 'ADMIN';
  }
}
