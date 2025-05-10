import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier'; // zakładamy, że używasz angular-notifier

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  newsletterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  subscribeToNewsletter(): void {
    if (this.newsletterForm.invalid) {
      this.notifierService.notify('error', 'Niepoprawny adres e-mail');
      return;
    }

    const email = this.newsletterForm.value.email;
    const storedEmails = JSON.parse(
      localStorage.getItem('newsletterEmails') || '[]'
    );

    if (storedEmails.includes(email)) {
      this.notifierService.notify('warning', 'Ten e-mail jest już zapisany');
    } else {
      storedEmails.push(email);
      localStorage.setItem('newsletterEmails', JSON.stringify(storedEmails));
      this.notifierService.notify(
        'success',
        'Dziękujemy za zapis do newslettera!'
      );
    }
    //TODO: Backend
    this.newsletterForm.reset();
  }
}
