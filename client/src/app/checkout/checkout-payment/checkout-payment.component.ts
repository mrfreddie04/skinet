import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { IOrder, IOrderWrite } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';
import { IBasket } from 'src/app/shared/models/basket';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  
  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();    
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(orderToCreate).subscribe(
      (order: IOrder)=>{        
        this.basketService.deleteLocalBasket(basket.id);
        this.toastr.success('Order created successfully');
        console.log("Order created successfully", order);

        const navigationExtras: NavigationExtras = {
          state: order
        };
        this.router.navigate(["checkout/success"], navigationExtras);
      },
      (err)=>{
        this.toastr.error(err.message);
        console.log(err); 
      }  
    )
  }

  private getOrderToCreate(basket: IBasket): IOrderWrite {
    return {
      basketId: basket.id,
      deliveryMethodId: Number(this.checkoutForm.get('shippingForm').get("deliveryMethod").value),
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }
}
