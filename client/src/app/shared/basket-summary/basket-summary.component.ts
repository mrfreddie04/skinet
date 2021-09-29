import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketItem } from '../models/basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  public basket$: Observable<IBasket>;
  @Input() isBasket: boolean = true;
  @Output() remove = new EventEmitter<IBasketItem>();
  @Output() increment = new EventEmitter<IBasketItem>();
  @Output() decrement = new EventEmitter<IBasketItem>();
  
  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  public removeBasketItem(item: IBasketItem) {
    this.remove.emit(item);
  }

  public incrementItemQuantity(item: IBasketItem) {
    this.increment.emit(item);
  }
  
  public decrementItemQuantity(item: IBasketItem) {
    this.decrement.emit(item);
  }    

}
