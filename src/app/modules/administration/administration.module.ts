import { NgModule } from '@angular/core';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { AddCategoryFormComponent } from './components/administrator/add-category-form/add-category-form.component';
import { ManageProductsComponent } from './components/administrator/manage-products/manage-products.component';
import { SharedModule } from '../shared/shared.module';
import { AddProductFormComponent } from './components/administrator/manage-products/add-product-form/add-product-form.component';
import { DeleteProductFormComponent } from './components/administrator/manage-products/delete-product-form/delete-product-form.component';
import { UploadedImagesComponent } from './components/administrator/manage-products/add-product-form/uploaded-images/uploaded-images.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DeleteProductDialogComponent } from './components/administrator/manage-products/delete-product-form/delete-product-dialog/delete-product-dialog.component';
import { OrderPanelComponent } from './components/administrator/order-panel/order-panel.component';
import { OrderDetailsComponent } from './components/administrator/order-panel/order-details/order-details.component';
import { UserPanelComponent } from './components/administrator/user-panel/user-panel.component';
import { UserDetailsComponent } from './components/administrator/user-panel/user-details/user-details.component';
@NgModule({
  declarations: [
    AdministratorComponent,
    AddCategoryFormComponent,
    ManageProductsComponent,
    AddProductFormComponent,
    DeleteProductFormComponent,
    UploadedImagesComponent,
    DeleteProductDialogComponent,
    OrderPanelComponent,
    OrderDetailsComponent,
    UserPanelComponent,
    UserDetailsComponent
  ],
  imports: [SharedModule, AdministrationRoutingModule, AngularEditorModule]
})
export class AdministrationModule {}
