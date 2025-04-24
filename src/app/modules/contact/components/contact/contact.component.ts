import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  email = '';
  message = '';

  submitContactForm() {
    console.log('Email:', this.email);
    console.log('Message:', this.message);
    alert('Dziękujemy za kontakt!');
    // TODO: Backend
  }
}
