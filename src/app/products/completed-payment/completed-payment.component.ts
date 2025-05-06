import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-completed-payment',
  templateUrl: './completed-payment.component.html',
  styleUrl: './completed-payment.component.css'
})
export class CompletedPaymentComponent {
  constructor(private router: Router) {
  }

  async redirect() {
    await this.router.navigateByUrl('products');
  }
}
