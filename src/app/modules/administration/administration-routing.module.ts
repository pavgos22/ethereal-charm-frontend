import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { AddCategoryFormComponent } from './components/administrator/add-category-form/add-category-form.component';
import { ManageProductsComponent } from './components/administrator/manage-products/manage-products.component';
import { OrderPanelComponent } from './components/administrator/order-panel/order-panel.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { OrderDetailsComponent } from './components/administrator/order-panel/order-details/order-details.component';
import { UserDetailsComponent } from './components/administrator/user-panel/user-details/user-details.component';
import { UserPanelComponent } from './components/administrator/user-panel/user-panel.component';

const routes: Routes = [
  {
    path: 'panel',
    component: AdministratorComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'categories',
        component: AddCategoryFormComponent
      },
      {
        path: 'products',
        component: ManageProductsComponent
      },
      {
        path: 'orders',
        component: OrderPanelComponent
      },
      {
        path: 'orders/:orderUuid',
        component: OrderDetailsComponent
      },
      {
        path: 'users',
        component: UserPanelComponent
      },
      {
        path: 'user/:uuid',
        component: UserDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {}
