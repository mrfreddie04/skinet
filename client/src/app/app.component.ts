import { AccountService } from './account/account.service';
import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';
import { IBasket } from './shared/models/basket';
import { IProduct } from './shared/models/product';
import { IUser } from './shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title: string = 'SkiNet';
  public products: IProduct[] = [];

  constructor(
    private basketService: BasketService,
    private accountService: AccountService 
  ) {}

  ngOnInit(): void {
    this.initializeBasket();
    this.initializeUser();
  }

  private initializeUser(): void {
    const token = localStorage.getItem("token");
    this.accountService.loadCurrentUser(token).subscribe(
      (user: IUser) => {
        console.log("User Loaded:", user?.displayName ?? "guest");
      },
      (error) => {
        console.log(error);
      }        
    );
  }

  private initializeBasket(): void {
    const basketId = localStorage.getItem("basket_id");
    if(basketId) {
      this.basketService.getBasket(basketId).subscribe( 
        (result: IBasket) => {
          console.log("Basket Initialized");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
