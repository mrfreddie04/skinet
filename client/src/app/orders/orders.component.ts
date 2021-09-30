import { OrdersService } from './orders.service';
import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public orders: IOrder[];

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  public onClick(id: number) {
    const order = this.orders.find(o => o.id === id);
    const navigationExtras: NavigationExtras = {
      state: order
    };
    this.router.navigate(["orders",id], navigationExtras);
  }

  private getOrders() {
    this.ordersService.getOrders().subscribe(
      (orders)=>{
        this.orders = orders;
      },
      (err)=>{ console.log(err);}
    )
  }
}
