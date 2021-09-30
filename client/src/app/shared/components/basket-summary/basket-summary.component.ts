import { BehaviorSubject, Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasketItem } from '../../models/basket';
import { IOrderItem } from '../../models/order';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  @Input() source: string = "basket";
  @Input() items: IBasketItem[] | IOrderItem[] = [];
  @Output() remove = new EventEmitter<IBasketItem>();
  @Output() increment = new EventEmitter<IBasketItem>();
  @Output() decrement = new EventEmitter<IBasketItem>();
  public isEdit$ = new BehaviorSubject<boolean>(true);
  private isContained$ = new BehaviorSubject<boolean>(false); 

  constructor() {
  }

  ngOnInit(): void {
    console.log("Source:", this.source);
    this.isEdit$.next((this.source === "basket"));
    this.isContained$.next((this.source === "checkout"));
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
