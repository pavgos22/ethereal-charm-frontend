import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AccountDeleteConfirmationDialogComponent } from './account-delete-confirmation-dialog/account-delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ResetPasswordData } from '../../../core/models/auth.model';
import { ProfileService } from '../../../core/services/profile-service.service';
import { PasswordResetConfirmationDialogComponent } from './password-reset-confirmation-dialog/password-reset-confirmation-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private notifierService: NotifierService,
    private profileService: ProfileService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  allCookies = false;
  email: string | null = null;

  ngOnInit(): void {
    const savedPreference = localStorage.getItem('allCookies');
    this.allCookies = savedPreference === 'true';

    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.email = profile?.email || null;
      },
      error: () => {
        this.notifierService.notify(
          'error',
          'Wystąpił problem z pobraniem profilu użytkownika. Zaloguj się ponownie.'
        );
      }
    });
  }

  onToggleChange(type: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (type === 'all') {
      this.allCookies = isChecked;
      localStorage.setItem('allCookies', String(isChecked));
    }

    console.log(`${type} cookies accepted:`, isChecked);
  }

  onDeactivateAccount(): void {
    const dialogRef = this.dialog.open(
      AccountDeleteConfirmationDialogComponent
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.deactivateAccount().subscribe({
          next: (response) => {
            if (response.code === 'SUCCESS') {
              this.authService.logout().subscribe({
                next: () => {
                  this.notifierService.notify(
                    'success',
                    'Twoje konto zostało skasowane.'
                  );
                  this.router.navigate(['/login']);
                },
                error: () => {
                  this.notifierService.notify(
                    'error',
                    'Wystąpił problem przy wylogowaniu. Spróbuj ponownie.'
                  );
                  this.router.navigate(['/login']);
                }
              });
            } else {
              this.notifierService.notify(
                'error',
                'Wystąpił problem przy dezaktywacji konta. Spróbuj ponownie.'
              );
            }
          },
          error: () => {
            this.notifierService.notify(
              'error',
              'Nie udało się usunąć konta. Skontaktuj się z administratorem.'
            );
          }
        });
      }
    });
  }

  onChangePassword(): void {
    if (!this.email) {
      this.notifierService.notify(
        'error',
        'Nie udało się pobrać adresu e-mail. Zaloguj się ponownie.'
      );
      return;
    }

    const dialogRef = this.dialog.open(
      PasswordResetConfirmationDialogComponent,
      {
        width: '400px',
        data: { email: this.email }
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.email) {
        const resetPasswordData: ResetPasswordData = { email: this.email };

        this.authService.resetPassword(resetPasswordData).subscribe({
          next: (response) => {
            if (response.code === 'SUCCESS') {
              this.notifierService.notify(
                'success',
                'Link do zmiany hasła został wysłany na Twój adres e-mail.'
              );
            } else {
              this.notifierService.notify(
                'error',
                'Wystąpił problem podczas wysyłania linku do zmiany hasła.'
              );
            }
          },
          error: () => {
            this.notifierService.notify(
              'error',
              'Nie udało się wysłać linku do zmiany hasła. Skontaktuj się z administratorem.'
            );
          }
        });
      }
    });
  }
}
