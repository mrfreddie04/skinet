import { BasketService } from 'src/app/basket/basket.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public basket$: Observable<IBasket>;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;    
  }

  public getQuantity(basket: IBasket | null): number {
    let quantity: number = 0;
    if(basket)
      basket.items.forEach( item => quantity += item.quantity);
    return quantity;  
  }
}
