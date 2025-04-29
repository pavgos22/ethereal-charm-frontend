import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OrdersService } from '../../core/services/orders.service';
import { Router } from '@angular/router';
import * as OrderActions from './order.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class OrderEffects {
  createOrder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrderActions.createOrder),
      switchMap(({ orderData }) =>
        this.ordersService.addOrder(orderData).pipe(
          map(() => {
            this.notifier.notify('success', 'Zamówienie zostało złożone!');
            this.router.navigate(['/order-confirmation']);
            return OrderActions.createOrderSuccess();
          }),
          catchError((err) =>
            of(
              OrderActions.createOrderFailure({
                error: 'Nie udało się złożyć zamówienia.'
              })
            )
          )
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private ordersService: OrdersService,
    private notifier: NotifierService,
    private router: Router
  ) {}
}
