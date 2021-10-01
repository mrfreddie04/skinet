import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/delivery-method';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private baseUrl: string = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null); 
  public basket$ =  this.basketSource.asObservable();
  public basketTotal$ =  this.basketTotalSource.asObservable();
  //public shipping: number = 0;

  constructor(private http: HttpClient) { }

  public createPaymentIntent() {
    const basket = this.basketSource.getValue();
    return this.http.post<IBasket>(`${this.baseUrl}payments/${basket.id}`,{})
      .pipe(
        tap( (basket: IBasket) =>{
          this.basketSource.next(basket);
        })
      );
  }

  public getBasket(id: string): Observable<IBasket> {
    return this.http.get<IBasket>(`${this.baseUrl}basket?id=${id}`)
      .pipe( 
        tap( (basket: IBasket) => {
          this.basketSource.next(basket);
          this.calculateTotals();          
        })
      );  
  }

  private setBasket(basket: IBasket) {
    return this.http.post<IBasket>(`${this.baseUrl}basket`, basket)
      .subscribe( 
        (basket: IBasket) => {
          this.basketSource.next(basket);
          this.calculateTotals(); 
        },
        (error) => {
          console.log(error);
        }  
      );
  }
    
  public deleteBasket(basket: IBasket) { 
    return this.http.delete(`${this.baseUrl}basket?id=${basket.id}`)
      .subscribe( 
        () => {
          this.basketSource.next(null);
          this.basketTotalSource.next(null);
          localStorage.removeItem("basket_id");
        },
        (error) => {
          console.log(error);
        }  
      );
  }

  public deleteLocalBasket(basketid: string) { 
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem("basket_id");
  }

  public getCurrentBasketValue(): IBasket {
    return this.basketSource.getValue();
  }

  public addItemToBasket(item: IProduct, quantity: number = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd);
    this.setBasket(basket);
  }

  public incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const basketItem = basket.items.find( el => el.id === item.id);
    if(basketItem) {
      basketItem.quantity++;
      this.setBasket(basket);
    }  
  }

  public decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const itemIndex = basket.items.findIndex( el => el.id === item.id);
    if(itemIndex >= 0) {      
      if(basket.items[itemIndex].quantity > 1) {
        basket.items[itemIndex].quantity--;
        this.setBasket(basket);
      } else {
        this.removeItemFromBasket(item);
      }
    }  
  }

  public removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const itemIndex = basket.items.findIndex( el => el.id === item.id);
    if(itemIndex >= 0) { 
      basket.items.splice(itemIndex,1);
    }
    if(basket.items.length>0) {
      this.setBasket(basket);
    } else {
      this.deleteBasket(basket);
    }
  }

  public setShippingPrice(shippingMethod: IDeliveryMethod) {
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = shippingMethod.id;
    basket.shippingPrice = shippingMethod.price;
    //this.calculateTotals();  
    this.setBasket(basket);
    
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: quantity,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    };
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem("basket_id",basket.id);
    return basket;
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem): IBasketItem[] {
    const item = items.find( item => item.id === itemToAdd.id);
    if(item) {
      item.quantity = item.quantity + itemToAdd.quantity;
    } else {
      items.push(itemToAdd);
    }  
    return items;
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    if(!basket) {
      this.basketTotalSource.next(null);
      return;
    }

    const shipping = basket.shippingPrice ?? 0;//this.shipping;
    const subtotal = basket.items.reduce<number>( 
      (prev: number, item: IBasketItem): number => prev + item.quantity * item.price,
       0
    );
    const total = subtotal + shipping;
    
    const basketTotals: IBasketTotals = { shipping, subtotal, total };
    this.basketTotalSource.next(basketTotals);
  }
}
