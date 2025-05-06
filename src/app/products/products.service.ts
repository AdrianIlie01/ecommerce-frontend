import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CreatePdfDto} from "./products.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  private apiMail = `${environment.urlBackend}/mail`;
  private apiProducts = `${environment.urlBackend}/products`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getProducts() {
    return this.httpClient.get<any>(this.apiProducts, this.httpOptions);
  }

  getProduct(name: string) {
    return this.httpClient.get<any>(this.apiProducts + '/name/' + name, this.httpOptions);
  }

  getThumbnailUrl(image: string) {
    return `${environment.urlBackend}/products/image/${image}`;
  }

  createPdf(createPdf: CreatePdfDto) {

    return this.httpClient.post(this.apiMail + '/generate-pdf', JSON.stringify(createPdf), this.httpOptions)
      .pipe()
  }

  pay(amount: number) {
    const body = { amount: amount };

    return this.httpClient.post(this.apiProducts + '/pay', body, this.httpOptions)
      .pipe()
  }

}
