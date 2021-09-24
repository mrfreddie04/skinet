import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';
import { IBasket } from './shared/models/basket';
import { IProduct } from './shared/models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title: string = 'SkiNet';
  public products: IProduct[] = [];

  constructor(private basketService: BasketService) {
  }

  ngOnInit(): void {
    this.initializeBasket();
  }

  private initializeBasket(): void {
    const basketId = localStorage.getItem("basket_id");
    if(basketId) {
      this.basketService.getBasket(basketId).subscribe( 
        (result: IBasket) => {
          console.log("Initialized basket!");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
