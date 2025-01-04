import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../../core/services/form.service';
import { ProfileService } from '../../../core/services/profile-service.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  errorMsg: string | null = null;

  constructor(
    private formService: FormService,
    private profileService: ProfileService,
    private notifierService: NotifierService
  ) {
    this.profileForm = this.formService.initProfileForm();
  }

  get controls() {
    return this.profileForm.controls as {
      [key: string]: FormControl;
    };
  }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe({
      next: (userData) => {
        console.log('Fetched user data:', userData);

        this.profileForm.patchValue({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          city: userData.city || '',
          street: userData.street || '',
          number: userData.number || '',
          postCode: userData.postCode || '',
          company: userData.company || false,
          companyName: userData.company ? userData.companyName || '' : '',
          nip: userData.company ? userData.nip || '' : ''
        });

        this.toggleCompanyFields(userData.company || false);
      },
      error: (err) => {
        this.errorMsg = 'Nie udało się pobrać danych użytkownika.';
        console.error('Error fetching user profile:', err);
      }
    });

    this.controls['company'].valueChanges.subscribe((company) => {
      this.toggleCompanyFields(company);
    });
  }

  private toggleCompanyFields(company: boolean): void {
    if (company) {
      this.controls['companyName'].enable();
      this.controls['nip'].enable();
    } else {
      this.controls['companyName'].disable();
      this.controls['nip'].disable();
      this.controls['companyName'].setValue('');
      this.controls['nip'].setValue('');
    }
  }

  getErrorMessage(control: any): string {
    return this.formService.getErrorMessage(control);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const profileDetails = this.profileForm.value;

      /* Object.keys(this.profileForm.controls).forEach((key) => {
         console.log(
           `Control: ${key}, Value: ${this.profileForm.get(key)?.value}, Valid: ${this.profileForm.get(key)?.valid}`
         );
       }); */

      console.log('Profile details being sent:', profileDetails);

      this.profileService.updateShippingDetails(profileDetails).subscribe({
        next: () => {
          this.notifierService.notify(
            'success',
            'Profil zaktualizowany pomyślnie.'
          );
          console.log('Profile updated successfully.');
        },
        error: (err) => {
          this.errorMsg = 'Nie udało się zaktualizować profilu.';
          console.error('Error updating profile:', err);
        }
      });
    } else {
      console.warn('Formularz jest nieprawidłowy.');
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        if (control && control.invalid) {
          console.warn(
            `Invalid Control: ${key}, Errors: ${JSON.stringify(control.errors)}`
          );
        }
      });
    }
  }
}
