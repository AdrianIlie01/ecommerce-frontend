import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import {ProductType} from "../models/product-type.enum";

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrl: './display-products.component.css',
})
export class DisplayProductsComponent implements OnInit {

  protected readonly ProductType = ProductType;
  constructor(
    private productsService: ProductsService,
    private router: Router,
  ) {}

  products!: any;
  image!: string;
  showFilters: boolean = false;
  sortAsc: boolean = true;
  selectedFilter: ProductType | null = null;
  productCount: number = 0;
  loading: boolean = true;

  imageLoadingMap: Record<string, boolean> = {};


  async ngOnInit() {
    this.productsService.getProducts().subscribe((data: any) => {
      console.log(data);

      this.products = data.map((product: any) => {

        this.imageLoadingMap[product.name] = true;

        return {
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
        };
      })
        .sort((a: any, b: any) => (a.price) - (b.price));;
        // this.loading = false;
    });

    this.productCount = this.getTotalProductCount()
  }
  getThumbnailUrl(image: string) {
    this.loading = false;

    return (this.image = this.productsService.getThumbnailUrl(image));
  }
  async redirectToCart() {
    await this.router.navigateByUrl('cart');
  }

  async displayFilters() {
    this.showFilters = !this.showFilters;

    console.log('Dispaly Filters');
  }

  async sort() {

    this.sortAsc = !this.sortAsc;

    this.products = this.products.sort((a: any, b: any) => {

      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);

      return this.sortAsc ? priceA - priceB : priceB - priceA;
    });

    console.log('SORT');
  }

  async applyFilter(type: ProductType) {
    this.showFilters = !this.showFilters;
    this.selectedFilter = type;



    // aici poți adăuga logica pentru a filtra produsele în funcție de tipul selectat

    this.productsService.getProductsFiltered(type).subscribe((data: any) => {
      console.log(data);

      this.products = data.map((product: any) => {
        return {
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
        };
      })

      if(this.sortAsc) {
        this.products.sort((a: any, b: any) => (a.price) - (b.price));;
      } else  {
        this.products.sort((a: any, b: any) => (b.price) - (a.price));;

      }
    });

    console.log('Filter applied:', type);
  }


  async closeFilters() {
    console.log('overlay clikced');
    this.showFilters = false;
  }

  async redirectToProduct(name: string) {
    await this.router.navigateByUrl(`product/${name}`);
  }

  async addProduct(product: any) {
    localStorage.setItem(product.name + '-Name', product.image);
    localStorage.setItem(product.name + '-Price', product.price);

    const count = localStorage.getItem(product.name + '-Count');

    if (count) {
      const newCount = parseInt(count, 10) + 1;
      localStorage.setItem(product.name + '-Count', newCount.toString());
    } else {
      localStorage.setItem(product.name + '-Count', '1');
    }

    this.productCount++;
  }

  getTotalProductCount(): number {
    let total = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.endsWith('-Count')) {
        const value = parseInt(localStorage.getItem(key) || '0', 10);
        if (!isNaN(value)) {
          total += value;
        }
      }
    }

    return total;
  }
}
