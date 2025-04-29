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
import { PasswdRecoveryForm } from '../../../core/models/forms.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { selectAuthLoading } from '../../store/auth.selectors';
import * as AuthActions from '../../store/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements AfterViewInit, OnDestroy {
  passwdRecoveryForm: FormGroup<PasswdRecoveryForm> =
    this.formService.initPasswdRecoveryForm();
  submitted = false;
  loading$: Observable<boolean> = this.store.select(selectAuthLoading);

  errorMessage: string | null = null;

  @ViewChildren('inputFieldRef', { read: ElementRef })
  private inputs!: QueryList<ElementRef<HTMLInputElement>>;
  private listeners: (() => void)[] = [];

  constructor(
    private formService: FormService,
    private authService: AuthService,
    private notifier: NotifierService,
    private store: Store<AppState>
  ) {}

  get controls(): PasswdRecoveryForm {
    return this.passwdRecoveryForm.controls;
  }

  getErrorMessage(ctrl: FormControl): string {
    return this.formService.getErrorMessage(ctrl);
  }

  onPasswdRecovery(): void {
    this.submitted = true;

    if (this.passwdRecoveryForm.invalid) {
      return;
    }

    this.store.dispatch(
      AuthActions.passwordReset({
        email: this.passwdRecoveryForm.getRawValue().email
      })
    );
  }

  ngAfterViewInit(): void {
    this.inputs.forEach((el) => {
      const native = el.nativeElement;
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
  }
}
