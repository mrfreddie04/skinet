import { IDeliveryMethod } from './../../shared/models/delivery-method';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  styleUrls: ['./checkout-shipping.component.scss']
})
export class CheckoutShippingComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  public deliveryMethods: IDeliveryMethod[];
  
  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService) 
  {}

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe( 
      (dms) => this.deliveryMethods = dms,
      (err) => console.log(err)
    );
  }

  public setShippingPrice(deliveryMethod: IDeliveryMethod) {
      this.basketService.setShippingPrice(deliveryMethod);
  }
}
