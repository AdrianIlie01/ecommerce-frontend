import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../products.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreatePdfDto} from "../products.interface";
import { loadStripe } from '@stripe/stripe-js';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  constructor(
    private productsService: ProductsService,
    private router: Router,
  ) {
  }

  products!: any;
  image!: string;
  continueForm: boolean = false;
  form!: FormGroup;
  productsExist: boolean = false;
  total: number = 0;

  async ngOnInit() {
    this.getAllProductsFromLocalStorage();

    if (localStorage.length > 0) {
      this.productsExist = true;
    }

    this.form = new FormGroup({
      address: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl('', {
        validators: [Validators.required]
      }),
      phone: new FormControl('', {
        validators: [Validators.required]
      }),
    });
  }


  getAllProductsFromLocalStorage(): void {
    const keys = Object.keys(localStorage);

    console.log('keys');
    console.log(keys);

    this.products = keys
      .filter((key) => key.endsWith('-Name'))
      .map((nameKey) => {
        const baseKey = nameKey.slice(0, -5); // Eliminăm "-Name" pentru a obține cheia de bază

        const keyCount = baseKey + '-Count';
        const keyPrice = baseKey + '-Price';

        const count =localStorage.getItem(keyCount);
        const price = localStorage.getItem(keyPrice);

        if (count && price) {
          this.total = parseFloat((this.total + parseInt(count, 10) * parseFloat(price)).toFixed(2));

        }


        return {
          name: baseKey,
          price: localStorage.getItem(baseKey + '-Price'),
          count: localStorage.getItem(baseKey + '-Count'),
          image: localStorage.getItem(nameKey),
        };
      });
  }

  getThumbnailUrl(image: string) {
    return this.image = this.productsService.getThumbnailUrl(image);
  }

  decreaseValue(name: string) {
    const keyCount = name + '-Count';
    const keyPrice = name + '-Price';

    const productToUpdate = this.products.find((product: any) => product.name === name);
    const productIndex = this.products.findIndex((product: any) => product.name === name);

    const count =localStorage.getItem(keyCount);
    const price = localStorage.getItem(keyPrice);

    if (count && price) {
      const countValue = parseInt(localStorage.getItem(keyCount) as string, 10) || 0;
      const priceValue = parseFloat(localStorage.getItem(keyPrice) as string) || 0;

      if (productIndex !== -1) {

        this.products[productIndex].count = countValue - 1;
        localStorage.setItem(keyCount, (countValue - 1).toString());
        localStorage.setItem(keyCount, (countValue - 1).toString());
        // this.total = this.total - priceValue;
        this.total = parseFloat((this.total - priceValue).toFixed(2));

        // this.total = parseFloat((this.total + parseInt(count, 10) * parseFloat(price)).toFixed(2));


        if (countValue == 1) {
          const count =localStorage.getItem(keyCount);
          const price = localStorage.getItem(keyPrice);

          if (count && price) {
            const countValue = parseInt(localStorage.getItem(keyCount) as string, 10) || 0;
            const priceValue = parseFloat(localStorage.getItem(keyPrice) as string) || 0;

            this.total = parseFloat((this.total - countValue * priceValue).toFixed(2));
            const keyName = name + '-Name';

            localStorage.removeItem(keyName);
            localStorage.removeItem(keyCount);
            localStorage.removeItem(keyPrice);

            this.products = this.products.filter((product: any) => product.name !== name);

          }

          if (localStorage.length === 0) {
            this.productsExist = false;
          }        }

      }


    }

    if (localStorage.length === 0) {
      this.productsExist = false;
    }
  }

  increaseValue(name: string) {
    const keyCount = name + '-Count';
    const keyPrice = name + '-Price';

    const productToUpdate = this.products.find((product: any) => product.name === name);
    const productIndex = this.products.findIndex((product: any) => product.name === name);

    const count =localStorage.getItem(keyCount);
    const price = localStorage.getItem(keyPrice);

    if (count && price) {
      const countValue = parseInt(localStorage.getItem(keyCount) as string, 10) || 0;
      const priceValue = parseFloat(localStorage.getItem(keyPrice) as string) || 0;

      if (productIndex !== -1) {

        this.products[productIndex].count = countValue + 1;
        localStorage.setItem(keyCount, (countValue + 1).toString());

        localStorage.setItem(keyCount, (countValue + 1).toString());


        this.total = parseFloat((this.total + priceValue).toFixed(2));

      }

    }

  }

  deleteProduct(name: string) {

    const keyName = name + '-Name';
    const keyCount = name + '-Count';
    const keyPrice = name + '-Price';




      const count =localStorage.getItem(keyCount);
      const price = localStorage.getItem(keyPrice);

    if (count && price) {
      const countValue = parseInt(localStorage.getItem(keyCount) as string, 10) || 0;
      const priceValue = parseFloat(localStorage.getItem(keyPrice) as string) || 0;

      this.total = this.total - countValue * priceValue;

      localStorage.removeItem(keyName);
      localStorage.removeItem(keyCount);
      localStorage.removeItem(keyPrice);

      this.products = this.products.filter((product: any) => product.name !== name);

    }

    if (localStorage.length === 0) {
      this.productsExist = false;
    }


  }

  continue() {
    this.continueForm = true;
  }

  completeOrder() {

  }

 async pay() {

    if (this.form.invalid) {
      return
    }

    const createPdfDto: CreatePdfDto = {
      products: this.products,
      costTotal: this.total,
      address: this.form.get('address')?.value,
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      phoneNumber: this.form.get('phone')?.value,
    }

    this.productsService.createPdf(createPdfDto).subscribe(async (data: any) => {
      localStorage.clear();
      // await this.router.navigateByUrl('order-completed');
      await this.afterPayment();
    });


  }


  async afterPayment() {
    const stripePromise = loadStripe(environment.publishableKey);
    this.productsService.pay(this.total).subscribe(async (result: any) => {
      const sessionId = result.sessionId;

      const stripe = await stripePromise;
      if (stripe !== null) {
        const {error} = await stripe.redirectToCheckout({
          sessionId,
        });

        if (error) {
          console.error(error);
        } else {
          // Ascultă evenimentul checkout.session.completed
          stripe.redirectToCheckout({sessionId})
            .then((result) => {
              if (result.error) {
                console.error(result.error.message);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }

    });

  }

  async redirectToProducts() {
    await this.router.navigateByUrl('products');
  }

}
