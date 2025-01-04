import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';
import { QuantityControlComponent } from './controles/quantity-control/quantity-control.component';
import { InputOnlyNumberDirective } from './directives/input-only-number.directive';
import { PhoneControlComponent } from './controles/phone-control/phone-control.component';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AlertComponent,
    QuantityControlComponent,
    InputOnlyNumberDirective,
    PhoneControlComponent,
    CartProductComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AlertComponent,
    CartProductComponent,
    QuantityControlComponent,
    PhoneControlComponent,
    MatCheckboxModule
  ]
})
export class SharedModule {}
