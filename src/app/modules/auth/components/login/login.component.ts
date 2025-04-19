import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { FormService } from '../../../core/services/form.service';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginForm } from '../../../core/models/forms.model';
import * as AuthActions from '../../store/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { Observable } from 'rxjs';
import { selectAuthError, selectAuthLoading } from '../../store/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy, AfterViewInit {
  loginForm: FormGroup<LoginForm> = this.formService.initLoginForm();

  submitted = false;

  errorMsg$: Observable<string | null> = this.store.select(selectAuthError);
  loading$: Observable<boolean> = this.store.select(selectAuthLoading);

  constructor(
    private formService: FormService,
    private store: Store<AppState>
  ) {}

  get controls() {
    return this.loginForm.controls;
  }

  getErrorMessage(control: FormControl): string {
    return this.formService.getErrorMessage(control);
  }

  onLogin(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(
      AuthActions.login({ loginData: this.loginForm.getRawValue() })
    );
  }

  ngAfterViewInit(): void {
    const inputs = document.querySelectorAll<HTMLInputElement>('.input-field');

    inputs.forEach((inp) => {
      inp.addEventListener('focus', () => {
        inp.classList.add('active');
      });

      inp.addEventListener('blur', () => {
        if (inp.value === '') {
          inp.classList.remove('active');
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(AuthActions.clearError());
  }
}
