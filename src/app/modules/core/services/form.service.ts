import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AddCategoryForm,
  AddressForm,
  CustomerForm,
  DeliveryForm,
  LoginForm,
  PasswdRecoveryForm,
  PasswordsForm,
  PostProduct,
  RegisterForm
} from '../models/forms.model';
import { equivalentValidator } from '../../shared/validators/equivalent.validator';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  initAddCategoryForm(): FormGroup<AddCategoryForm> {
    return new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    });
  }

  initAddProductForm(): FormGroup<PostProduct> {
    return new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      mainDesc: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      descHtml: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      price: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      category: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      parameters: new FormArray([
        new FormGroup({
          key: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          value: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          })
        })
      ])
    });
  }
  initPasswdRecoveryForm(): FormGroup<PasswdRecoveryForm> {
    return new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      })
    });
  }

  initCustomerForm(): FormGroup<CustomerForm> {
    return new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      lastName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      phone: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(14),
          Validators.pattern(/^\+?\d+$/)
        ],
        nonNullable: true
      })
    });
  }

  initAddressForm(): FormGroup<AddressForm> {
    return new FormGroup({
      city: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      street: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      number: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      postCode: new FormControl('', {
        validators: [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)],
        nonNullable: true
      })
    });
  }

  initDeliveryForm(): FormGroup<DeliveryForm> {
    return new FormGroup({
      uuid: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    });
  }

  initPasswordsForm(): FormGroup<PasswordsForm> {
    return new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(75)
          ],
          nonNullable: true
        }),
        repeatedPassword: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(75)
          ],
          nonNullable: true
        })
      },
      { validators: [equivalentValidator('password', 'repeatedPassword')] }
    );
  }

  initLoginForm(): FormGroup<LoginForm> {
    return new FormGroup({
      login: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50)
        ],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(75)
        ],
        nonNullable: true
      })
    });
  }

  initRegisterForm(): FormGroup<RegisterForm> {
    return new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      login: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50)
        ],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(75)
        ],
        nonNullable: true
      }),
      repeatedPassword: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(75)
        ],
        nonNullable: true
      })
    });
  }

  getErrorMessage(control: FormControl): string {
    if (control.hasError('required')) {
      return 'To pole jest wymagane';
    }

    if (
      control.hasError('pattern') &&
      control.errors?.['pattern']?.['requiredPattern'] === '/^\\d{2}-\\d{3}$/'
    ) {
      return 'Podano kod pocztowy w niepoprawnym formacie';
    }

    if (control.hasError('minlength')) {
      return `Minimalna ilość znaków: ${control.errors?.['minlength']?.requiredLength}`;
    }

    if (control.hasError('maxlength')) {
      return `Maksymalna ilość znaków: ${control.errors?.['maxlength']?.requiredLength}`;
    }

    if (control.hasError('email')) {
      return `Niepoprawny adres e-mail`;
    }

    if (control.hasError('passwordsNotEqual')) {
      return 'Hasła muszą być takie same';
    }
    return '';
  }

  initProfileForm(): FormGroup {
    return new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(14)
      ]),
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
      postCode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{2}-\d{3}$/)
      ]),
      company: new FormControl(false),
      companyName: new FormControl({ value: '', disabled: true }, []),
      nip: new FormControl({ value: '', disabled: true }, [
        Validators.pattern(/^\d{10}$/)
      ])
    });
  }

  initCompanyForm(): FormGroup {
    return new FormGroup({
      companyName: new FormControl('', {}),
      nip: new FormControl('', {
        validators: [Validators.maxLength(32)]
      })
    });
  }

  initInfoForm(): FormGroup {
    return new FormGroup({
      info: new FormControl('', {
        validators: [Validators.maxLength(1000)]
      })
    });
  }

  initEditProductForm(): FormGroup {
    return new FormGroup({
      price: new FormControl(0, {
        validators: [Validators.required, Validators.min(0)],
        nonNullable: true
      }),
      discount: new FormControl(false, {
        nonNullable: true
      }),
      discountedPrice: new FormControl(0, {
        validators: [Validators.min(0)],
        nonNullable: true
      })
    });
  }

  initPriorityEditForm(): FormGroup {
    return new FormGroup({
      priority: new FormControl(0, {
        validators: [Validators.required, Validators.min(0)],
        nonNullable: true
      })
    });
  }
}
