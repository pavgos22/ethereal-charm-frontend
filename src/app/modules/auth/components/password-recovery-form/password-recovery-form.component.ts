import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormService } from '../../../core/services/form.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PasswordsForm } from '../../../core/models/forms.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-password-recovery-form',
  templateUrl: './password-recovery-form.component.html',
  styleUrls: ['./password-recovery-form.component.scss']
})
export class PasswordRecoveryFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  passwordsForm: FormGroup<PasswordsForm> =
    this.formService.initPasswordsForm();
  submitted = false;

  uid = '';
  errorMessage: string | null = null;

  @ViewChildren('inputFieldRef', { read: ElementRef })
  private inputs!: QueryList<ElementRef<HTMLInputElement>>;
  private listeners: (() => void)[] = [];

  constructor(
    private formService: FormService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notifier: NotifierService,
    private router: Router
  ) {}

  get controls(): PasswordsForm {
    return this.passwordsForm.controls;
  }

  getErrorMessage(ctrl: FormControl): string {
    return this.formService.getErrorMessage(ctrl);
  }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid') ?? '';
  }

  onPasswdChange(): void {
    this.submitted = true;

    if (this.passwordsForm.invalid) {
      return;
    }

    const { password } = this.passwordsForm.getRawValue();

    this.authService.changePassword({ password, uid: this.uid }).subscribe({
      next: () => {
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
            this.notifier.notify(
              'success',
              'Hasło zostało zmienione. Zaloguj się ponownie.'
            );
          },
          error: () => {
            this.router.navigate(['/login']);
            this.notifier.notify(
              'success',
              'Hasło zmienione. Zaloguj się ponownie.'
            );
          }
        });
      },
      error: (err) => {
        this.errorMessage = err;
        this.notifier.notify(
          'error',
          'Nie udało się zmienić hasła. Spróbuj ponownie.'
        );
      }
    });
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
