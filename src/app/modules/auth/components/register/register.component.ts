import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormService } from '../../../core/services/form.service';
import { FormControl, FormGroup } from '@angular/forms';
import { RegisterForm } from '../../../core/models/forms.model';
import * as AuthActions from '../../store/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { Observable } from 'rxjs';
import { selectAuthError, selectAuthLoading } from '../../store/auth.selectors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  registerForm: FormGroup<RegisterForm> = this.formService.initRegisterForm();
  notMatchingPasswordsErr: string | null = null;
  submitted = false;
  showPassword = false;
  showRepeatedPassword = false;

  errorMsg$: Observable<string | null> = this.store.select(selectAuthError);
  loading$: Observable<boolean> = this.store.select(selectAuthLoading);

  @ViewChildren('inputFieldRef', { read: ElementRef })
  private inputs!: QueryList<ElementRef<HTMLInputElement>>;

  private listeners: (() => void)[] = [];

  constructor(
    private formService: FormService,
    private store: Store<AppState>
  ) {}

  get controls(): RegisterForm {
    return this.registerForm.controls;
  }

  getErrorMessage(control: FormControl): string {
    return this.formService.getErrorMessage(control);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleRepeatedPasswordVisibility(): void {
    this.showRepeatedPassword = !this.showRepeatedPassword;
  }

  onRegister(): void {
    this.submitted = true;

    const { login, email, password, repeatedPassword } =
      this.registerForm.getRawValue();

    if (password !== repeatedPassword) {
      this.notMatchingPasswordsErr = 'Hasła nie mogą być różne.';
      return;
    }

    this.store.dispatch(
      AuthActions.register({ registerData: { login, email, password } })
    );
  }

  ngAfterViewInit(): void {
    this.inputs.forEach((inputEl) => {
      const native = inputEl.nativeElement;

      const onFocus = () => native.classList.add('active');
      const onBlur = () => {
        if (native.value === '') native.classList.remove('active');
      };

      native.addEventListener('focus', onFocus);
      native.addEventListener('blur', onBlur);

      this.listeners.push(() => {
        native.removeEventListener('focus', onFocus);
        native.removeEventListener('blur', onBlur);
      });
    });
  }

  ngOnDestroy(): void {
    this.listeners.forEach((off) => off());
    this.store.dispatch(AuthActions.clearError());
  }
}
