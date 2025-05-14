import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducer';
import * as AuthActions from '../app/modules/auth/store/auth.actions';
import { CartService } from './modules/core/services/cart.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Location, PopStateEvent, ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';

declare let bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ethereal-charm';

  private lastPoppedUrl: string | undefined;
  private yScrollStack: number[] = [];

  constructor(
    private store: Store<AppState>,
    private cartService: CartService,
    private router: Router,
    private location: Location,
    viewport: ViewportScroller
  ) {
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => viewport.scrollToPosition([0, 0]));
      });
  }

  ngAfterViewInit(): void {
    const collapseElement = document.getElementById('navbarNav');
    const toggleButton = document.querySelector('.navbar-toggler');

    if (collapseElement && toggleButton) {
      const bsCollapse = new bootstrap.Collapse(collapseElement, {
        toggle: false
      });

      toggleButton.addEventListener('click', () => {
        bsCollapse.toggle();
      });
    }
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.autoLogin());

    this.cartService.getCartProducts().subscribe({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      error: () => {}
    });

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
  }
}
