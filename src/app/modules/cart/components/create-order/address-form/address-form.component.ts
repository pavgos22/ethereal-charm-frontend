import { Component } from '@angular/core';
import { FormService } from '../../../../core/services/form.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent {
  addressForm = this.formService.initAddressForm();
  constructor(private formService: FormService) {}

  get controls() {
    return this.addressForm.controls;
  }

  getErrorMessage(control: FormControl) {
    return this.formService.getErrorMessage(control);
  }
}
