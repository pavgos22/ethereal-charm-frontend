import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerForm } from '../../../../core/models/forms.model';
import { FormService } from '../../../../core/services/form.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent {
  @Input() customerForm: FormGroup<CustomerForm> =
    this.formService.initCustomerForm();

  constructor(private formService: FormService) {}

  get controls() {
    return this.customerForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this.formService.getErrorMessage(control);
  }
}
