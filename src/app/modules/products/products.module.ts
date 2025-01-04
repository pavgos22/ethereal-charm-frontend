import { NgModule } from '@angular/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './components/products/products.component';
import { SharedModule } from '../shared/shared.module';
import { ProductComponent } from './components/products/product/product.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';
import { ImagesCarouselComponent } from './components/products/product-details/images-carousel/images-carousel.component';
import { ProductEditDialogComponent } from './components/products/product-edit-dialog/product-edit-dialog.component';
import { PriorityEditDialogComponent } from './components/products/priority-edit-dialog/priority-edit-dialog.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductComponent,
    ProductDetailsComponent,
    ImagesCarouselComponent,
    ProductEditDialogComponent,
    PriorityEditDialogComponent
  ],
  exports: [ProductComponent],
  imports: [SharedModule, ProductsRoutingModule]
})
export class ProductsModule {}
