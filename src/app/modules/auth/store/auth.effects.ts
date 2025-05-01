import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, EMPTY, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) => {
        return this.authService.login(action.loginData).pipe(
          map((user) => {
            this.router.navigate(['/']);
            this.notifierService.notify('success', 'Poprawnie zalogowano się!');
            return AuthActions.loginSuccess({ user: { ...user } });
          }),
          catchError((err) => {
            let errorMessage = 'Błąd logowania';
            if (err.error?.code === 'A2') {
              errorMessage = 'Podane dane są nieprawidłowe';
            }
            return of(
              AuthActions.loginFailure({
                error: errorMessage
              })
            );
          })
        );
      })
    );
  });

  autoLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.autoLogin),
        switchMap(() => {
          return this.authService.autoLogin().pipe(
            map((user) => {
              return AuthActions.autoLoginSuccess({ user: { ...user } });
            }),
            catchError((err) => of(AuthActions.autoLoginFailure()))
          );
        })
      );
    }
    // { dispatch: false }
  );

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => {
        return this.authService.logout().pipe(
          map(() => {
            this.router.navigate(['/login']);
            this.notifierService.notify('success', 'Wylogowano się.');
            return AuthActions.logoutSuccess();
          }),
          catchError((err) => {
            this.notifierService.notify('warning', err);
            return of(AuthActions.logoutFailure());
          })
        );
      })
    );
  });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap((action) => {
        return this.authService.register(action.registerData).pipe(
          map((user) => {
            this.router.navigate(['/login']);
            this.notifierService.notify(
              'success',
              'Poprawnie utworzono konto użytkownika! Aktywuj konto na podanym adresie e-mail.'
            );
            return AuthActions.registerSuccess();
          }),
          catchError((err) => {
            console.log(err);
            return of(AuthActions.loginFailure({ error: err }));
          })
        );
      })
    );
  });

  passwordReset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.passwordReset),
      switchMap((action) => {
        return this.authService.resetPassword({ email: action.email }).pipe(
          map(() => {
            this.notifierService.notify(
              'success',
              'Wysłano instrukcję resetu hasła na podanego maila.'
            );
            return AuthActions.passwordResetSuccess();
          }),
          catchError((err) => {
            return of(
              AuthActions.passwordResetFailure({
                error: 'Nie udało się zresetować hasła.'
              })
            );
          })
        );
      })
    );
  });

  activateAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.activateAccount),
      switchMap((action) => {
        return this.authService.activateAccount(action.uid).pipe(
          map((response) => {
            this.router.navigate(['/login']);
            this.notifierService.notify('success', response.message);
            return AuthActions.activateAccountSuccess();
          }),
          catchError((error) => {
            return of(
              AuthActions.activateAccountFailure({
                error: 'Nie udało się aktywować konta.'
              })
            );
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {}
}
