import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../../../core/services/form.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent {
  companyForm: FormGroup;

  constructor(private formService: FormService) {
    this.companyForm = this.formService.initCompanyForm();
  }

  get controls() {
    return this.companyForm.controls as { [key: string]: FormControl };
  }

  getErrorMessage(control: FormControl): string {
    return this.formService.getErrorMessage(control);
  }
}
