import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAccountRoutingModule } from './user-account-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { UserAccountComponent } from './user-account.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SharedModule } from '../shared/shared.module';
import { OrdersComponent } from './components/orders/orders/orders.component';
import { OrderComponent } from './components/orders/order/order.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { ProductsModule } from '../products/products.module';
import { FormsModule } from '@angular/forms';
import { AccountDeleteConfirmationDialogComponent } from './components/settings/account-delete-confirmation-dialog/account-delete-confirmation-dialog.component';
import { PasswordResetConfirmationDialogComponent } from './components/settings/password-reset-confirmation-dialog/password-reset-confirmation-dialog.component';

@NgModule({
  declarations: [
    ProfileComponent,
    UserAccountComponent,
    OrdersComponent,
    OrderComponent,
    SettingsComponent,
    FavouritesComponent,
    AccountDeleteConfirmationDialogComponent,
    PasswordResetConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    UserAccountRoutingModule,
    SharedModule,
    ProductsModule,
    FormsModule
  ]
})
export class UserAccountModule {}
