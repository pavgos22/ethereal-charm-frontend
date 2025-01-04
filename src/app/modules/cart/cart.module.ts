import { NgModule } from '@angular/core';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './components/cart/cart.component';
import { SharedModule } from '../shared/shared.module';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { CustomerFormComponent } from './components/create-order/customer-form/customer-form.component';
import { AddressFormComponent } from './components/create-order/address-form/address-form.component';
import { DeliveryFormComponent } from './components/create-order/delivery-form/delivery-form.component';
import { FormsModule } from '@angular/forms';
import { CompanyFormComponent } from './components/create-order/company-form/company-form.component';
import { InfoFormComponent } from './components/create-order/info-form/info-form.component';

@NgModule({
  declarations: [
    CartComponent,
    CreateOrderComponent,
    CustomerFormComponent,
    AddressFormComponent,
    DeliveryFormComponent,
    CompanyFormComponent,
    InfoFormComponent
  ],
  imports: [SharedModule, CartRoutingModule, FormsModule]
})
export class CartModule {}
