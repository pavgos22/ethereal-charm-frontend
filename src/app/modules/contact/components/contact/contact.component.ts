import { Component } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  email = '';
  message = '';

  constructor(private notifierService: NotifierService) {}

  submitContactForm(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email)) {
      this.notifierService.notify('error', 'Niepoprawny adres e-mail');
      return;
    }

    if (!this.message.trim()) {
      this.notifierService.notify('warning', 'Wiadomość nie może być pusta');
      return;
    }

    // TODO: Backend
    this.notifierService.notify('success', 'Dziękujemy za wiadomość!');
    this.message = '';
  }
}
