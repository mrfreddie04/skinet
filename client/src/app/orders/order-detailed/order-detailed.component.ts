import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  public order: IOrder;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private bcService: BreadcrumbService
  ) { 
    this.bcService.set("@orderDetails", " ");
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;     
    if(state) {
      this.order = state as IOrder;
      this.bcService.set("@orderDetails", "Order# " + this.order.id.toString() + " - " + this.order.status);
    }    
  }    

  ngOnInit(): void {
    this.loadOrder();
  }

  private loadOrder() {
    if(!this.order) {
      const orderId = parseInt(this.route.snapshot.paramMap.get("id"));

      this.ordersService.getOrder(orderId).subscribe(
        (order)=>{
          this.order = order;
          this.bcService.set("@orderDetails", "Order# " + order.id.toString() + " - " + order.status);
        },
        (err)=>console.log(err)
      );
    }
  }

}
