import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';

const routes: Routes = [
  {
    path: '',
    component: CartComponent
  },
  {
    path: 'zamow',
    component: CreateOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule {}
