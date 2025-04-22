import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  newsletterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  subscribeToNewsletter(): void {
    if (this.newsletterForm.valid) {
      const email = this.newsletterForm.value.email;
      console.log('Subskrybujesz e-mail:', email);
      // TODO: backend
      this.newsletterForm.reset();
    }
  }
}
