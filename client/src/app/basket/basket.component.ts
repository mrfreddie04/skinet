import { IBasketTotals } from './../shared/models/basket';
import { BasketService } from 'src/app/basket/basket.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  public basket$: Observable<IBasket>;
  public basketTotal$: Observable<IBasketTotals>;
  
  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.basketTotal$ = this.basketService.basketTotal$;
  }

  public removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  public incrementItemQuantity(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }
  
  public decrementItemQuantity(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }  
}
