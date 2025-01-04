import { Component } from '@angular/core';
import { FormService } from '../../../../core/services/form.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.scss']
})
export class InfoFormComponent {
  infoForm: FormGroup;

  constructor(private formService: FormService) {
    this.infoForm = this.formService.initInfoForm();
  }

  get controls() {
    return this.infoForm.controls as { [key: string]: FormControl };
  }

  getErrorMessage(control: FormControl) {
    return this.formService.getErrorMessage(control);
  }
}
