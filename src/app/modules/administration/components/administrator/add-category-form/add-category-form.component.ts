import { Component } from '@angular/core';
import { FormService } from '../../../../core/services/form.service';
import { AddCategoryForm } from '../../../../core/models/forms.model';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoriesService } from '../../../../core/services/categories.service';

@Component({
  selector: 'app-add-category-form',
  templateUrl: './add-category-form.component.html',
  styleUrls: ['./add-category-form.component.scss']
})
export class AddCategoryFormComponent {
  addCategoryForm: FormGroup<AddCategoryForm> =
    this.formService.initAddCategoryForm();

  successMsg: string | null = null;
  errorMsg: string | null = null;

  constructor(
    private formService: FormService,
    private categoriesService: CategoriesService
  ) {}

  onAddCategory() {
    this.categoriesService
      .addCategory(this.addCategoryForm.getRawValue())
      .subscribe({
        next: () => {
          this.successMsg = 'Poprawnie dodano kategorię.';
        },
        error: (err) => {
          this.errorMsg = err;
        }
      });
  }

  getErrorMessage(control: FormControl) {
    return this.formService.getErrorMessage(control);
  }
}
