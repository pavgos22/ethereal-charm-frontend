import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducer';
import * as AuthActions from '../app/modules/auth/store/auth.actions';
import { CartService } from './modules/core/services/cart.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ethereal-charm';

  private lastPoppedUrl: string | undefined;
  private yScrollStack: number[] = [];

  constructor(
    private store: Store<AppState>,
    private cartService: CartService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.autoLogin());

    this.cartService.getCartProducts().subscribe({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      error: () => {}
    });

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });

    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationStart) {
        if (ev.url !== this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (ev instanceof NavigationEnd) {
        if (ev.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop() ?? 0);
        } else {
          window.scrollTo(0, 0);
        }
      }
    });
  }
}
