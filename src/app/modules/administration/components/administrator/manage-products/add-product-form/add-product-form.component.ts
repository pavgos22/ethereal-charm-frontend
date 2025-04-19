import { Component } from '@angular/core';
import { ImageService } from '../../../../../core/services/image.service';
import { Image } from '../../../../../core/models/image.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostProduct } from '../../../../../core/models/forms.model';
import { FormService } from '../../../../../core/services/form.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../../../../../core/models/categories.model';
import { AddProductData } from '../../../../../core/models/product.model';
import { ProductsService } from '../../../../../core/services/products.service';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.scss']
})
export class AddProductFormComponent {
  config: AngularEditorConfig = this.imageService.config;

  selectedFile: File | null = null;
  fileName = '';

  imageUrls: Image[] = [];
  errorImageUploadMsg: string | null = null;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  categories: BehaviorSubject<Category[]> = this.categoriesService.categories;

  addProductForm: FormGroup<PostProduct> =
    this.formService.initAddProductForm();

  constructor(
    private imageService: ImageService,
    private formService: FormService,
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
    }
  }

  uploadFile() {
    this.errorImageUploadMsg = null;
    if (this.selectedFile) {
      console.log('Selected file:', this.selectedFile);
      const formData = new FormData();
      formData.append('multipartFile', this.selectedFile);

      this.imageService.addImage(formData).subscribe({
        next: (response) => {
          //http://localhost:8888/api/v1/image?uuid=d2c190cc-8946-474e-9967-419380e8c697
          this.imageUrls = [...this.imageUrls, { ...response }];
        },
        error: (err) => {
          this.errorImageUploadMsg = err;
        }
      });
    }
  }

  setActiveImageUrls(imageArr: Image[]) {
    this.imageUrls = [...imageArr];
  }

  get controls() {
    return this.addProductForm.controls;
  }

  get parameters(): FormArray<
    FormGroup<{ value: FormControl<string>; key: FormControl<string> }>
  > {
    return this.addProductForm.controls.parameters;
  }

  getErrorMessage(control: FormControl<string>) {
    return this.formService.getErrorMessage(control);
  }

  addProduct() {
    const formValue = this.addProductForm.getRawValue();
    const parametersObject: { [key: string]: string } = {};

    formValue.parameters.forEach((item) => {
      parametersObject[item.key] = item.value;
    });

    const parameters = `${JSON.stringify(parametersObject)}`;

    const imagesUuid = this.imageUrls.map((url) => {
      const [, uuid] = url.url.split('uuid=');
      return uuid;
    });

    const addProductData: AddProductData = {
      ...formValue,
      price: Number(formValue.price),
      parameters,
      imagesUuid
    };

    this.productsService.addProduct(addProductData).subscribe({
      next: () => {
        this.addProductForm.reset();
        this.imageUrls = [];
        this.successMessage = 'Poprawnie dodano produkt do sklepu.';
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  deleteParameter(i: number) {
    this.parameters.removeAt(i);
  }

  addParameter() {
    const newGroup = new FormGroup({
      key: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      value: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    });

    this.parameters.push(newGroup);
  }
}
