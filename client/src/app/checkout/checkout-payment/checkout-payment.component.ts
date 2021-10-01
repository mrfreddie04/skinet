import { ToastrService } from 'ngx-toastr';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { IOrder, IOrderWrite } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';
import { IBasket } from 'src/app/shared/models/basket';
import { NavigationExtras, Router } from '@angular/router';

declare var Stripe: stripe.StripeStatic; //to suppress stripe errors

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  @ViewChild("cardNumber",{static:true}) cardNumberElement: ElementRef;
  @ViewChild("cardExpiry",{static:true}) cardExpiryElement: ElementRef;
  @ViewChild("cardCvc",{static:true}) cardCvcElement: ElementRef;
  public cardErrors: any = {};
  public loading = false;
  private stripe: stripe.Stripe; //to access stripe js functionality
  private cardNumber: stripe.elements.Element;
  private cardExpiry: stripe.elements.Element;
  private cardCvc: stripe.elements.Element;
  //private cardHandler = this.onChange.bind(this); //cardHandler the same as onChange, but bound to CheckoutPaymentComponent

  public cardObj = {
    cardNumber: { valid: false, error: ""},
    cardExpiry: { valid: false, error: ""},
    cardCvc: { valid: false, error: ""} 
  };
  
  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.stripe = Stripe(
    "pk_test_51JWFZEDg2mAMldRjl5AJHyiYj0EtBRZvb5beSoqZgqlfA86IeXlKU9tXQzdJaruu7iLHBmTJlW8CiNYzcvPn0Bzc00Gu2hbUwF");

    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener("change", this.cardEventHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener("change", this.cardEventHandler);
    
    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);    
    this.cardCvc.addEventListener("change", this.cardEventHandler);
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  public isValid(): boolean {
    let formValid = this.checkoutForm.get("paymentForm").valid;
    Object.values(this.cardObj).forEach(val => {formValid = formValid && val.valid;});
    return formValid;
  }

  //private cardChangeEventHandler: (event: stripe.elements.ElementChangeResponse) => void = 
  private cardEventHandler = (event: stripe.elements.ElementChangeResponse) => {    
    const {error, elementType, complete} = event;
    this.cardObj[elementType].valid = complete;
    this.cardObj[elementType].error = error?.message ?? null;
  }

  // private onChange(event: stripe.elements.ElementChangeResponse) {    
  //   const {error, elementType, complete} = event;
  //   //console.log(elementType,complete,error?.message);
  //   this.cardObj[elementType].valid = complete;
  //   this.cardObj[elementType].error = error?.message ?? null;
  // }

  public async submitOrder() {
    this.loading = true;

    const basket = this.basketService.getCurrentBasketValue();
    
    try {
      const createdOrder = await this.createOrder(basket);  
      const paymentResult = await this.confirmPaymentWithStripe(basket.clientSecret);
  
      if(paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);

        const navigationExtras: NavigationExtras = {state: createdOrder};
        this.router.navigate(["checkout/success"], navigationExtras);
      }
      if(paymentResult.error) {
        this.toastr.error(paymentResult.error.message);
      }
    } catch(err) {
      //this.toastr.error(err?.message ?? "Problems submitting order");
      console.log(err); 
    } finally {
      this.loading = false;
    } 
   
  }

  private createOrder(basket: IBasket): Promise<IOrder> {
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  private confirmPaymentWithStripe(clientSecret: string): Promise<stripe.PaymentIntentResponse> {
    return this.stripe.confirmCardPayment(clientSecret, { 
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get("paymentForm").get("nameOnCard").value
        }
      }
    });    
  }

  private getOrderToCreate(basket: IBasket): IOrderWrite {
    return {
      basketId: basket.id,
      deliveryMethodId: Number(this.checkoutForm.get('shippingForm').get("deliveryMethod").value),
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }
}
