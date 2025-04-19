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

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements AfterViewInit, OnDestroy {
  /* ---------- formularz ---------- */
  passwdRecoveryForm: FormGroup<PasswdRecoveryForm> =
    this.formService.initPasswdRecoveryForm();
  submitted = false;

  /* ---------- komunikaty ---------- */
  errorMessage: string | null = null;

  /* ---------- refs do inputów ---------- */
  @ViewChildren('inputFieldRef', { read: ElementRef })
  private inputs!: QueryList<ElementRef<HTMLInputElement>>;
  private listeners: (() => void)[] = [];

  constructor(
    private formService: FormService,
    private authService: AuthService,
    private notifier: NotifierService
  ) {}

  /* --- getter do pola e‑mail w template --- */
  get controls(): PasswdRecoveryForm {
    return this.passwdRecoveryForm.controls;
  }

  getErrorMessage(ctrl: FormControl): string {
    return this.formService.getErrorMessage(ctrl);
  }

  /* ---------- SUBMIT ---------- */
  onPasswdRecovery(): void {
    this.submitted = true;

    /* nie wysyłaj, jeśli formularz niepoprawny */
    if (this.passwdRecoveryForm.invalid) {
      return;
    }

    this.authService
      .resetPassword(this.passwdRecoveryForm.getRawValue())
      .subscribe({
        next: () => {
          this.notifier.notify(
            'success',
            'Jeśli podano prawidłowego e‑maila, wysłaliśmy instrukcję resetu.'
          );
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
  }

  /* ---------- focus / blur ---------- */
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

  /* ---------- cleanup ---------- */
  ngOnDestroy(): void {
    this.listeners.forEach((off) => off());
  }
}
