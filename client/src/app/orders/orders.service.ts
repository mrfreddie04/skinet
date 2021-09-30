import { IOrder } from './../shared/models/order';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getOrders() {
    return this.http.get<IOrder[]>(`${this.baseUrl}orders`);
  }

  public getOrder(id: number) {
    return this.http.get<IOrder>(`${this.baseUrl}orders/${id}`);
  }  
}
