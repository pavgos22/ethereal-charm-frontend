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
  showPassword = false;

  errorMsg$: Observable<string | null> = this.store.select(selectAuthError);
  loading$: Observable<boolean> = this.store.select(selectAuthLoading);

  private dispose: (() => void)[] = [];

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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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

  ngAfterViewInit() {
    document
      .querySelectorAll<HTMLInputElement>('.input-field')
      .forEach((inp) => {
        const onF = () => inp.classList.add('active');
        const onB = () => inp.value === '' && inp.classList.remove('active');
        inp.addEventListener('focus', onF);
        inp.addEventListener('blur', onB);

        this.dispose.push(() => {
          inp.removeEventListener('focus', onF);
          inp.removeEventListener('blur', onB);
        });
      });
  }

  ngOnDestroy() {
    this.dispose.forEach((fn) => fn());
    this.store.dispatch(AuthActions.clearError());
  }
}
