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
import { EmptyCartComponent } from './components/cart/empty-cart/empty-cart.component';
import { StoreModule } from '@ngrx/store';
import { orderReducer } from './store/order.reducer';
import { OrderEffects } from './store/order.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    CartComponent,
    CreateOrderComponent,
    CustomerFormComponent,
    AddressFormComponent,
    DeliveryFormComponent,
    CompanyFormComponent,
    InfoFormComponent,
    EmptyCartComponent
  ],
  imports: [
    SharedModule,
    CartRoutingModule,
    FormsModule,
    StoreModule.forFeature('order', orderReducer),
    EffectsModule.forFeature([OrderEffects])
  ]
})
export class CartModule {}
