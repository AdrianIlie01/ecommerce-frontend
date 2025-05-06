import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductComponent} from "./product/product.component";
import {DisplayProductsComponent} from "./display-products/display-products.component";
import {CartComponent} from "./cart/cart.component";
import {CompletedPaymentComponent} from "./completed-payment/completed-payment.component";

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  {path: 'products', component: DisplayProductsComponent},
  {path: 'product/:name', component: ProductComponent},
  {path: 'cart', component: CartComponent},
  {path: 'order-completed', component: CompletedPaymentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
