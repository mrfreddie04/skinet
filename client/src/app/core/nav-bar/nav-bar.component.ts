import { Router } from '@angular/router';
import { AccountService } from './../../account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket } from 'src/app/shared/models/basket';
import { IUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public basket$: Observable<IBasket>;
  public currentUser$: Observable<IUser>;

  constructor(
    private basketService: BasketService,
    private accountService: AccountService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;    
    this.currentUser$ = this.accountService.currentUser$;
  }

  public getQuantity(basket: IBasket | null): number {
    let quantity: number = 0;
    if(basket)
      basket.items.forEach( item => quantity += item.quantity);
    return quantity;  
  }

  public logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/account/login");
  }
}
