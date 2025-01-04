import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit, AfterViewInit {
  errorMsg: null | string = null;
  saveShipping = false;
  isAuthenticated = false;
  isCompany = false;

  @ViewChild(CustomerFormComponent) customerFormComp!: CustomerFormComponent;
  @ViewChild(AddressFormComponent) addressFormComp!: AddressFormComponent;
  @ViewChild(DeliveryFormComponent) deliveryFormComp!: DeliveryFormComponent;
  @ViewChild(CompanyFormComponent) companyFormComp!: CompanyFormComponent;
  @ViewChild(InfoFormComponent) infoFormComp!: InfoFormComponent;

  constructor(
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
    if (
      this.customerFormComp.customerForm.valid &&
      this.addressFormComp.addressForm.valid &&
      this.deliveryFormComp.deliveryForm.valid &&
      (!this.isCompany || this.companyFormComp.companyForm.valid)
    ) {
      const orderData = {
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

      // console.log(
      //   'Order data being sent to backend:',
      //   JSON.stringify(orderData, null, 2)
      // );

      this.ordersService.addOrder(orderData).subscribe({
        next: () => {
          if (this.saveShipping && this.isAuthenticated) {
            this.saveShippingDetails(orderData.address);
          }
        },
        error: (err) => {
          this.errorMsg = err;
          console.error('Order submission error:', err);
        }
      });
    } else {
      console.warn('Form is invalid');
    }
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
