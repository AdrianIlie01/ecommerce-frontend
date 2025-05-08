// loading.interceptor.ts
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import {LoadingService} from "../services/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const showDelay = 200; // ms – arată loaderul doar dacă durează mai mult de 2 secunde

    this.loadingService.startLoading();

    return timer(showDelay).pipe(
      switchMap(() => next.handle(req)),
      finalize(() => this.loadingService.stopLoading())
    );
  }
}
