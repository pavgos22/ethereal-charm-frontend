import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducer';
import * as AuthActions from '../app/modules/auth/store/auth.actions';
import { CartService } from './modules/core/services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ethereal-charm';

  constructor(
    private store: Store<AppState>,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.autoLogin());

    this.cartService.getCartProducts().subscribe({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      error: () => {}
    });
  }
}
