import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
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
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('menuAnimation', [
      state('void', style({ height: '0', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void <=> *', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  @ViewChild('accountLink') accountLink!: ElementRef;

  user$: Observable<User | null> = this.store.select(selectAuthUser);
  cartTotalCount$: BehaviorSubject<number> = this.cartService.totalCount$;
  isMobile = window.innerWidth < 992;
  private dropdownOpen = false;
  navbarOpen = false;

  categories$: Observable<Category[]> =
    this.categoriesService.categories.asObservable();

  constructor(
    private store: Store<AppState>,
    private categoriesService: CategoriesService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe();

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 992;
      if (!this.isMobile && this.dropdownOpen) {
        this.closeAccountDropdown();
      }
    });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  closeNavbar() {
    if (this.isMobile) {
      this.navbarOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedInsideAccount =
      this.accountLink?.nativeElement.contains(target);
    const clickedNavbarToggler = target.closest('.navbar-toggler');

    if (this.dropdownOpen && !clickedInsideAccount && !clickedNavbarToggler) {
      this.closeAccountDropdown();
    }
  }

  onProductsClick(ev: MouseEvent) {
    if (window.innerWidth >= 992) {
      ev.preventDefault();
      this.router.navigate(['/products'], {
        queryParams: { page: 1, limit: 8, sort_by: 'priority', sort: 'desc' }
      });
    }
  }

  onAccountClick(ev: MouseEvent) {
    if (this.isMobile) {
      ev.preventDefault();
      this.toggleAccountDropdown();
    }
  }

  private toggleAccountDropdown() {
    const dropdown = this.accountLink.nativeElement.nextElementSibling;
    if (dropdown.classList.contains('show')) {
      this.closeAccountDropdown();
    } else {
      this.openAccountDropdown();
    }
  }

  private openAccountDropdown() {
    const dropdown = this.accountLink.nativeElement.nextElementSibling;
    dropdown.classList.add('show');
    this.accountLink.nativeElement.setAttribute('aria-expanded', 'true');
    this.dropdownOpen = true;
  }

  private closeAccountDropdown() {
    const dropdown = this.accountLink.nativeElement.nextElementSibling;
    dropdown.classList.remove('show');
    this.accountLink.nativeElement.setAttribute('aria-expanded', 'false');
    this.dropdownOpen = false;
  }

  logout() {
    this.closeNavbar();
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
