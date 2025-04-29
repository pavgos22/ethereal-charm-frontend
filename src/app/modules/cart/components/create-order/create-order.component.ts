import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { DeliveryFormComponent } from './delivery-form/delivery-form.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { InfoFormComponent } from './info-form/info-form.component';
import { OrdersService } from '../../../core/services/orders.service';
import { ProfileService } from '../../../core/services/profile-service.service';
import { AuthService } from '../../../core/services/auth.service';
import { selectOrderLoading } from '../../store/order.selectors';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store/app.reducer';
import { Store } from '@ngrx/store';
import { createOrder } from '../../store/order.actions';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit, AfterViewInit {
  loading$: Observable<boolean> = this.store.select(selectOrderLoading);
  errorMsg: null | string = null;
  saveShipping = false;
  isAuthenticated = false;
  isCompany = false;
  submitted = false;
  private inputListeners: (() => void)[] = [];
  @ViewChild(CustomerFormComponent) customerFormComp!: CustomerFormComponent;
  @ViewChild(AddressFormComponent) addressFormComp!: AddressFormComponent;
  @ViewChild(DeliveryFormComponent) deliveryFormComp!: DeliveryFormComponent;
  @ViewChild(CompanyFormComponent) companyFormComp!: CompanyFormComponent;
  @ViewChild(InfoFormComponent) infoFormComp!: InfoFormComponent;
  @ViewChildren('inputField') inputFields!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  constructor(
    private store: Store<AppState>,
    private location: Location,
    private router: Router,
    private ordersService: OrdersService,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const locationState = this.location.getState() as {
      summaryPrice: undefined | number;
      navigationId: number;
    };

    if (!locationState.summaryPrice) {
      this.router.navigate(['']);
    }

    this.checkIfUserIsLoggedIn();
  }

  ngAfterViewInit(): void {
    if (this.isAuthenticated) {
      this.fetchUserProfile();
    }

    this.setupInputListeners();
  }

  private setupInputListeners(): void {
    this.inputFields.forEach((input) => {
      const nativeEl = input.nativeElement;

      const focusHandler = () => {
        nativeEl.classList.add('active');
      };

      const blurHandler = () => {
        if (!nativeEl.value) {
          nativeEl.classList.remove('active');
        }
      };

      if (nativeEl.value) {
        nativeEl.classList.add('active');
      }

      nativeEl.addEventListener('focus', focusHandler);
      nativeEl.addEventListener('blur', blurHandler);

      this.inputListeners.push(() => {
        nativeEl.removeEventListener('focus', focusHandler);
        nativeEl.removeEventListener('blur', blurHandler);
      });
    });
  }

  private cleanupInputListeners(): void {
    this.inputListeners.forEach((removeListener) => removeListener());
    this.inputListeners = [];
  }

  checkIfUserIsLoggedIn(): void {
    this.authService.isLoggedIn().subscribe({
      next: (response) => {
        this.isAuthenticated = response.message;
        if (this.isAuthenticated) {
          this.fetchUserProfile();
        }
      },
      error: (err) => {
        this.isAuthenticated = false;
        console.error('Error checking login status:', err);
      }
    });
  }

  fetchUserProfile(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.customerFormComp.customerForm.patchValue({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || ''
        });

        if (profile.phone) {
          this.customerFormComp.controls.phone.setValue(profile.phone);
        }

        this.addressFormComp.addressForm.patchValue({
          city: profile.city || '',
          street: profile.street || '',
          number: profile.number || '',
          postCode: profile.postCode || ''
        });

        if (profile.company) {
          this.isCompany = true;

          if (this.companyFormComp?.companyForm) {
            this.companyFormComp.companyForm.enable();
            this.companyFormComp.companyForm.patchValue({
              companyName: profile.companyName || '',
              nip: profile.nip || ''
            });
          }
        } else {
          this.isCompany = false;
          if (this.companyFormComp?.companyForm) {
            this.companyFormComp.companyForm.reset();
            this.companyFormComp.companyForm.disable();
          }
        }
      },
      error: (err) => {
        this.errorMsg = 'Nie udało się załadować danych użytkownika';
        console.error('Error fetching user profile:', err);
      }
    });
  }

  onCompanyChange(): void {
    if (this.isCompany) {
      this.companyFormComp.companyForm.enable();
    } else {
      this.companyFormComp.companyForm.reset();
      this.companyFormComp.companyForm.disable();
    }
  }

  order(): void {
    this.submitted = true;

    if (!this.formsValid()) {
      console.warn('Form is invalid');
      return;
    }

    const orderData = this.gatherOrderData();

    if (this.saveShipping && this.isAuthenticated) {
      this.saveShippingDetails(orderData.address);
    }

    this.store.dispatch(createOrder({ orderData }));
  }

  private formsValid(): boolean {
    return (
      this.customerFormComp.customerForm.valid &&
      this.addressFormComp.addressForm.valid &&
      this.deliveryFormComp.deliveryForm.valid &&
      (!this.isCompany || this.companyFormComp.companyForm.valid)
    );
  }

  private gatherOrderData(): any {
    return {
      address: this.addressFormComp.addressForm.getRawValue(),
      deliver: this.deliveryFormComp.deliveryForm.getRawValue(),
      customerDetails: this.customerFormComp.customerForm.getRawValue(),
      isCompany: this.isCompany,
      companyName: this.isCompany
        ? this.companyFormComp.companyForm.get('companyName')?.value
        : null,
      nip: this.isCompany
        ? this.companyFormComp.companyForm.get('nip')?.value
        : null,
      info: this.infoFormComp.infoForm.get('info')?.value || null
    };
  }

  saveShippingDetails(address: any): void {
    const customerDetails = this.customerFormComp.customerForm.getRawValue();
    const companyDetails = this.isCompany
      ? this.companyFormComp.companyForm.getRawValue()
      : { companyName: null, nip: null };

    const shippingDetails = {
      ...customerDetails,
      ...address,
      isCompany: this.isCompany,
      companyName: companyDetails.companyName,
      nip: companyDetails.nip
    };

    this.profileService.updateShippingDetails(shippingDetails).subscribe({
      next: () => console.log('Shipping details saved successfully'),
      error: (err) => console.error('Error saving shipping details:', err)
    });
  }
}
