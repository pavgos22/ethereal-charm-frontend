import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../core/services/form.service';
import { PasswordsForm } from '../../../core/models/forms.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-password-recovery-form',
  templateUrl: './password-recovery-form.component.html',
  styleUrls: ['./password-recovery-form.component.scss']
})
export class PasswordRecoveryFormComponent implements OnInit {
  passwordsForm: FormGroup<PasswordsForm> =
    this.formService.initPasswordsForm();

  uid = '';
  errorMessage: null | string = null;

  get controls(): PasswordsForm {
    return this.passwordsForm.controls;
  }

  constructor(
    private formService: FormService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notifierService: NotifierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (param) => {
        this.uid = param.get('uid') as string;
      }
    });
  }

  getErrorMessage(control: FormControl<string>): string {
    return this.formService.getErrorMessage(control);
  }

  onPasswdChange(): void {
    const { password } = this.passwordsForm.getRawValue();

    this.authService.changePassword({ password, uid: this.uid }).subscribe({
      next: () => {
        this.authService.isLoggedIn().subscribe({
          next: (response) => {
            if (response.message) {
              this.authService.logout().subscribe({
                next: () => {
                  this.router.navigate(['/login']);
                  this.notifierService.notify(
                    'success',
                    'Poprawnie zmieniono hasło. Możesz się zalogować.'
                  );
                },
                error: () => {
                  this.router.navigate(['/login']);
                  this.notifierService.notify(
                    'error',
                    'Hasło zostało zmienione, ale wystąpił problem z wylogowaniem. Zaloguj się ponownie.'
                  );
                }
              });
            } else {
              this.router.navigate(['/login']);
              this.notifierService.notify(
                'success',
                'Poprawnie zmieniono hasło. Możesz się zalogować.'
              );
            }
          },
          error: () => {
            this.router.navigate(['/login']);
            this.notifierService.notify(
              'error',
              'Hasło zostało zmienione, zaloguj się ponownie!'
            );
          }
        });
      },
      error: (err) => {
        this.errorMessage = err;
        this.notifierService.notify(
          'error',
          'Wystąpił problem podczas zmiany hasła. Spróbuj ponownie.'
        );
      }
    });
  }
}
