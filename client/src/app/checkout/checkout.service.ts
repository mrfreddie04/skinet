import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../shared/models/delivery-method';
import { IOrder, IOrderWrite } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public createOrder(order: IOrderWrite) {
    console.log("Order Submit", order);
    return this.http.post<IOrder>(`${this.baseUrl}orders/`, order);
  }

  public getDeliveryMethods() {
    return this.http.get<IDeliveryMethod[]>(`${this.baseUrl}orders/deliverymethods`).pipe(
      map((dms)=>{
        return dms.sort((a,b) => b.price - a.price);
      })
    )
  }
}
