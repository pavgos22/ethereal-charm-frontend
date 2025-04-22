import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { ProductsModule } from '../products/products.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, HomeRoutingModule, CoreModule, ProductsModule]
})
export class HomeModule {}
