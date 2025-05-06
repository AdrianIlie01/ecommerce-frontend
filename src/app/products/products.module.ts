import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { DisplayProductsComponent } from './display-products/display-products.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { CompletedPaymentComponent } from './completed-payment/completed-payment.component';
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    DisplayProductsComponent,
    ProductComponent,
    CartComponent,
    CompletedPaymentComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
})
export class ProductsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
