import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ loginData }) =>
        this.authService.login(loginData).pipe(
          map((resp: any) => {
            if (resp?.twoFactorRequired) {
              return AuthActions.twoFARequired({
                challengeId: resp.challengeId
              });
            }
            this.notifierService.notify('success', 'Zalogowano.');
            return AuthActions.loginSuccess({ user: resp as any });
          }),
          catchError((err) => {
            const msg =
              err?.error?.code === 'A2'
                ? 'Nieprawidłowe dane.'
                : 'Błąd logowania.';
            return of(AuthActions.loginFailure({ error: msg }));
          })
        )
      )
    );
  });

  navigateTo2FA$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.twoFARequired),
        tap(() => {
          this.notifierService.notify('info', 'Wpisz kod wysłany na e-mail.');
          this.router.navigate(['/login/code']);
        })
      );
    },
    { dispatch: false }
  );

  navigateAfterLoginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  navigateAfter2FASuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.twoFAVerifySuccess),
        tap(() => {
          this.notifierService.notify('success', 'Zalogowano pomyślnie.');
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

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
              'Poprawnie utworzono konto użytkownika! Aktywuj konto na podanym adresie e-mail. Pamiętaj, żeby sprawdzić folder spam.'
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

  twoFAVerify$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.twoFAVerify),
      switchMap(({ challengeId, code }) =>
        this.authService.verifyTwoFA(challengeId, code).pipe(
          map((user) => {
            this.notifierService.notify('success', 'Zalogowano.');
            this.router.navigate(['/']);
            return AuthActions.twoFAVerifySuccess({ user: user as any });
          }),
          catchError(() =>
            of(
              AuthActions.twoFAVerifyFailure({
                error: 'Nieprawidłowy kod lub kod wygasł.'
              })
            )
          )
        )
      )
    );
  });

  toggleTwoFA$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.toggleTwoFA),
      switchMap(({ enabled }) =>
        this.authService.toggleTwoFA(enabled).pipe(
          map(() => {
            this.notifierService.notify(
              'success',
              enabled
                ? 'Włączono weryfikację dwuetapową.'
                : 'Wyłączono weryfikację dwuetapową.'
            );
            return AuthActions.toggleTwoFASuccess({ enabled });
          }),
          catchError(() =>
            of(
              AuthActions.toggleTwoFAFailure({
                error: 'Nie udało się zmienić ustawienia.'
              })
            )
          )
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {}
}
