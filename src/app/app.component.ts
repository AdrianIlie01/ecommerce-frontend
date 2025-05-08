import { Component } from '@angular/core';
import {LoadingService} from "./services/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public loadingService: LoadingService) {}
  title = 'ecommerce';
}
