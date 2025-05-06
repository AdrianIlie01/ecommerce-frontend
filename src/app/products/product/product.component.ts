import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../products.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
) {
  }

  productName!: string;
  product!: any;
  image!: string;
  name!: string;
  description!: string;
  price!: string;

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.productName = params['name'];

      console.log(this.productName);

      this.productsService.getProduct(this.productName).subscribe(async (data: any) => {

        this.product = data;

        if (this.product && this.product.image) {
          this.image = this.productsService.getThumbnailUrl(this.product.image);
          this.name = this.product.name;
          this.description = this.product.description;
          this.price = this.product.price;
        }

      });
    });

  };


  async addProduct(name: string) {
    localStorage.setItem(this.productName + '-Name', this.product.image);
    localStorage.setItem(this.productName + '-Price', this.price);

    const count = localStorage.getItem(this.productName + '-Count');

    if (count) {
      const newCount = parseInt(count, 10) + 1;
      localStorage.setItem(this.productName + '-Count', newCount.toString());
    } else {
      localStorage.setItem(this.productName + '-Count', '1');
    }

    await this.router.navigateByUrl('products');

  }

}
