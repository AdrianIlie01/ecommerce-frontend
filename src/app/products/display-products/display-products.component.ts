import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrl: './display-products.component.css',
})
export class DisplayProductsComponent implements OnInit {
  constructor(
    private productsService: ProductsService,
    private router: Router,
  ) {}

  products!: any;
  image!: string;

  async ngOnInit() {
    this.productsService.getProducts().subscribe((data: any) => {
      console.log(data);

      this.products = data.map((product: any) => {
        return {
          name: product.name,
          image: product.image,
          description: product.description,
        };
      });
    });
  }
  getThumbnailUrl(image: string) {
    return (this.image = this.productsService.getThumbnailUrl(image));
  }
  async redirectToCart() {
    await this.router.navigateByUrl('cart');
  }
  async redirectToProduct(name: string) {
    await this.router.navigateByUrl(`product/${name}`);
  }
}
